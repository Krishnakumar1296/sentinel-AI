from pydantic import BaseModel
from typing import Optional, Literal


class KnowledgeGap(BaseModel):
    id: str
    question: str
    frequency: int = 1
    priority: Literal["high", "medium", "low"] = "medium"
    department: str = ""
    firstSeen: str = ""
    lastSeen: str = ""
    status: Literal["open", "in_progress", "resolved"] = "open"


class KnowledgeRequest(BaseModel):
    id: str
    question: str
    askedBy: str = ""
    timestamp: str = ""
    status: Literal["pending", "resolved"] = "pending"
    documentId: Optional[str] = None
