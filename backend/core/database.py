import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(".env.local")

def get_supabase() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    print(f"URL: {url}")
    print(f"KEY: {key[:20] if key else 'NOT FOUND'}")
    return create_client(url, key)