"""Text chunking for RAG embeddings."""

from typing import List, Dict, Any
from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_pages(
    pages: List[tuple[int, str]],
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
) -> List[Dict[str, Any]]:
    """Split page texts into overlapping chunks, preserving page metadata.
    
    Returns a list of dicts with keys: chunk_index, page_number, content.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    chunks: List[Dict[str, Any]] = []
    chunk_index = 0

    for page_number, text in pages:
        page_chunks = splitter.split_text(text)
        for chunk_text in page_chunks:
            chunks.append({
                "chunk_index": chunk_index,
                "page_number": page_number,
                "content": chunk_text,
            })
            chunk_index += 1

    return chunks
