# System Architecture

MedVision AI is a hybrid machine learning and full-stack web application designed for healthcare recommendations and diagnostics.

## High-Level Architecture

The system is separated into three primary concerns:

1. **Frontend (React / Vite)**: A responsive, professional user interface built with React, Vite, TailwindCSS, and Shadcn UI components.
2. **Backend API (FastAPI)**: A modular domain-driven API that serves as the gateway for the frontend to access ML models and generative AI insights.
3. **ML Infrastructure**: A dedicated machine learning lifecycle directory for data processing, model training, and asset storage.

## Directory Structure

```
healthcare-recommendation-system/
├── backend/               # FastAPI Application Layer
│   ├── src/
│   │   ├── api/           # API Endpoints (routes.py)
│   │   ├── core/          # Configuration (config.py)
│   │   ├── domain/        # Pydantic Schemas (schemas.py)
│   │   ├── services/      # 3rd Party Integrations (llm_service.py)
│   │   └── ml_inference/  # Wrappers for ML model execution
├── ml/                    # Machine Learning Lifecycle
│   ├── data/              # Raw and Processed datasets
│   ├── training/          # Training scripts (.py)
│   └── models/            # Serialized model checkpoints (.pkl, .pth)
├── frontend/              # React UI
└── docs/                  # System Documentation
```

## Key Design Patterns
- **Separation of Concerns**: The API routing logic (`routes.py`) is decoupled from the ML model loading and execution (`ml_inference/`).
- **Domain-Driven Design**: All request/response schemas are centralized in `domain/schemas.py`.
- **Environment Configuration**: `core/config.py` uses `pydantic-settings` to robustly load environment variables from `.env`.
