# 🏥 MedVision AI: Personalized Healthcare & Diagnostics

A production-grade, FAANG-level architecture for AI-powered healthcare diagnostics. This system combines multiple machine learning models with a modern React frontend and a scalable FastAPI backend.

## 🚀 Features
- **Symptom Checker**: AI-based disease prediction with personalized medicine, diet, and workout recommendations.
- **Chest X-Ray Analysis**: Deep learning (ResNet50) powered pneumonia detection, complete with Grad-CAM visual explainability.
- **Generative AI Insights**: Google Gemini 1.5 Flash provides holistic, synthesized patient summaries.
- **Professional Diagnostics**: Premium, printable A4-ready diagnostic reports for clinical settings.

## 🏗️ Architecture

The codebase has been meticulously structured using **Domain-Driven Design (DDD)** and clear separation of concerns, heavily inspired by FAANG engineering standards.

- `backend/`: A robust FastAPI application utilizing modular routes, Pydantic data validation schemas, and clean `pydantic-settings` environment configuration.
- `frontend/`: A highly responsive UI built with Vite, React, TailwindCSS, and Shadcn UI.
- `ml/`: A completely isolated machine learning lifecycle layer containing raw data, training pipelines, and serialized model checkpoints.

## 📚 Documentation
For deep dives into the codebase, please refer to:
- [System Architecture](docs/architecture/README.md)
- [Developer Guide](docs/development/codebase-guide.md)

## 💻 Quickstart (Windows)

Ensure you have Python 3.10+ and Node.js v18+ installed.

1. Clone the repository.
2. Setup your `.env` file in `backend/.env` with your `GEMINI_API_KEY`.
3. Boot the application using the provided batch script:

```bash
.\run.bat
```

This will automatically install dependencies and launch both the backend (Port 8000) and frontend (Port 5173).
