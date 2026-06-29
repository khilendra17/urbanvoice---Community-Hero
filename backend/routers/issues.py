from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from core.database import get_supabase

router = APIRouter(prefix="/api/issues", tags=["issues"])

@router.get("/")
def get_issues():
    supabase = get_supabase()
    response = supabase.table("issues").select("*").execute()
    return response.data



@router.post("/submit")
async def submit_issue(
    title: str = Form(...),
    description: str = Form(...),
    address: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    image: UploadFile = File(None)
):
    supabase = get_supabase()
    image_url = None

    if image and image.filename:
        file_content = await image.read()
        file_ext = image.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_ext}"
        supabase.storage.from_("issue-images").upload(
            path=file_name,
            file=file_content,
            file_options={"content-type": image.content_type}
        )
        image_url = supabase.storage.from_("issue-images").get_public_url(file_name)

    # Save immediately with basic data
    issue_data = {
        "title": title,
        "description": description,
        "address": address,
        "latitude": latitude,
        "longitude": longitude,
        "status": "pending",
        "severity": 3,
        "category": "Analyzing...",
        "department": "Public Works",
        "image_url": image_url,
        "ai_summary": description
    }

    response = supabase.table("issues").insert(issue_data).execute()
    issue_id = response.data[0]["id"]

    # Run AI in background after returning
    import threading
    def run_ai_analysis():
        try:
            from services.gemini_service import analyze_issue_text, generate_issue_summary
            ai_result = analyze_issue_text(title, description)
            ai_summary = generate_issue_summary(
                title, description,
                ai_result.get("category", "Uncategorized"),
                int(ai_result.get("severity", 3))
            )
            dept_officers = {
                "Roads Department": "Rajesh Kumar",
                "Water Department": "Priya Sharma",
                "Sanitation Department": "Amit Patel",
                "Electricity Department": "Sunita Rao",
                "Public Works": "Vikram Singh"
            }
            supabase.table("issues").update({
                "category": ai_result.get("category", "Uncategorized"),
                "severity": int(ai_result.get("severity", 3)),
                "department": ai_result.get("department", "Public Works"),
                "ai_summary": ai_summary
            }).eq("id", issue_id).execute()
        except Exception as e:
            print(f"Background AI failed: {e}")

    thread = threading.Thread(target=run_ai_analysis)
    thread.daemon = True
    thread.start()

    dept_officers = {
        "Roads Department": "Rajesh Kumar",
        "Water Department": "Priya Sharma",
        "Sanitation Department": "Amit Patel",
        "Electricity Department": "Sunita Rao",
        "Public Works": "Vikram Singh"
    }

    return {
        "message": "Issue submitted successfully",
        "issue": response.data[0],
        "officer_name": "Vikram Singh",
        "ai_summary": description
    }
    
    
@router.get("/stats")
def get_stats():
      supabase = get_supabase()
    
      all_issues = supabase.table("issues").select("*").execute()
      total = len(all_issues.data)
    
      pending = len([i for i in all_issues.data if i["status"] == "pending"])
      in_progress = len([i for i in all_issues.data if i["status"] == "in_progress"])
      resolved = len([i for i in all_issues.data if i["status"] == "resolved"])

      return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "city_health_score": max(0, 100 - (pending * 5) - (in_progress * 2))
    }

@router.patch("/{issue_id}/status")
def update_issue_status(issue_id: str, status: dict):
    supabase = get_supabase()
    response = supabase.table("issues").update({
        "status": status["status"],
        "updated_at": "now()"
    }).eq("id", issue_id).execute()
    return {"message": "Status updated", "issue": response.data[0]}

import uuid

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    supabase = get_supabase()
    
    file_content = await file.read()
    file_ext = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"
    
    response = supabase.storage.from_("issue-images").upload(
        path=file_name,
        file=file_content,
        file_options={"content-type": file.content_type}
    )
    
    public_url = supabase.storage.from_("issue-images").get_public_url(file_name)
    
    return {"url": public_url, "filename": file_name}


@router.get("/test-ai")
def test_ai():
    from services.gemini_service import analyze_issue_text
    result = analyze_issue_text(
        title="Large pothole on Main Street",
        description="There is a dangerous pothole near the school that has been there for 2 weeks"
    )
    return result  