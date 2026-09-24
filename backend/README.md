# Sentinel AI — Python Backend

Secure enterprise knowledge management backend with Firebase Authentication, Supabase storage, and RAG pipeline.

## Quick Start

### 1. Prerequisites
- Python 3.11+
- A Firebase project with Email/Password auth enabled
- A Supabase project
- A Google Gemini API key

### 2. Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

You need:
- **Firebase**: Download service account JSON from Firebase Console → Project Settings → Service accounts. Set `FIREBASE_CREDENTIALS_PATH` to its path. Set `FIREBASE_API_KEY` to your Web API Key.
- **Supabase**: Get URL and service-role key from Supabase Dashboard → Settings → API.
- **Gemini**: Get API key from https://aistudio.google.com/apikey

### 4. Set Up Database

Run the SQL files in Supabase SQL Editor (in order):
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/match_document_chunks.sql`

Also create a storage bucket named `documents` in Supabase Dashboard → Storage.

### 5. Run the Server

```bash
uvicorn app.main:app --reload --port 8000
```

### 6. Frontend Configuration

In the frontend root (`d:\sentinel11`), create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=your-app-id
```

Install Firebase SDK:
```bash
npm install firebase
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Architecture

- **Firebase Auth**: User authentication (email/password)
- **Firestore**: User profiles and metadata
- **Supabase PostgreSQL**: Documents, chat history, search history, analytics, notifications
- **Supabase Storage**: PDF file uploads
- **pgvector**: Vector embeddings for RAG similarity search
- **Google Gemini**: Embeddings (`gemini-embedding-exp-03-07`) + LLM (`gemini-2.0-flash`)