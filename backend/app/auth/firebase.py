"""Firebase Admin SDK authentication helpers."""

import httpx
from firebase_admin import auth as firebase_auth

from ..config import settings
from ..dependencies import init_firebase


def verify_id_token(id_token: str) -> dict:
    """Verify a Firebase ID token and return the decoded claims."""
    init_firebase()
    return firebase_auth.verify_id_token(id_token)


def create_user(email: str, password: str, display_name: str = "") -> str:
    """Create a new Firebase Auth user. Returns the UID."""
    init_firebase()
    user_record = firebase_auth.create_user(
        email=email,
        password=password,
        display_name=display_name,
    )
    return user_record.uid


def delete_user(uid: str) -> None:
    """Delete a Firebase Auth user by UID."""
    init_firebase()
    firebase_auth.delete_user(uid)


def update_user(uid: str, **kwargs) -> None:
    """Update a Firebase Auth user's properties."""
    init_firebase()
    firebase_auth.update_user(uid, **kwargs)


async def sign_in_with_email_password(email: str, password: str) -> dict | None:
    """Sign in via Firebase Auth REST API to get an ID token.
    
    Uses the Firebase Auth REST API because the Admin SDK doesn't
    provide a sign-in method (it's meant for server-side verification).
    """
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword"
    params = {"key": settings.FIREBASE_API_KEY}
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True,
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, params=params, json=payload)
            if resp.status_code != 200:
                return None
            data = resp.json()
            return {
                "idToken": data["idToken"],
                "refreshToken": data["refreshToken"],
                "localId": data["localId"],
                "email": data["email"],
            }
    except Exception as exc:
        print(f"[WARN] Firebase Auth request failed: {exc}")
        return None
