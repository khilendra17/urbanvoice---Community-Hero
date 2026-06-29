from fastapi import APIRouter
from pydantic import BaseModel
from services.rag_service import get_relevant_issues, build_context
from google import genai
import os
from dotenv import load_dotenv

load_dotenv(".env.local")
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter(prefix="/api/copilot", tags=["copilot"])

class CopilotRequest(BaseModel):
    question: str
    user_role: str = "citizen"
    current_page: str = "home"

@router.post("/ask")
def ask_copilot(request: CopilotRequest):
    relevant_issues = get_relevant_issues(request.question)
    context = build_context(relevant_issues)

    prompt = f"""
    You are UrbanVoice Civic Copilot, an AI assistant for a smart city platform.
    You help {request.user_role}s manage and understand civic issues in Nagpur, India.
    
    Current context from database:
    {context}
    
    User question: {request.question}
    
    Give a helpful, concise response in 2-3 sentences. Be specific using the real data above.
    If asked about statistics, use the actual numbers from the context.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {
        "answer": response.text,
        "relevant_issues": relevant_issues,
        "sources": len(relevant_issues)
    }