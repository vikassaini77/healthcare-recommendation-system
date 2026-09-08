# Developer Guide

Welcome to the MedVision AI codebase. This guide will help you get started with development.

## Prerequisites
- Node.js (v18+)
- Python (3.10+)
- PyTorch

## Running the Application Locally
We provide a convenient batch script for Windows users:
```bash
.\run.bat
```
This will boot both the FastAPI backend and the React frontend in separate windows.

## Adding a New ML Model
1. Place your training script in `ml/training/`.
2. Save your trained weights (`.pkl` or `.pth`) in `ml/models/`.
3. Create an inference wrapper in `backend/src/ml_inference/`.
4. Expose the new inference logic via a route in `backend/src/api/routes.py`.

## Adding a New API Endpoint
1. Define your Request and Response schemas in `backend/src/domain/schemas.py`.
2. Add your route to `backend/src/api/routes.py`.
