from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from datetime import datetime, timezone, timedelta
import jwt
import uuid
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), '_shared'))
from database import get_db
from models import AdminUser as AdminUserModel
from supabase_client import get_public_supabase

JWT_SECRET = os.environ.get('JWT_SECRET', 'dani-pt-secret-key-2024')
JWT_ALGORITHM = "HS256"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    token: str
    user: dict

@app.post("/api/admin/login", response_model=TokenResponse)
async def admin_login(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Admin login using Supabase Auth"""
    supabase = get_public_supabase()
    
    try:
        response = supabase.auth.sign_in_with_password({
            "email": login_data.email,
            "password": login_data.password
        })
        
        if not response.user or not response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        result = await db.execute(
            select(AdminUserModel).where(AdminUserModel.email == login_data.email)
        )
        admin_user = result.scalar_one_or_none()
        
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
        raise HTTPException(status_code=401, detail="Invalid credentials")
