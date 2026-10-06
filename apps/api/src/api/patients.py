from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db
from database.schemas.models import User, Patient
from apps.api.src.api.deps import get_current_user
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    gender: str
    weight_kg: float
    height_cm: float
    known_conditions: List[str] = []
    allergies: List[str] = []
    current_medications: List[str] = []
    pregnancy_status: Optional[str] = None

class PatientResponse(PatientCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

@router.post("/", response_model=PatientResponse)
def create_patient(
    patient_in: PatientCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    patient = Patient(
        **patient_in.dict(),
        user_id=current_user.id
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@router.get("/", response_model=List[PatientResponse])
def get_patients(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    patients = db.query(Patient).filter(Patient.user_id == current_user.id).all()
    return patients
