from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables / .env file."""

    # Firebase
    FIREBASE_CREDENTIALS_PATH: str = "./firebase-service-account.json"
    FIREBASE_API_KEY: str = ""

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    # Google Gemini
    GEMINI_API_KEY: str = ""

    # Development mode (falls back gracefully if credentials are not yet configured)
    DEV_MODE: bool = True

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000,http://localhost:5174,http://127.0.0.1:5174"

    @property
    def cors_origin_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def is_firebase_configured(self) -> bool:
        return bool(self.FIREBASE_API_KEY and os.path.exists(self.FIREBASE_CREDENTIALS_PATH))

    @property
    def is_supabase_configured(self) -> bool:
        return bool(self.SUPABASE_URL and self.SUPABASE_KEY)

    @property
    def normalized_supabase_url(self) -> str:
        url = self.SUPABASE_URL.strip().rstrip("/")
        if url.endswith("/rest/v1"):
            url = url[:-len("/rest/v1")].rstrip("/")
        return url

    @property
    def is_gemini_configured(self) -> bool:
        return bool(self.GEMINI_API_KEY)

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
