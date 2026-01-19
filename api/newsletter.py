from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
import uuid
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '_shared'))
from database import get_db
from models import NewsletterSubscriber as NewsletterModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NewsletterCreate(BaseModel):
    email: str

class NewsletterUnsubscribe(BaseModel):
    email: str

class NewsletterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    email: str
    is_active: bool
    created_at: datetime

class MessageResponse(BaseModel):
    message: str
    found: bool = True

@app.post("/api/newsletter", response_model=NewsletterResponse)
async def subscribe_newsletter(data: NewsletterCreate, db: AsyncSession = Depends(get_db)):
    """Subscribe to newsletter"""
    result = await db.execute(
        select(NewsletterModel).where(NewsletterModel.email == data.email)
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        if existing.is_active:
            raise HTTPException(status_code=400, detail="Email já subscrito")
        else:
            existing.is_active = True
            await db.commit()
            await db.refresh(existing)
            return existing
    
    new_subscriber = NewsletterModel(
        id=str(uuid.uuid4()),
        email=data.email
    )
    
    db.add(new_subscriber)
    await db.commit()
    await db.refresh(new_subscriber)
    
    return new_subscriber

@app.post("/api/newsletter/unsubscribe", response_model=MessageResponse)
async def unsubscribe_newsletter(data: NewsletterUnsubscribe, db: AsyncSession = Depends(get_db)):
    """Unsubscribe from newsletter"""
    result = await db.execute(
        select(NewsletterModel).where(NewsletterModel.email == data.email)
    )
    existing = result.scalar_one_or_none()
    
    if not existing:
        return MessageResponse(
            message="Email não encontrado na nossa lista de subscritores.",
            found=False
        )
    
    if not existing.is_active:
        return MessageResponse(
            message="Este email já foi removido da newsletter anteriormente.",
            found=True
        )
    
    existing.is_active = False
    await db.commit()
    
    return MessageResponse(
        message="Subscrição cancelada com sucesso. Lamentamos vê-lo partir!",
        found=True
    )

@app.get("/api/newsletter/check/{email}")
async def check_subscription(email: str, db: AsyncSession = Depends(get_db)):
    """Check if email is subscribed"""
    result = await db.execute(
        select(NewsletterModel).where(NewsletterModel.email == email)
    )
    existing = result.scalar_one_or_none()
    
    if not existing:
        return {"subscribed": False, "found": False}
    
    return {"subscribed": existing.is_active, "found": True}
