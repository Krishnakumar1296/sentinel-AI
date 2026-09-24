from pydantic import BaseModel
from typing import List


class QueryTrendItem(BaseModel):
    date: str
    queries: int
    successful: int


class DepartmentQueries(BaseModel):
    name: str
    queries: int


class GapsByDepartment(BaseModel):
    department: str
    count: int


class AnalyticsData(BaseModel):
    totalQueries: int = 0
    successfulAnswers: int = 0
    failedQueries: int = 0
    avgResponseTime: float = 0.0
    faithfulnessScore: float = 0.0
    contextRelevance: float = 0.0
    answerConfidence: float = 0.0
    retrievalPrecision: float = 0.0
    queryTrend: List[QueryTrendItem] = []
    topDepartments: List[DepartmentQueries] = []
    gapsByDepartment: List[GapsByDepartment] = []
