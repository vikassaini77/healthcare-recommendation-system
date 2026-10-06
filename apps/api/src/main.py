from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apps.api.src.core.config import settings
from apps.api.src.api.routes import router as api_router
from apps.api.src.api.auth import router as auth_router
from apps.api.src.api.patients import router as patients_router
from apps.api.src.api.history import router as history_router
from ml.inference.model import initialize as init_ml_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML models on startup
    init_ml_model()
    yield
    # Clean up on shutdown if needed

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth")
app.include_router(patients_router, prefix=f"{settings.API_V1_STR}/patients")
app.include_router(history_router, prefix=f"{settings.API_V1_STR}/history")

@app.get("/")
def root():
    return {"message": "Welcome to the MedVision AI Combined API"}
