from supabase import create_client, Client, ClientOptions
import os

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY')

_admin_client = None
_public_client = None

def get_admin_supabase() -> Client:
    """Get admin Supabase client (bypasses RLS)"""
    global _admin_client
    if _admin_client is None:
        _admin_client = create_client(
            SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY,
            options=ClientOptions(
                persist_session=False,
                auto_refresh_token=False
            )
        )
    return _admin_client

def get_public_supabase() -> Client:
    """Get public Supabase client (for auth operations)"""
    global _public_client
    if _public_client is None:
        _public_client = create_client(
            SUPABASE_URL,
            SUPABASE_ANON_KEY,
            options=ClientOptions(
                persist_session=False,
                auto_refresh_token=False
            )
        )
    return _public_client
