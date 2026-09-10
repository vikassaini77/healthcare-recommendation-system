import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import json
import os

# Paths
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'backend', 'app', 'model')

# Ensure model dir exists
os.makedirs(MODEL_DIR, exist_ok=True)

def train_and_export():
    print("Loading datasets...")
    df = pd.read_csv(os.path.join(DATA_DIR, 'dataset.csv'))
    
    # Process symptoms
    # The dataset has Disease and Symptom_1 to Symptom_17
    # We need to flatten the symptoms to find all unique symptoms
    symptoms = set()
    for col in df.columns[1:]:
        for val in df[col].dropna():
            if str(val).strip() != "":
                symptoms.add(str(val).strip())
    
    symptoms = sorted(list(symptoms))
    print(f"Found {len(symptoms)} unique symptoms.")

    # Create a binary matrix
    X_data = []
    y_data = []

    for index, row in df.iterrows():
        disease = row['Disease'].strip()
        row_symptoms = [str(val).strip() for val in row[1:] if pd.notna(val) and str(val).strip() != ""]
        
        # Create binary vector
        binary_vector = [1 if symptom in row_symptoms else 0 for symptom in symptoms]
        
        X_data.append(binary_vector)
        y_data.append(disease)

    X = np.array(X_data)
    y = np.array(y_data)

    print("Training model...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")

    # Save model
    joblib.dump(model, os.path.join(MODEL_DIR, 'disease_model.pkl'))
    
    # Process Descriptions
    desc_df = pd.read_csv(os.path.join(DATA_DIR, 'symptom_Description.csv'))
    descriptions = {row['Disease'].strip(): row['Description'].strip() for _, row in desc_df.iterrows()}

    # Process Precautions
    prec_df = pd.read_csv(os.path.join(DATA_DIR, 'symptom_precaution.csv'))
    precautions = {}
    for _, row in prec_df.iterrows():
        disease = str(row['Disease']).strip()
        precs = [str(p).strip() for p in row[1:] if pd.notna(p) and str(p).strip() != ""]
        precautions[disease] = precs

    # Generate synthetic Diet and Medicine mappings (since Kaggle doesn't have it)
    diets = {}
    medications = {}
    workouts = {}
    for disease in set(y):
        diets[disease] = ["Drink plenty of water", "Eat a balanced diet rich in vitamins", "Avoid junk food"]
        medications[disease] = ["Consult a doctor for specific medications", "Paracetamol (if fever is present)"]
        workouts[disease] = ["Light stretching", "Yoga", "Avoid heavy weightlifting"]

    metadata = {
        "symptoms": symptoms,
        "descriptions": descriptions,
        "precautions": precautions,
        "diets": diets,
        "medications": medications,
        "workouts": workouts
    }

    with open(os.path.join(MODEL_DIR, 'metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=4)

    print("Training complete. Model and metadata exported to backend/app/model/")

if __name__ == "__main__":
    train_and_export()
