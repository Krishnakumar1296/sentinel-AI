from pydantic import BaseModel
from typing import List, Optional, Literal
from .search import SearchResult


class ChatMessage(BaseModel):
    id: str
    role: Literal["user", "assistant"]
    content: str
    result: Optional[SearchResult] = None
    timestamp: str


class ChatSession(BaseModel):
    id: str
    title: str = "New Chat"
    createdAt: str
    updatedAt: str
    messages: List[ChatMessage] = []
