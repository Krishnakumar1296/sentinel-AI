"""Analytics endpoints."""

from fastapi import APIRouter, Depends

from ..models.user import User
from ..models.analytics import AnalyticsData
from ..auth.middleware import get_current_user, require_manager_or_admin
from ..services.analytics_service import get_analytics

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("", response_model=AnalyticsData)
async def analytics(user: User = Depends(require_manager_or_admin)):
    """Get RAG analytics data."""
    return await get_analytics()
