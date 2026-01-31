# CropIQ

CropIQ is an AI-powered smart farming platform that helps farmers and agribusiness users make faster, data-driven decisions throughout the crop lifecycle. It combines **plant health analysis**, **yield forecasting**, **weather-aware planning**, and **market/profit insights** into a single, easy-to-use dashboard—so users can move from guesswork to actionable recommendations.

At a glance, CropIQ enables you to:

- **Diagnose plant diseases from images** and get a clear health classification.
- **Predict crop yield** using data-driven modeling and historical patterns.
- **Plan with weather context**, making daily decisions smarter and more resilient.
- **Estimate profitability** by combining yield forecasts with price information.
- **Collaborate through a community space** to share knowledge and best practices.
- **Work location-first**, tailoring insights to a user’s region via mapping and saved location settings.

---

## What CropIQ Does

### 1) Crop Doctor (Plant Disease Detection)
CropIQ includes a “Crop Doctor” experience where users can submit a plant image to receive an AI-based classification of plant health/disease. This helps with early detection and supports timely intervention.

**Typical use cases**
- Identify common diseases early from leaf/crop images
- Separate healthy vs. affected crops quickly
- Support day-to-day field scouting with consistent results

---

### 2) Yield Prediction (Season Planning & Forecasting)
CropIQ provides yield prediction to help farmers plan resources and estimate expected production. The yield workflow is designed for fast exploration of scenarios and supports decision-making across the season.

**Typical use cases**
- Compare expected yield outcomes across crops/locations
- Estimate production for planning storage, logistics, and sales
- Make more informed input decisions (timing, scale, budgeting)

---

### 3) Weather-Aware Insights
CropIQ integrates weather-based context into the overall planning experience. Users can factor weather conditions into operational decisions and align farm activities accordingly.

**Typical use cases**
- Plan farming operations based on local weather context
- Improve timing decisions around field work and crop care

---

### 4) Profit & Price Intelligence
CropIQ supports profit-oriented decision-making by combining predicted outputs (yield) with price data. This helps users understand not only “how much will I produce,” but also “what does it mean economically.”

**Typical use cases**
- Estimate revenue and profit directionally based on pricing inputs
- Evaluate crop choices and timing with financial context

---

### 5) Community Knowledge Hub
CropIQ includes a community module for sharing practical insights, tips, and experiences—supporting peer learning and knowledge exchange.

**Typical use cases**
- Share observations and best practices
- Ask questions and learn from others in the ecosystem

---

### 6) Location-First Experience + Mapping
CropIQ is designed around location-aware insights. Users can set and save their location and use map-based interaction to ground the experience in real regional context.

---

## Tech Stack (Overview)

- **Frontend:** Next.js (App Router) + TypeScript
- **Backend:** Python (service + API layer)
- **ML Assets:** Model artifacts bundled with the backend for inference
- **UI:** Component-driven design system with reusable UI primitives

---

## Repository Structure

```text
.
├── backend/                  # Python backend APIs + ML inference services
│   ├── main.py
│   ├── api/                  # Route handlers (yield, community, etc.)
│   ├── services/             # Weather, profit, model inference logic
│   ├── data/                 # Supporting datasets (prices, yields)
│   └── model/                # ML models and preprocessing artifacts
└── frontend/                 # Next.js + TypeScript frontend
    ├── app/                  # App Router pages (login, location, dashboard)
    ├── components/           # UI + feature components (dashboard modules)
    ├── services/             # Client API service layer
    ├── hooks/                # Shared React hooks
    ├─�� lib/                  # Utilities + datasets (geo, crop info)
    └── public/               # Images and static assets
```

---

## Frontend (User Experience)

The frontend is organized around a clean dashboard-style experience:

- **Authentication + onboarding flow**
- **Location setup**
- **Dashboard modules** for yield, crop doctor, and profile/workspace experiences
- A typed **service layer** (`frontend/services/*`) that keeps API calls isolated from UI components

---

## Backend (Services & APIs)

The backend is structured into:
- An application entrypoint (`backend/main.py`)
- API modules (`backend/api/*`) that expose endpoints
- Service modules (`backend/services/*`) that handle business logic and model inference
- Supporting datasets in `backend/data/*`
- Model artifacts in `backend/model/*` used for prediction workflows

---

## Getting Started

### Prerequisites
- **Node.js** (for the frontend)
- **Python 3.x** (for the backend)

### Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

### Run the Backend
```bash
cd backend
python -m venv .venv
# activate your venv
pip install -r requirements.txt
python main.py
```

---

## Key Modules (Where Things Live)

### Frontend
- Dashboard modules: `frontend/components/dashboard/*`
- Crop Doctor UI: `frontend/components/dashboard/crop-doctor.tsx`
- Yield Predictor UI: `frontend/components/dashboard/yield-predictor.tsx`
- API clients: `frontend/services/*`

### Backend
- Yield endpoints: `backend/api/yield.py`, `backend/api/yield_api.py`
- Community endpoints: `backend/api/community.py`
- Weather & profit logic: `backend/services/weather.py`, `backend/services/profit.py`
- Yield inference logic: `backend/services/yield_model.py`
- Plant disease model logic: `backend/model/cnn.py` (+ model artifact)

---

## License
Add your preferred license (MIT / Apache-2.0 / GPL, etc.) in a `LICENSE` file.
