import os
import json
import re
from google import genai
from dotenv import load_dotenv

load_dotenv(".env.local")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_issue_text(title: str, description: str) -> dict:
    prompt = f"""
    Analyze this civic issue and return ONLY a JSON object with these exact fields:
    {{
        "category": "one of: Pothole, Broken Streetlight, Water Leakage, Garbage, Drainage, Road Damage, Other",
        "severity": "number from 1 to 5",
        "department": "one of: Roads Department, Water Department, Sanitation Department, Electricity Department, Public Works",
        "estimated_resolution_days": "number",
        "summary": "one sentence AI summary"
    }}
    
    Issue Title: {title}
    Issue Description: {description}
    
    Return ONLY the JSON. No extra text.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text.strip()
    text = re.sub(r"```json|```", "", text).strip()
    return json.loads(text)

    def generate_issue_summary(title: str, description: str, category: str, severity: int) -> str:
    prompt = f"""
    Generate a 2-sentence professional civic issue summary for a municipal officer.
    
    Issue: {title}
    Description: {description}
    Category: {category}
    Severity: {severity}/5
    
    Be specific, professional, and mention the civic impact. No bullet points. Just 2 sentences.
    """
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    return response.text.strip()