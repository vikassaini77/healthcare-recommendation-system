import os
import joblib
import json
from src.core.config import settings
import numpy as np

def load_model_and_metadata():
    model_path = os.path.join(settings.ML_MODELS_DIR, "disease_model.pkl")
    metadata_path = os.path.join(settings.ML_DATA_PROCESSED_DIR, "metadata.json")
    
    model = joblib.load(model_path)
    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
        
    return model, metadata

model, metadata = load_model_and_metadata()

def predict_disease(symptoms_list, patient_profile=None):
    all_symptoms = metadata['symptoms']
    
    # Create binary vector
    binary_vector = [1 if symptom in symptoms_list else 0 for symptom in all_symptoms]
    X = np.array([binary_vector])
    
    # Predict
    prediction = model.predict(X)[0]
    
    # Get recommendations
    description = metadata['descriptions'].get(prediction, "No description available.")
    precautions = metadata['precautions'].get(prediction, [])
    diets = metadata['diets'].get(prediction, [])
    medications = metadata['medications'].get(prediction, [])
    workouts = metadata['workouts'].get(prediction, [])

    # Rule-Based Filtering & Candidate Generation (Proper ML Engineering approach)
    if patient_profile and len(medications) > 0:
        try:
            age = patient_profile.age
            weight = patient_profile.weight
            condition = patient_profile.conditions[0].lower() if len(patient_profile.conditions) > 0 else "none"

            filtered_medications = []
            
            for drug in medications:
                drug_lower = drug.lower()
                is_safe = True
                
                # Rule 1: Contraindications for Diabetes
                if "diabetes" in condition and ("syrup" in drug_lower or "sugar" in drug_lower):
                    is_safe = False
                
                # Rule 2: Contraindications for Hypertension
                if "hypertension" in condition and ("sodium" in drug_lower or "stimulant" in drug_lower):
                    is_safe = False
                    
                # Rule 3: Age-based filtering
                if age > 65 and "strong" in drug_lower:
                    is_safe = False
                    
                # Rule 4: Weight-based dosing (Mock logic)
                if weight < 40 and "heavy" in drug_lower:
                    is_safe = False

                if is_safe:
                    filtered_medications.append(drug)
                    
            if not filtered_medications:
                filtered_medications = ["Consult a doctor for safe alternative medications."]
                
            # Highlight the top candidate
            best_drug = filtered_medications[0]
            medications = [f"⭐ {best_drug} (Recommended based on your profile)"] + filtered_medications[1:]

        except Exception as e:
            print("Filtering Error:", e)
            pass

    # AI Personalization Override
    if patient_profile and settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            llm = genai.GenerativeModel("gemini-3.6-flash")
            
            prompt = (
                f"You are an AI doctor. Patient Profile: Name={getattr(patient_profile, 'name', 'Patient')}, "
                f"Age={patient_profile.age}, Gender={patient_profile.gender}, Weight={patient_profile.weight}kg, "
                f"Height={getattr(patient_profile, 'height', 170)}cm, Pre-existing Conditions={', '.join(patient_profile.conditions)}.\n"
                f"Symptoms: {', '.join(symptoms_list)}.\n"
                f"Our ML model predicts: {prediction}.\n\n"
                "Write a highly personalized, empathetic 3-sentence summary and recommendation tailored EXACTLY "
                "to their age, gender, height, weight, and specific symptoms. DO NOT just give generic advice."
            )
            res = llm.generate_content(prompt)
            if res.text:
                description = f"🤖 AI Personalized Analysis: {res.text.strip()}"
        except Exception as e:
            print("Gemini Personalization Error:", e)
            pass
    
    return {
        "prediction": prediction,
        "description": description,
        "precautions": precautions,
        "diets": diets,
        "medications": medications,
        "workouts": workouts
    }

def get_all_symptoms():
    return metadata['symptoms']
