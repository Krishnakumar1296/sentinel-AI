from pydantic import BaseModel
from typing import List, Literal


class SearchSource(BaseModel):
    id: str
    documentId: str
    documentName: str
    page: int
    totalPages: int
    relevance: float
    excerpt: str


class SearchResult(BaseModel):
    id: str
    query: str
    answer: str
    confidence: float
    sources: List[SearchSource]
    citations: List[SearchSource] = []
    timestamp: str
    status: Literal["verified", "no_answer", "partial"]
    responseTime: float


class SearchHistoryItem(BaseModel):
    id: str
    query: str
    timestamp: str
    status: Literal["verified", "no_answer", "partial"]
    confidence: float
    sourcesCount: int
    responseTime: float


class SearchQuery(BaseModel):
    query: str
