from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apps.api.src.core.config import settings
from apps.api.src.api.routes import router as api_router
from apps.api.src.api.auth import router as auth_router
from apps.api.src.api.patients import router as patients_router
from apps.api.src.api.history import router as history_router
from ml.inference.model import initialize as init_ml_model

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uuid
from apps.api.src.core.logger import logger, log_request

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing ML models...")
    init_ml_model()
    yield
    logger.info("Shutting down application...")

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Optional request logging
    request_id = str(uuid.uuid4())
    logger.info(f"[{request_id}] {request.method} {request.url}")
    response = await call_next(request)
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    request_id = str(uuid.uuid4())
    logger.error(f"[{request_id}] Unhandled Exception on {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "request_id": request_id}
    )

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
