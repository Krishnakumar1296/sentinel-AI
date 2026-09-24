"""Shared singleton clients for Firebase and Supabase."""

from functools import lru_cache

import os
import firebase_admin
from firebase_admin import credentials, firestore, auth as firebase_auth
from supabase import create_client, Client as SupabaseClient

from .config import settings


# ── Firebase ────────────────────────────────────────────────
_firebase_app: firebase_admin.App | None = None
_firebase_init_attempted: bool = False


def init_firebase() -> firebase_admin.App | None:
    """Initialize Firebase Admin SDK gracefully (idempotent)."""
    global _firebase_app, _firebase_init_attempted
    if _firebase_app is not None:
        return _firebase_app
    if firebase_admin._apps:
        _firebase_app = firebase_admin.get_app()
        return _firebase_app

    if _firebase_init_attempted:
        return _firebase_app
    _firebase_init_attempted = True

    cert_path = settings.FIREBASE_CREDENTIALS_PATH
    if not os.path.exists(cert_path):
        print(f"[WARN] Firebase credentials file not found at '{cert_path}'. Running without Firebase Admin.")
        return None

    try:
        cred = credentials.Certificate(cert_path)
        _firebase_app = firebase_admin.initialize_app(cred)
        return _firebase_app
    except Exception as exc:
        print(f"[WARN] Failed to initialize Firebase Admin SDK: {exc}")
        return None


def is_firebase_ready() -> bool:
    """Check if Firebase Admin SDK is initialized."""
    app = init_firebase()
    return app is not None


def get_firestore_client():
    """Get Firestore client."""
    app = init_firebase()
    if not app:
        raise RuntimeError("Firebase is not initialized. Please verify FIREBASE_CREDENTIALS_PATH.")
    return firestore.client()


def get_firebase_auth():
    """Get Firebase Auth module."""
    app = init_firebase()
    if not app:
        raise RuntimeError("Firebase is not initialized. Please verify FIREBASE_CREDENTIALS_PATH.")
    return firebase_auth


# ── Supabase ────────────────────────────────────────────────
_supabase_client: SupabaseClient | None = None
_supabase_verified: bool | None = None


def is_supabase_ready() -> bool:
    """Check if Supabase client is configured and actually reachable."""
    global _supabase_verified
    if not (settings.SUPABASE_URL and settings.SUPABASE_KEY):
        return False
    if _supabase_verified is not None:
        return _supabase_verified

    try:
        from urllib.parse import urlparse
        import socket
        parsed = urlparse(settings.normalized_supabase_url)
        host = parsed.hostname
        if host:
            socket.getaddrinfo(host, 443, proto=socket.IPPROTO_TCP)
        _supabase_verified = True
    except Exception as exc:
        print(f"[WARN] Supabase host unreachable ({exc}). Falling back to local in-memory store.")
        _supabase_verified = False

    return _supabase_verified


def get_supabase() -> SupabaseClient:
    """Get Supabase client singleton."""
    global _supabase_client
    if _supabase_client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise RuntimeError(
                "Supabase is not configured. Please set SUPABASE_URL and SUPABASE_KEY in backend/.env"
            )
        _supabase_client = create_client(settings.normalized_supabase_url, settings.SUPABASE_KEY)
    return _supabase_client
