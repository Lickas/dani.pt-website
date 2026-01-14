from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'dani-pt-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Create the main app
app = FastAPI(title="dANI.PT API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# ==================== MODELS ====================

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    token: str
    user: UserBase

class VehicleBase(BaseModel):
    brand: str
    model: str
    year: int
    price: float
    fuel_type: str  # Gasolina, Diesel, Híbrido, Elétrico
    mileage: int
    transmission: str  # Manual, Automático
    color: str
    power: str  # ex: "150cv"
    description: str
    features: List[str] = []
    is_featured: bool = False
    is_sold: bool = False

class VehicleCreate(VehicleBase):
    images: List[str] = []

class Vehicle(VehicleBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    images: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VehicleUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    price: Optional[float] = None
    fuel_type: Optional[str] = None
    mileage: Optional[int] = None
    transmission: Optional[str] = None
    color: Optional[str] = None
    power: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    images: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_sold: Optional[bool] = None

class CampaignBase(BaseModel):
    title: str
    description: str
    discount_percentage: Optional[float] = None
    start_date: datetime
    end_date: datetime
    is_active: bool = True

class CampaignCreate(CampaignBase):
    vehicle_ids: List[str] = []

class Campaign(CampaignBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vehicle_ids: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    vehicle_id: Optional[str] = None

class ContactMessage(ContactMessageBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    is_read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BusinessInfoBase(BaseModel):
    phone: str
    email: str
    address: str
    whatsapp: str
    schedule: dict  # {"monday": {"open": "09:00", "close": "19:00"}, ...}
    about_text: str
    google_maps_embed: Optional[str] = None

class BusinessInfo(BusinessInfoBase):
    model_config = ConfigDict(extra="ignore")
    id: str = "business_info"
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str) -> str:
    expiration = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": expiration
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(email=user_data.email, name=user_data.name)
    user_dict = user.model_dump()
    user_dict['password_hash'] = hash_password(user_data.password)
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    token = create_token(user.id, user.email)
    
    return TokenResponse(token=token, user=UserBase(email=user.email, name=user.name))

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(login_data: LoginRequest):
    user = await db.users.find_one({"email": login_data.email}, {"_id": 0})
    if not user or not verify_password(login_data.password, user.get('password_hash', '')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user['id'], user['email'])
    return TokenResponse(token=token, user=UserBase(email=user['email'], name=user['name']))

@api_router.get("/auth/me", response_model=UserBase)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserBase(email=current_user['email'], name=current_user['name'])

# ==================== VEHICLES ROUTES ====================

@api_router.get("/vehicles", response_model=List[Vehicle])
async def get_vehicles(
    brand: Optional[str] = None,
    fuel_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_year: Optional[int] = None,
    max_year: Optional[int] = None,
    is_featured: Optional[bool] = None
):
    query = {"is_sold": False}
    
    if brand:
        query["brand"] = {"$regex": brand, "$options": "i"}
    if fuel_type:
        query["fuel_type"] = fuel_type
    if min_price is not None:
        query["price"] = {"$gte": min_price}
    if max_price is not None:
        query.setdefault("price", {})["$lte"] = max_price
    if min_year is not None:
        query["year"] = {"$gte": min_year}
    if max_year is not None:
        query.setdefault("year", {})["$lte"] = max_year
    if is_featured is not None:
        query["is_featured"] = is_featured
    
    vehicles = await db.vehicles.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for v in vehicles:
        if isinstance(v.get('created_at'), str):
            v['created_at'] = datetime.fromisoformat(v['created_at'])
        if isinstance(v.get('updated_at'), str):
            v['updated_at'] = datetime.fromisoformat(v['updated_at'])
    
    return vehicles

@api_router.get("/vehicles/all", response_model=List[Vehicle])
async def get_all_vehicles(current_user: dict = Depends(get_current_user)):
    """Admin endpoint to get all vehicles including sold ones"""
    vehicles = await db.vehicles.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for v in vehicles:
        if isinstance(v.get('created_at'), str):
            v['created_at'] = datetime.fromisoformat(v['created_at'])
        if isinstance(v.get('updated_at'), str):
            v['updated_at'] = datetime.fromisoformat(v['updated_at'])
    
    return vehicles

@api_router.get("/vehicles/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(vehicle_id: str):
    vehicle = await db.vehicles.find_one({"id": vehicle_id}, {"_id": 0})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    if isinstance(vehicle.get('created_at'), str):
        vehicle['created_at'] = datetime.fromisoformat(vehicle['created_at'])
    if isinstance(vehicle.get('updated_at'), str):
        vehicle['updated_at'] = datetime.fromisoformat(vehicle['updated_at'])
    
    return vehicle

@api_router.post("/vehicles", response_model=Vehicle)
async def create_vehicle(vehicle_data: VehicleCreate, current_user: dict = Depends(get_current_user)):
    vehicle = Vehicle(**vehicle_data.model_dump())
    vehicle_dict = vehicle.model_dump()
    vehicle_dict['created_at'] = vehicle_dict['created_at'].isoformat()
    vehicle_dict['updated_at'] = vehicle_dict['updated_at'].isoformat()
    
    await db.vehicles.insert_one(vehicle_dict)
    return vehicle

@api_router.put("/vehicles/{vehicle_id}", response_model=Vehicle)
async def update_vehicle(vehicle_id: str, vehicle_data: VehicleUpdate, current_user: dict = Depends(get_current_user)):
    existing = await db.vehicles.find_one({"id": vehicle_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    update_data = {k: v for k, v in vehicle_data.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.vehicles.update_one({"id": vehicle_id}, {"$set": update_data})
    
    updated = await db.vehicles.find_one({"id": vehicle_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    
    return updated

@api_router.delete("/vehicles/{vehicle_id}")
async def delete_vehicle(vehicle_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.vehicles.delete_one({"id": vehicle_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"message": "Vehicle deleted successfully"}

# ==================== CAMPAIGNS ROUTES ====================

@api_router.get("/campaigns", response_model=List[Campaign])
async def get_campaigns(active_only: bool = True):
    query = {}
    if active_only:
        now = datetime.now(timezone.utc)
        query = {
            "is_active": True,
            "start_date": {"$lte": now.isoformat()},
            "end_date": {"$gte": now.isoformat()}
        }
    
    campaigns = await db.campaigns.find(query, {"_id": 0}).to_list(50)
    
    for c in campaigns:
        if isinstance(c.get('start_date'), str):
            c['start_date'] = datetime.fromisoformat(c['start_date'])
        if isinstance(c.get('end_date'), str):
            c['end_date'] = datetime.fromisoformat(c['end_date'])
        if isinstance(c.get('created_at'), str):
            c['created_at'] = datetime.fromisoformat(c['created_at'])
    
    return campaigns

@api_router.get("/campaigns/all", response_model=List[Campaign])
async def get_all_campaigns(current_user: dict = Depends(get_current_user)):
    campaigns = await db.campaigns.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    
    for c in campaigns:
        if isinstance(c.get('start_date'), str):
            c['start_date'] = datetime.fromisoformat(c['start_date'])
        if isinstance(c.get('end_date'), str):
            c['end_date'] = datetime.fromisoformat(c['end_date'])
        if isinstance(c.get('created_at'), str):
            c['created_at'] = datetime.fromisoformat(c['created_at'])
    
    return campaigns

@api_router.post("/campaigns", response_model=Campaign)
async def create_campaign(campaign_data: CampaignCreate, current_user: dict = Depends(get_current_user)):
    campaign = Campaign(**campaign_data.model_dump())
    campaign_dict = campaign.model_dump()
    campaign_dict['start_date'] = campaign_dict['start_date'].isoformat()
    campaign_dict['end_date'] = campaign_dict['end_date'].isoformat()
    campaign_dict['created_at'] = campaign_dict['created_at'].isoformat()
    
    await db.campaigns.insert_one(campaign_dict)
    return campaign

@api_router.put("/campaigns/{campaign_id}", response_model=Campaign)
async def update_campaign(campaign_id: str, campaign_data: CampaignCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    update_data = campaign_data.model_dump()
    update_data['start_date'] = update_data['start_date'].isoformat()
    update_data['end_date'] = update_data['end_date'].isoformat()
    
    await db.campaigns.update_one({"id": campaign_id}, {"$set": update_data})
    
    updated = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if isinstance(updated.get('start_date'), str):
        updated['start_date'] = datetime.fromisoformat(updated['start_date'])
    if isinstance(updated.get('end_date'), str):
        updated['end_date'] = datetime.fromisoformat(updated['end_date'])
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    
    return updated

@api_router.delete("/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.campaigns.delete_one({"id": campaign_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"message": "Campaign deleted successfully"}

# ==================== CONTACT MESSAGES ROUTES ====================

@api_router.post("/contacts", response_model=ContactMessage)
async def create_contact_message(message_data: ContactMessageBase):
    message = ContactMessage(**message_data.model_dump())
    message_dict = message.model_dump()
    message_dict['created_at'] = message_dict['created_at'].isoformat()
    
    await db.contact_messages.insert_one(message_dict)
    return message

@api_router.get("/contacts", response_model=List[ContactMessage])
async def get_contact_messages(current_user: dict = Depends(get_current_user)):
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for m in messages:
        if isinstance(m.get('created_at'), str):
            m['created_at'] = datetime.fromisoformat(m['created_at'])
    
    return messages

@api_router.put("/contacts/{message_id}/read")
async def mark_message_read(message_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.contact_messages.update_one({"id": message_id}, {"$set": {"is_read": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message marked as read"}

@api_router.delete("/contacts/{message_id}")
async def delete_contact_message(message_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.contact_messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message deleted successfully"}

# ==================== BUSINESS INFO ROUTES ====================

@api_router.get("/business-info", response_model=BusinessInfo)
async def get_business_info():
    info = await db.business_info.find_one({"id": "business_info"}, {"_id": 0})
    if not info:
        # Return default info
        default_info = BusinessInfo(
            phone="+351 919 190 993",
            email="daniel.henriques@dani.pt",
            address="Rua da Casa Meada 12, Antanhol, 3040-584 Coimbra, Portugal",
            whatsapp="+351919190993",
            schedule={
                "segunda": {"open": "09:00", "close": "19:00"},
                "terca": {"open": "09:00", "close": "19:00"},
                "quarta": {"open": "09:00", "close": "19:00"},
                "quinta": {"open": "09:00", "close": "19:00"},
                "sexta": {"open": "09:00", "close": "19:00"},
                "sabado": {"open": "09:00", "close": "13:00"},
                "domingo": {"open": "", "close": ""}
            },
            about_text="A dANI.PT é um stand de automóveis usados localizado em Coimbra, dedicado a oferecer viaturas de qualidade com total transparência e confiança. Com anos de experiência no mercado automóvel, a nossa missão é ajudar os nossos clientes a encontrar o carro perfeito para as suas necessidades.",
            google_maps_embed="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3046.8!2d-8.4!3d40.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDEyJzAwLjAiTiA4wrAyNCcwMC4wIlc!5e0!3m2!1spt-PT!2spt!4v1234567890"
        )
        return default_info
    
    if isinstance(info.get('updated_at'), str):
        info['updated_at'] = datetime.fromisoformat(info['updated_at'])
    
    return info

@api_router.put("/business-info", response_model=BusinessInfo)
async def update_business_info(info_data: BusinessInfoBase, current_user: dict = Depends(get_current_user)):
    info = BusinessInfo(**info_data.model_dump())
    info_dict = info.model_dump()
    info_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.business_info.update_one(
        {"id": "business_info"},
        {"$set": info_dict},
        upsert=True
    )
    
    return info

# ==================== FILE UPLOAD ====================

@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    # Generate unique filename
    file_extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return the URL path
    return {"url": f"/api/uploads/{unique_filename}", "filename": unique_filename}

# ==================== STATS (DASHBOARD) ====================

@api_router.get("/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    total_vehicles = await db.vehicles.count_documents({})
    available_vehicles = await db.vehicles.count_documents({"is_sold": False})
    sold_vehicles = await db.vehicles.count_documents({"is_sold": True})
    active_campaigns = await db.campaigns.count_documents({"is_active": True})
    unread_messages = await db.contact_messages.count_documents({"is_read": False})
    total_messages = await db.contact_messages.count_documents({})
    
    return {
        "total_vehicles": total_vehicles,
        "available_vehicles": available_vehicles,
        "sold_vehicles": sold_vehicles,
        "active_campaigns": active_campaigns,
        "unread_messages": unread_messages,
        "total_messages": total_messages
    }

# ==================== SEED DATA ====================

@api_router.post("/seed")
async def seed_data():
    """Seed the database with sample data (only if empty)"""
    
    # Check if vehicles already exist
    existing_count = await db.vehicles.count_documents({})
    if existing_count > 0:
        return {"message": "Database already has data", "vehicles_count": existing_count}
    
    # Sample vehicles
    sample_vehicles = [
        {
            "id": str(uuid.uuid4()),
            "brand": "BMW",
            "model": "Serie 3 320d",
            "year": 2021,
            "price": 32500,
            "fuel_type": "Diesel",
            "mileage": 45000,
            "transmission": "Automático",
            "color": "Preto",
            "power": "190cv",
            "description": "BMW Série 3 em excelente estado, com manutenção em dia e histórico completo de revisões. Interior em pele, navegação, sensores de estacionamento.",
            "features": ["GPS", "Sensores Estacionamento", "Bancos em Pele", "Cruise Control", "Jantes Liga Leve"],
            "images": ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"],
            "is_featured": True,
            "is_sold": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "brand": "Mercedes-Benz",
            "model": "Classe A 180d",
            "year": 2020,
            "price": 27900,
            "fuel_type": "Diesel",
            "mileage": 62000,
            "transmission": "Automático",
            "color": "Branco",
            "power": "116cv",
            "description": "Mercedes Classe A com pacote AMG Line, sistema MBUX, câmara de marcha-atrás e muito mais equipamento de série.",
            "features": ["MBUX", "Câmara Traseira", "LED", "Bluetooth", "Apple CarPlay"],
            "images": ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"],
            "is_featured": True,
            "is_sold": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "brand": "Volkswagen",
            "model": "Golf 8 GTI",
            "year": 2022,
            "price": 38500,
            "fuel_type": "Gasolina",
            "mileage": 28000,
            "transmission": "Automático",
            "color": "Vermelho",
            "power": "245cv",
            "description": "Golf GTI de última geração com cockpit digital, teto de abrir panorâmico e performance desportiva.",
            "features": ["Teto Panorâmico", "Digital Cockpit", "Faróis Matrix LED", "Sistema de Som Harman Kardon"],
            "images": ["https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"],
            "is_featured": True,
            "is_sold": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "brand": "Audi",
            "model": "A4 Avant 40 TDI",
            "year": 2021,
            "price": 35900,
            "fuel_type": "Diesel",
            "mileage": 55000,
            "transmission": "Automático",
            "color": "Cinzento",
            "power": "190cv",
            "description": "Audi A4 Avant com tecnologia quattro, virtual cockpit e assistentes de condução avançados.",
            "features": ["Quattro", "Virtual Cockpit", "Assistente de Faixa", "Park Assist"],
            "images": ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"],
            "is_featured": False,
            "is_sold": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "brand": "Peugeot",
            "model": "3008 GT",
            "year": 2022,
            "price": 34900,
            "fuel_type": "Híbrido",
            "mileage": 35000,
            "transmission": "Automático",
            "color": "Azul",
            "power": "225cv",
            "description": "SUV híbrido plug-in com autonomia elétrica de 60km, i-Cockpit e acabamento premium GT.",
            "features": ["Híbrido Plug-in", "i-Cockpit", "Night Vision", "Teto Panorâmico"],
            "images": ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"],
            "is_featured": False,
            "is_sold": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "brand": "Toyota",
            "model": "Corolla Hybrid",
            "year": 2023,
            "price": 28500,
            "fuel_type": "Híbrido",
            "mileage": 15000,
            "transmission": "Automático",
            "color": "Branco Pérola",
            "power": "140cv",
            "description": "Toyota Corolla híbrido de última geração, económico e fiável. Garantia de fábrica ainda válida.",
            "features": ["Híbrido", "Toyota Safety Sense", "Android Auto", "Câmara 360°"],
            "images": ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"],
            "is_featured": True,
            "is_sold": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "brand": "Renault",
            "model": "Clio V RS Line",
            "year": 2021,
            "price": 18500,
            "fuel_type": "Gasolina",
            "mileage": 42000,
            "transmission": "Manual",
            "color": "Laranja",
            "power": "130cv",
            "description": "Renault Clio com acabamento RS Line, visual desportivo e motor TCe eficiente.",
            "features": ["RS Line", "Ecrã Multimédia 9.3\"", "Sensores Estacionamento", "Ar Condicionado Auto"],
            "images": ["https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800"],
            "is_featured": False,
            "is_sold": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "brand": "Tesla",
            "model": "Model 3 Long Range",
            "year": 2022,
            "price": 42900,
            "fuel_type": "Elétrico",
            "mileage": 30000,
            "transmission": "Automático",
            "color": "Preto",
            "power": "350cv",
            "description": "Tesla Model 3 com autonomia de 600km, Autopilot, supercharging gratuito e atualizações OTA.",
            "features": ["Autopilot", "Supercharging", "Premium Interior", "Teto de Vidro"],
            "images": ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"],
            "is_featured": True,
            "is_sold": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "brand": "Ford",
            "model": "Focus ST",
            "year": 2020,
            "price": 29900,
            "fuel_type": "Gasolina",
            "mileage": 48000,
            "transmission": "Manual",
            "color": "Azul Performance",
            "power": "280cv",
            "description": "Ford Focus ST com motor EcoBoost de alta performance, suspensão adaptativa e interior Recaro.",
            "features": ["Bancos Recaro", "Suspensão Adaptativa", "Launch Control", "Diferencial LSD"],
            "images": ["https://images.unsplash.com/photo-1551830820-330a71b99659?w=800"],
            "is_featured": False,
            "is_sold": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "brand": "Volvo",
            "model": "XC40 T4 R-Design",
            "year": 2021,
            "price": 36500,
            "fuel_type": "Gasolina",
            "mileage": 40000,
            "transmission": "Automático",
            "color": "Cinzento Thunder",
            "power": "190cv",
            "description": "SUV compacto premium com design escandinavo, sistema de segurança City Safety e interior nórdico.",
            "features": ["City Safety", "Harman Kardon", "Pilot Assist", "360° Camera"],
            "images": ["https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800"],
            "is_featured": False,
            "is_sold": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.vehicles.insert_many(sample_vehicles)
    
    # Create default admin user
    admin_exists = await db.users.find_one({"email": "admin@dani.pt"})
    if not admin_exists:
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": "admin@dani.pt",
            "name": "Admin dANI.PT",
            "password_hash": hash_password("admin123"),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
    
    # Create sample campaign
    campaign_exists = await db.campaigns.count_documents({})
    if campaign_exists == 0:
        sample_campaign = {
            "id": str(uuid.uuid4()),
            "title": "Promoção de Verão",
            "description": "Desconto especial em viaturas selecionadas durante o mês de Dezembro!",
            "discount_percentage": 10,
            "start_date": datetime.now(timezone.utc).isoformat(),
            "end_date": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
            "is_active": True,
            "vehicle_ids": [sample_vehicles[0]["id"], sample_vehicles[2]["id"]],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.campaigns.insert_one(sample_campaign)
    
    return {"message": "Database seeded successfully", "vehicles_count": len(sample_vehicles)}

# Include the router in the main app
app.include_router(api_router)

# Mount static files for uploads
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
