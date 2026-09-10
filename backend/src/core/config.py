import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Try loading .env from backend root
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '.env'))

class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = "MedVision AI Backend"
    API_V1_STR: str = "/api"

    # ML Paths (relative to the repo root)
    REPO_ROOT: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    ML_DATA_PROCESSED_DIR: str = os.path.join(REPO_ROOT, "ml", "data", "processed")
    ML_MODELS_DIR: str = os.path.join(REPO_ROOT, "ml", "models")

    # API Keys
    GEMINI_API_KEY: str = os.environ.get("GEMINI_API_KEY", "")

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "*"]

settings = Settings()
