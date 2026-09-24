"""Search and RAG endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional

from ..models.user import User
from ..models.search import SearchResult, SearchHistoryItem, SearchQuery
from ..auth.middleware import get_current_user
from ..services import search_service
from ..services.notification_service import report_unanswered

router = APIRouter(prefix="/api/search", tags=["Search"])


@router.post("", response_model=SearchResult)
async def search(body: SearchQuery, user: User = Depends(get_current_user)):
    """Execute a RAG search query."""
    result = await search_service.execute_search(body.query, user)
    
    # If no answer, report as unanswered
    if result.status == "no_answer":
        await report_unanswered(body.query, user)
    
    return result


@router.get("/conversations/{conversation_id}", response_model=SearchResult)
async def get_conversation(
    conversation_id: str,
    user: User = Depends(get_current_user),
):
    """Retrieve a past search conversation."""
    result = await search_service.get_search_conversation(conversation_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    return result


@router.get("/history", response_model=List[SearchHistoryItem])
async def get_history(user: User = Depends(get_current_user)):
    """Get the current user's search history."""
    return await search_service.get_search_history(user)


@router.delete("/history", status_code=status.HTTP_204_NO_CONTENT)
async def clear_history(user: User = Depends(get_current_user)):
    """Clear all search history for the current user."""
    await search_service.clear_search_history(user.id)
