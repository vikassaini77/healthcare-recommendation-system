from fastapi import APIRouter, UploadFile, File, Form
from torchvision import transforms
from PIL import Image
import torch
import base64
import io
import uuid
import cv2
import json

from src.ml_inference.model_xray import load_model
from src.ml_inference.gradcam import GradCAM, create_heatmap
from src.ml_inference.model import predict_disease, get_all_symptoms
from src.domain.schemas import PredictionRequest, PredictionResponse, SymptomsResponse, XRayPredictionResponse, HolisticPredictionResponse
from src.services.llm_service import generate_holistic_summary

router = APIRouter()

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
xray_model = load_model()
gradcam = GradCAM(xray_model, xray_model.layer4[-1])

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

@router.get("/symptoms", response_model=SymptomsResponse)
async def get_symptoms():
    return {"symptoms": get_all_symptoms()}

@router.post("/predict_symptoms", response_model=PredictionResponse)
async def predict_symptoms(request: PredictionRequest):
    result = predict_disease(request.symptoms, getattr(request, "patient_profile", None))
    return result

@router.post("/predict_xray", response_model=XRayPredictionResponse)
async def predict_xray(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    x = transform(image).unsqueeze(0).to(DEVICE)
    x.requires_grad = True

    output = xray_model(x)
    probs = torch.softmax(output, dim=1)
    pred_class = torch.argmax(probs, dim=1).item()
    confidence = probs[0][pred_class].item()

    xray_model.zero_grad()
    output[0, pred_class].backward()

    cam = gradcam.generate()
    heatmap = create_heatmap(cam)

    _, buffer = cv2.imencode(".png", heatmap)
    gradcam_b64 = base64.b64encode(buffer).decode()

    label = "Pneumonia" if pred_class == 1 else "Normal"
    risk = "High" if label == "Pneumonia" and confidence >= 0.75 else "Medium" if label == "Pneumonia" and confidence >= 0.45 else "Low"

    return XRayPredictionResponse(
        case_id=str(uuid.uuid4()),
        prediction=label,
        confidence=float(confidence),
        risk_level=risk,
        gradcam=gradcam_b64
    )

@router.post("/predict_holistic", response_model=HolisticPredictionResponse)
async def predict_holistic(
    file: UploadFile = File(None),
    data: str = Form(...) 
):
    payload = json.loads(data)
    request = PredictionRequest(**payload)
    
    symptom_result = predict_disease(request.symptoms, getattr(request, "patient_profile", None))
    
    xray_result = None
    if file:
        xray_res = await predict_xray(file)
        xray_result = xray_res

    # Patient profile formatting
    profile_dict = None
    if getattr(request, "patient_profile", None):
        profile_dict = {
            "age": request.patient_profile.age,
            "gender": request.patient_profile.gender
        }

    holistic_summary = generate_holistic_summary(
        symptom_prediction=symptom_result['prediction'],
        patient_profile=profile_dict,
        xray_prediction=xray_result.prediction if xray_result else None,
        xray_confidence=xray_result.confidence if xray_result else None
    )
    
    return HolisticPredictionResponse(
        xray_result=xray_result,
        symptom_result=PredictionResponse(**symptom_result),
        holistic_summary=holistic_summary
    )
