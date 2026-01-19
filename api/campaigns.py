from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
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

class CampaignCreate(BaseModel):
    title: str
    description: str
    discount_percentage: Optional[int] = None
    start_date: datetime
    end_date: datetime
    is_active: bool = True
    image_url: Optional[str] = None
    applicable_vehicle_ids: List[str] = []

class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    discount_percentage: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None
    image_url: Optional[str] = None
    applicable_vehicle_ids: Optional[List[str]] = None

@app.get("/api/campaigns")
async def get_campaigns():
    """Get active campaigns"""
    supabase = get_admin_supabase()
    result = supabase.table('campaigns').select('*').eq('is_active', True).order('created_at', desc=True).execute()
    return result.data or []

@app.get("/api/campaigns/all")
async def get_all_campaigns(authorization: str = Query(None)):
    """Get all campaigns (admin only)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    supabase = get_admin_supabase()
    result = supabase.table('campaigns').select('*').order('created_at', desc=True).execute()
    return result.data or []

@app.get("/api/campaigns/public/{campaign_id}")
async def get_campaign_public(campaign_id: str):
    """Get a specific campaign (public)"""
    supabase = get_admin_supabase()
    result = supabase.table('campaigns').select('*').eq('id', campaign_id).eq('is_active', True).execute()
    
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    return result.data[0]

@app.get("/api/campaigns/{campaign_id}")
async def get_campaign(campaign_id: str, authorization: str = Query(None)):
    """Get a specific campaign (admin only)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    supabase = get_admin_supabase()
    result = supabase.table('campaigns').select('*').eq('id', campaign_id).execute()
    
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    return result.data[0]

@app.post("/api/campaigns")
async def create_campaign(campaign: CampaignCreate, authorization: str = Query(None)):
    """Create a new campaign (admin only)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    supabase = get_admin_supabase()
    
    data = campaign.model_dump()
    data['id'] = str(uuid.uuid4())
    data['start_date'] = data['start_date'].isoformat()
    data['end_date'] = data['end_date'].isoformat()
    
    result = supabase.table('campaigns').insert(data).execute()
    return result.data[0] if result.data else data

@app.put("/api/campaigns/{campaign_id}")
async def update_campaign(campaign_id: str, campaign: CampaignUpdate, authorization: str = Query(None)):
    """Update a campaign (admin only)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    supabase = get_admin_supabase()
    
    update_data = {k: v for k, v in campaign.model_dump().items() if v is not None}
    if 'start_date' in update_data:
        update_data['start_date'] = update_data['start_date'].isoformat()
    if 'end_date' in update_data:
        update_data['end_date'] = update_data['end_date'].isoformat()
    
    result = supabase.table('campaigns').update(update_data).eq('id', campaign_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    return result.data[0]

@app.delete("/api/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str, authorization: str = Query(None)):
    """Delete a campaign (admin only)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    supabase = get_admin_supabase()
    supabase.table('campaigns').delete().eq('id', campaign_id).execute()
    
    return {"message": "Campaign deleted successfully"}
