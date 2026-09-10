from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class PatientProfile(BaseModel):
    age: int
    gender: str
    weight: float
    conditions: List[str]

class PredictionRequest(BaseModel):
    symptoms: List[str]
    patient_profile: Optional[PatientProfile] = None

class PredictionResponse(BaseModel):
    prediction: str
    description: str
    precautions: List[str]
    medications: List[str]
    diets: List[str]
    workouts: List[str]

class SymptomsResponse(BaseModel):
    symptoms: List[str]

class XRayPredictionResponse(BaseModel):
    case_id: str
    prediction: str
    confidence: float
    risk_level: str
    gradcam: str

class HolisticPredictionResponse(BaseModel):
    xray_result: Optional[XRayPredictionResponse] = None
    symptom_result: PredictionResponse
    holistic_summary: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    response: str
