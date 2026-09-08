import os
import joblib
import json
from src.core.config import settings
import numpy as np
import pickle
import pandas as pd

def load_model_and_metadata():
    model_path = os.path.join(settings.ML_MODELS_DIR, "disease_model.pkl")
    metadata_path = os.path.join(settings.ML_DATA_PROCESSED_DIR, "metadata.json")
    
    model = joblib.load(model_path)
    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
        
    return model, metadata

model, metadata = load_model_and_metadata()

def load_recsys():
    recsys_path = os.path.join(settings.ML_MODELS_DIR, "recsys_model.pkl")
    try:
        with open(recsys_path, 'rb') as f:
            return pickle.load(f)
    except FileNotFoundError:
        return None

recsys_data = load_recsys()

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

    # Apply RecSys for Personalized Medication
    if patient_profile and recsys_data and len(medications) > 0:
        try:
            recsys_model = recsys_data['model']
            le_gender = recsys_data['le_gender']
            le_condition = recsys_data['le_condition']
            le_disease = recsys_data['le_disease']
            le_drug = recsys_data['le_drug']

            age = patient_profile.age
            weight = patient_profile.weight
            gender = patient_profile.gender
            condition = patient_profile.conditions[0] if len(patient_profile.conditions) > 0 else "None"

            # Transform features
            gender_enc = le_gender.transform([gender] if gender in le_gender.classes_ else ['Male'])[0]
            condition_enc = le_condition.transform([condition] if condition in le_condition.classes_ else ['None'])[0]
            disease_enc = le_disease.transform([prediction] if prediction in le_disease.classes_ else [le_disease.classes_[0]])[0]

            best_drug = medications[0]
            best_score = -1

            for drug in medications:
                drug_clean = drug.strip()
                if drug_clean in le_drug.classes_:
                    drug_enc = le_drug.transform([drug_clean])[0]
                    # ['age', 'weight', 'gender_enc', 'condition_enc', 'disease_enc', 'drug_enc']
                    features = pd.DataFrame([[age, weight, gender_enc, condition_enc, disease_enc, drug_enc]], 
                        columns=['age', 'weight', 'gender_enc', 'condition_enc', 'disease_enc', 'drug_enc'])
                    score = recsys_model.predict(features)[0]
                    if score > best_score:
                        best_score = score
                        best_drug = drug

            medications = [f"⭐ {best_drug} (Highly Recommended)"] + [m for m in medications if m != best_drug]

        except Exception as e:
            print("RecSys Error:", e)
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
