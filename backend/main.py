from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import io
import torchvision.transforms as transforms
from dotenv import load_dotenv

# Load environment variables from .env (for OPENWEATHER_API_KEY, etc.)
load_dotenv()

# Your disease model imports
from model.cnn import CNN, idx_to_classes

# Import the yield API router
from api import yield_api

# NEW: community router
from api import community

app = FastAPI(title="CropIQ Backend", version="1.0.0")

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # consider restricting to your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# Health/root endpoints
# ------------------------
@app.get("/")
def root():
    return {"status": "ok", "service": "CropIQ Backend"}

@app.get("/health")
def health():
    return {"ok": True}

# ------------------------
# Plant disease inference
# ------------------------
MODEL_PATH = "model/plant_disease_model.pt"

def load_model():
    model = CNN(len(idx_to_classes))
    # map_location='cpu' so it runs without GPU
    state = torch.load(MODEL_PATH, map_location=torch.device("cpu"))
    model.load_state_dict(state)
    model.eval()
    return model

disease_model = load_model()

# Image preprocessing (should match training)
transform = transforms.Compose([
    transforms.Resize(255),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
])

def predict_image(img_bytes: bytes):
    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    image = transform(image).unsqueeze(0)  # Add batch dimension
    with torch.no_grad():
        outputs = disease_model(image)
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

# ------------------------
# Live yield & profit routes
# ------------------------
# Mount the /api/yield/* routes from the new module
app.include_router(yield_api.router)

# ------------------------
# Community map routes (in-memory counts)
# ------------------------
app.include_router(community.router)