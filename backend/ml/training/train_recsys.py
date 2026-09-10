import pandas as pd
import numpy as np
import pickle
import os
import random
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder

import json

# Load existing data mappings
current_dir = os.path.dirname(os.path.abspath(__file__))
metadata_path = os.path.join(current_dir, '..', 'app', 'model', 'metadata.json')

with open(metadata_path, 'r') as f:
    metadata = json.load(f)

disease_names = list(metadata['medications'].keys())

print("Generating synthetic patient dataset for RecSys...")

data = []
conditions_list = ["Diabetes", "Hypertension", "Asthma", "None", "Heart Disease"]

for _ in range(5000):
    age = random.randint(18, 90)
    gender = random.choice(["Male", "Female"])
    weight = random.randint(50, 120)
    condition = random.choice(conditions_list)
    
    disease = random.choice(disease_names)
    disease_meds = metadata['medications'].get(disease, [])
    if len(disease_meds) == 0:
        continue
    
    for drug in disease_meds:
        drug = drug.strip()
        # Synthetic logic: some drugs are less effective for older people or specific conditions
        base_score = random.uniform(5.0, 9.0)
        
        if condition == "Diabetes" and "syrup" in drug.lower():
            base_score -= 4.0 # Syrups bad for diabetics
        if age > 60 and "strong" in drug.lower():
            base_score -= 2.0
            
        score = max(1.0, min(10.0, base_score + random.uniform(-1, 1)))
        
        data.append({
            "age": age,
            "gender": gender,
            "weight": weight,
            "condition": condition,
            "disease": disease,
            "drug": drug,
            "effectiveness": score
        })

df = pd.DataFrame(data)

print("Training Recommendation Engine...")
# Encode categorical features
le_gender = LabelEncoder()
le_condition = LabelEncoder()
le_disease = LabelEncoder()
le_drug = LabelEncoder()

df['gender_enc'] = le_gender.fit_transform(df['gender'])
df['condition_enc'] = le_condition.fit_transform(df['condition'])
df['disease_enc'] = le_disease.fit_transform(df['disease'])
df['drug_enc'] = le_drug.fit_transform(df['drug'])

X = df[['age', 'weight', 'gender_enc', 'condition_enc', 'disease_enc', 'drug_enc']]
y = df['effectiveness']

model = RandomForestRegressor(n_estimators=50, random_state=42)
model.fit(X, y)

print("Saving models...")
os.makedirs(os.path.join(current_dir, '..', 'models'), exist_ok=True)
with open(os.path.join(current_dir, '..', 'models', 'recsys_model.pkl'), 'wb') as f:
    pickle.dump({
        'model': model,
        'le_gender': le_gender,
        'le_condition': le_condition,
        'le_disease': le_disease,
        'le_drug': le_drug
    }, f)

print("RecSys training complete!")
