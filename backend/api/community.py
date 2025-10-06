from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Tuple

router = APIRouter(prefix="/api/community", tags=["community"])

# EXACT names aligned with your coordinate list (38 districts)
TN_DISTRICTS: List[str] = [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kanchipuram",
    "Kanniyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivagangai",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupattur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Villupuram",
    "Virudhunagar",
    "The Nilgiris",
]

# In-memory counter: key = (cropId, diseaseId, districtName)
COUNTS: Dict[Tuple[str, str, str], int] = {}

class ReportIn(BaseModel):
    district: str = Field(..., description="Tamil Nadu district")
    crop: str = Field(..., description="Crop ID (e.g., 'Potato')")
    disease: str = Field(..., description="Disease ID with underscores (e.g., 'Late_blight')")

@router.get("/districts", response_model=List[str])
def get_districts():
    return TN_DISTRICTS

@router.post("/report")
def add_report(payload: ReportIn):
    if payload.district not in TN_DISTRICTS:
        raise HTTPException(400, f"Unknown district: {payload.district}")
    key = (payload.crop, payload.disease, payload.district)
    COUNTS[key] = COUNTS.get(key, 0) + 1
    return {"ok": True, "count": COUNTS[key]}

@router.get("/stats")
def stats(crop: str, disease: str):
    result = []
    total = 0
    for d in TN_DISTRICTS:
        c = COUNTS.get((crop, disease, d), 0)
        if c > 0:
            result.append({"district": d, "count": c})
            total += c
    return {"stats": result, "total": total}