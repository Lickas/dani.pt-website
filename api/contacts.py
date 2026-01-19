from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
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

class ContactCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

@app.post("/api/contacts")
async def create_contact(contact: ContactCreate):
    """Create a new contact message"""
    supabase = get_admin_supabase()
    
    data = contact.model_dump()
    data['id'] = str(uuid.uuid4())
    data['read'] = False
    
    result = supabase.table('contacts').insert(data).execute()
    return result.data[0] if result.data else data

@app.get("/api/contacts")
async def get_contacts(authorization: str = Query(None)):
    """Get all contacts (admin only)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    supabase = get_admin_supabase()
    result = supabase.table('contacts').select('*').order('created_at', desc=True).execute()
    return result.data or []

@app.put("/api/contacts/{contact_id}/read")
async def mark_contact_read(contact_id: str, authorization: str = Query(None)):
    """Mark contact as read (admin only)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    supabase = get_admin_supabase()
    supabase.table('contacts').update({'read': True}).eq('id', contact_id).execute()
    
    return {"message": "Contact marked as read"}

@app.delete("/api/contacts/{contact_id}")
async def delete_contact(contact_id: str, authorization: str = Query(None)):
    """Delete a contact (admin only)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    supabase = get_admin_supabase()
    supabase.table('contacts').delete().eq('id', contact_id).execute()
    
    return {"message": "Contact deleted successfully"}
