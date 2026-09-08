@echo off
echo ====================================================
echo Starting Healthcare Recommendation System
echo ====================================================

echo [1/2] Starting Backend Server (FastAPI)...
start "Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn src.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting Frontend App (React/Vite)...
start "Frontend (React)" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Both services are starting in separate windows!
echo Backend API will be available at http://127.0.0.1:8000
echo Frontend will be available at http://localhost:5173 (check the frontend window)
echo.
pause

