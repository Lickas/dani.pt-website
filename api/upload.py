from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '_shared'))
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

class ImageUploadResponse(BaseModel):
    url: str
    path: str

@app.post("/api/upload/vehicle-image", response_model=ImageUploadResponse)
async def upload_vehicle_image(
    file: UploadFile = File(...),
    admin: dict = Depends(verify_admin_token)
):
    """Upload vehicle image to Supabase Storage"""
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
        
        return ImageUploadResponse(url=public_url, path=path)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/api/upload/campaign-image", response_model=ImageUploadResponse)
async def upload_campaign_image(
    file: UploadFile = File(...),
    admin: dict = Depends(verify_admin_token)
):
    """Upload campaign image to Supabase Storage"""
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
        
        return ImageUploadResponse(url=public_url, path=path)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.delete("/api/upload/vehicle-image")
async def delete_vehicle_image(
    path: str,
    admin: dict = Depends(verify_admin_token)
):
    """Delete vehicle image from storage"""
    supabase = get_admin_supabase()
    
    try:
        supabase.storage.from_("vehicle-images").remove([path])
        return {"message": "Image deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")
