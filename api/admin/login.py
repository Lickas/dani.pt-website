from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timezone, timedelta
import jwt
import uuid
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), '_shared'))
from supabase_client import get_public_supabase, get_admin_supabase

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

@app.post("/api/admin/login")
async def admin_login(login_data: LoginRequest):
    """Admin login using Supabase Auth"""
    supabase = get_public_supabase()
    
    try:
        response = supabase.auth.sign_in_with_password({
            "email": login_data.email,
            "password": login_data.password
        })
        
        if not response.user or not response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Check/create admin user in database
        admin_supabase = get_admin_supabase()
        result = admin_supabase.table('admin_users').select('*').eq('email', login_data.email).execute()
        
        if not result.data or len(result.data) == 0:
            # Create admin user record
            admin_id = str(uuid.uuid4())
            admin_supabase.table('admin_users').insert({
                'id': admin_id,
                'email': login_data.email,
                'name': login_data.email.split('@')[0],
                'supabase_user_id': response.user.id
            }).execute()
            admin_user = {'id': admin_id, 'email': login_data.email, 'name': login_data.email.split('@')[0]}
        else:
            admin_user = result.data[0]
        
        # Create JWT token
        token_payload = {
            "sub": admin_user['id'],
            "email": admin_user['email'],
            "name": admin_user.get('name', ''),
            "exp": datetime.now(timezone.utc) + timedelta(hours=24),
            "iat": datetime.now(timezone.utc)
        }
        custom_token = jwt.encode(token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        return {
            "token": custom_token,
            "user": {
                "id": admin_user['id'],
                "email": admin_user['email'],
                "name": admin_user.get('name', '')
            }
        }
        
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
