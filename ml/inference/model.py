import os
import joblib
import json
from apps.api.src.core.config import settings
import numpy as np
from apps.api.src.services.medical_kb import medical_kb
from apps.api.src.services.safety_checker import safety_checker

model = None
metadata = None

def initialize():
    global model, metadata
    if model is None or metadata is None:
        model_path = os.path.join(settings.ML_MODELS_DIR, "disease", "v1.0.0", "disease_model.pkl")
        metadata_path = os.path.join(settings.ML_DATA_PROCESSED_DIR, "metadata.json")
        
        model = joblib.load(model_path)
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)

def predict_disease(symptoms_list, patient_profile=None):
    if model is None or metadata is None:
        initialize()
        
    if not symptoms_list:
        return {
            "prediction": "Unknown",
            "confidence": 0.0,
            "top_predictions": [],
            "important_symptoms": [],
            "description": "No symptoms provided. Please provide symptoms for analysis.",
            "precautions": [],
            "diets": [],
            "medications": [],
            "workouts": []
        }
        
    all_symptoms = metadata['symptoms']
    
    # Symptom Normalization (Lowercase and map spaces to underscores)
    normalized_all = {s.lower().replace(" ", "_"): s for s in all_symptoms}
    
    recognized_symptoms = []
    unrecognized_symptoms = []
    
    for sym in symptoms_list:
        norm_sym = sym.lower().replace(" ", "_").strip()
        if norm_sym in normalized_all:
            recognized_symptoms.append(normalized_all[norm_sym])
        else:
            unrecognized_symptoms.append(sym)
            
    if not recognized_symptoms:
        return {
            "prediction": "Indeterminate",
            "confidence": 0.0,
            "top_predictions": [],
            "important_symptoms": [],
            "description": f"None of the provided symptoms were recognized. Unrecognized: {', '.join(unrecognized_symptoms)}",
            "precautions": ["Consult a healthcare provider."],
            "diets": [],
            "medications": [],
            "workouts": []
        }
    
    # Create binary vector
    binary_vector = [1 if symptom in recognized_symptoms else 0 for symptom in all_symptoms]
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
        
    # Uncertainty Handling (Thresholding/Abstention)
    if confidence < 0.35:
        prediction = "Indeterminate"
        description = "Prediction confidence is too low to make a safe determination. Please consult a healthcare professional for clinical evaluation."
    else:
        description = metadata['descriptions'].get(prediction, "No description available.")
        
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
        
    # BMI is now handled safely by the LLM service or not appended directly to the input object.
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
    if patient_profile:
        import sys
        sys.path.append(settings.REPO_ROOT)
        try:
            from packages.ai.services.llm_service import generate_personalized_symptom_summary
            res_text = generate_personalized_symptom_summary(symptoms_list, prediction, patient_profile)
            if res_text:
                description = f"🤖 AI Personalized Analysis: {res_text}"
        except ImportError:
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
