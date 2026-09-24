"""Sentinel AI — FastAPI Application Entrypoint."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .dependencies import init_firebase

# Import routers
from .routers import auth, users, documents, search, chats, knowledge, analytics, notifications


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup."""
    fb_app = init_firebase()
    if fb_app:
        print("[OK] Firebase Admin SDK initialized")
    else:
        print("[INFO] Firebase Admin not configured (set FIREBASE_CREDENTIALS_PATH)")

    if settings.is_supabase_configured:
        print("[OK] Supabase client configured")
    else:
        print("[INFO] Supabase not configured (set SUPABASE_URL & SUPABASE_KEY)")

    if settings.is_gemini_configured:
        print("[OK] Google Gemini AI configured")
    else:
        print("[INFO] Gemini API key not set (set GEMINI_API_KEY)")

    print("[STARTUP] Sentinel AI backend is running")
    yield
    print("[SHUTDOWN] Shutting down Sentinel AI backend")


app = FastAPI(
    title="Sentinel AI",
    description="Secure Enterprise Knowledge Management Backend",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(documents.router)
app.include_router(search.router)
app.include_router(chats.router)
app.include_router(knowledge.router)
app.include_router(analytics.router)
app.include_router(notifications.router)


@app.get("/")
async def root():
    return {"service": "Sentinel AI", "status": "running", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
