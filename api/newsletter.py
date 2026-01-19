from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '_shared'))
from supabase_client import get_admin_supabase

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

@app.post("/api/newsletter")
async def subscribe_newsletter(data: NewsletterCreate):
    """Subscribe to newsletter"""
    supabase = get_admin_supabase()
    
    # Check if already exists
    result = supabase.table('newsletter_subscribers').select('*').eq('email', data.email).execute()
    
    if result.data and len(result.data) > 0:
        existing = result.data[0]
        if existing.get('is_active', True):
            raise HTTPException(status_code=400, detail="Email já subscrito")
        else:
            # Reactivate
            supabase.table('newsletter_subscribers').update({'is_active': True}).eq('email', data.email).execute()
            return {"id": existing['id'], "email": data.email, "is_active": True, "message": "Subscrição reativada"}
    
    # Create new
    new_id = str(uuid.uuid4())
    supabase.table('newsletter_subscribers').insert({
        'id': new_id,
        'email': data.email,
        'is_active': True
    }).execute()
    
    return {"id": new_id, "email": data.email, "is_active": True, "message": "Subscrito com sucesso"}

@app.post("/api/newsletter/unsubscribe")
async def unsubscribe_newsletter(data: NewsletterUnsubscribe):
    """Unsubscribe from newsletter"""
    supabase = get_admin_supabase()
    
    result = supabase.table('newsletter_subscribers').select('*').eq('email', data.email).execute()
    
    if not result.data or len(result.data) == 0:
        return {
            "message": "Email não encontrado na nossa lista de subscritores.",
            "found": False
        }
    
    existing = result.data[0]
    if not existing.get('is_active', True):
        return {
            "message": "Este email já foi removido da newsletter anteriormente.",
            "found": True
        }
    
    supabase.table('newsletter_subscribers').update({'is_active': False}).eq('email', data.email).execute()
    
    return {
        "message": "Subscrição cancelada com sucesso. Lamentamos vê-lo partir!",
        "found": True
    }

@app.get("/api/newsletter/check/{email}")
async def check_subscription(email: str):
    """Check if email is subscribed"""
    supabase = get_admin_supabase()
    
    result = supabase.table('newsletter_subscribers').select('*').eq('email', email).execute()
    
    if not result.data or len(result.data) == 0:
        return {"subscribed": False, "found": False}
    
    return {"subscribed": result.data[0].get('is_active', False), "found": True}
