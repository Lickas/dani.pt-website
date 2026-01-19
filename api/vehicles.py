from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import uuid
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '_shared'))
from database import get_db
from models import Vehicle as VehicleModel
from auth import verify_admin_token
from supabase_client import get_admin_supabase

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
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

# Routes
@app.get("/api/vehicles", response_model=List[Vehicle])
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

@app.get("/api/vehicles/all", response_model=List[Vehicle])
async def get_all_vehicles(
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Get ALL vehicles including sold ones (admin only)"""
    query = select(VehicleModel).order_by(VehicleModel.created_at.desc())
    result = await db.execute(query)
    vehicles = result.scalars().all()
    return vehicles

@app.get("/api/vehicles/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific vehicle by ID"""
    result = await db.execute(
        select(VehicleModel).where(VehicleModel.id == vehicle_id)
    )
    vehicle = result.scalar_one_or_none()
    
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    return vehicle

@app.post("/api/vehicles", response_model=Vehicle)
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

@app.put("/api/vehicles/{vehicle_id}", response_model=Vehicle)
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
    
    update_data = vehicle_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(vehicle, key, value)
    
    vehicle.updated_at = datetime.now(timezone.utc)
    
    await db.commit()
    await db.refresh(vehicle)
    
    return vehicle

@app.delete("/api/vehicles/{vehicle_id}")
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
    
    if vehicle.images:
        supabase = get_admin_supabase()
        for image_url in vehicle.images:
            try:
                path = image_url.split("vehicle-images/")[-1]
                supabase.storage.from_("vehicle-images").remove([path])
            except:
                pass
    
    await db.delete(vehicle)
    await db.commit()
    
    return {"message": "Vehicle deleted successfully"}
