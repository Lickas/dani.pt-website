from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
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

@app.post("/api/upload/vehicle-image")
async def upload_vehicle_image(file: UploadFile = File(...), authorization: str = Query(None)):
    """Upload vehicle image to Supabase Storage"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only images allowed")
    
    supabase = get_admin_supabase()
    
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    path = f"{uuid.uuid4()}.{file_extension}"
    
    try:
        contents = await file.read()
        
        supabase.storage.from_("vehicle-images").upload(
            path=path,
            file=contents,
            file_options={
                "cache-control": "3600",
                "content-type": file.content_type,
                "upsert": False
            }
        )
        
        public_url = supabase.storage.from_("vehicle-images").get_public_url(path)
        
        return {"url": public_url, "path": path}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/api/upload/campaign-image")
async def upload_campaign_image(file: UploadFile = File(...), authorization: str = Query(None)):
    """Upload campaign image to Supabase Storage"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only images allowed")
    
    supabase = get_admin_supabase()
    
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    path = f"{uuid.uuid4()}.{file_extension}"
    
    try:
        contents = await file.read()
        
        supabase.storage.from_("campaign-images").upload(
            path=path,
            file=contents,
            file_options={
                "cache-control": "3600",
                "content-type": file.content_type,
                "upsert": False
            }
        )
        
        public_url = supabase.storage.from_("campaign-images").get_public_url(path)
        
        return {"url": public_url, "path": path}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.delete("/api/upload/vehicle-image")
async def delete_vehicle_image(path: str, authorization: str = Query(None)):
    """Delete vehicle image from storage"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    token = authorization.replace('Bearer ', '')
    verify_token(token)
    
    supabase = get_admin_supabase()
    
    try:
        supabase.storage.from_("vehicle-images").remove([path])
        return {"message": "Image deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")
