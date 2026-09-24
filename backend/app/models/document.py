from pydantic import BaseModel
from typing import Optional, Literal

DocumentStatus = Literal["active", "restricted", "processing", "failed"]
DocumentAccess = Literal["employee", "manager", "admin", "finance", "hr", "it"]


class Document(BaseModel):
    id: str
    name: str
    department: str
    type: str = "PDF"
    access: str = "employee"
    status: str = "processing"
    pages: int = 0
    size: str = ""
    uploadedBy: str = ""
    updatedAt: str = ""
    description: Optional[str] = None
    content: Optional[str] = None
    indexed: bool = False
    storagePath: Optional[str] = None


class DocumentEdits(BaseModel):
    name: str
    department: str
    description: str
    content: str
