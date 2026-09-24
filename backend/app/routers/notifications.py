from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from ..models.user import User
from ..models.notification import Notification, AuditLogEntry
from ..auth.middleware import get_current_user, require_admin
from ..services.notification_service import (
    get_notifications,
    get_audit_logs,
    mark_notification_read,
    mark_all_notifications_read,
)

router = APIRouter(prefix="/api", tags=["Notifications"])


@router.get("/notifications", response_model=List[Notification])
async def list_notifications(user: User = Depends(get_current_user)):
    """Get notifications for the current user."""
    return await get_notifications(user.id)


@router.patch("/notifications/{notification_id}/read")
async def mark_read(
    notification_id: str,
    user: User = Depends(get_current_user),
):
    """Mark a specific notification as read."""
    success = await mark_notification_read(notification_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found.",
        )
    return {"success": True, "id": notification_id}


@router.post("/notifications/read-all")
async def mark_all_read(user: User = Depends(get_current_user)):
    """Mark all notifications for the current user as read."""
    await mark_all_notifications_read(user.id)
    return {"success": True}


@router.get("/audit-logs", response_model=List[AuditLogEntry])
async def list_audit_logs(user: User = Depends(require_admin)):
    """Get security audit logs (admin only)."""
    return await get_audit_logs()
