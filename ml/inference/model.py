import os
import joblib
import json
from apps.api.src.core.config import settings
import numpy as np
from apps.api.src.services.medical_kb import medical_kb
from apps.api.src.services.safety_checker import safety_checker

def load_model_and_metadata():
    model_path = os.path.join(settings.ML_MODELS_DIR, "disease_model.pkl")
    metadata_path = os.path.join(settings.ML_DATA_PROCESSED_DIR, "metadata.json")
    
    model = joblib.load(model_path)
    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
        
    return model, metadata

model, metadata = load_model_and_metadata()

def predict_disease(symptoms_list, patient_profile=None):
    if len(symptoms_list) < 3:
        return {
            "prediction": "Unknown",
            "confidence": 0.0,
            "top_predictions": [],
            "important_symptoms": [],
            "description": "Insufficient information for reliable prediction. Please provide at least 3 symptoms.",
            "precautions": [],
            "diets": [],
            "medications": [],
            "workouts": []
        }
        
    all_symptoms = metadata['symptoms']
    
    # Create binary vector
    binary_vector = [1 if symptom in symptoms_list else 0 for symptom in all_symptoms]
    X = np.array([binary_vector])
    
    # Predict Probabilities
    if hasattr(model, 'predict_proba'):
        probabilities = model.predict_proba(X)[0]
        classes = model.classes_
        
        # Get top 3
        top_indices = np.argsort(probabilities)[::-1][:3]
        top_predictions = [{"disease": classes[i], "probability": float(probabilities[i])} for i in top_indices]
        
        prediction = top_predictions[0]["disease"]
        confidence = top_predictions[0]["probability"]
    else:
        # Fallback if uncalibrated/no predict_proba
        prediction = model.predict(X)[0]
        confidence = 1.0
        top_predictions = [{"disease": prediction, "probability": 1.0}]
        
    # Explainability: which of the provided symptoms had the highest feature importance?
    important_symptoms = []
    # If the model is a CalibratedClassifierCV, we can inspect its base estimators
    base_estimator = None
    if hasattr(model, 'calibrated_classifiers_'):
        base_estimator = model.calibrated_classifiers_[0].estimator
    elif hasattr(model, 'feature_importances_'):
        base_estimator = model
        
    if base_estimator and hasattr(base_estimator, 'feature_importances_'):
        importances = base_estimator.feature_importances_
        # Get importances only for the provided symptoms
        provided_importances = []
        for sym in symptoms_list:
            if sym in all_symptoms:
                idx = all_symptoms.index(sym)
                provided_importances.append((sym, importances[idx]))
        
        # Sort by importance and get top 3
        provided_importances.sort(key=lambda x: x[1], reverse=True)
        important_symptoms = [sym for sym, imp in provided_importances[:3] if imp > 0]
        
    # Get base recommendations
    description = metadata['descriptions'].get(prediction, "No description available.")
    
    if confidence < 0.3:
        description = "⚠️ Prediction confidence is low. Please consult a healthcare professional. " + description
    
    # Optional BMI calculation to augment patient profile
    if patient_profile and getattr(patient_profile, 'weight', None) and getattr(patient_profile, 'height', None):
        height_m = patient_profile.height / 100.0
        bmi = patient_profile.weight / (height_m * height_m)
        # We can append this to conditions to be passed to the LLM if needed
        patient_profile.conditions.append(f"BMI: {bmi:.1f}")
    
    # Fetch structured medical knowledge
    kb_info = medical_kb.get_disease_info(prediction)
    precautions = list(dict.fromkeys(kb_info.get("precautions", []) + metadata['precautions'].get(prediction, [])))
    diets = list(dict.fromkeys(kb_info.get("diet", []) + metadata['diets'].get(prediction, [])))
    workouts = list(dict.fromkeys(kb_info.get("lifestyle", []) + metadata['workouts'].get(prediction, [])))
    
    candidate_medications = kb_info.get("medicines", [])
    references = kb_info.get("references", ["General Medical Guidance"])
    
    # Strict Patient Safety Layer
    patient_allergies = getattr(patient_profile, 'allergies', []) if patient_profile else []
    current_meds = getattr(patient_profile, 'current_medications', []) if patient_profile else []
    
    safe_meds, allergy_rejections = safety_checker.check_allergies(candidate_medications, patient_allergies)
    safe_meds, interaction_warnings, interaction_rejections = safety_checker.check_interactions(safe_meds, current_meds)
    
    # Format final recommendations with evidence and safety notes
    final_medications = []
    
    for med in safe_meds:
        med_entry = f"✅ {med.title()} (Source: {', '.join(references)})"
        for w in interaction_warnings:
            if w["medication"] == med:
                med_entry += f" - {w['warning']}"
        final_medications.append(med_entry)
        
    for r in allergy_rejections:
        final_medications.append(f"❌ {r['medication'].title()} (REJECTED: {r['reason']})")
        
    for r in interaction_rejections:
        final_medications.append(f"❌ {r['medication'].title()} (REJECTED: {r['reason']})")

    if not final_medications:
        final_medications = ["Consult a doctor for safe alternative medications."]
        
    medications = final_medications

    # Real AI Recommendation Engine (Personalization Summary Only)
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
                "Write a highly personalized, empathetic 3-sentence summary tailored EXACTLY "
                "to their profile and specific symptoms. DO NOT list medications, just provide the summary paragraph."
            )
            res = llm.generate_content(prompt)
            if res.text:
                description = f"🤖 AI Personalized Analysis: {res.text.strip()}"
        except Exception as e:
            print("Gemini Personalization Error:", e)
            pass
    
    return {
        "prediction": prediction,
        "confidence": confidence,
        "top_predictions": top_predictions,
        "important_symptoms": important_symptoms,
        "description": description,
        "precautions": precautions,
        "diets": diets,
        "medications": medications,
        "workouts": workouts
    }

def get_all_symptoms():
    return metadata['symptoms']
