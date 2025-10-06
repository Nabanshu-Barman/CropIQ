from __future__ import annotations

from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, confloat, conint

from services.weather import get_live_weather
from services.yield_model import model as yield_model_singleton
from services.profit import compute_profit_for_crop, suggested_techniques_for_crop

router = APIRouter(prefix="/api/yield", tags=["yield"])

class PredictRequest(BaseModel):
    nitrogen: confloat(ge=0) = Field(...)
    phosphorous: confloat(ge=0) = Field(...)
    potassium: confloat(ge=0) = Field(...)
    ph: confloat(ge=0, le=14) = Field(...)
    lat: float = Field(...)
    lng: float = Field(...)
    month: Optional[conint(ge=1, le=12)] = Field(None)

    temperature_c: Optional[float] = None
    humidity_percent: Optional[float] = None
    rainfall_mm_24h: Optional[float] = None

class WeatherResponse(BaseModel):
    temperature_c: float
    humidity_percent: float
    rainfall_mm_24h: float
    source: Optional[str] = None

class PredictResponse(BaseModel):
    crop: str
    confidence: float
    profit_per_acre_rs: float
    estimated_yield_quintal_per_acre: Optional[float] = None
    estimated_revenue_rs: Optional[float] = None
    estimated_cost_rs: Optional[float] = None
    techniques: list[str]
    inputs_echoed: Dict[str, Any]
    weather_used: WeatherResponse

@router.get("/weather", response_model=WeatherResponse)
def weather(lat: float, lng: float) -> WeatherResponse:
    try:
        wx = get_live_weather(lat=lat, lng=lng)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Weather fetch failed: {e}")
    return WeatherResponse(**wx)

@router.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest) -> PredictResponse:
    if req.temperature_c is None or req.humidity_percent is None or req.rainfall_mm_24h is None:
        try:
            wx = get_live_weather(lat=req.lat, lng=req.lng)
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Weather fetch failed: {e}")
    else:
        wx = {
            "temperature_c": float(req.temperature_c),
            "humidity_percent": float(req.humidity_percent),
            "rainfall_mm_24h": float(req.rainfall_mm_24h),
        }

    features = {
        "nitrogen": float(req.nitrogen),
        "phosphorous": float(req.phosphorous),
        "potassium": float(req.potassium),
        "temperature": float(wx["temperature_c"]),
        "humidity": float(wx["humidity_percent"]),
        "ph": float(req.ph),
        "rainfall": float(wx["rainfall_mm_24h"]),
    }

    try:
        pred = yield_model_singleton.predict(features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")

    crop = pred["crop"]
    confidence = float(pred["confidence"])

    try:
        profit_info = compute_profit_for_crop(crop)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profit computation failed: {e}")

    techniques = suggested_techniques_for_crop(crop, month=req.month)

    return PredictResponse(
        crop=crop,
        confidence=confidence,
        profit_per_acre_rs=round(profit_info["profit_per_acre_rs"], 2),
        estimated_yield_quintal_per_acre=profit_info.get("yield_quintal_per_acre"),
        estimated_revenue_rs=profit_info.get("revenue_rs"),
        estimated_cost_rs=profit_info.get("cost_rs"),
        techniques=techniques,
        inputs_echoed={
            "lat": req.lat, "lng": req.lng,
            "nitrogen": req.nitrogen, "phosphorous": req.phosphorous,
            "potassium": req.potassium, "ph": req.ph, "month": req.month,
        },
        weather_used=WeatherResponse(**wx),
    )