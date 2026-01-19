from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
import uuid
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '_shared'))
from database import get_db
from models import Campaign as CampaignModel
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

# Routes
@app.get("/api/campaigns", response_model=List[Campaign])
async def get_campaigns(db: AsyncSession = Depends(get_db)):
    """Get active campaigns"""
    query = select(CampaignModel).where(CampaignModel.is_active == True).order_by(CampaignModel.created_at.desc())
    result = await db.execute(query)
    campaigns = result.scalars().all()
    return campaigns

@app.get("/api/campaigns/all", response_model=List[Campaign])
async def get_all_campaigns(
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Get all campaigns (admin only)"""
    query = select(CampaignModel).order_by(CampaignModel.created_at.desc())
    result = await db.execute(query)
    campaigns = result.scalars().all()
    return campaigns

@app.get("/api/campaigns/public/{campaign_id}", response_model=Campaign)
async def get_campaign_public(campaign_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific campaign (public)"""
    result = await db.execute(
        select(CampaignModel).where(
            CampaignModel.id == campaign_id,
            CampaignModel.is_active == True
        )
    )
    campaign = result.scalar_one_or_none()
    
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    return campaign

@app.get("/api/campaigns/{campaign_id}", response_model=Campaign)
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

@app.post("/api/campaigns", response_model=Campaign)
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

@app.put("/api/campaigns/{campaign_id}", response_model=Campaign)
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

@app.delete("/api/campaigns/{campaign_id}")
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
    
    if campaign.image_url:
        supabase = get_admin_supabase()
        try:
            path = campaign.image_url.split("campaign-images/")[-1]
            supabase.storage.from_("campaign-images").remove([path])
        except:
            pass
    
    await db.delete(campaign)
    await db.commit()
    
    return {"message": "Campaign deleted successfully"}
