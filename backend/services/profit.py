from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, Any, Optional

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

_prices_cache: Optional[Dict[str, Any]] = None
_yields_cache: Optional[Dict[str, Any]] = None

DEFAULT_COST_RS_PER_ACRE = 40000.0  # fallback


def _norm_key(name: str) -> str:
    # Normalize crop names to handle spaces/underscores/casing and some synonyms
    k = name.strip().lower().replace("_", "").replace(" ", "")
    synonyms = {
        "kidneybeans": "kidneybeans",
        "kidneybean": "kidneybeans",
        "pigeonpeas": "pigeonpeas",
        "pigeonpea": "pigeonpeas",
        "blackgram": "blackgram",
        "blackgrama": "blackgram",
        "mothbeans": "mothbeans",
        "mungbean": "mungbean",
        "mungbeans": "mungbean",
        "chickpea": "chickpea",
        "chickpeas": "chickpea",
        "lentil": "lentil",
        "lentils": "lentil",
        "muskmelon": "muskmelon",
        "watermelon": "watermelon",
        "pomegranate": "pomegranate",
        "banana": "banana",
        "mango": "mango",
        "grapes": "grapes",
        "apple": "apple",
        "orange": "orange",
        "papaya": "papaya",
        "coconut": "coconut",
        "cotton": "cotton",
        "jute": "jute",
        "coffee": "coffee",
        "maize": "maize",
        "rice": "rice",
        "soybean": "soybean",
        "groundnut": "groundnut",
    }
    # If key matches exactly a known key, return it; else map via synonyms if possible
    return synonyms.get(k, k)


def _load_prices() -> Dict[str, Any]:
    global _prices_cache
    if _prices_cache is None:
        with open(DATA_DIR / "prices.json", "r", encoding="utf-8") as f:
            rows = json.load(f)
        _prices_cache = { _norm_key(row["crop"]): row for row in rows }
    return _prices_cache


def _load_yields() -> Dict[str, Any]:
    global _yields_cache
    if _yields_cache is None:
        with open(DATA_DIR / "yields.json", "r", encoding="utf-8") as f:
            rows = json.load(f)
        _yields_cache = { _norm_key(row["crop"]): row for row in rows }
    return _yields_cache


def compute_profit_for_crop(crop_name: str) -> Dict[str, float]:
    """
    Returns a dict:
    {
      "yield_quintal_per_acre": float,
      "price_per_quintal_rs": float,
      "revenue_rs": float,
      "cost_rs": float,
      "profit_per_acre_rs": float
    }
    """
    key = _norm_key(crop_name)
    prices = _load_prices()
    yields = _load_yields()

    price_row = prices.get(key)
    yield_row = yields.get(key)

    if price_row is None:
        raise ValueError(f"No price data for crop '{crop_name}'")
    if yield_row is None:
        raise ValueError(f"No yield data for crop '{crop_name}'")

    price_per_quintal = float(price_row["price_per_quintal_rs"])
    cost_rs = float(price_row.get("cost_per_acre_rs", DEFAULT_COST_RS_PER_ACRE))
    yield_quintal_per_acre = float(yield_row["typical_yield_quintal_per_acre"])

    revenue_rs = price_per_quintal * yield_quintal_per_acre
    profit_rs = revenue_rs - cost_rs

    return {
        "yield_quintal_per_acre": yield_quintal_per_acre,
        "price_per_quintal_rs": price_per_quintal,
        "revenue_rs": revenue_rs,
        "cost_rs": cost_rs,
        "profit_per_acre_rs": profit_rs,
    }


def suggested_techniques_for_crop(crop_name: str, month: Optional[int]) -> list[str]:
    crop = _norm_key(crop_name)
    base = {
        "potato": [
            "Use certified seed tubers; treat before planting.",
            "Plant in well-drained loamy soil at 15–20 cm; pH 5.2–6.4.",
            "Irrigate lightly but frequently; avoid waterlogging at tuber initiation.",
            "Ensure balanced NPK; adequate K improves tuber quality.",
            "Scout for late blight; rotate with non-solanaceous crops.",
        ],
        "rice": [
            "Level field to reduce percolation; maintain puddling if transplanting.",
            "Transplant healthy seedlings 20–25 days old; 20x20 cm spacing.",
            "Maintain 2–5 cm water during tillering; adopt AWD to save water.",
            "Split N applications; ensure Zn where deficient.",
        ],
        "wheat": [
            "Sow certified seed at 4–6 cm depth during Nov–Dec.",
            "Irrigate at CRI, tillering, jointing, flowering, milking.",
            "Apply NPK with S; early weed management within 25–30 days.",
        ],
        "maize": [
            "Ensure good drainage; avoid waterlogging.",
            "60x20 cm spacing; split nitrogen applications.",
            "Scout for fall armyworm; adopt IPM.",
        ],
        "soybean": [
            "Use rhizobium inoculation; avoid waterlogging.",
            "Sow rows 45 cm apart; early weed management.",
        ],
        "default": [
            "Test soil to fine-tune NPK and micronutrients.",
            "Ensure timely irrigation and drainage.",
            "Adopt crop rotation and IPM.",
            "Use certified seeds of locally advised varieties.",
        ],
    }

    tips = base.get(crop, base["default"])
    if month:
        if crop in ("rice", "maize", "soybean") and month in (6, 7, 8, 9):
            tips = tips + ["Kharif window: monitor monsoon distribution."]
        if crop in ("wheat", "chickpea", "potato") and month in (11, 12, 1):
            tips = tips + ["Rabi window: ensure timely sowing."]
    return tips