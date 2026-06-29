import os
from dotenv import load_dotenv
from core.database import get_supabase

load_dotenv(".env.local")

def get_relevant_issues(query: str, limit: int = 5) -> list:
    supabase = get_supabase()
    
    # Fetch recent issues as context
    response = supabase.table("issues").select("*").limit(20).execute()
    all_issues = response.data
    
    # Simple keyword matching for now (will upgrade to vector search when Gemini quota available)
    query_lower = query.lower()
    keywords = query_lower.split()
    
    scored_issues = []
    for issue in all_issues:
        score = 0
        text = f"{issue.get('title','')} {issue.get('description','')} {issue.get('category','')} {issue.get('address','')}".lower()
        for keyword in keywords:
            if keyword in text:
                score += 1
        if score > 0:
            scored_issues.append((score, issue))
    
    scored_issues.sort(key=lambda x: x[0], reverse=True)
    return [issue for _, issue in scored_issues[:limit]]

def build_context(issues: list) -> str:
    if not issues:
        return "No relevant issues found in the database."
    
    context = "Relevant civic issues from the database:\n\n"
    for i, issue in enumerate(issues, 1):
        context += f"{i}. {issue.get('title')} - {issue.get('category')} - Severity {issue.get('severity')} - Status: {issue.get('status')} - Location: {issue.get('address')}\n"
    
    return context