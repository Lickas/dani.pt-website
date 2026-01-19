from supabase import create_client, Client
import os

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY')

def get_admin_supabase() -> Client:
    """Get admin Supabase client (bypasses RLS)"""
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

def get_public_supabase() -> Client:
    """Get public Supabase client (for auth operations)"""
    return create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
