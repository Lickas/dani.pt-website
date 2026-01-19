from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
import uuid
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), '_shared'))
from database import get_db
from models import AdminUser as AdminUserModel
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

class RegisterRequest(BaseModel):
    email: str
    password: str

@app.post("/api/admin/register")
async def admin_register(
    data: RegisterRequest,
    admin: dict = Depends(verify_admin_token),
    db: AsyncSession = Depends(get_db)
):
    """Register a new admin (requires existing admin)"""
    supabase = get_admin_supabase()
    
    try:
        user_response = supabase.auth.admin.create_user({
            "email": data.email,
            "password": data.password,
            "email_confirm": True
        })
        
        if not user_response.user:
            raise HTTPException(status_code=400, detail="Failed to create user")
        
        admin_user = AdminUserModel(
            id=str(uuid.uuid4()),
            email=data.email,
            name=data.email.split('@')[0],
            supabase_user_id=user_response.user.id
        )
        db.add(admin_user)
        await db.commit()
        
        return {"message": "Admin created successfully", "email": data.email}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
