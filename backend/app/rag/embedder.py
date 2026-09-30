"""Embedding generation using Ollama (nomic-embed-text)."""

from typing import List
import httpx

from ..config import settings

EMBEDDING_MODEL = "nomic-embed-text"
EMBEDDING_DIMENSION = 768


def embed_texts(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for a batch of texts using Ollama.

    Returns a list of embedding vectors (each is a list of floats).
    """
    if not texts:
        return []

    all_embeddings: List[List[float]] = []

    for text in texts:
        try:
            response = httpx.post(
                f"{settings.OLLAMA_BASE_URL}/api/embeddings",
                json={
                    "model": EMBEDDING_MODEL,
                    "prompt": text,
                    # Release VRAM immediately after embedding so llama3.2
                    # can load without waiting for the keep-alive window.
                    "keep_alive": 0,
                },
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()
            embedding = data.get("embedding", [])
            if not embedding:
                print(f"[WARN] Ollama returned empty embedding for text snippet.")
                all_embeddings.append([0.0] * EMBEDDING_DIMENSION)
            else:
                all_embeddings.append(embedding)
        except Exception as exc:
            print(f"[WARN] Ollama embedding failed ({exc}). Returning zero vector.")
            all_embeddings.append([0.0] * EMBEDDING_DIMENSION)

    return all_embeddings


def embed_query(query: str) -> List[float]:
    """Generate an embedding for a single search query."""
    result = embed_texts([query])
    return result[0] if result else []
