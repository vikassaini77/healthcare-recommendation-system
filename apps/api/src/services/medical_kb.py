class MedicalKnowledgeBase:
    def __init__(self):
        # Structured Database: Disease -> Details
        self.diseases = {
            "Hypertension": {
                "medicines": ["Lisinopril", "Amlodipine", "Hydrochlorothiazide", "Losartan"],
                "contraindications": ["Pregnancy (for ACE inhibitors like Lisinopril)", "Severe renal impairment"],
                "precautions": ["Monitor blood pressure regularly", "Avoid high sodium intake"],
                "diet": ["DASH diet", "Low sodium"],
                "lifestyle": ["Regular aerobic exercise", "Weight management"],
                "references": ["AHA/ACC Guidelines 2017"]
            },
            "Diabetes": {
                "medicines": ["Metformin", "Glipizide", "Insulin Glargine", "Sitagliptin"],
                "contraindications": ["Severe renal dysfunction (for Metformin)"],
                "precautions": ["Monitor blood glucose", "Risk of hypoglycemia with Glipizide"],
                "diet": ["Low glycemic index", "Controlled carbohydrates"],
                "lifestyle": ["Regular exercise", "Foot care"],
                "references": ["ADA Standards of Medical Care in Diabetes"]
            },
            "Common Cold": {
                "medicines": ["Acetaminophen", "Ibuprofen", "Cetirizine", "Dextromethorphan"],
                "contraindications": ["Severe liver disease (for Acetaminophen)"],
                "precautions": ["Do not exceed maximum daily dose of Acetaminophen"],
                "diet": ["Warm fluids", "Adequate hydration"],
                "lifestyle": ["Rest", "Humidifier use"],
                "references": ["CDC Guidelines for Viral Respiratory Infections"]
            },
            "Pneumonia": {
                "medicines": ["Azithromycin", "Amoxicillin", "Levofloxacin", "Doxycycline"],
                "contraindications": ["Macrolide allergy", "Penicillin allergy"],
                "precautions": ["Complete full course of antibiotics", "Monitor for breathing difficulty"],
                "diet": ["High protein", "Adequate hydration"],
                "lifestyle": ["Rest", "Avoid smoking"],
                "references": ["IDSA/ATS Community-Acquired Pneumonia Guidelines"]
            },
            "Migraine": {
                "medicines": ["Sumatriptan", "Ibuprofen", "Rizatriptan", "Naproxen"],
                "contraindications": ["Ischemic heart disease (for Triptans)"],
                "precautions": ["Avoid overuse of acute medications"],
                "diet": ["Avoid known triggers (e.g. aged cheese, alcohol)"],
                "lifestyle": ["Stress management", "Regular sleep schedule"],
                "references": ["American Headache Society Guidelines"]
            },
            "Malaria": {
                "medicines": ["Artemether-Lumefantrine", "Chloroquine", "Atovaquone-Proguanil"],
                "contraindications": ["Severe renal impairment"],
                "precautions": ["Complete full course", "Take with food"],
                "diet": ["Adequate hydration"],
                "lifestyle": ["Use mosquito nets", "Rest"],
                "references": ["WHO Guidelines for Malaria"]
            },
            "Bronchial Asthma": {
                "medicines": ["Albuterol", "Fluticasone", "Montelukast", "Budesonide"],
                "contraindications": ["Status asthmaticus for inhaled corticosteroids as primary treatment"],
                "precautions": ["Rinse mouth after corticosteroid use", "Keep rescue inhaler nearby"],
                "diet": ["Avoid food triggers if any"],
                "lifestyle": ["Avoid allergens and smoke", "Regular breathing exercises"],
                "references": ["GINA Guidelines for Asthma"]
            },
            "Gastroenteritis": {
                "medicines": ["Loperamide", "Ondansetron", "Oral Rehydration Salts (ORS)"],
                "contraindications": ["Dysentery (bloody diarrhea) for Loperamide"],
                "precautions": ["Monitor for severe dehydration"],
                "diet": ["BRAT diet (Bananas, Rice, Applesauce, Toast)", "Clear fluids"],
                "lifestyle": ["Rest", "Strict hand hygiene"],
                "references": ["ACG Clinical Guideline: Diarrheal Infections"]
            },
            "Heart attack": {
                "medicines": ["Aspirin", "Clopidogrel", "Nitroglycerin", "Atorvastatin"],
                "contraindications": ["Active bleeding (for Aspirin/Clopidogrel)"],
                "precautions": ["Immediate medical attention required"],
                "diet": ["Low saturated fat", "Heart-healthy diet"],
                "lifestyle": ["Cardiac rehabilitation", "Smoking cessation"],
                "references": ["AHA/ACC Guidelines for STEMI/NSTEMI"]
            }
        }

    def get_disease_info(self, disease_name: str):
        # Normalize and match disease
        disease_name = disease_name.strip()
        
        # Exact match
        if disease_name in self.diseases:
            return self.diseases[disease_name]
            
        # Case insensitive match
        for k, v in self.diseases.items():
            if k.lower() == disease_name.lower():
                return v
                
        # Default fallback if disease is not fully mapped yet
        return {
            "medicines": ["Acetaminophen", "Ibuprofen"], # Generic safe choices for minor symptoms
            "contraindications": [],
            "precautions": ["Consult a healthcare provider for proper diagnosis and treatment plan."],
            "diet": ["Balanced diet", "Adequate hydration"],
            "lifestyle": ["Rest", "Monitor symptoms"],
            "references": ["General Medical Guidance"]
        }

medical_kb = MedicalKnowledgeBase()
