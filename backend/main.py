from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import issues, departments, copilot, analytics



load_dotenv(".env.local")

app = FastAPI(title="UrbanVoice API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(issues.router)
app.include_router(departments.router)
app.include_router(copilot.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {"message": "UrbanVoice API is running"}