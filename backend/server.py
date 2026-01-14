from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
from dotenv import load_dotenv
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import jwt
from supabase import Client

# Import database and models
from database import get_db
from models import Vehicle as VehicleModel, Campaign as CampaignModel, Contact as ContactModel, AdminUser as AdminUserModel
from supabase_client import get_admin_supabase, get_public_supabase

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase JWT Configuration
SUPABASE_JWT_SECRET = os.environ.get('SUPABASE_JWT_SECRET')
JWT_ALGORITHM = "HS256"

# Storage buckets
VEHICLE_IMAGES_BUCKET = "vehicle-images"
CAMPAIGN_IMAGES_BUCKET = "campaign-images"

# Create the main app
app = FastAPI(title="dANI.PT API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class VehicleBase(BaseModel):
    brand: str
    model: str
    year: int
    price: float
    fuel_type: str
    mileage: int
    transmission: str
    color: str
    power: str
    description: str
    features: List[str] = []
    is_featured: bool = False
    is_sold: bool = False

class VehicleCreate(VehicleBase):
    images: List[str] = []

class Vehicle(VehicleBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    images: List[str] = []
    created_at: datetime
    updated_at: datetime

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
    discount_percentage: Optional[int] = None
    start_date: datetime
    end_date: datetime
    is_active: bool = True
    image_url: Optional[str] = None
    applicable_vehicle_ids: List[str] = []

class CampaignCreate(CampaignBase):
    pass

class Campaign(CampaignBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    created_at: datetime

class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    discount_percentage: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None
    image_url: Optional[str] = None
    applicable_vehicle_ids: Optional[List[str]] = None

class ContactBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    read: bool = False
    created_at: datetime

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    token: str
    user: dict

class ImageUploadResponse(BaseModel):
    url: str
    path: str

# ==================== AUTH HELPERS ====================

async def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify Supabase JWT token for admin access"""
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
            options={"verify_aud": False}
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== STORAGE HELPERS ====================

def ensure_storage_buckets():
    """Ensure storage buckets exist"""
    supabase = get_admin_supabase()
    
    try:
        # List existing buckets
        buckets = supabase.storage.list_buckets()
        bucket_names = [b.name for b in buckets]
        
        # Create vehicle-images bucket if not exists
        if VEHICLE_IMAGES_BUCKET not in bucket_names:
            supabase.storage.create_bucket(
                VEHICLE_IMAGES_BUCKET,
                options={"public": True}
            )
            logger.info(f"Created bucket: {VEHICLE_IMAGES_BUCKET}")
        
        # Create campaign-images bucket if not exists
        if CAMPAIGN_IMAGES_BUCKET not in bucket_names:
            supabase.storage.create_bucket(
                CAMPAIGN_IMAGES_BUCKET,
                options={"public": True}
            )
            logger.info(f"Created bucket: {CAMPAIGN_IMAGES_BUCKET}")
            
    except Exception as e:
        logger.error(f"Error ensuring buckets: {e}")

# ==================== VEHICLES ROUTES ====================

@api_router.get("/vehicles", response_model=List[Vehicle])
async def get_vehicles(
    brand: Optional[str] = None,
    fuel_type: Optional[str] = None,
    min_year: Optional[int] = None,
    max_price: Optional[float] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all vehicles with optional filters"""
    query = select(VehicleModel).where(VehicleModel.is_sold == False)
    
    if brand:
        query = query.where(VehicleModel.brand == brand)
    if fuel_type:
        query = query.where(VehicleModel.fuel_type == fuel_type)
    if min_year:
        query = query.where(VehicleModel.year >= min_year)
    if max_price:
        query = query.where(VehicleModel.price <= max_price)
    
    query = query.order_by(VehicleModel.created_at.desc())
    
    result = await db.execute(query)
    vehicles = result.scalars().all()
    return vehicles

@api_router.get("/vehicles/all", response_model=List[Vehicle])
async def get_all_vehicles(
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Get ALL vehicles including sold ones (admin only)"""
    query = select(VehicleModel).order_by(VehicleModel.created_at.desc())
    result = await db.execute(query)
    vehicles = result.scalars().all()
    return vehicles

@api_router.get("/vehicles/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific vehicle by ID"""
    result = await db.execute(
        select(VehicleModel).where(VehicleModel.id == vehicle_id)
    )
    vehicle = result.scalar_one_or_none()
    
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    return vehicle

@api_router.post("/vehicles", response_model=Vehicle)
async def create_vehicle(
    vehicle: VehicleCreate,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Create a new vehicle (admin only)"""
    new_vehicle = VehicleModel(
        id=str(uuid.uuid4()),
        **vehicle.model_dump()
    )
    
    db.add(new_vehicle)
    await db.commit()
    await db.refresh(new_vehicle)
    
    return new_vehicle

@api_router.put("/vehicles/{vehicle_id}", response_model=Vehicle)
async def update_vehicle(
    vehicle_id: str,
    vehicle_update: VehicleUpdate,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Update a vehicle (admin only)"""
    result = await db.execute(
        select(VehicleModel).where(VehicleModel.id == vehicle_id)
    )
    vehicle = result.scalar_one_or_none()
    
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    # Update only provided fields
    update_data = vehicle_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(vehicle, key, value)
    
    vehicle.updated_at = datetime.now(timezone.utc)
    
    await db.commit()
    await db.refresh(vehicle)
    
    return vehicle

@api_router.delete("/vehicles/{vehicle_id}")
async def delete_vehicle(
    vehicle_id: str,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Delete a vehicle (admin only)"""
    result = await db.execute(
        select(VehicleModel).where(VehicleModel.id == vehicle_id)
    )
    vehicle = result.scalar_one_or_none()
    
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    # Delete associated images from storage
    if vehicle.images:
        supabase = get_admin_supabase()
        for image_url in vehicle.images:
            try:
                # Extract path from URL
                path = image_url.split(f"{VEHICLE_IMAGES_BUCKET}/")[-1]
                supabase.storage.from_(VEHICLE_IMAGES_BUCKET).remove([path])
            except Exception as e:
                logger.error(f"Error deleting image: {e}")
    
    await db.delete(vehicle)
    await db.commit()
    
    return {"message": "Vehicle deleted successfully"}

# ==================== CAMPAIGNS ROUTES ====================

@api_router.get("/campaigns", response_model=List[Campaign])
async def get_campaigns(db: AsyncSession = Depends(get_db)):
    """Get active campaigns"""
    query = select(CampaignModel).where(CampaignModel.is_active == True).order_by(CampaignModel.created_at.desc())
    result = await db.execute(query)
    campaigns = result.scalars().all()
    return campaigns

@api_router.get("/campaigns/all", response_model=List[Campaign])
async def get_all_campaigns(
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Get all campaigns (admin only)"""
    query = select(CampaignModel).order_by(CampaignModel.created_at.desc())
    result = await db.execute(query)
    campaigns = result.scalars().all()
    return campaigns

@api_router.get("/campaigns/{campaign_id}", response_model=Campaign)
async def get_campaign(
    campaign_id: str,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Get a specific campaign (admin only)"""
    result = await db.execute(
        select(CampaignModel).where(CampaignModel.id == campaign_id)
    )
    campaign = result.scalar_one_or_none()
    
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    return campaign

@api_router.post("/campaigns", response_model=Campaign)
async def create_campaign(
    campaign: CampaignCreate,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Create a new campaign (admin only)"""
    new_campaign = CampaignModel(
        id=str(uuid.uuid4()),
        **campaign.model_dump()
    )
    
    db.add(new_campaign)
    await db.commit()
    await db.refresh(new_campaign)
    
    return new_campaign

@api_router.put("/campaigns/{campaign_id}", response_model=Campaign)
async def update_campaign(
    campaign_id: str,
    campaign_update: CampaignUpdate,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Update a campaign (admin only)"""
    result = await db.execute(
        select(CampaignModel).where(CampaignModel.id == campaign_id)
    )
    campaign = result.scalar_one_or_none()
    
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    update_data = campaign_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(campaign, key, value)
    
    await db.commit()
    await db.refresh(campaign)
    
    return campaign

@api_router.delete("/campaigns/{campaign_id}")
async def delete_campaign(
    campaign_id: str,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Delete a campaign (admin only)"""
    result = await db.execute(
        select(CampaignModel).where(CampaignModel.id == campaign_id)
    )
    campaign = result.scalar_one_or_none()
    
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Delete associated image from storage
    if campaign.image_url:
        supabase = get_admin_supabase()
        try:
            path = campaign.image_url.split(f"{CAMPAIGN_IMAGES_BUCKET}/")[-1]
            supabase.storage.from_(CAMPAIGN_IMAGES_BUCKET).remove([path])
        except Exception as e:
            logger.error(f"Error deleting image: {e}")
    
    await db.delete(campaign)
    await db.commit()
    
    return {"message": "Campaign deleted successfully"}

# ==================== CONTACTS ROUTES ====================

@api_router.post("/contacts", response_model=Contact)
async def create_contact(contact: ContactCreate, db: AsyncSession = Depends(get_db)):
    """Create a new contact message"""
    new_contact = ContactModel(
        id=str(uuid.uuid4()),
        **contact.model_dump()
    )
    
    db.add(new_contact)
    await db.commit()
    await db.refresh(new_contact)
    
    return new_contact

@api_router.get("/contacts", response_model=List[Contact])
async def get_contacts(
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Get all contacts (admin only)"""
    query = select(ContactModel).order_by(ContactModel.created_at.desc())
    result = await db.execute(query)
    contacts = result.scalars().all()
    return contacts

@api_router.put("/contacts/{contact_id}/read")
async def mark_contact_read(
    contact_id: str,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Mark contact as read (admin only)"""
    result = await db.execute(
        select(ContactModel).where(ContactModel.id == contact_id)
    )
    contact = result.scalar_one_or_none()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    contact.read = True
    await db.commit()
    
    return {"message": "Contact marked as read"}

@api_router.delete("/contacts/{contact_id}")
async def delete_contact(
    contact_id: str,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Delete a contact (admin only)"""
    result = await db.execute(
        select(ContactModel).where(ContactModel.id == contact_id)
    )
    contact = result.scalar_one_or_none()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    await db.delete(contact)
    await db.commit()
    
    return {"message": "Contact deleted successfully"}

# ==================== AUTH ROUTES ====================

@api_router.post("/admin/login", response_model=TokenResponse)
async def admin_login(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Admin login using Supabase Auth"""
    supabase = get_public_supabase()
    
    try:
        # Sign in with Supabase Auth
        response = supabase.auth.sign_in_with_password({
            "email": login_data.email,
            "password": login_data.password
        })
        
        if not response.user or not response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Check if admin user exists in our database
        result = await db.execute(
            select(AdminUserModel).where(AdminUserModel.email == login_data.email)
        )
        admin_user = result.scalar_one_or_none()
        
        # If not exists, create admin user record
        if not admin_user:
            admin_user = AdminUserModel(
                id=str(uuid.uuid4()),
                email=login_data.email,
                name=response.user.email.split('@')[0],
                supabase_user_id=response.user.id
            )
            db.add(admin_user)
            await db.commit()
            await db.refresh(admin_user)
        
        # Create our own JWT token (HS256) for internal use
        token_payload = {
            "sub": admin_user.id,
            "email": admin_user.email,
            "name": admin_user.name,
            "exp": datetime.now(timezone.utc) + timedelta(hours=24),
            "iat": datetime.now(timezone.utc)
        }
        custom_token = jwt.encode(token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        return TokenResponse(
            token=custom_token,
            user={
                "id": admin_user.id,
                "email": admin_user.email,
                "name": admin_user.name
            }
        )
        
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

@api_router.post("/admin/register")
async def admin_register(
    email: str,
    password: str,
    admin: dict = Depends(verify_admin_token),
    db: AsyncSession = Depends(get_db)
):
    """Register a new admin (requires existing admin)"""
    supabase = get_admin_supabase()
    
    try:
        # Create user in Supabase Auth
        user_response = supabase.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True
        })
        
        if not user_response.user:
            raise HTTPException(status_code=400, detail="Failed to create user")
        
        # Create admin user record
        admin_user = AdminUserModel(
            id=str(uuid.uuid4()),
            email=email,
            name=email.split('@')[0],
            supabase_user_id=user_response.user.id
        )
        db.add(admin_user)
        await db.commit()
        
        return {"message": "Admin created successfully", "email": email}
        
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# ==================== IMAGE UPLOAD ROUTES ====================

@api_router.post("/upload/vehicle-image", response_model=ImageUploadResponse)
async def upload_vehicle_image(
    file: UploadFile = File(...),
    admin: dict = Depends(verify_admin_token)
):
    """Upload vehicle image to Supabase Storage"""
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only images allowed")
    
    supabase = get_admin_supabase()
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    path = f"{uuid.uuid4()}.{file_extension}"
    
    try:
        # Read file contents
        contents = await file.read()
        
        # Upload to Supabase Storage
        response = supabase.storage.from_(VEHICLE_IMAGES_BUCKET).upload(
            path=path,
            file=contents,
            file_options={
                "cache-control": "3600",
                "content-type": file.content_type,
                "upsert": False
            }
        )
        
        # Get public URL
        public_url = supabase.storage.from_(VEHICLE_IMAGES_BUCKET).get_public_url(path)
        
        return ImageUploadResponse(url=public_url, path=path)
        
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@api_router.post("/upload/campaign-image", response_model=ImageUploadResponse)
async def upload_campaign_image(
    file: UploadFile = File(...),
    admin: dict = Depends(verify_admin_token)
):
    """Upload campaign image to Supabase Storage"""
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only images allowed")
    
    supabase = get_admin_supabase()
    
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    path = f"{uuid.uuid4()}.{file_extension}"
    
    try:
        contents = await file.read()
        
        response = supabase.storage.from_(CAMPAIGN_IMAGES_BUCKET).upload(
            path=path,
            file=contents,
            file_options={
                "cache-control": "3600",
                "content-type": file.content_type,
                "upsert": False
            }
        )
        
        public_url = supabase.storage.from_(CAMPAIGN_IMAGES_BUCKET).get_public_url(path)
        
        return ImageUploadResponse(url=public_url, path=path)
        
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@api_router.delete("/upload/vehicle-image")
async def delete_vehicle_image(
    path: str,
    admin: dict = Depends(verify_admin_token)
):
    """Delete vehicle image from storage"""
    supabase = get_admin_supabase()
    
    try:
        supabase.storage.from_(VEHICLE_IMAGES_BUCKET).remove([path])
        return {"message": "Image deleted successfully"}
    except Exception as e:
        logger.error(f"Delete error: {e}")
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

# ==================== HEALTH CHECK ====================

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "supabase-postgresql",
        "storage": "supabase-storage",
        "auth": "supabase-auth"
    }

# ==================== APP SETUP ====================

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize storage buckets on startup"""
    ensure_storage_buckets()
    logger.info("Server started successfully")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
