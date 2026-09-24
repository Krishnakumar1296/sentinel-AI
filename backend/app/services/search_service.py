"""Search service — orchestrates RAG and persists history."""

import time
from datetime import datetime, timezone
from typing import Optional, List

from ..dependencies import get_supabase, is_supabase_ready
from ..models.search import SearchResult, SearchHistoryItem, SearchSource
from ..models.user import User
from ..rag.pipeline import search as rag_search
from .notification_service import log_audit


# In-memory dev fallback when Supabase is not configured or table has no queries yet
_DEV_SEARCH_HISTORY: List[dict] = [
    {
        "id": "h1",
        "user_id": "u1",
        "query": "What is the remote work policy?",
        "status": "verified",
        "confidence": 96,
        "sources_count": 1,
        "response_time": 2.4,
        "created_at": "Today, 4:32 PM",
        "result": {
            "id": "h1",
            "query": "What is the remote work policy?",
            "answer": "According to the Remote Work Guidelines (Section 3.2), employees are eligible for remote work arrangements under the following conditions:\n\n• Employees must have completed at least 3 months of employment\n• A formal remote work agreement must be signed with the HR department\n• Employees are entitled to work remotely up to 3 days per week (hybrid model)\n• Full remote work requires manager approval and is reviewed quarterly\n\nAll remote employees must maintain core working hours of 10:00 AM – 3:00 PM in their local timezone and ensure a secure, dedicated workspace.",
            "confidence": 96,
            "sources": [
                {
                    "id": "s1",
                    "documentId": "d5",
                    "documentName": "Remote Work Guidelines",
                    "page": 8,
                    "totalPages": 18,
                    "relevance": 96,
                    "excerpt": "Employees are entitled to work remotely up to 3 days per week under the hybrid work model. A formal remote work agreement must be signed with the HR department.",
                }
            ],
            "timestamp": "Today, 4:32 PM",
            "status": "verified",
            "responseTime": 2.4,
        },
    },
    {
        "id": "h2",
        "user_id": "u1",
        "query": "How many days of annual leave do I get?",
        "status": "verified",
        "confidence": 98,
        "sources_count": 1,
        "response_time": 1.8,
        "created_at": "Today, 2:15 PM",
        "result": {
            "id": "h2",
            "query": "How many days of annual leave do I get?",
            "answer": "According to the Employee Handbook 2024 (Section 6.1), full-time employees are entitled to:\n\n• 24 days of paid annual leave per calendar year\n• 10 public holidays as per the annual company calendar\n• Up to 5 additional days for sick leave with a medical certificate",
            "confidence": 98,
            "sources": [
                {
                    "id": "s2",
                    "documentId": "d1",
                    "documentName": "Employee Handbook 2024",
                    "page": 17,
                    "totalPages": 48,
                    "relevance": 98,
                    "excerpt": "Full-time employees receive 24 days of paid annual leave each calendar year, plus 10 public holidays as per the annual company calendar.",
                }
            ],
            "timestamp": "Today, 2:15 PM",
            "status": "verified",
            "responseTime": 1.8,
        },
    },
    {
        "id": "h3",
        "user_id": "u1",
        "query": "What is the AI usage policy for employees?",
        "status": "no_answer",
        "confidence": 0,
        "sources_count": 0,
        "response_time": 2.1,
        "created_at": "Today, 11:03 AM",
        "result": {
            "id": "h3",
            "query": "What is the AI usage policy for employees?",
            "answer": "",
            "confidence": 0,
            "sources": [],
            "timestamp": "Today, 11:03 AM",
            "status": "no_answer",
            "responseTime": 2.1,
        },
    },
    {
        "id": "h4",
        "user_id": "u1",
        "query": "Explain our data retention policy",
        "status": "verified",
        "confidence": 91,
        "sources_count": 1,
        "response_time": 3.2,
        "created_at": "Yesterday, 3:45 PM",
        "result": {
            "id": "h4",
            "query": "Explain our data retention policy",
            "answer": "The Data Security Policy (Section 5.4) requires that:\n\n• Customer records must be retained in accordance with applicable regulatory and operational requirements\n• All retained data must be stored within the organization's secure vector vault and access is governed by role-based authorization\n• Records older than the defined retention period will be securely purged in line with the disposal schedule",
            "confidence": 91,
            "sources": [
                {
                    "id": "s3",
                    "documentId": "d2",
                    "documentName": "Data Security Policy",
                    "page": 9,
                    "totalPages": 22,
                    "relevance": 91,
                    "excerpt": "All retained data must be stored within the organization's secure vector vault and access is governed by role-based authorization.",
                }
            ],
            "timestamp": "Yesterday, 3:45 PM",
            "status": "verified",
            "responseTime": 3.2,
        },
    },
    {
        "id": "h5",
        "user_id": "u1",
        "query": "What are the onboarding requirements for new employees?",
        "status": "verified",
        "confidence": 94,
        "sources_count": 1,
        "response_time": 2.7,
        "created_at": "Yesterday, 10:22 AM",
        "result": {
            "id": "h5",
            "query": "What are the onboarding requirements for new employees?",
            "answer": "According to the IT Onboarding Checklist & Employee Handbook:\n\n• Complete IT asset verification and two-factor authentication configuration on Day 1\n• Review and sign the Information Security and Acceptable Use Policy\n• Complete assigned compliance and data privacy training within the first 14 days",
            "confidence": 94,
            "sources": [
                {
                    "id": "s4",
                    "documentId": "d7",
                    "documentName": "IT Onboarding Checklist",
                    "page": 3,
                    "totalPages": 12,
                    "relevance": 94,
                    "excerpt": "New employees must complete two-factor authentication and sign the Information Security Policy on Day 1.",
                }
            ],
            "timestamp": "Yesterday, 10:22 AM",
            "status": "verified",
            "responseTime": 2.7,
        },
    },
    {
        "id": "h6",
        "user_id": "u1",
        "query": "New vendor approval process?",
        "status": "no_answer",
        "confidence": 0,
        "sources_count": 0,
        "response_time": 1.9,
        "created_at": "Aug 26, 2:11 PM",
        "result": {
            "id": "h6",
            "query": "New vendor approval process?",
            "answer": "",
            "confidence": 0,
            "sources": [],
            "timestamp": "Aug 26, 2:11 PM",
            "status": "no_answer",
            "responseTime": 1.9,
        },
    },
    {
        "id": "h7",
        "user_id": "u1",
        "query": "What is the expense reimbursement procedure?",
        "status": "partial",
        "confidence": 67,
        "sources_count": 1,
        "response_time": 2.2,
        "created_at": "Aug 26, 9:34 AM",
        "result": {
            "id": "h7",
            "query": "What is the expense reimbursement procedure?",
            "answer": "Expenses must be submitted through the finance portal with itemized receipts attached within 30 days of purchase. Manager pre-approval is required for expenses exceeding $500.",
            "confidence": 67,
            "sources": [
                {
                    "id": "s5",
                    "documentId": "d3",
                    "documentName": "Q3 Financial Report",
                    "page": 12,
                    "totalPages": 64,
                    "relevance": 67,
                    "excerpt": "Expense claims require manager approval and must be filed within 30 days.",
                }
            ],
            "timestamp": "Aug 26, 9:34 AM",
            "status": "partial",
            "responseTime": 2.2,
        },
    },
]


async def execute_search(query: str, user: User) -> SearchResult:
    """Run a RAG search and persist the result in history."""
    result = await rag_search(
        query=query,
        user_access_level=user.role,
        user_department=user.department,
    )

    now = datetime.now(timezone.utc).isoformat()
    history_row = {
        "id": result.id,
        "user_id": user.id,
        "query": query,
        "status": result.status,
        "confidence": result.confidence,
        "sources_count": len(result.sources),
        "response_time": result.responseTime,
        "result": result.model_dump(),
        "created_at": now,
    }

    # Always keep in local dev history for immediate resilience
    _DEV_SEARCH_HISTORY.insert(0, history_row)

    if is_supabase_ready():
        supabase = get_supabase()
        try:
            supabase.table("search_history").insert(history_row).execute()
        except Exception as e:
            print(f"[WARN] Failed to save search to Supabase: {e}")

    # Audit log
    await log_audit(
        user=user,
        action="Knowledge Search",
        resource=f'"{query[:40]}"',
        status="success" if result.status != "no_answer" else "failed",
        details=f"Result status: {result.status} (confidence: {result.confidence}%, {len(result.sources)} sources)",
    )

    return result


async def get_search_conversation(conversation_id: str) -> Optional[SearchResult]:
    """Retrieve a full SearchResult from history by ID."""
    if is_supabase_ready():
        try:
            supabase = get_supabase()
            response = (
                supabase.table("search_history")
                .select("result")
                .eq("id", conversation_id)
                .single()
                .execute()
            )
            if response.data and response.data.get("result"):
                return SearchResult(**response.data["result"])
        except Exception:
            pass

    item = next((h for h in _DEV_SEARCH_HISTORY if h["id"] == conversation_id), None)
    if item and item.get("result"):
        return SearchResult(**item["result"])
    return None


async def get_search_history(user: User | str) -> List[SearchHistoryItem]:
    """Get search history for a user or organization."""
    user_id = user.id if isinstance(user, User) else user
    user_role = user.role if isinstance(user, User) else "employee"

    if is_supabase_ready():
        try:
            supabase = get_supabase()
            query_builder = supabase.table("search_history").select("id, query, status, confidence, sources_count, response_time, created_at")
            if user_role not in ("admin", "manager"):
                query_builder = query_builder.eq("user_id", user_id)

            response = query_builder.order("created_at", desc=True).limit(100).execute()
            if response.data and len(response.data) > 0:
                items = []
                for row in response.data:
                    items.append(SearchHistoryItem(
                        id=row["id"],
                        query=row["query"],
                        timestamp=row.get("created_at", ""),
                        status=row.get("status", "verified"),
                        confidence=row.get("confidence", 0),
                        sourcesCount=row.get("sources_count", 0),
                        responseTime=row.get("response_time", 0),
                    ))
                return items
        except Exception as e:
            print(f"[WARN] Failed to query search_history from Supabase: {e}")

    # Fallback to in-memory / seed history
    items = []
    for row in _DEV_SEARCH_HISTORY:
        items.append(SearchHistoryItem(
            id=row["id"],
            query=row["query"],
            timestamp=row.get("created_at", ""),
            status=row.get("status", "verified"),
            confidence=row.get("confidence", 0),
            sourcesCount=row.get("sources_count", 0),
            responseTime=row.get("response_time", 0),
        ))
    return items


async def clear_search_history(user_id: str) -> None:
    """Clear search history for a user."""
    global _DEV_SEARCH_HISTORY
    _DEV_SEARCH_HISTORY = [h for h in _DEV_SEARCH_HISTORY if h.get("user_id") != user_id and user_id != "u1"]

    if is_supabase_ready():
        try:
            supabase = get_supabase()
            supabase.table("search_history").delete().eq("user_id", user_id).execute()
        except Exception:
            pass
