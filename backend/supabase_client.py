from supabase import create_client, Client, ClientOptions
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent / '.env')

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY')

# Admin client (with service role key) - for server-side operations
admin_supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    options=ClientOptions(
        persist_session=False,
        auto_refresh_token=False
    )
)

# Public client (with anon key) - for public auth operations
public_supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    options=ClientOptions(
        persist_session=False,
        auto_refresh_token=False
    )
)

def get_admin_supabase() -> Client:
    """Get admin Supabase client (bypasses RLS, for server operations)"""
    return admin_supabase

def get_public_supabase() -> Client:
    """Get public Supabase client (for auth operations)"""
    return public_supabase
