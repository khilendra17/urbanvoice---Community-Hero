from fastapi import APIRouter
from core.database import get_supabase

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/summary")
def get_analytics_summary():
    supabase = get_supabase()
    
    all_issues = supabase.table("issues").select("*").execute()
    data = all_issues.data
    
    total = len(data)
    pending = len([i for i in data if i["status"] == "pending"])
    in_progress = len([i for i in data if i["status"] == "in_progress"])
    resolved = len([i for i in data if i["status"] == "resolved"])
    
    # Category breakdown
    categories = {}
    for issue in data:
        cat = issue.get("category") or "Uncategorized"
        categories[cat] = categories.get(cat, 0) + 1
    
    # Department breakdown
    departments = {}
    for issue in data:
        dept = issue.get("department") or "Unknown"
        departments[dept] = departments.get(dept, 0) + 1
    
    # Severity breakdown
    severities = {}
    for issue in data:
        sev = str(issue.get("severity") or 0)
        severities[sev] = severities.get(sev, 0) + 1
    
    city_health = max(0, 100 - (pending * 5) - (in_progress * 2))
    resolution_rate = round((resolved / total * 100), 1) if total > 0 else 0
    
    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "city_health_score": city_health,
        "resolution_rate": resolution_rate,
        "category_breakdown": categories,
        "department_breakdown": departments,
        "severity_breakdown": severities
    }