# Model Card: Symptom Prediction Model (Random Forest)

## Model Details
- **Architecture:** Random Forest Classifier (100 estimators), calibrated via `CalibratedClassifierCV` (sigmoid).
- **Version:** 1.0.0
- **Input:** 132-dimensional binary vector representing one-hot encoded symptoms.
- **Output:** Predicted disease class (1 of 41 common conditions) with probability distribution.

## Intended Use
- **Primary Use Case:** Educational and research purposes to demonstrate content-based triage from NLP-extracted or manually inputted symptoms.
- **Out of Scope:** Clinical diagnosis, self-diagnosis, medical prescription generation, and definitive triage.

## Dataset
- **Training Data:** Synthetically constructed / curated disease-symptom mapping dataset containing roughly 4,920 records (reduced to ~304 unique combinations after deduplication).
- **Features:** Binary symptom flags (e.g., `itching`, `skin_rash`, `continuous_sneezing`).

## Training & Evaluation
- **Methodology:** 5-fold Stratified Cross-Validation on deduplicated dataset.
- **Metrics (v1.0.0):** 
  - Accuracy and Balanced Accuracy tracked via MLflow.
  - Baseline acceptance threshold: > 85% Accuracy.
  
## Bias & Limitations
- **Data Bias:** The training dataset maps highly idealized symptom combinations to diseases. Real-world patients present with noisy, overlapping, and ambiguous symptoms not captured in this clean distribution.
- **Demographic Bias:** The model does not currently factor in age, sex, geography, or genetic background directly into the primary disease probability calculation.

## Failure Cases
- **Atypical Presentations:** Will fail to correctly classify atypical presentations of diseases.
- **Co-morbidities:** The model assumes a single mutually-exclusive disease classification per query, failing to represent patients with multiple simultaneous conditions.

## Ethical Considerations
- **No Medical Advice:** Must always display a prominent disclaimer that the output is not medical advice.
- **Safety Checker Isolation:** Downstream medication recommendations based on the predicted disease are strictly gated by a separate safety and drug-interaction checker to prevent dangerous contraindications.
