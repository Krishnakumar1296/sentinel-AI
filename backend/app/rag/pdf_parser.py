"""PDF text extraction using PyMuPDF."""

from typing import List, Tuple
import pymupdf

PAGE_BREAK = "\n\n◆◆ PAGE BREAK ◆◆\n\n"


def extract_text_from_pdf(pdf_bytes: bytes) -> List[Tuple[int, str]]:
    """Extract text from a PDF file, returning a list of (page_number, text) tuples.
    
    Page numbers are 1-indexed. Falls back to plain text if not a PDF.
    """
    pages: List[Tuple[int, str]] = []
    try:
        doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
        for i, page in enumerate(doc):
            text = page.get_text("text").strip()
            if text:
                pages.append((i + 1, text))
        doc.close()
    except Exception:
        # Fallback to UTF-8 text if file is not a valid PDF binary
        try:
            text = pdf_bytes.decode("utf-8", errors="ignore").strip()
            if text:
                pages.append((1, text))
        except Exception:
            pass
    return pages


def pages_to_content(pages: List[Tuple[int, str]]) -> str:
    """Join page texts with the PAGE_BREAK separator."""
    return PAGE_BREAK.join(text for _, text in pages)


def count_pages(content: str) -> int:
    """Count pages from content string using PAGE_BREAK separator."""
    return len([p for p in content.split(PAGE_BREAK) if p.strip()])
