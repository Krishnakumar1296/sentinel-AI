"""Knowledge requests and gaps endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from ..models.user import User
from ..models.knowledge import KnowledgeRequest, KnowledgeGap
from ..models.document import Document, DocumentEdits
from ..auth.middleware import get_current_user, require_manager_or_admin
from ..services.notification_service import get_knowledge_requests, resolve_knowledge_request
from ..services.analytics_service import get_knowledge_gaps
from ..services.document_service import upload_document
from ..rag.pdf_parser import PAGE_BREAK, count_pages

router = APIRouter(prefix="/api/knowledge", tags=["Knowledge"])


@router.get("/requests", response_model=List[KnowledgeRequest])
async def list_requests(user: User = Depends(require_manager_or_admin)):
    """List all knowledge requests."""
    return await get_knowledge_requests()


@router.post("/requests/{request_id}/publish", response_model=Document)
async def publish_for_request(
    request_id: str,
    body: DocumentEdits,
    user: User = Depends(require_manager_or_admin),
):
    """Publish a new document to resolve a knowledge request."""
    from ..services.document_service import _reindex_from_content, _DEV_DOCUMENTS, _row_to_document, get_document
    from ..dependencies import get_supabase, is_supabase_ready
    import time
    from datetime import datetime, timezone
    
    doc_id = f"d-{int(time.time() * 1000)}"
    now = datetime.now(timezone.utc).isoformat()
    page_count = count_pages(body.content)

    if not is_supabase_ready():
        doc_row = {
            "id": doc_id,
            "name": body.name,
            "department": body.department,
            "type": "PDF",
            "access": "employee",
            "status": "active",
            "pages": page_count,
            "size": "2.0 MB",
            "uploaded_by": user.name,
            "updated_at": now,
            "description": body.description,
            "content": body.content,
            "indexed": True,
            "storage_path": None,
        }
        _DEV_DOCUMENTS.insert(0, doc_row)
        await resolve_knowledge_request(request_id, doc_id)
        return _row_to_document(doc_row)

    supabase = get_supabase()
    
    # Verify request exists
    req_resp = supabase.table("knowledge_requests").select("*").eq("id", request_id).single().execute()
    if not req_resp.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Knowledge request not found.")
    
    # Create the document
    doc_row = {
        "id": doc_id,
        "name": body.name,
        "department": body.department,
        "type": "PDF",
        "access": "employee",
        "status": "processing",
        "pages": page_count,
        "size": "2.0 MB",
        "uploaded_by": user.name,
        "updated_at": now,
        "description": body.description,
        "content": body.content,
        "indexed": False,
        "firebase_uid": user.id,
    }
    supabase.table("documents").insert(doc_row).execute()
    
    # Index the document content
    await _reindex_from_content(doc_id, body.name, body.department, body.content)
    
    # Resolve the knowledge request
    await resolve_knowledge_request(request_id, doc_id)
    
    doc = await get_document(doc_id)
    return doc or _row_to_document(doc_row)


@router.get("/gaps", response_model=List[KnowledgeGap])
async def list_gaps(user: User = Depends(get_current_user)):
    """List all knowledge gaps."""
    return await get_knowledge_gaps()
