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

    # Real AI Recommendation Engine
    if patient_profile and settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            import json
            genai.configure(api_key=settings.GEMINI_API_KEY)
            llm = genai.GenerativeModel("gemini-3.6-flash")
            
            prompt = (
                f"You are an AI doctor. Patient Profile: Name={getattr(patient_profile, 'name', 'Patient')}, "
                f"Age={patient_profile.age}, Gender={patient_profile.gender}, Weight={patient_profile.weight}kg, "
                f"Height={getattr(patient_profile, 'height', 170)}cm, Pre-existing Conditions={', '.join(patient_profile.conditions)}, "
                f"Allergies={', '.join(patient_profile.allergies)}, Pregnancy Status={patient_profile.pregnancy_status}, "
                f"Current Medications={', '.join(patient_profile.current_medications)}, Disease Severity={patient_profile.disease_severity}.\n"
                f"Symptoms: {', '.join(symptoms_list)}.\n"
                f"Our ML model predicts: {prediction}.\n\n"
                "Act as a recommendation engine. Do the following:\n"
                "1. Analyze candidate medicines for the predicted disease.\n"
                "2. Perform patient safety checks (drug interactions, contraindications, allergies, pregnancy, age/weight dosage constraints).\n"
                "3. Personalize and rank the top safe medications.\n"
                "Output your response strictly as a JSON object with two keys:\n"
                "- 'summary': A highly personalized, empathetic 3-sentence summary.\n"
                "- 'medications': A list of strings, where each string is a recommended medication with a brief explanation of why it was chosen and safety notes (e.g. '⭐ Ibuprofen 200mg (Safe for your age/weight, no interaction with your current meds)').\n"
                "Return ONLY valid JSON. Do NOT include markdown formatting like ```json or any other text outside the JSON block."
            )
            res = llm.generate_content(prompt)
            if res.text:
                try:
                    response_json = json.loads(res.text.strip())
                    if "summary" in response_json:
                        description = f"🤖 AI Personalized Analysis: {response_json['summary']}"
                    if "medications" in response_json:
                        medications = response_json['medications']
                except json.JSONDecodeError:
                    # Fallback if the model didn't return perfect JSON
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
