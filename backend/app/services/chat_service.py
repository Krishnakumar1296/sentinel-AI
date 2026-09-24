"""Chat session management using Supabase."""

import time
from datetime import datetime, timezone
from typing import List, Optional

from ..dependencies import get_supabase, is_supabase_ready
from ..models.chat import ChatSession, ChatMessage
from ..models.search import SearchResult


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _chat_id() -> str:
    return f"chat-{int(time.time() * 1000)}"


def _msg_id(session_id: str, index: int) -> str:
    return f"{session_id}-{index}"


# In-memory dev fallback when Supabase is not configured
_DEV_CHATS: List[dict] = []
_DEV_MESSAGES: List[dict] = []


async def get_user_chats(user_id: str) -> List[ChatSession]:
    """Get all chat sessions for a user (without messages for sidebar listing)."""
    if not is_supabase_ready():
        return [
            ChatSession(
                id=c["id"],
                title=c.get("title", "New Chat"),
                createdAt=c.get("created_at", ""),
                updatedAt=c.get("updated_at", ""),
                messages=[],
            )
            for c in sorted(_DEV_CHATS, key=lambda x: x.get("updated_at", ""), reverse=True)
            if c.get("user_id") == user_id
        ]

    supabase = get_supabase()
    response = (
        supabase.table("chat_sessions")
        .select("*")
        .eq("user_id", user_id)
        .order("updated_at", desc=True)
        .execute()
    )
    sessions = []
    for row in (response.data or []):
        sessions.append(ChatSession(
            id=row["id"],
            title=row.get("title", "New Chat"),
            createdAt=row.get("created_at", ""),
            updatedAt=row.get("updated_at", ""),
            messages=[],
        ))
    return sessions


async def get_chat(session_id: str) -> Optional[ChatSession]:
    """Get a chat session with all its messages."""
    if not is_supabase_ready():
        chat = next((c for c in _DEV_CHATS if c["id"] == session_id), None)
        if not chat:
            return None
        msgs = [
            ChatMessage(
                id=m["id"],
                role=m["role"],
                content=m["content"],
                result=SearchResult(**m["result"]) if m.get("result") else None,
                timestamp=m.get("created_at", ""),
            )
            for m in _DEV_MESSAGES
            if m.get("session_id") == session_id
        ]
        return ChatSession(
            id=chat["id"],
            title=chat.get("title", "New Chat"),
            createdAt=chat.get("created_at", ""),
            updatedAt=chat.get("updated_at", ""),
            messages=msgs,
        )

    supabase = get_supabase()
    
    # Get session
    session_resp = (
        supabase.table("chat_sessions")
        .select("*")
        .eq("id", session_id)
        .single()
        .execute()
    )
    if not session_resp.data:
        return None
    
    row = session_resp.data
    
    # Get messages
    msgs_resp = (
        supabase.table("chat_messages")
        .select("*")
        .eq("session_id", session_id)
        .order("created_at")
        .execute()
    )
    
    messages = []
    for m in (msgs_resp.data or []):
        result = None
        if m.get("result"):
            try:
                result = SearchResult(**m["result"])
            except Exception:
                pass
        messages.append(ChatMessage(
            id=m["id"],
            role=m["role"],
            content=m["content"],
            result=result,
            timestamp=m.get("created_at", ""),
        ))
    
    return ChatSession(
        id=row["id"],
        title=row.get("title", "New Chat"),
        createdAt=row.get("created_at", ""),
        updatedAt=row.get("updated_at", ""),
        messages=messages,
    )


async def get_active_chat(user_id: str) -> Optional[ChatSession]:
    """Get the most recently updated chat session for a user."""
    if not is_supabase_ready():
        user_chats = [c for c in _DEV_CHATS if c.get("user_id") == user_id]
        if user_chats:
            user_chats.sort(key=lambda x: x.get("updated_at", ""), reverse=True)
            return await get_chat(user_chats[0]["id"])
        return None

    supabase = get_supabase()
    response = (
        supabase.table("chat_sessions")
        .select("id")
        .eq("user_id", user_id)
        .order("updated_at", desc=True)
        .limit(1)
        .execute()
    )
    if response.data:
        return await get_chat(response.data[0]["id"])
    return None


async def create_chat(user_id: str, title: str = "New Chat") -> ChatSession:
    """Create a new chat session."""
    now = _now_iso()
    chat_id = _chat_id()
    
    if not is_supabase_ready():
        chat_data = {
            "id": chat_id,
            "user_id": user_id,
            "title": title,
            "created_at": now,
            "updated_at": now,
        }
        _DEV_CHATS.insert(0, chat_data)
        return ChatSession(
            id=chat_id,
            title=title,
            createdAt=now,
            updatedAt=now,
            messages=[],
        )

    supabase = get_supabase()
    supabase.table("chat_sessions").insert({
        "id": chat_id,
        "user_id": user_id,
        "title": title,
        "created_at": now,
        "updated_at": now,
    }).execute()
    
    return ChatSession(
        id=chat_id,
        title=title,
        createdAt=now,
        updatedAt=now,
        messages=[],
    )


async def append_turn(
    session_id: str,
    query: str,
    result: SearchResult,
) -> Optional[ChatSession]:
    """Append a user question and assistant answer to a chat session."""
    now = _now_iso()

    if not is_supabase_ready():
        chat = next((c for c in _DEV_CHATS if c["id"] == session_id), None)
        if not chat:
            return None
        
        count = len([m for m in _DEV_MESSAGES if m.get("session_id") == session_id])
        _DEV_MESSAGES.append({
            "id": _msg_id(session_id, count + 1),
            "session_id": session_id,
            "role": "user",
            "content": query,
            "result": None,
            "created_at": now,
        })
        _DEV_MESSAGES.append({
            "id": _msg_id(session_id, count + 2),
            "session_id": session_id,
            "role": "assistant",
            "content": result.answer,
            "result": result.model_dump(),
            "created_at": now,
        })
        chat["updated_at"] = now
        if chat.get("title") == "New Chat":
            chat["title"] = query[:42] + "…" if len(query) > 42 else query
        return await get_chat(session_id)

    supabase = get_supabase()

    # Get current message count for IDs
    msgs_resp = (
        supabase.table("chat_messages")
        .select("id", count="exact")
        .eq("session_id", session_id)
        .execute()
    )
    count = msgs_resp.count or 0
    
    # Insert user message
    user_msg_id = _msg_id(session_id, count + 1)
    supabase.table("chat_messages").insert({
        "id": user_msg_id,
        "session_id": session_id,
        "role": "user",
        "content": query,
        "result": None,
        "created_at": now,
    }).execute()
    
    # Insert assistant message
    asst_msg_id = _msg_id(session_id, count + 2)
    supabase.table("chat_messages").insert({
        "id": asst_msg_id,
        "session_id": session_id,
        "role": "assistant",
        "content": result.answer,
        "result": result.model_dump(),
        "created_at": now,
    }).execute()
    
    # Update session title if it's still 'New Chat'
    session_resp = supabase.table("chat_sessions").select("title").eq("id", session_id).single().execute()
    title = session_resp.data.get("title", "") if session_resp.data else ""
    update_fields = {"updated_at": now}
    if title == "New Chat":
        short_title = query[:42] + "…" if len(query) > 42 else query
        update_fields["title"] = short_title
    
    supabase.table("chat_sessions").update(update_fields).eq("id", session_id).execute()
    
    return await get_chat(session_id)


async def delete_chat(session_id: str, user_id: str) -> bool:
    """Delete a chat session and all its messages."""
    if not is_supabase_ready():
        global _DEV_CHATS, _DEV_MESSAGES
        chat = next((c for c in _DEV_CHATS if c["id"] == session_id and c.get("user_id") == user_id), None)
        if not chat:
            return False
        _DEV_CHATS = [c for c in _DEV_CHATS if c["id"] != session_id]
        _DEV_MESSAGES = [m for m in _DEV_MESSAGES if m.get("session_id") != session_id]
        return True

    supabase = get_supabase()
    # verify ownership
    resp = supabase.table("chat_sessions").select("id").eq("id", session_id).eq("user_id", user_id).execute()
    if not resp.data:
        return False
    # delete messages first
    supabase.table("chat_messages").delete().eq("session_id", session_id).execute()
    supabase.table("chat_sessions").delete().eq("id", session_id).execute()
    return True


async def continue_conversation(
    user_id: str,
    conversation_id: str,
) -> Optional[ChatSession]:
    """Load a past search result into the user's active chat."""
    from ..services.search_service import get_search_conversation
    
    result = await get_search_conversation(conversation_id)
    if not result:
        return None
    
    # Get or create active chat
    active = await get_active_chat(user_id)
    if not active:
        active = await create_chat(user_id)
    
    # Append the historical turn
    return await append_turn(active.id, result.query, result)
