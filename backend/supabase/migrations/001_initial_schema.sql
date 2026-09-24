-- Sentinel AI — Initial Database Schema
-- Run this in the Supabase SQL Editor

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ─── Documents metadata ───────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name          TEXT NOT NULL,
    department    TEXT NOT NULL,
    type          TEXT DEFAULT 'PDF',
    access        TEXT NOT NULL DEFAULT 'employee',
    status        TEXT DEFAULT 'processing',
    pages         INT DEFAULT 0,
    size          TEXT,
    uploaded_by   TEXT NOT NULL,
    updated_at    TIMESTAMPTZ DEFAULT now(),
    description   TEXT,
    content       TEXT,
    indexed       BOOLEAN DEFAULT FALSE,
    storage_path  TEXT,
    firebase_uid  TEXT NOT NULL
);

-- ─── Document chunks with embeddings for RAG ──────────────
CREATE TABLE IF NOT EXISTS document_chunks (
    id            BIGSERIAL PRIMARY KEY,
    document_id   TEXT REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index   INT NOT NULL,
    page_number   INT,
    content       TEXT NOT NULL,
    embedding     vector(768),
    metadata      JSONB DEFAULT '{}'
);

-- IVFFlat index for fast cosine similarity search
-- NOTE: Create this AFTER inserting initial data (needs rows for training)
-- For < 1000 rows, use exact search (no index needed)
-- CREATE INDEX ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- HNSW index (better for smaller datasets, no training needed)
CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON document_chunks
    USING hnsw (embedding vector_cosine_ops);

-- ─── Chat sessions ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_sessions (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id       TEXT NOT NULL,
    title         TEXT DEFAULT 'New Chat',
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);

-- ─── Chat messages ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id    TEXT REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role          TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content       TEXT NOT NULL,
    result        JSONB,
    created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);

-- ─── Search history ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS search_history (
    id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id        TEXT NOT NULL,
    query          TEXT NOT NULL,
    status         TEXT NOT NULL DEFAULT 'verified',
    confidence     REAL DEFAULT 0,
    sources_count  INT DEFAULT 0,
    response_time  REAL DEFAULT 0,
    result         JSONB,
    created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id);

-- ─── Knowledge requests (unanswered queries) ──────────────
CREATE TABLE IF NOT EXISTS knowledge_requests (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    question      TEXT NOT NULL,
    asked_by      TEXT NOT NULL,
    user_id       TEXT NOT NULL,
    status        TEXT DEFAULT 'pending',
    document_id   TEXT,
    created_at    TIMESTAMPTZ DEFAULT now()
);

-- ─── Knowledge gaps (aggregated) ──────────────────────────
CREATE TABLE IF NOT EXISTS knowledge_gaps (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    question      TEXT NOT NULL,
    frequency     INT DEFAULT 1,
    priority      TEXT DEFAULT 'medium',
    department    TEXT,
    first_seen    TIMESTAMPTZ DEFAULT now(),
    last_seen     TIMESTAMPTZ DEFAULT now(),
    status        TEXT DEFAULT 'open'
);

-- ─── Notifications ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id       TEXT,
    type          TEXT NOT NULL,
    title         TEXT NOT NULL,
    message       TEXT NOT NULL,
    read          BOOLEAN DEFAULT FALSE,
    action        TEXT,
    request_id    TEXT,
    created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- ─── Audit logs ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id       TEXT NOT NULL,
    user_name     TEXT NOT NULL,
    action        TEXT NOT NULL,
    resource      TEXT NOT NULL,
    status        TEXT DEFAULT 'success',
    details       TEXT,
    created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);

-- ─── Supabase Storage bucket ──────────────────────────────
-- Create the 'documents' bucket via Supabase Dashboard or API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
