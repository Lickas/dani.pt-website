from supabase import create_client, Client
import os

def get_admin_supabase() -> Client:
    """Get admin Supabase client (bypasses RLS)"""
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
    
    return create_client(url, key)

def get_public_supabase() -> Client:
    """Get public Supabase client (for auth operations)"""
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY are required")
    
    return create_client(url, key)
