from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import io
import torchvision.transforms as transforms

from model.cnn import CNN, idx_to_classes  # Import both!

app = FastAPI()

# Add CORS middleware so frontend can access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "model/plant_disease_model.pt"

def load_model():
    model = CNN(len(idx_to_classes))
    model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
    model.eval()
    return model

model = load_model()

# Image preprocessing (must match training)
transform = transforms.Compose([
    transforms.Resize(255),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
])

def predict_image(img_bytes):
    image = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    image = transform(image).unsqueeze(0)  # Add batch dimension
    with torch.no_grad():
        outputs = model(image)
        probs = torch.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probs, 1)
    disease = idx_to_classes[predicted_idx.item()]
    return disease, confidence.item()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    img_bytes = await file.read()
    disease, confidence = predict_image(img_bytes)
    result = {"disease": disease, "confidence": confidence}
    return JSONResponse(content=result)