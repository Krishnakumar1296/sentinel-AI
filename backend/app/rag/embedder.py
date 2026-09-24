"""Embedding generation using Google Gemini."""

from typing import List
from google import genai

from ..config import settings

_client: genai.Client | None = None

EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIMENSION = 768


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


def embed_texts(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for a batch of texts.
    
    Returns a list of embedding vectors (each is a list of floats).
    """
    if not texts:
        return []

    if not settings.is_gemini_configured:
        return [[0.0] * EMBEDDING_DIMENSION for _ in texts]
    
    try:
        client = _get_client()
        all_embeddings: List[List[float]] = []
        batch_size = 100

        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            result = client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=batch,
                config={
                    "output_dimensionality": EMBEDDING_DIMENSION,
                },
            )
            for embedding in result.embeddings:
                all_embeddings.append(list(embedding.values))

        return all_embeddings
    except Exception as exc:
        print(f"[WARN] Gemini embedding failed ({exc}). Returning zero vectors.")
        return [[0.0] * EMBEDDING_DIMENSION for _ in texts]


def embed_query(query: str) -> List[float]:
    """Generate an embedding for a single search query."""
    result = embed_texts([query])
    return result[0] if result else []
