# Sentinel AI — Enterprise Knowledge Management Platform

> Secure, AI-powered document intelligence for modern enterprises.
> Built with FastAPI + React + Ollama (local LLM) + Supabase.

---

## Features

- **RAG Search** — Ask questions in natural language; AI retrieves and cites company documents
- **Document Vault** — Upload, index, and manage PDF documents with RBAC access control
- **Chat Sessions** — Multi-turn conversations with context-aware AI responses
- **Analytics Dashboard** — Query trends, faithfulness scores, RAG quality metrics
- **Knowledge Gaps** — Auto-detects unanswered queries and surfaces content gaps
- **User Management** — Role-based user directory (admin/manager/employee)
- **Security Audit** — Full audit log of every document access and user action
- **Notifications** — Real-time notification feed with knowledge request alerts
- **Dark/Light Mode** — Sleek dark-first UI with theme toggle

---

## Architecture

```
sentinel11/
├── src/                    # React + TypeScript frontend (Vite)
│   ├── pages/              # 14 pages (Dashboard, Search, Documents, etc.)
│   ├── components/         # Reusable UI components
│   ├── services/api.ts     # All API calls (with mock fallbacks)
│   ├── context/            # AuthContext, ThemeContext
│   └── types/              # Shared TypeScript type definitions
│
└── backend/                # FastAPI Python backend
    └── app/
        ├── routers/        # 8 API routers (auth, docs, search, chats...)
        ├── services/       # Business logic layer
        ├── rag/            # RAG pipeline (embed -> retrieve -> generate)
        │   ├── pipeline.py     # Main orchestrator
        │   ├── embedder.py     # nomic-embed-text via Ollama
        │   ├── generator.py    # llama3.2 answer generation
        │   ├── chunker.py      # Text chunking
        │   └── pdf_parser.py   # PDF extraction (PyMuPDF)
        ├── auth/           # Firebase + dev-mode authentication
        ├── models/         # Pydantic models
        └── config.py       # Settings (env vars)
```

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Ollama running locally (`ollama serve`)
- Ollama models: `ollama pull llama3.2` and `ollama pull nomic-embed-text`

### 1. Frontend Setup

```bash
npm install
npm run dev
# Open http://localhost:5173
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
# Open http://127.0.0.1:8000/docs
```

### 3. Configure Environment

**Frontend** (`.env`):
```
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

**Backend** (`backend/.env`):
```
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
OLLAMA_EMBED_MODEL=nomic-embed-text
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_CREDENTIALS_PATH=./firebase-service-account.json
DEV_MODE=True
```

---

## Default Login (Dev Mode)

| Email | Password | Role |
|---|---|---|
| admin@sentinel.ai | AdminPassword123! | Admin |
| manager@sentinel.ai | ManagerPass123! | Manager |
| employee@sentinel.ai | EmployeePass123! | Employee |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/login | - | Login |
| GET | /api/auth/me | Required | Current user profile |
| GET | /api/documents | Required | List documents (RBAC) |
| POST | /api/documents/upload | Manager+ | Upload PDF |
| POST | /api/search | Required | RAG search query |
| GET | /api/search/history | Required | Search history |
| GET | /api/chats | Required | List chat sessions |
| POST | /api/chats | Required | Create chat session |
| GET | /api/analytics | Manager+ | Analytics metrics |
| GET | /api/knowledge/gaps | Required | Knowledge gaps |
| GET | /api/knowledge/requests | Manager+ | Knowledge requests |
| GET | /api/users | Admin | User directory |
| GET | /api/audit-logs | Admin | Security audit logs |
| GET | /api/notifications | Required | Notifications |

Full interactive docs: http://localhost:8000/docs

---

## Testing

```bash
cd backend
venv\Scripts\python.exe test_all_functions.py
# Expected: 17/17 CHECKS PASSED
```

---

## Production Build

```bash
npm run build
# Optimized output in dist/ with code-split vendor chunks
npm run preview
```

---

## Deployment

- **Frontend**: Deploy `dist/` to Vercel (auto-configured via `vercel.json`)
- **Backend**: Deploy to Railway, Render, or Docker
  - Set `DEV_MODE=False` in production
  - Configure real Supabase + Firebase credentials

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| UI Animations | Framer Motion, GSAP, Lenis, Three.js |
| Charts | Recharts |
| Backend | FastAPI, Python 3.11, Uvicorn |
| AI / LLM | Ollama (llama3.2), nomic-embed-text |
| Vector Search | Supabase pgvector (match_document_chunks RPC) |
| Auth | Firebase Auth + local dev fallback |
| Storage | Supabase PostgreSQL + Storage |
| PDF Parsing | PyMuPDF (fitz) |
| Deployment | Vercel (frontend) + Railway/Render (backend) |
