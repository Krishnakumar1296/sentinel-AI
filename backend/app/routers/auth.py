"""Authentication endpoints."""

from fastapi import APIRouter, HTTPException, status, Depends

from ..models.user import LoginRequest, LoginResponse, User
from ..auth.firebase import sign_in_with_email_password, verify_id_token
from ..config import settings
from ..auth.middleware import get_current_user
from ..dependencies import is_firebase_ready
from ..services.user_service import (
    get_user_by_uid,
    get_user_by_email,
    get_user_by_username,
    update_last_active,
    verify_dev_user,
)
from ..services.notification_service import log_audit

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest):
    """Authenticate a user and return their profile + token."""
    identifier = body.email.strip().lower()

    # 1. Direct Firebase Auth when FIREBASE_API_KEY is configured
    if settings.FIREBASE_API_KEY:
        email = identifier
        if "@" not in identifier:
            user = await get_user_by_username(identifier)
            if user:
                email = user.email

        result = await sign_in_with_email_password(email, body.password)
        if result:
            uid = result["localId"]
            user = None
            if is_firebase_ready():
                user = await get_user_by_uid(uid)
            if not user:
                name = email.split("@")[0].replace(".", " ").title()
                user = User(
                    id=uid,
                    name=name,
                    email=email,
                    username=email.split("@")[0],
                    department="Engineering" if "admin" in email.lower() or "krish" in email.lower() else "General",
                    role="admin" if "admin" in email.lower() or "krish" in email.lower() else "employee",
                    status="active",
                    lastActive="Just now",
                    createdAt="2026-09-11",
                )
            await log_audit(
                user=user,
                action="Document Accessed",
                resource="System",
                status="success",
                details=f"User {user.name} ({user.email}) signed in via Firebase.",
            )
            return LoginResponse(user=user, token=result["idToken"])
        elif not settings.DEV_MODE:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials. Please verify your email and password.",
            )

    # 2. Local dev store fallback ONLY if DEV_MODE is explicitly True
    if settings.DEV_MODE:
        dev_user = await verify_dev_user(identifier, body.password)
        if dev_user:
            await update_last_active(dev_user.id)
            await log_audit(
                user=dev_user,
                action="Document Accessed",
                resource="System",
                status="success",
                details=f"User {dev_user.name} ({dev_user.email}) signed in successfully.",
            )
            return LoginResponse(user=dev_user, token=f"dev-token-{dev_user.id}")

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials. Please verify your username and password.",
    )


@router.post("/logout")
async def logout(user: User = Depends(get_current_user)):
    """Logout endpoint (client-side token invalidation)."""
    return {"success": True}


@router.get("/me", response_model=User)
async def get_me(user: User = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    return user
