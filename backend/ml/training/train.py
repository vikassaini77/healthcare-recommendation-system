import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import json
import os

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_RAW_DIR = os.path.join(BASE_DIR, 'data', 'raw')
DATA_PROCESSED_DIR = os.path.join(BASE_DIR, 'data', 'processed')
MODEL_DIR = os.path.join(BASE_DIR, 'models')

# Ensure dirs exist
os.makedirs(DATA_PROCESSED_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

def train_and_evaluate():
    print("Loading datasets...")
    df = pd.read_csv(os.path.join(DATA_RAW_DIR, 'dataset.csv'))
    
    # Process symptoms
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

    print("Splitting dataset into Train (70%), Validation (15%), Test (15%)...")
    # First split: 70% train, 30% temp (for val and test)
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
    # Second split: 15% val, 15% test
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

    print("Training Random Forest model on training set...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate on Validation
    print("Evaluating on Validation Set...")
    y_val_pred = model.predict(X_val)
    val_accuracy = accuracy_score(y_val, y_val_pred)
    print(f"Validation Accuracy: {val_accuracy * 100:.2f}%")

    # Evaluate on Test Set
    print("Evaluating on Test Set...")
    y_test_pred = model.predict(X_test)
    test_accuracy = accuracy_score(y_test, y_test_pred)
    
    report = classification_report(y_test, y_test_pred)
    conf_matrix = confusion_matrix(y_test, y_test_pred)

    print(f"Test Accuracy: {test_accuracy * 100:.2f}%")
    
    # Save evaluation metrics
    report_path = os.path.join(MODEL_DIR, 'evaluation_report.txt')
    with open(report_path, 'w') as f:
        f.write("=== Disease Prediction Model Evaluation ===\n")
        f.write(f"Test Accuracy: {test_accuracy * 100:.2f}%\n\n")
        f.write("--- Classification Report ---\n")
        f.write(report)
        f.write("\n\n--- Confusion Matrix ---\n")
        f.write(np.array2string(conf_matrix))
        
    print(f"Evaluation report saved to {report_path}")

    # Save model
    joblib.dump(model, os.path.join(MODEL_DIR, 'disease_model.pkl'))
    
    # Read other metadata logic (kept intact but updating paths)
    desc_df = pd.read_csv(os.path.join(DATA_RAW_DIR, 'symptom_Description.csv'))
    descriptions = {row['Disease'].strip(): row['Description'].strip() for _, row in desc_df.iterrows()}

    prec_df = pd.read_csv(os.path.join(DATA_RAW_DIR, 'symptom_precaution.csv'))
    precautions = {}
    for _, row in prec_df.iterrows():
        disease = str(row['Disease']).strip()
        precs = [str(p).strip() for p in row[1:] if pd.notna(p) and str(p).strip() != ""]
        precautions[disease] = precs

    # Generate candidate medications/diets
    diets = {}
    medications = {}
    workouts = {}
    for disease in set(y):
        diets[disease] = ["Drink plenty of water", "Eat a balanced diet rich in vitamins", "Avoid junk food"]
        medications[disease] = ["Consult a doctor for specific medications", "Rest and hydration"]
        workouts[disease] = ["Light stretching", "Yoga", "Avoid heavy weightlifting"]

    metadata = {
        "symptoms": symptoms,
        "descriptions": descriptions,
        "precautions": precautions,
        "diets": diets,
        "medications": medications,
        "workouts": workouts
    }

    # IMPORTANT: Save to the correct processed directory
    with open(os.path.join(DATA_PROCESSED_DIR, 'metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=4)

    print("Training complete. Model and metadata exported.")

if __name__ == "__main__":
    train_and_evaluate()
