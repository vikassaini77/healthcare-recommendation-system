from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db
from database.schemas.models import User, Patient, Assessment
from apps.api.src.api.deps import get_current_user
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

router = APIRouter()

class AssessmentResponse(BaseModel):
    id: int
    patient_id: int
    symptoms: List[str]
    symptom_duration: Optional[str]
    predicted_condition: str
    confidence: float
    top_predictions: Optional[List[Dict[str, Any]]]
    important_symptoms: Optional[List[str]]
    recommended_medications: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/patient/{patient_id}", response_model=List[AssessmentResponse])
def get_patient_history(
    patient_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Verify patient belongs to user
    patient = db.query(Patient).filter(Patient.id == patient_id, Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found or unauthorized")
        
    assessments = db.query(Assessment).filter(Assessment.patient_id == patient_id).order_by(Assessment.created_at.desc()).all()
    return assessments

class AssessmentCreate(BaseModel):
    patient_id: int
    symptoms: List[str]
    symptom_duration: Optional[str] = None
    predicted_condition: str
    confidence: float
    top_predictions: Optional[List[Dict[str, Any]]] = None
    important_symptoms: Optional[List[str]] = None
    recommended_medications: List[str] = []
    recommended_diets: List[str] = []
    precautions: List[str] = []
    holistic_summary: Optional[str] = None

@router.post("/", response_model=AssessmentResponse)
def save_assessment(
    assessment_in: AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.id == assessment_in.patient_id, Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found or unauthorized")
        
    assessment = Assessment(**assessment_in.dict())
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment

