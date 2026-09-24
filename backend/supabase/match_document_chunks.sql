-- Run this in Supabase SQL Editor AFTER running 001_initial_schema.sql
-- This function performs vector similarity search with RBAC filtering

CREATE OR REPLACE FUNCTION match_document_chunks(
    query_embedding vector(768),
    match_threshold float DEFAULT 0.3,
    match_count int DEFAULT 10,
    access_levels text[] DEFAULT ARRAY['employee']
)
RETURNS TABLE (
    id bigint,
    document_id text,
    chunk_index int,
    page_number int,
    content text,
    similarity float,
    document_name text,
    total_pages int,
    department text
)
LANGUAGE sql STABLE
AS $$
    SELECT
        dc.id,
        dc.document_id,
        dc.chunk_index,
        dc.page_number,
        dc.content,
        1 - (dc.embedding <=> query_embedding) AS similarity,
        d.name AS document_name,
        d.pages AS total_pages,
        d.department
    FROM document_chunks dc
    JOIN documents d ON d.id = dc.document_id
    WHERE d.access = ANY(access_levels)
      AND d.status = 'active'
      AND d.indexed = true
      AND 1 - (dc.embedding <=> query_embedding) > match_threshold
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
$$;