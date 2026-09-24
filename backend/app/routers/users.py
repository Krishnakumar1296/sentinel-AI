"""User management endpoints (admin only)."""

from fastapi import APIRouter, HTTPException, status, Depends
from typing import List

from ..models.user import User, NewUserInput, UserUpdate
from ..auth.middleware import get_current_user, require_admin
from ..services import user_service
from ..services.notification_service import log_audit

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("", response_model=List[User])
async def list_users(user: User = Depends(require_admin)):
    """List all users (admin only)."""
    return await user_service.list_users()


@router.post("", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(body: NewUserInput, user: User = Depends(require_admin)):
    """Create a new user (admin only)."""
    # Check for duplicate email
    existing = await user_service.get_user_by_email(body.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )
    try:
        created = await user_service.create_user(body)
        await log_audit(
            user=user,
            action="User Created",
            resource=created.name,
            status="success",
            details=f"Created user {created.email} with role {created.role}",
        )
        return created
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.patch("/{user_id}", response_model=User)
async def update_user(user_id: str, body: UserUpdate, user: User = Depends(require_admin)):
    """Update a user's profile (admin only)."""
    updated = await user_service.update_user(user_id, body)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )
    await log_audit(
        user=user,
        action="User Updated",
        resource=updated.name,
        status="success",
        details=f"Updated profile for {updated.email}",
    )
    return updated


@router.patch("/{user_id}/role", response_model=User)
async def update_user_role(
    user_id: str,
    body: dict,
    user: User = Depends(require_admin),
):
    """Update a user's role (admin only)."""
    role = body.get("role")
    if role not in ("employee", "manager", "admin"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role.",
        )
    updated = await user_service.update_user(user_id, UserUpdate(role=role))
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    await log_audit(
        user=user,
        action="User Updated",
        resource=updated.name,
        status="success",
        details=f"Updated role for {updated.email} to {role}",
    )
    return updated


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str, user: User = Depends(require_admin)):
    """Delete a user (admin only)."""
    await user_service.delete_user(user_id)
    await log_audit(
        user=user,
        action="User Deleted",
        resource=user_id,
        status="success",
        details=f"Deleted user with ID {user_id}",
    )
