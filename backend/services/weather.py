from __future__ import annotations

import os
from typing import Dict, Any, Optional

import requests


def _get_api_key() -> str:
    api_key = os.getenv("OPENWEATHER_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("Missing OPENWEATHER_API_KEY in environment")
    return api_key


def get_live_weather(lat: float, lng: float) -> Dict[str, Any]:
    """
    Returns:
      {
        "temperature_c": float,
        "humidity_percent": float,
        "rainfall_mm_24h": float,
        "source": str
      }

    Strategy:
    - OpenWeather One Call hourly: sum rain['1h'] for last 24 hours (preferred)
    - Fallback OpenWeather daily[0].rain (mm)
    - Fallback OpenWeather current.rain.{1h|3h}
    - If still zero/missing, fallback to Open-Meteo hourly precipitation last 24 hours (no key needed)
    """
    api_key = _get_api_key()

    temperature_c: Optional[float] = None
    humidity_percent: Optional[float] = None
    rainfall_mm_24h: float = 0.0
    source: str = "unknown"

    # Try OpenWeather One Call with hourly data
    try:
        onecall_url = "https://api.openweathermap.org/data/2.5/onecall"
        params = {
            "lat": lat,
            "lon": lng,
            "exclude": "minutely,alerts",
            "units": "metric",
            "appid": api_key,
        }
        oc = requests.get(onecall_url, params=params, timeout=12)
        oc.raise_for_status()
        data = oc.json()

        current = data.get("current", {}) or {}
        if "temp" in current:
            temperature_c = float(current["temp"])
        if "humidity" in current:
            humidity_percent = float(current["humidity"])

        # Hourly accumulation (up to past 24 hours)
        hourly = data.get("hourly", []) or []
        if hourly:
            rainfall_mm_24h = 0.0
            for h in hourly[:24]:
                rain_blk = h.get("rain", {}) or {}
                rainfall_mm_24h += float(rain_blk.get("1h") or 0.0)
            source = "openweather_hourly"

        # Fallback to daily if hourly sum is zero
        if rainfall_mm_24h <= 0.0:
            daily = data.get("daily", []) or []
            if daily:
                rain = float(daily[0].get("rain") or 0.0)
                snow = float(daily[0].get("snow") or 0.0)
                if rain + snow > 0.0:
                    rainfall_mm_24h = rain + snow
                    source = "openweather_daily"

        # Fallback to current rain block
        if rainfall_mm_24h <= 0.0:
            c_rain = current.get("rain", {}) or {}
            val = float(c_rain.get("1h") or c_rain.get("3h") or 0.0)
            if val > 0.0:
                rainfall_mm_24h = val
                source = "openweather_current"

    except Exception:
        # Will try fallback provider next
        pass

    # Fallback: Open-Meteo hourly precipitation (sum last 24 hours)
    if rainfall_mm_24h <= 0.0:
        try:
            om_url = "https://api.open-meteo.com/v1/forecast"
            om_params = {
                "latitude": lat,
                "longitude": lng,
                "hourly": "precipitation",
                "past_days": 1,
                "forecast_days": 1,
                "timezone": "auto",
            }
            r = requests.get(om_url, params=om_params, timeout=10)
            r.raise_for_status()
            jd = r.json()
            hourly = (jd.get("hourly") or {}).get("precipitation") or []
            if hourly:
                # Take last 24 values (Open-Meteo returns mm for each hour)
                rainfall_mm_24h = float(sum(hourly[-24:]))
                source = "openmeteo_hourly"
        except Exception:
            pass

    # If temperature/humidity still missing, try OpenWeather current endpoint as final fallback
    if temperature_c is None or humidity_percent is None:
        wx_url = "https://api.openweathermap.org/data/2.5/weather"
        wx_params = {"lat": lat, "lon": lng, "units": "metric", "appid": api_key}
        r = requests.get(wx_url, params=wx_params, timeout=10)
        r.raise_for_status()
        dat = r.json()
        main = dat.get("main", {}) or {}
        temperature_c = float(main.get("temp"))
        humidity_percent = float(main.get("humidity"))
        if rainfall_mm_24h <= 0.0:
            rain_block = dat.get("rain", {}) or {}
            val = float(rain_block.get("1h") or rain_block.get("3h") or 0.0)
            if val > 0.0:
                rainfall_mm_24h = val
                source = source or "openweather_current"

    return {
        "temperature_c": float(temperature_c),
        "humidity_percent": float(humidity_percent),
        "rainfall_mm_24h": float(rainfall_mm_24h),
        "source": source or "none",
    }