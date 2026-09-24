from pydantic import BaseModel
from typing import Optional, Literal

NotificationType = Literal["success", "warning", "error", "info"]


class Notification(BaseModel):
    id: str
    type: str
    title: str
    message: str
    timestamp: str
    read: bool = False
    action: Optional[str] = None
    requestId: Optional[str] = None


class AuditLogEntry(BaseModel):
    id: str
    timestamp: str
    userId: str
    userName: str
    action: str
    resource: str
    status: Literal["success", "blocked", "failed"] = "success"
    details: str = ""