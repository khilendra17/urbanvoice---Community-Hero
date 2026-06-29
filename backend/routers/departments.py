from fastapi import APIRouter
from core.database import get_supabase

router = APIRouter(prefix="/api/departments", tags=["departments"])

@router.get("/")
def get_departments():
    supabase = get_supabase()
    response = supabase.table("departments").select("*").execute()
    return response.data