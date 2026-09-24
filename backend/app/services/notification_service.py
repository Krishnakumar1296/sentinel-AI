"""Notification and audit log management using Supabase."""

import time
from datetime import datetime, timezone
from typing import List, Optional

from ..dependencies import get_supabase, is_supabase_ready
from ..models.notification import Notification, AuditLogEntry
from ..models.knowledge import KnowledgeRequest
from ..models.user import User


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# In-memory dev fallback when Supabase is not configured
_DEV_NOTIFICATIONS: List[dict] = [
    {
        "id": "n1",
        "type": "success",
        "title": "Document Processing Complete",
        "message": "Benefits Package Overview.pdf is now indexed and available for search.",
        "created_at": "2 minutes ago",
        "read": False,
        "action": "/search",
        "request_id": None,
        "user_id": None,
    },
    {
        "id": "n2",
        "type": "warning",
        "title": "Knowledge Gap Detected",
        "message": 'High-frequency unanswered question: "AI Usage Policy" — 48 queries with no answer.',
        "created_at": "15 minutes ago",
        "read": False,
        "action": "/requests",
        "request_id": "kr-1",
        "user_id": None,
    },
    {
        "id": "n3",
        "type": "error",
        "title": "Security Alert",
        "message": "Unauthorized document access attempt blocked for user michael@company.com.",
        "created_at": "1 hour ago",
        "read": False,
        "action": "/security",
        "request_id": None,
        "user_id": None,
    },
    {
        "id": "n4",
        "type": "info",
        "title": "New Document Added",
        "message": "Remote Work Guidelines has been updated and re-indexed.",
        "created_at": "3 hours ago",
        "read": True,
        "action": "/search",
        "request_id": None,
        "user_id": None,
    },
]

_DEV_AUDIT_LOGS: List[dict] = [
    {
        "id": "a1",
        "created_at": "Today, 10:42 AM",
        "user_id": "u4",
        "user_name": "Emily Chen",
        "action": "Document Accessed",
        "resource": "Employee Handbook 2024",
        "status": "success",
        "details": "Viewed page 24 of Employee Handbook",
    },
    {
        "id": "a2",
        "created_at": "Today, 10:31 AM",
        "user_id": "u2",
        "user_name": "Sarah Mitchell",
        "action": "Document Uploaded",
        "resource": "Benefits Package Overview",
        "status": "success",
        "details": "Uploaded new HR policy document",
    },
    {
        "id": "a3",
        "created_at": "Today, 9:54 AM",
        "user_id": "u5",
        "user_name": "Michael Torres",
        "action": "Access Blocked",
        "resource": "Q3 Financial Report",
        "status": "blocked",
        "details": "Employee role does not have access to Finance documents",
    },
    {
        "id": "a4",
        "created_at": "Today, 9:22 AM",
        "user_id": "u4",
        "user_name": "Emily Chen",
        "action": "Knowledge Search",
        "resource": "Remote Work Guidelines",
        "status": "success",
        "details": "Query answered with 96% confidence",
    },
]

_DEV_KNOWLEDGE_REQUESTS: List[dict] = [
    {
        "id": "kr-1",
        "question": "What is our AI usage policy for employees?",
        "asked_by": "Emily Chen",
        "user_id": "u4",
        "status": "pending",
        "document_id": None,
        "created_at": "Today, 11:03 AM",
    }
]


async def get_notifications(user_id: Optional[str] = None) -> List[Notification]:
    """Get notifications for a user (or all admin-broadcast notifications)."""
    if not is_supabase_ready():
        return [
            Notification(
                id=row["id"],
                type=row.get("type", "info"),
                title=row.get("title", ""),
                message=row.get("message", ""),
                timestamp=row.get("created_at", ""),
                read=row.get("read", False),
                action=row.get("action"),
                requestId=row.get("request_id"),
            )
            for row in _DEV_NOTIFICATIONS
            if not user_id or not row.get("user_id") or row.get("user_id") == user_id
        ]

    supabase = get_supabase()
    query = supabase.table("notifications").select("*").order("created_at", desc=True).limit(50)
    
    if user_id:
        response = query.or_(f"user_id.eq.{user_id},user_id.is.null").execute()
    else:
        response = query.execute()
    
    notifications = []
    for row in (response.data or []):
        notifications.append(Notification(
            id=row["id"],
            type=row.get("type", "info"),
            title=row.get("title", ""),
            message=row.get("message", ""),
            timestamp=row.get("created_at", ""),
            read=row.get("read", False),
            action=row.get("action"),
            requestId=row.get("request_id"),
        ))
    return notifications


async def mark_notification_read(notification_id: str) -> bool:
    """Mark a single notification as read."""
    if not is_supabase_ready():
        for n in _DEV_NOTIFICATIONS:
            if n["id"] == notification_id:
                n["read"] = True
                return True
        return False

    supabase = get_supabase()
    res = supabase.table("notifications").update({"read": True}).eq("id", notification_id).execute()
    return bool(res.data)


async def mark_all_notifications_read(user_id: Optional[str] = None) -> bool:
    """Mark all notifications as read for a user."""
    if not is_supabase_ready():
        for n in _DEV_NOTIFICATIONS:
            if not user_id or not n.get("user_id") or n.get("user_id") == user_id:
                n["read"] = True
        return True

    supabase = get_supabase()
    query = supabase.table("notifications").update({"read": True})
    if user_id:
        query = query.or_(f"user_id.eq.{user_id},user_id.is.null")
    query.execute()
    return True


async def push_notification(
    type: str,
    title: str,
    message: str,
    user_id: Optional[str] = None,
    action: Optional[str] = None,
    request_id: Optional[str] = None,
) -> None:
    """Create a notification."""
    notif_id = f"n-{int(time.time() * 1000)}"
    now = _now_iso()
    
    if not is_supabase_ready():
        _DEV_NOTIFICATIONS.insert(0, {
            "id": notif_id,
            "user_id": user_id,
            "type": type,
            "title": title,
            "message": message,
            "read": False,
            "action": action,
            "request_id": request_id,
            "created_at": now,
        })
        return

    supabase = get_supabase()
    supabase.table("notifications").insert({
        "id": notif_id,
        "user_id": user_id,
        "type": type,
        "title": title,
        "message": message,
        "read": False,
        "action": action,
        "request_id": request_id,
        "created_at": now,
    }).execute()


async def report_unanswered(query: str, user: User) -> None:
    """Report a query that the RAG couldn't answer — creates a KnowledgeRequest + notification."""
    supabase = get_supabase()
    
    # Check for duplicate pending requests
    existing = (
        supabase.table("knowledge_requests")
        .select("id")
        .eq("question", query.strip())
        .eq("status", "pending")
        .limit(1)
        .execute()
    )
    if existing.data:
        return  # Already reported
    
    request_id = f"kr-{int(time.time() * 1000)}"
    now = _now_iso()
    
    supabase.table("knowledge_requests").insert({
        "id": request_id,
        "question": query.strip(),
        "asked_by": user.name,
        "user_id": user.id,
        "status": "pending",
        "created_at": now,
    }).execute()
    
    # Also update/create knowledge gap
    gap_resp = (
        supabase.table("knowledge_gaps")
        .select("*")
        .eq("question", query.strip())
        .limit(1)
        .execute()
    )
    if gap_resp.data:
        gap = gap_resp.data[0]
        supabase.table("knowledge_gaps").update({
            "frequency": gap["frequency"] + 1,
            "last_seen": now,
        }).eq("id", gap["id"]).execute()
    else:
        supabase.table("knowledge_gaps").insert({
            "id": f"kg-{int(time.time() * 1000)}",
            "question": query.strip(),
            "frequency": 1,
            "priority": "medium",
            "department": user.department,
            "first_seen": now,
            "last_seen": now,
            "status": "open",
        }).execute()
    
    # Push admin notification
    await push_notification(
        type="warning",
        title="New Knowledge Request",
        message=f'"{query.strip()}" — information not found in the documents. Click to update the knowledge base.',
        action="/requests",
        request_id=request_id,
    )


async def get_knowledge_requests() -> List[KnowledgeRequest]:
    """Get all knowledge requests."""
    if not is_supabase_ready():
        return [
            KnowledgeRequest(
                id=row["id"],
                question=row.get("question", ""),
                askedBy=row.get("asked_by", ""),
                timestamp=row.get("created_at", ""),
                status=row.get("status", "pending"),
                documentId=row.get("document_id"),
            )
            for row in _DEV_KNOWLEDGE_REQUESTS
        ]

    supabase = get_supabase()
    response = (
        supabase.table("knowledge_requests")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )
    return [
        KnowledgeRequest(
            id=row["id"],
            question=row.get("question", ""),
            askedBy=row.get("asked_by", ""),
            timestamp=row.get("created_at", ""),
            status=row.get("status", "pending"),
            documentId=row.get("document_id"),
        )
        for row in (response.data or [])
    ]


async def resolve_knowledge_request(request_id: str, document_id: str) -> None:
    """Mark a knowledge request as resolved."""
    if not is_supabase_ready():
        for r in _DEV_KNOWLEDGE_REQUESTS:
            if r["id"] == request_id:
                r["status"] = "resolved"
                r["document_id"] = document_id
        await push_notification(
            type="success",
            title="Your question has been answered",
            message="A new document was added covering your requested question. Open AI Knowledge Search to ask it again.",
            action="/search",
        )
        return

    supabase = get_supabase()
    supabase.table("knowledge_requests").update({
        "status": "resolved",
        "document_id": document_id,
    }).eq("id", request_id).execute()
    
    # Push success notification
    req_resp = supabase.table("knowledge_requests").select("question").eq("id", request_id).single().execute()
    question = req_resp.data.get("question", "") if req_resp.data else ""
    
    await push_notification(
        type="success",
        title="Your question has been answered",
        message=f'A new document was added covering "{question}". Open AI Knowledge Search to ask it again.',
        action="/search",
    )


async def get_audit_logs() -> List[AuditLogEntry]:
    """Get security audit logs."""
    if not is_supabase_ready():
        return [
            AuditLogEntry(
                id=row["id"],
                timestamp=row.get("created_at", ""),
                userId=row.get("user_id", ""),
                userName=row.get("user_name", ""),
                action=row.get("action", ""),
                resource=row.get("resource", ""),
                status=row.get("status", "success"),
                details=row.get("details", ""),
            )
            for row in _DEV_AUDIT_LOGS
        ]

    supabase = get_supabase()
    response = (
        supabase.table("audit_logs")
        .select("*")
        .order("created_at", desc=True)
        .limit(100)
        .execute()
    )
    return [
        AuditLogEntry(
            id=row["id"],
            timestamp=row.get("created_at", ""),
            userId=row.get("user_id", ""),
            userName=row.get("user_name", ""),
            action=row.get("action", ""),
            resource=row.get("resource", ""),
            status=row.get("status", "success"),
            details=row.get("details", ""),
        )
        for row in (response.data or [])
    ]


async def log_audit(
    user: User,
    action: str,
    resource: str,
    status: str = "success",
    details: str = "",
) -> None:
    """Insert an audit log entry."""
    entry_id = f"al-{int(time.time() * 1000)}"
    now = _now_iso()

    if not is_supabase_ready():
        _DEV_AUDIT_LOGS.insert(0, {
            "id": entry_id,
            "user_id": user.id,
            "user_name": user.name,
            "action": action,
            "resource": resource,
            "status": status,
            "details": details,
            "created_at": now,
        })
        return

    supabase = get_supabase()
    try:
        supabase.table("audit_logs").insert({
            "id": entry_id,
            "user_id": user.id,
            "user_name": user.name,
            "action": action,
            "resource": resource,
            "status": status,
            "details": details,
            "created_at": now,
        }).execute()
    except Exception as exc:
        print(f"[WARN] Failed to insert audit log: {exc}")
