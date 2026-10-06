import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, precision_recall_fscore_support
from sklearn.calibration import CalibratedClassifierCV
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
    # Deduplicate before processing to prevent train/test leakage
    original_len = len(df)
    df = df.drop_duplicates()
    print(f"Removed {original_len - len(df)} exact duplicate rows out of {original_len} total rows.")
    
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
    print("Splitting dataset into Train (70%), Validation (15%), Test (15%) with Stratification...")
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp)

    print("Training Random Forest model on training set...")
    base_model = RandomForestClassifier(n_estimators=100, random_state=42)
    
    print("Performing Stratified 5-Fold Cross Validation on Train+Val data...")
    X_cv = np.vstack((X_train, X_val))
    y_cv = np.concatenate((y_train, y_val))
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(base_model, X_cv, y_cv, cv=cv, scoring='accuracy')
    print(f"CV Accuracy: {cv_scores.mean()*100:.2f}% (+/- {cv_scores.std()*200:.2f}%)")

    # Train base model
    base_model.fit(X_train, y_train)
    
    # Calibrate probabilities for better confidence estimates
    print("Calibrating probabilities...")
    model = CalibratedClassifierCV(estimator=RandomForestClassifier(n_estimators=100, random_state=42), method='sigmoid', cv=5)
    model.fit(X_train, y_train) # Fit calibrator on training set (it splits internally)

    import mlflow
    import mlflow.sklearn
    import datetime

    print("Evaluating on Test Set...")
    y_test_pred = model.predict(X_test)
    test_accuracy = accuracy_score(y_test, y_test_pred)
    
    from sklearn.metrics import balanced_accuracy_score
    bal_acc = balanced_accuracy_score(y_test, y_test_pred)
    
    report = classification_report(y_test, y_test_pred)
    conf_matrix = confusion_matrix(y_test, y_test_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_test_pred, average='weighted')
    macro_p, macro_r, macro_f1, _ = precision_recall_fscore_support(y_test, y_test_pred, average='macro')

    print(f"Test Accuracy: {test_accuracy * 100:.2f}%")
    print(f"Balanced Accuracy: {bal_acc * 100:.2f}%")
    
    # ---------------- MLOps: Experiment Tracking ----------------
    mlflow.set_experiment("Disease_Prediction_Model")
    with mlflow.start_run() as run:
        # 1. Log Hyperparameters & Dataset Info
        mlflow.log_param("n_estimators", 100)
        mlflow.log_param("random_state", 42)
        mlflow.log_param("cv_folds", 5)
        mlflow.log_param("dataset_size", original_len)
        mlflow.log_param("deduplicated_size", len(df))
        
        # 2. Log Metrics
        mlflow.log_metric("cv_accuracy_mean", cv_scores.mean())
        mlflow.log_metric("test_accuracy", test_accuracy)
        mlflow.log_metric("balanced_accuracy", bal_acc)
        mlflow.log_metric("weighted_precision", precision)
        mlflow.log_metric("weighted_recall", recall)
        mlflow.log_metric("weighted_f1", f1)
        mlflow.log_metric("macro_f1", macro_f1)
        
        # 3. Automated ML Evaluation (Pass/Fail Gate)
        BASELINE_ACCURACY = 0.85
        if test_accuracy < BASELINE_ACCURACY:
            mlflow.log_param("gate_status", "FAILED")
            print(f"❌ Model failed evaluation gate (Accuracy {test_accuracy:.2f} < {BASELINE_ACCURACY}). Aborting registration.")
            raise ValueError(f"Model failed quality gate. Accuracy {test_accuracy:.2f} is below baseline {BASELINE_ACCURACY}.")
        
        mlflow.log_param("gate_status", "PASSED")
        print("✅ Model passed evaluation gate.")
        
        # 4. Save model to MLflow (and locally for fast API loading)
        mlflow.sklearn.log_model(model, "model")
        
        # 5. Log Git Commit (Mocked for example, normally extracted via gitpython or env vars)
        commit_hash = os.getenv("GIT_COMMIT", "local-dev")
        mlflow.log_param("git_commit", commit_hash)
        
        # Save evaluation metrics locally as well
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        version = f"v1.0.0_{timestamp}"
        
        version_dir = os.path.join(MODEL_DIR, 'disease', version)
        os.makedirs(version_dir, exist_ok=True)
        report_path = os.path.join(version_dir, 'evaluation_report.txt')
        
        with open(report_path, 'w') as f:
            f.write(f"=== Disease Prediction Model Evaluation ({version}) ===\n")
            f.write(f"Deduplicated Rows Removed: {original_len - len(df)}\n")
            f.write(f"Stratified CV (5-Fold) Accuracy: {cv_scores.mean()*100:.2f}% (+/- {cv_scores.std()*200:.2f}%)\n")
            f.write(f"Test Accuracy: {test_accuracy * 100:.2f}%\n")
            f.write(f"Balanced Accuracy: {bal_acc * 100:.2f}%\n")
            f.write(f"Weighted Precision: {precision * 100:.2f}%\n")
            f.write(f"Weighted Recall: {recall * 100:.2f}%\n")
            f.write(f"Weighted F1-Score: {f1 * 100:.2f}%\n")
            f.write(f"Macro F1-Score: {macro_f1 * 100:.2f}%\n\n")
            f.write("--- Classification Report ---\n")
            f.write(report)
            f.write("\n\n--- Confusion Matrix ---\n")
            f.write(np.array2string(conf_matrix))
            
        print(f"Evaluation report saved to {report_path}")

        # Save model locally for API
        model_path = os.path.join(version_dir, 'disease_model.pkl')
        joblib.dump(model, model_path)
        
        # Update registry.json
        registry_path = os.path.join(MODEL_DIR, 'registry.json')
        registry_data = {"disease_model": {"version": version, "path": model_path}}
        if os.path.exists(registry_path):
            try:
                with open(registry_path, 'r') as f:
                    registry_data = json.load(f)
                registry_data["disease_model"] = {"version": version, "path": model_path}
            except Exception:
                pass
                
        with open(registry_path, 'w') as f:
            json.dump(registry_data, f, indent=4)
        
        print(f"Model registered in registry.json as version {version}")
    
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
