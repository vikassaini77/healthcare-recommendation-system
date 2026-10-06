from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    patients = relationship("Patient", back_populates="user", cascade="all, delete-orphan")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(DateTime, nullable=True)
    gender = Column(String)
    weight_kg = Column(Float)
    height_cm = Column(Float)
    
    # Simple JSON arrays for now (can be normalized to tables later)
    known_conditions = Column(JSON, default=list)
    allergies = Column(JSON, default=list)
    current_medications = Column(JSON, default=list)
    pregnancy_status = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="patients")
    assessments = relationship("Assessment", back_populates="patient", cascade="all, delete-orphan")


class Assessment(Base):
    """
    History of symptom checks and predictions.
    """
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    
    symptoms = Column(JSON, nullable=False)  # List of symptoms reported
    symptom_duration = Column(String, nullable=True)
    disease_severity = Column(String, nullable=True)
    
    predicted_condition = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    top_predictions = Column(JSON, nullable=True) # [{'disease': '...', 'probability': 0.8}]
    important_symptoms = Column(JSON, nullable=True)
    
    recommended_medications = Column(JSON, default=list)
    recommended_diets = Column(JSON, default=list)
    precautions = Column(JSON, default=list)
    
    # Store LLM summary or safety flags
    holistic_summary = Column(Text, nullable=True)
    safety_flags = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="assessments")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)
    resource_type = Column(String, nullable=False)  # e.g., 'assessment', 'patient_profile'
    resource_id = Column(Integer, nullable=True)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(JSON, nullable=True)
