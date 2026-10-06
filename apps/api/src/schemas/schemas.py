from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PatientProfile(BaseModel):
    name: str = Field(default="Unknown")
    age: int = Field(gt=0, le=120, description="Age must be between 1 and 120")
    gender: str = Field(pattern="^(Male|Female|Other)$", description="Must be Male, Female, or Other")
    weight: float = Field(gt=0, description="Weight in kg must be > 0")
    height: float = Field(gt=0, description="Height in cm must be > 0")
    conditions: List[str] = Field(default_factory=list)
    allergies: List[str] = Field(default_factory=list)
    pregnancy_status: Optional[str] = None
    current_medications: List[str] = Field(default_factory=list)
    disease_severity: str = Field(default="Moderate")
    symptom_duration: str = Field(default="Unknown")

class PredictionRequest(BaseModel):
    symptoms: List[str]
    patient_profile: Optional[PatientProfile] = None

class PredictionResponse(BaseModel):
    prediction: str
    confidence: Optional[float] = None
    top_predictions: Optional[List[Dict[str, Any]]] = None
    important_symptoms: Optional[List[str]] = None
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
