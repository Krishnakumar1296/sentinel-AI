"""Chat session endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel

from ..models.user import User
from ..models.chat import ChatSession
from ..models.search import SearchResult
from ..auth.middleware import get_current_user
from ..services import chat_service

router = APIRouter(prefix="/api/chats", tags=["Chats"])


class AppendTurnBody(BaseModel):
    query: str
    result: SearchResult


@router.get("", response_model=List[ChatSession])
async def list_chats(user: User = Depends(get_current_user)):
    """List all chat sessions for the current user."""
    return await chat_service.get_user_chats(user.id)


@router.get("/active", response_model=Optional[ChatSession])
async def get_active_chat(user: User = Depends(get_current_user)):
    """Get the most recently active chat session."""
    return await chat_service.get_active_chat(user.id)


@router.get("/{session_id}", response_model=ChatSession)
async def get_chat(session_id: str, user: User = Depends(get_current_user)):
    """Get a specific chat session with messages."""
    chat = await chat_service.get_chat(session_id)
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found.")
    return chat


@router.post("", response_model=ChatSession, status_code=status.HTTP_201_CREATED)
async def create_chat(user: User = Depends(get_current_user)):
    """Start a new chat session."""
    return await chat_service.create_chat(user.id)


@router.post("/{session_id}/messages", response_model=ChatSession)
async def append_turn(
    session_id: str,
    body: AppendTurnBody,
    user: User = Depends(get_current_user),
):
    """Append a Q&A turn to a chat session."""
    chat = await chat_service.append_turn(session_id, body.query, body.result)
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found.")
    return chat


@router.post("/continue/{conversation_id}", response_model=ChatSession)
async def continue_conversation(
    conversation_id: str,
    user: User = Depends(get_current_user),
):
    """Continue a past search conversation in the active chat."""
    chat = await chat_service.continue_conversation(user.id, conversation_id)
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    return chat


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat(
    session_id: str,
    user: User = Depends(get_current_user),
):
    """Delete a chat session and its messages."""
    deleted = await chat_service.delete_chat(session_id, user.id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found.")
