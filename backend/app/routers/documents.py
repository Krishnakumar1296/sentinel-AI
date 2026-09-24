"""Document management endpoints."""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from typing import List, Optional

from ..models.user import User
from ..models.document import Document, DocumentEdits
from ..auth.middleware import get_current_user, require_manager_or_admin
from ..services import document_service

from ..services.notification_service import log_audit

router = APIRouter(prefix="/api/documents", tags=["Documents"])


@router.get("", response_model=List[Document])
async def list_documents(user: User = Depends(get_current_user)):
    """List documents filtered by user access level."""
    return await document_service.list_documents(user)


@router.get("/{doc_id}", response_model=Document)
async def get_document(doc_id: str, user: User = Depends(get_current_user)):
    """Get a single document with RBAC enforcement and audit logging."""
    doc = await document_service.get_document(doc_id)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")

    # RBAC check: employees cannot directly view restricted documents
    if user.role == "employee" and doc.access != "employee":
        await log_audit(
            user=user,
            action="Access Blocked",
            resource=doc.name,
            status="blocked",
            details=f"Employee role does not have access to {doc.department} ({doc.access}) documents",
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this restricted document.",
        )

    await log_audit(
        user=user,
        action="Document Accessed",
        resource=doc.name,
        status="success",
        details=f"Viewed {doc.name} ({doc.pages} pages)",
    )
    return doc


@router.post("/upload", response_model=Document, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    name: str = Form(""),
    department: str = Form("HR"),
    access: str = Form("employee"),
    description: str = Form(""),
    user: User = Depends(require_manager_or_admin),
):
    """Upload a PDF document and trigger RAG ingestion."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are accepted.",
        )
    
    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty file.",
        )
    
    doc = await document_service.upload_document(
        file_bytes=file_bytes,
        filename=file.filename,
        name=name or file.filename.replace(".pdf", ""),
        department=department,
        access=access,
        description=description,
        user=user,
    )
    return doc


@router.patch("/{doc_id}", response_model=Document)
async def update_document(
    doc_id: str,
    body: DocumentEdits,
    user: User = Depends(require_manager_or_admin),
):
    """Update a document's content and metadata, re-indexing embeddings."""
    doc = await document_service.update_document(doc_id, body, user)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")
    return doc


@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    doc_id: str,
    user: User = Depends(require_manager_or_admin),
):
    """Delete a document, its vector chunks, and its storage file."""
    deleted = await document_service.delete_document(doc_id, user)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")
