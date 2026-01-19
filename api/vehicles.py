from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '_shared'))
from supabase_client import get_admin_supabase
from auth import verify_token

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VehicleCreate(BaseModel):
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
    images: List[str] = []
    is_featured: bool = False
    is_sold: bool = False

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

@app.get("/api/vehicles")
async def get_vehicles(
    brand: Optional[str] = None,
    fuel_type: Optional[str] = None,
    min_year: Optional[int] = None,
    max_price: Optional[float] = None
):
    """Get all vehicles with optional filters"""
    supabase = get_admin_supabase()
    
    query = supabase.table('vehicles').select('*').eq('is_sold', False)
    
    if brand:
        query = query.eq('brand', brand)
    if fuel_type:
        query = query.eq('fuel_type', fuel_type)
    if min_year:
        query = query.gte('year', min_year)
    if max_price:
        query = query.lte('price', max_price)
    
    result = query.order('created_at', desc=True).execute()
    return result.data or []

@app.get("/api/vehicles/all")
async def get_all_vehicles(authorization: str = Query(None)):
    """Get ALL vehicles including sold ones (admin only)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    supabase = get_admin_supabase()
    result = supabase.table('vehicles').select('*').order('created_at', desc=True).execute()
    return result.data or []

@app.get("/api/vehicles/{vehicle_id}")
async def get_vehicle(vehicle_id: str):
    """Get a specific vehicle by ID"""
    supabase = get_admin_supabase()
    result = supabase.table('vehicles').select('*').eq('id', vehicle_id).execute()
    
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    return result.data[0]

@app.post("/api/vehicles")
async def create_vehicle(vehicle: VehicleCreate, authorization: str = Query(None)):
    """Create a new vehicle (admin only)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    supabase = get_admin_supabase()
    
    data = vehicle.model_dump()
    data['id'] = str(uuid.uuid4())
    
    result = supabase.table('vehicles').insert(data).execute()
    return result.data[0] if result.data else data

@app.put("/api/vehicles/{vehicle_id}")
async def update_vehicle(vehicle_id: str, vehicle: VehicleUpdate, authorization: str = Query(None)):
    """Update a vehicle (admin only)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    supabase = get_admin_supabase()
    
    update_data = {k: v for k, v in vehicle.model_dump().items() if v is not None}
    
    result = supabase.table('vehicles').update(update_data).eq('id', vehicle_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    return result.data[0]

@app.delete("/api/vehicles/{vehicle_id}")
async def delete_vehicle(vehicle_id: str, authorization: str = Query(None)):
    """Delete a vehicle (admin only)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    supabase = get_admin_supabase()
    supabase.table('vehicles').delete().eq('id', vehicle_id).execute()
    
    return {"message": "Vehicle deleted successfully"}
