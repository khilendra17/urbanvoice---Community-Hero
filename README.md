UrbanVoice
AI-powered civic intelligence platform for smarter cities.



Overview
UrbanVoice is a full-stack civic technology platform that replaces passive complaint portals with an autonomous AI pipeline. Citizens report issues in under sixty seconds. Gemini AI classifies, prioritizes, and routes every report to the correct municipal department without human intervention. Municipal officers manage a live operations dashboard with SLA tracking, AI recommendations, and real-time analytics.
Built for the Vibe2Ship 2026 hackathon under the Community Hero challenge.



Architecture
Frontend          React 18 + Vite + TypeScript + Tailwind CSS
Backend           FastAPI (Python)
Database          PostgreSQL via Supabase (pgvector enabled)
AI                Google Gemini 2.0 Flash via Google AI Studio
Storage           Supabase Storage
Vector Search     pgvector on PostgreSQL



Project Structure
urbanvoice/
  src/
    components/
      LandingPage.tsx
      CitizenHome.tsx
      ReportWizard.tsx
      IssueDetail.tsx
      MunicipalConsole.tsx
      AnalyticsDashboard.tsx
      CopilotDrawer.tsx
      Header.tsx
      Sidebar.tsx
      SettingsPage.tsx
    App.tsx
    types.ts
    data.ts
  backend/
    routers/
      issues.py
      copilot.py
      departments.py
      analytics.py
    services/
      gemini_service.py
      rag_service.py
    core/
      database.py
    main.py
    requirements.txt
  public/
  .env



Prerequisites

Node.js 18 or higher
Python 3.11 or higher
Supabase account
Google AI Studio API key


Local Development
1. Clone the repository
bashgit clone https://github.com/yourname/urbanvoice.git
cd urbanvoice
2. Install frontend dependencies
bashnpm install
3. Install backend dependencies
bashcd backend
pip install fastapi uvicorn supabase python-dotenv google-genai python-multipart langchain langchain-google-genai
4. Configure environment variables
Create .env in the project root:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://127.0.0.1:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
Create backend/.env.local:
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
5. Set up the database
Run the following in Supabase SQL Editor:
sqlCREATE EXTENSION IF NOT EXISTS vector;


CREATE TABLE issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  severity INTEGER CHECK (severity BETWEEN 1 AND 5),
  status TEXT DEFAULT 'pending',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  department TEXT,
  image_url TEXT,
  ai_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  head_name TEXT,
  contact_email TEXT,
  sla_hours INTEGER DEFAULT 48
);

INSERT INTO departments (name, head_name, contact_email, sla_hours) VALUES
('Roads Department', 'Rajesh Kumar', 'roads@urbanvoice.in', 48),
('Water Department', 'Priya Sharma', 'water@urbanvoice.in', 24),
('Sanitation Department', 'Amit Patel', 'sanitation@urbanvoice.in', 12),
('Electricity Department', 'Sunita Rao', 'electricity@urbanvoice.in', 24),
('Public Works', 'Vikram Singh', 'publicworks@urbanvoice.in', 72);
6. Run the backend
bashcd backend
uvicorn main:app --reload
Backend runs at http://127.0.0.1:8000
API documentation available at http://127.0.0.1:8000/docs
7. Run the frontend
bashcd ..
npm run dev
Frontend runs at http://localhost:3000



AI Pipeline

Every issue submitted passes through the following pipeline:
Photo Upload
     |
Supabase Storage (image saved, URL returned)
     |
Issue saved to PostgreSQL (instant return to user)
     |
Background thread starts
     |
Gemini Vision Analysis
     |--- category classification
     |--- severity scoring (1-5)
     |--- department routing
     |--- AI summary generation
     |
PostgreSQL updated with AI results
     |
Frontend reflects updated data
The submission endpoint returns immediately after saving to the database. AI analysis runs in a background thread and updates the record within five to ten seconds, ensuring a fast user experience without blocking on AI response time.



RAG Copilot
The Civic Copilot implements retrieval-augmented generation:
User Query
     |
Keyword extraction
     |
PostgreSQL similarity search
     |
Top 5 relevant issues retrieved
     |
Context window constructed
     |
Gemini generates grounded response
     |
Answer returned with source count
This ensures the Copilot answers based on real data from the city's issue database rather than generating hallucinated responses.


API Reference
GET     /api/issues/              Returns all issues
POST    /api/issues/submit        Submits a new issue with optional image
PATCH   /api/issues/{id}/status   Updates issue status
GET     /api/issues/stats         Returns city-wide issue statistics
GET     /api/departments/         Returns all departments
GET     /api/analytics/summary    Returns full analytics breakdown
POST    /api/copilot/ask          RAG-powered Copilot query



Key Design Decisions
FastAPI over Express — Native compatibility with the Google Generative AI Python SDK. Async support for background AI processing without blocking the request cycle.
PostgreSQL over NoSQL — Structured civic data with relational department and user associations. pgvector extension enables semantic similarity search for future RAG upgrades without a separate vector database.
Background threading for AI — Issue submission returns in under one second. Gemini analysis runs asynchronously. This separates user experience latency from AI processing latency.
Supabase over self-managed PostgreSQL — Managed database with built-in REST API, real-time subscriptions, authentication, and storage in a single platform. Reduces operational overhead for a hackathon timeline.
Gemini 2.0 Flash over Pro — Lower latency and higher quota availability on the free tier. Sufficient capability for classification, routing, and summarization tasks at the scale of a civic platform prototype.

Environment Notes
The .env file at the project root contains frontend environment variables prefixed with VITE_. These are bundled into the frontend build by Vite and are safe to expose publicly since they use the Supabase anon key with row-level security.
The backend/.env.local file contains the Supabase service role key which has full database access. This file must never be committed to version control or exposed publicly.

Built With

React 18
Vite
TypeScript
Tailwind CSS
FastAPI
PostgreSQL
Supabase
Google AI Studio
Gemini 2.0 Flash
LangChain
pgvector
Lucide React


License
MIT

Vibe2Ship 2026 — Coding Ninjas x Google