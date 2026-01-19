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
from models import Contact as ContactModel
from auth import verify_admin_token

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
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

# Routes
@app.post("/api/contacts", response_model=Contact)
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

@app.get("/api/contacts", response_model=List[Contact])
async def get_contacts(
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Get all contacts (admin only)"""
    query = select(ContactModel).order_by(ContactModel.created_at.desc())
    result = await db.execute(query)
    contacts = result.scalars().all()
    return contacts

@app.put("/api/contacts/{contact_id}/read")
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

@app.delete("/api/contacts/{contact_id}")
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
