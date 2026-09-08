import google.generativeai as genai
from src.core.config import settings

def generate_holistic_summary(symptom_prediction: str, patient_profile: dict, xray_prediction: str = None, xray_confidence: float = None) -> str:
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return _fallback_summary(symptom_prediction, xray_prediction, xray_confidence)
        
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt = f"You are a medical AI assistant. Summarize the following findings for a patient:\n"
        prompt += f"- Symptoms Prediction: {symptom_prediction}\n"
        if patient_profile:
            prompt += f"- Patient Age: {patient_profile.get('age')}, Gender: {patient_profile.get('gender')}\n"
        if xray_prediction:
            prompt += f"- Chest X-Ray: {xray_prediction} ({xray_confidence*100:.1f}% confidence)\n"
        prompt += "\nProvide a concise 2-sentence holistic summary. Do not diagnose, just summarize the risk and findings."
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print("Gemini API Error:", e)
        return _fallback_summary(symptom_prediction, xray_prediction, xray_confidence)

def _fallback_summary(symptom_prediction: str, xray_prediction: str = None, xray_confidence: float = None) -> str:
    summary = f"Based on symptoms, the prediction is {symptom_prediction}."
    if xray_prediction:
        summary += f" Chest X-Ray indicates {xray_prediction} with {xray_confidence*100:.1f}% confidence."
        if xray_prediction == "Pneumonia" and symptom_prediction in ["Common Cold", "Tuberculosis"]:
            summary += " Warning: X-Ray suggests Pneumonia, aligning with severe respiratory symptoms."
    return summary
