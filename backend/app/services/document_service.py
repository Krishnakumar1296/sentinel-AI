"""Document management service using Supabase."""

import time
from datetime import datetime, timezone
from typing import List, Optional

from ..dependencies import get_supabase, is_supabase_ready
from ..models.document import Document, DocumentEdits
from ..models.user import User
from ..rag.pdf_parser import extract_text_from_pdf, pages_to_content, count_pages, PAGE_BREAK
from ..rag.chunker import chunk_pages
from ..rag.embedder import embed_texts
from .notification_service import log_audit


# In-memory dev fallback when Supabase is not configured
_DEV_DOCUMENTS: List[dict] = [
    {
        "id": "d1",
        "name": "Employee Handbook 2024",
        "department": "HR",
        "type": "PDF",
        "access": "employee",
        "status": "active",
        "pages": 48,
        "size": "3.2 MB",
        "uploaded_by": "Sarah Mitchell",
        "updated_at": "Aug 28, 2026",
        "description": "Complete employee handbook covering policies, benefits and conduct guidelines.",
        "content": "Section 1: Company Values\nSentinel AI is dedicated to privacy, security, and knowledge.\n\n◆◆ PAGE BREAK ◆◆\n\nSection 6.1: Annual Leave\nFull-time employees receive 24 days of paid annual leave each calendar year.",
        "indexed": True,
        "storage_path": None,
    },
    {
        "id": "d2",
        "name": "Data Security Policy",
        "department": "IT",
        "type": "PDF",
        "access": "employee",
        "status": "active",
        "pages": 22,
        "size": "1.8 MB",
        "uploaded_by": "IT Admin",
        "updated_at": "Aug 26, 2026",
        "description": "Information security policy and data handling guidelines.",
        "content": "Section 5.4: Data Retention\nAll retained data must be stored within the organization's secure vector vault.",
        "indexed": True,
        "storage_path": None,
    },
    {
        "id": "d3",
        "name": "Q3 Financial Report",
        "department": "Finance",
        "type": "PDF",
        "access": "finance",
        "status": "restricted",
        "pages": 64,
        "size": "5.4 MB",
        "uploaded_by": "James Park",
        "updated_at": "Aug 24, 2026",
        "description": "Q3 2026 financial performance report.",
        "content": "Financial Summary Q3 2026: Revenue grew 18% YoY.",
        "indexed": True,
        "storage_path": None,
    },
    {
        "id": "d4",
        "name": "Executive Strategy 2026",
        "department": "Management",
        "type": "PDF",
        "access": "admin",
        "status": "restricted",
        "pages": 32,
        "size": "2.1 MB",
        "uploaded_by": "Krishna Kumar",
        "updated_at": "Aug 20, 2026",
        "description": "Company strategic plan for 2026.",
        "content": "Confidential Strategy 2026: Expansion into enterprise AI agentic workflows.",
        "indexed": True,
        "storage_path": None,
    },
    {
        "id": "d5",
        "name": "Remote Work Guidelines",
        "department": "HR",
        "type": "PDF",
        "access": "employee",
        "status": "active",
        "pages": 18,
        "size": "1.2 MB",
        "uploaded_by": "Sarah Mitchell",
        "updated_at": "Aug 22, 2026",
        "description": "Guidelines for remote and hybrid work arrangements.",
        "content": "Section 3.2: Hybrid Work Model\nEmployees are entitled to work remotely up to 3 days per week.",
        "indexed": True,
        "storage_path": None,
    },
    {
        "id": "d6",
        "name": "Legal Compliance Manual",
        "department": "Legal",
        "type": "PDF",
        "access": "manager",
        "status": "active",
        "pages": 56,
        "size": "4.1 MB",
        "uploaded_by": "Michael Torres",
        "updated_at": "Aug 18, 2026",
        "description": "Regulatory compliance requirements and procedures.",
        "content": "Compliance Guidelines for SOC2, HIPAA and ISO 27001.",
        "indexed": True,
        "storage_path": None,
    },
    {
        "id": "d7",
        "name": "IT Onboarding Checklist",
        "department": "IT",
        "type": "PDF",
        "access": "employee",
        "status": "active",
        "pages": 12,
        "size": "0.8 MB",
        "uploaded_by": "IT Admin",
        "updated_at": "Aug 15, 2026",
        "description": "New employee IT setup and access request procedures.",
        "content": "New employees must sign the IT acceptable-use policy before credentials are issued.",
        "indexed": True,
        "storage_path": None,
    },
]


def _row_to_document(row: dict) -> Document:
    """Convert a row or dict to a Document model."""
    return Document(
        id=row["id"],
        name=row.get("name", ""),
        department=row.get("department", ""),
        type=row.get("type", "PDF"),
        access=row.get("access", "employee"),
        status=row.get("status", "processing"),
        pages=row.get("pages", 0),
        size=row.get("size", ""),
        uploadedBy=row.get("uploaded_by", ""),
        updatedAt=row.get("updated_at", ""),
        description=row.get("description"),
        content=row.get("content"),
        indexed=row.get("indexed", False),
        storagePath=row.get("storage_path"),
    )


async def list_documents(user: User) -> List[Document]:
    """List documents filtered by user access level."""
    if not is_supabase_ready():
        filtered = []
        for d in _DEV_DOCUMENTS:
            if user.role == "admin":
                filtered.append(d)
            elif user.role == "manager":
                if d["access"] in ("employee", "manager"):
                    filtered.append(d)
            else:
                if d["access"] == "employee":
                    filtered.append(d)
        return [_row_to_document(row) for row in filtered]

    supabase = get_supabase()
    
    if user.role == "admin":
        response = supabase.table("documents").select("*").order("updated_at", desc=True).execute()
    elif user.role == "manager":
        response = (
            supabase.table("documents")
            .select("*")
            .in_("access", ["employee", "manager"])
            .order("updated_at", desc=True)
            .execute()
        )
    else:
        response = (
            supabase.table("documents")
            .select("*")
            .eq("access", "employee")
            .order("updated_at", desc=True)
            .execute()
        )
    
    return [_row_to_document(row) for row in (response.data or [])]


async def get_document(doc_id: str) -> Optional[Document]:
    """Get a single document by ID."""
    if not is_supabase_ready():
        for d in _DEV_DOCUMENTS:
            if d["id"] == doc_id:
                return _row_to_document(d)
        return None

    supabase = get_supabase()
    response = supabase.table("documents").select("*").eq("id", doc_id).single().execute()
    if response.data:
        return _row_to_document(response.data)
    return None


async def upload_document(
    file_bytes: bytes,
    filename: str,
    name: str,
    department: str,
    access: str,
    description: str,
    user: User,
) -> Document:
    """Upload a PDF, parse it, generate embeddings, and store everything."""
    doc_id = f"d-{int(time.time() * 1000)}"
    file_size_mb = f"{len(file_bytes) / 1024 / 1024:.1f} MB"
    now = datetime.now(timezone.utc).isoformat()
    doc_name = name or filename.replace(".pdf", "")

    # Extract text from PDF
    pages = extract_text_from_pdf(file_bytes)
    content = pages_to_content(pages)
    page_count = len(pages)

    if not is_supabase_ready():
        doc_row = {
            "id": doc_id,
            "name": doc_name,
            "department": department,
            "type": "PDF",
            "access": access,
            "status": "active",
            "pages": page_count,
            "size": file_size_mb,
            "uploaded_by": user.name,
            "updated_at": now,
            "description": description,
            "content": content,
            "indexed": True,
            "storage_path": None,
        }
        _DEV_DOCUMENTS.insert(0, doc_row)
        await log_audit(
            user=user,
            action="Document Uploaded",
            resource=doc_name,
            status="success",
            details=f"Uploaded {doc_name} ({department}, {access})",
        )
        return _row_to_document(doc_row)

    supabase = get_supabase()

    # 1. Upload PDF to Supabase Storage
    storage_path = f"{user.id}/{doc_id}/{filename}"
    try:
        supabase.storage.from_("documents").upload(
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": "application/pdf"},
        )
    except Exception:
        storage_path = None  # Continue without storage if it fails

    # 2. Insert document metadata (status = processing)
    doc_row = {
        "id": doc_id,
        "name": doc_name,
        "department": department,
        "type": "PDF",
        "access": access,
        "status": "processing",
        "pages": page_count,
        "size": file_size_mb,
        "uploaded_by": user.name,
        "updated_at": now,
        "description": description,
        "content": content,
        "indexed": False,
        "storage_path": storage_path,
        "firebase_uid": user.id,
    }
    supabase.table("documents").insert(doc_row).execute()

    # 3. Chunk the text
    chunks = chunk_pages(pages)

    # 4. Generate embeddings
    if chunks:
        texts = [c["content"] for c in chunks]
        embeddings = embed_texts(texts)

        # Insert chunks with embeddings
        chunk_rows = []
        for chunk, embedding in zip(chunks, embeddings):
            chunk_rows.append({
                "document_id": doc_id,
                "chunk_index": chunk["chunk_index"],
                "page_number": chunk["page_number"],
                "content": chunk["content"],
                "embedding": embedding,
                "metadata": {"document_name": doc_name, "department": department},
            })
        
        # Insert in batches of 50
        for i in range(0, len(chunk_rows), 50):
            batch = chunk_rows[i : i + 50]
            supabase.table("document_chunks").insert(batch).execute()

    # 5. Update document status to active
    supabase.table("documents").update(
        {"status": "active", "indexed": True}
    ).eq("id", doc_id).execute()

    # 6. Audit log
    await log_audit(
        user=user,
        action="Document Uploaded",
        resource=doc_name,
        status="success",
        details=f"Uploaded {doc_name} ({department}, {access})",
    )

    return await get_document(doc_id) or _row_to_document(doc_row)


async def update_document(doc_id: str, edits: DocumentEdits, user: Optional[User] = None) -> Optional[Document]:
    """Update document content and re-index embeddings."""
    page_count = count_pages(edits.content)
    now = datetime.now(timezone.utc).isoformat()

    if not is_supabase_ready():
        for d in _DEV_DOCUMENTS:
            if d["id"] == doc_id:
                d["name"] = edits.name
                d["department"] = edits.department
                d["description"] = edits.description
                d["content"] = edits.content
                d["pages"] = page_count
                d["updated_at"] = now
                if user:
                    await log_audit(
                        user=user,
                        action="Document Updated",
                        resource=edits.name,
                        status="success",
                        details=f"Updated content and re-indexed {edits.name}",
                    )
                return _row_to_document(d)
        return None

    supabase = get_supabase()

    # Update metadata
    supabase.table("documents").update({
        "name": edits.name,
        "department": edits.department,
        "description": edits.description,
        "content": edits.content,
        "pages": page_count,
        "updated_at": now,
        "status": "processing",
        "indexed": False,
    }).eq("id", doc_id).execute()

    # Delete old chunks
    supabase.table("document_chunks").delete().eq("document_id", doc_id).execute()

    # Re-chunk and re-embed from the content string
    await _reindex_from_content(doc_id, edits.name, edits.department, edits.content)

    if user:
        await log_audit(
            user=user,
            action="Document Updated",
            resource=edits.name,
            status="success",
            details=f"Updated content and re-indexed {edits.name}",
        )

    return await get_document(doc_id)


async def delete_document(doc_id: str, user: User) -> bool:
    """Delete a document, its vector chunks, and storage file."""
    doc = await get_document(doc_id)
    if not doc:
        return False

    if not is_supabase_ready():
        global _DEV_DOCUMENTS
        _DEV_DOCUMENTS = [d for d in _DEV_DOCUMENTS if d["id"] != doc_id]
        await log_audit(
            user=user,
            action="Document Deleted",
            resource=doc.name,
            status="success",
            details=f"Deleted document {doc.name} ({doc.department})",
        )
        return True

    supabase = get_supabase()

    # 1. Delete file from storage if present
    if doc.storagePath:
        try:
            supabase.storage.from_("documents").remove([doc.storagePath])
        except Exception:
            pass

    # 2. Delete chunks
    try:
        supabase.table("document_chunks").delete().eq("document_id", doc_id).execute()
    except Exception:
        pass

    # 3. Delete document row
    supabase.table("documents").delete().eq("id", doc_id).execute()

    # 4. Audit log
    await log_audit(
        user=user,
        action="Document Deleted",
        resource=doc.name,
        status="success",
        details=f"Deleted document {doc.name} ({doc.department})",
    )
    return True


async def _reindex_from_content(doc_id: str, name: str, department: str, content: str) -> None:
    """Re-chunk and re-embed content for a document."""
    if not is_supabase_ready():
        return

    supabase = get_supabase()

    # Split content back into pages
    page_texts = content.split(PAGE_BREAK)
    pages = [(i + 1, text.strip()) for i, text in enumerate(page_texts) if text.strip()]

    chunks = chunk_pages(pages)
    if chunks:
        texts = [c["content"] for c in chunks]
        embeddings = embed_texts(texts)

        chunk_rows = []
        for chunk, embedding in zip(chunks, embeddings):
            chunk_rows.append({
                "document_id": doc_id,
                "chunk_index": chunk["chunk_index"],
                "page_number": chunk["page_number"],
                "content": chunk["content"],
                "embedding": embedding,
                "metadata": {"document_name": name, "department": department},
            })

        for i in range(0, len(chunk_rows), 50):
            batch = chunk_rows[i : i + 50]
            supabase.table("document_chunks").insert(batch).execute()

    supabase.table("documents").update(
        {"status": "active", "indexed": True}
    ).eq("id", doc_id).execute()
