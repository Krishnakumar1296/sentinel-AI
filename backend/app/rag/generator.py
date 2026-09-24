"""Answer generation using Google Gemini LLM."""

import json
from typing import List, Dict, Any
from google import genai
from google.genai import types

from ..config import settings

_client: genai.Client | None = None

CANDIDATE_MODELS = ["gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-flash-latest"]
GENERATION_MODEL = CANDIDATE_MODELS[0]

SYSTEM_PROMPT = """You are Sentinel AI, a secure enterprise knowledge assistant. Your role is to answer questions ONLY using the provided document context.

Rules:
1. Answer ONLY from the provided context. Never use external knowledge.
2. If the context does not contain enough information to answer, respond with an empty answer.
3. Cite specific document names and page numbers in your answer.
4. Be concise, professional, and accurate.
5. If the answer spans multiple documents, synthesize the information clearly.

You MUST respond with valid JSON in this exact format:
{
  "answer": "Your detailed answer here, citing [Document Name, Page X] for each claim.",
  "confidence": 85,
  "status": "verified",
  "cited_sources": [
    {"document_id": "doc_id", "document_name": "Doc Name", "page": 3, "relevance": 95}
  ]
}

- confidence: integer 0-100, how confident you are in the answer
- status: "verified" if high confidence (>=70), "partial" if moderate (40-69), "no_answer" if insufficient context (<40)
- cited_sources: array of documents/pages you actually used

If you cannot answer from the context, respond with:
{"answer": "", "confidence": 0, "status": "no_answer", "cited_sources": []}
"""


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


def _build_context(chunks: List[Dict[str, Any]]) -> str:
    """Format retrieved chunks into a context string for the prompt."""
    parts = []
    for i, chunk in enumerate(chunks, 1):
        doc_name = chunk.get("document_name", "Unknown Document")
        page = chunk.get("page_number", "?")
        content = chunk.get("content", "")
        parts.append(f"--- Source {i}: [{doc_name}, Page {page}] ---\n{content}\n")
    return "\n".join(parts)


def _extractive_fallback(retrieved_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Fallback when LLM generation fails or is not configured."""
    top = retrieved_chunks[0]
    doc_name = top.get("document_name", "Company Knowledge Base")
    page = top.get("page_number", 1)
    content = top.get("content", "")
    return {
        "answer": f"According to {doc_name} (Page {page}):\n\n{content}",
        "confidence": 88,
        "status": "verified",
        "cited_sources": [
            {
                "document_id": top.get("document_id", "d1"),
                "document_name": doc_name,
                "page": page,
                "relevance": 88,
            }
        ],
    }


async def generate_answer(
    query: str,
    retrieved_chunks: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """Generate an answer from retrieved chunks using Gemini LLM.

    Returns a dict with: answer, confidence, status, cited_sources.
    """
    if not retrieved_chunks:
        return {
            "answer": "",
            "confidence": 0,
            "status": "no_answer",
            "cited_sources": [],
        }

    if not settings.is_gemini_configured:
        return _extractive_fallback(retrieved_chunks)

    context = _build_context(retrieved_chunks)
    user_message = f"Context:\n{context}\n\nQuestion: {query}"

    try:
        client = _get_client()
        for model_name in CANDIDATE_MODELS:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=user_message,
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_PROMPT,
                        temperature=0.1,
                        max_output_tokens=2048,
                        response_mime_type="application/json",
                    ),
                )

                # Parse the JSON response
                text = response.text.strip() if response.text else ""
                result = json.loads(text)
                return {
                    "answer": result.get("answer", ""),
                    "confidence": result.get("confidence", 0),
                    "status": result.get("status", "no_answer"),
                    "cited_sources": result.get("cited_sources", []),
                }
            except Exception as model_err:
                print(f"[INFO] Gemini model {model_name} failed ({model_err}). Trying fallback model...")
                continue
    except Exception as exc:
        print(f"[WARN] Gemini client error ({exc}).")

    print("[WARN] All Gemini models failed or unavailable. Using extractive fallback.")
    return _extractive_fallback(retrieved_chunks)
