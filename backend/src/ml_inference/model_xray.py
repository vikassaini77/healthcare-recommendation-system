import os
import torch
from src.core.config import settings
import torch.nn as nn
from src.core.config import settings
from torchvision import models

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

def load_model():
    model = models.resnet50(weights=None)
    model.fc = nn.Linear(model.fc.in_features, 2)
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, "..", "models", "resnet50_pneumonia.pth")
    
    try:
        model.load_state_dict(
            torch.load(model_path, map_location=DEVICE, weights_only=True)
        )
    except FileNotFoundError:
        print("WARNING: PyTorch model weights not found. X-Ray prediction will use an untrained model.")
    model.to(DEVICE)
    model.eval()
    return model

