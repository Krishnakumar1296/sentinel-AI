"""Main RAG pipeline orchestrator."""

import time
import json
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

from ..dependencies import get_supabase, is_supabase_ready
from ..models.search import SearchResult, SearchSource
from .embedder import embed_query
from .generator import generate_answer


async def search(
    query: str,
    user_access_level: str,
    user_department: str = "",
    top_k: int = 10,
    similarity_threshold: float = 0.3,
) -> SearchResult:
    """Execute the full RAG pipeline: embed → retrieve → generate.
    
    Args:
        query: The user's natural language question.
        user_access_level: The user's role for RBAC filtering ('employee', 'manager', 'admin').
        user_department: The user's department for scoping.
        top_k: Number of chunks to retrieve.
        similarity_threshold: Minimum cosine similarity to include a chunk.
    
    Returns:
        A SearchResult with the AI-generated answer and source citations.
    """
    start_time = time.time()
    result_id = f"sr-{int(time.time() * 1000)}"

    # Step 1: Embed the query
    query_embedding = embed_query(query)
    if not query_embedding:
        return _no_answer_result(result_id, query, time.time() - start_time)

    # Step 2: Retrieve similar chunks from Supabase (with RBAC filtering)
    chunks = await _retrieve_chunks(
        query_embedding, user_access_level, top_k, similarity_threshold
    )

    if not chunks:
        return _no_answer_result(result_id, query, time.time() - start_time)

    # Step 3: Generate answer using LLM
    llm_result = await generate_answer(query, chunks)

    # Step 4: Build SearchResult
    response_time = round(time.time() - start_time, 1)
    
    # Build source list from cited sources + retrieved chunks
    sources = _build_sources(chunks, llm_result.get("cited_sources", []))

    return SearchResult(
        id=result_id,
        query=query,
        answer=llm_result["answer"],
        confidence=llm_result["confidence"],
        sources=sources,
        citations=sources,
        timestamp=datetime.now(timezone.utc).isoformat(),
        status=llm_result["status"],
        responseTime=response_time,
    )


async def _retrieve_chunks(
    query_embedding: List[float],
    user_access_level: str,
    top_k: int,
    similarity_threshold: float,
) -> List[Dict[str, Any]]:
    """Retrieve the most relevant document chunks via vector similarity search."""
    access_levels = _get_accessible_levels(user_access_level)

    if not is_supabase_ready():
        from ..services.document_service import _DEV_DOCUMENTS
        results = []
        for doc in _DEV_DOCUMENTS:
            if doc.get("access") in access_levels:
                results.append({
                    "content": doc.get("content", "")[:600],
                    "page_number": 1,
                    "document_id": doc["id"],
                    "document_name": doc["name"],
                    "total_pages": doc.get("pages", 1),
                    "similarity": 0.88,
                })
        return results[:top_k]

    supabase = get_supabase()

    # Use Supabase RPC for vector similarity search
    # This requires a Supabase function (or we do it via raw SQL through the REST API)
    # For simplicity, we'll use the postgrest approach with the match_documents function
    
    # Fallback: direct query using supabase-py
    embedding_str = "[" + ",".join(str(v) for v in query_embedding) + "]"
    
    # Query using RPC function (we'll create this in Supabase)
    try:
        response = supabase.rpc(
            "match_document_chunks",
            {
                "query_embedding": embedding_str,
                "match_threshold": similarity_threshold,
                "match_count": top_k,
                "access_levels": access_levels,
            },
        ).execute()
        
        if response.data:
            return response.data
    except Exception:
        pass

    # Fallback: simple query without vector search (for testing)
    try:
        response = (
            supabase.table("document_chunks")
            .select("*, documents!inner(name, access, pages, department)")
            .limit(top_k)
            .execute()
        )
        if response.data:
            return [
                {
                    "content": row["content"],
                    "page_number": row.get("page_number", 1),
                    "document_id": row["document_id"],
                    "document_name": row.get("documents", {}).get("name", "Unknown"),
                    "total_pages": row.get("documents", {}).get("pages", 1),
                    "similarity": 0.5,
                }
                for row in response.data
            ]
    except Exception:
        pass
    
    return []


def _get_accessible_levels(role: str) -> List[str]:
    """Return the list of document access levels a user role can see."""
    if role == "admin":
        return ["employee", "manager", "admin", "finance", "hr", "it"]
    elif role == "manager":
        return ["employee", "manager"]
    else:
        return ["employee"]


def _build_sources(
    chunks: List[Dict[str, Any]],
    cited: List[Dict[str, Any]],
) -> List[SearchSource]:
    """Build SearchSource list from retrieved chunks and LLM citations."""
    sources: List[SearchSource] = []
    seen = set()

    for i, chunk in enumerate(chunks[:5]):  # Limit to top 5 sources
        doc_id = chunk.get("document_id", "")
        page = chunk.get("page_number", 1)
        key = f"{doc_id}-{page}"
        if key in seen:
            continue
        seen.add(key)

        # Check if this chunk was cited by the LLM
        relevance = 50  # default
        for c in cited:
            if c.get("document_id") == doc_id or c.get("page") == page:
                relevance = c.get("relevance", 80)
                break
        
        similarity = chunk.get("similarity", 0.5)
        relevance = max(relevance, int(similarity * 100))

        sources.append(SearchSource(
            id=f"src-{i}",
            documentId=doc_id,
            documentName=chunk.get("document_name", "Unknown"),
            page=page,
            totalPages=chunk.get("total_pages", 1),
            relevance=relevance,
            excerpt=chunk.get("content", "")[:300],
        ))

    return sources


def _no_answer_result(result_id: str, query: str, elapsed: float) -> SearchResult:
    """Build a no-answer SearchResult."""
    return SearchResult(
        id=result_id,
        query=query,
        answer="",
        confidence=0,
        sources=[],
        citations=[],
        timestamp=datetime.now(timezone.utc).isoformat(),
        status="no_answer",
        responseTime=round(elapsed, 1),
    )
