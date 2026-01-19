from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), '_shared'))
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

class RegisterRequest(BaseModel):
    email: str
    password: str

@app.post("/api/admin/register")
async def admin_register(data: RegisterRequest, authorization: str = Query(None)):
    """Register a new admin (requires existing admin)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    supabase = get_admin_supabase()
    
    try:
        user_response = supabase.auth.admin.create_user({
            "email": data.email,
            "password": data.password,
            "email_confirm": True
        })
        
        if not user_response.user:
            raise HTTPException(status_code=400, detail="Failed to create user")
        
        # Create admin user record
        admin_id = str(uuid.uuid4())
        supabase.table('admin_users').insert({
            'id': admin_id,
            'email': data.email,
            'name': data.email.split('@')[0],
            'supabase_user_id': user_response.user.id
        }).execute()
        
        return {"message": "Admin created successfully", "email": data.email}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
