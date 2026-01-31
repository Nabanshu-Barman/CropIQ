# CropIQ

CropIQ is a full-stack, AI-assisted agriculture app with a **Next.js (TypeScript) frontend** and a **Python backend** that provides endpoints for crop insights such as:

- **Yield prediction** (ML model-based)
- **Plant disease prediction** (CNN / model artifacts present)
- **Weather & profit/price related utilities**
- A simple **community** feature (backend + frontend service layer)

> Repo: `Nabanshu-Barman/CropIQ`  
> Tech mix (approx.): TypeScript (frontend) + Python (backend) + CSS

---

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
  - [Yield Prediction](#yield-prediction)
  - [Plant Disease Prediction](#plant-disease-prediction)
  - [Community](#community)
  - [Location & Map UI](#location--map-ui)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Data & Model Artifacts](#data--model-artifacts)
- [Notes / Known Limitations](#notes--known-limitations)

---

## Project Structure

High-level layout (from repository contents):

```text
.
├── .gitattributes
├── backend/
│   ├── .env
│   ├── main.py
│   ├── requirements.txt
│   ├── api/
│   │   ├── community.py
│   │   ├── yield.py
│   │   └── yield_api.py
│   ├── services/
│   │   ├── profit.py
│   │   ├── weather.py
│   │   └── yield_model.py
│   ├── data/
│   │   ├── prices.json
│   │   └── yields.json
│   └── model/
│       ├── cnn.py
│       ├── plant_disease_model.pt
│       └── yield/
│           ├── encoder.pkl
│           ├── normalization.npz
│           └── weights.hdf5
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── login/page.tsx
    │   ├── location/page.tsx
    │   └── dashboard/
    │       ├── page.tsx
    │       └── yield/   (dir present)
    ├── components/
    │   ├── MapContainer.tsx
    │   ├── location.tsx
    │   ├── theme-provider.tsx
    │   ├── auth/
    │   │   ├── login-form.tsx
    │   │   └── location-setup.tsx
    │   ├── dashboard/
    │   │   ├── dashboard.tsx
    │   │   ├── header.tsx
    │   │   ├── profile.tsx
    │   │   ├── tab-navigation.tsx
    │   │   ├── crop-doctor.tsx
    │   │   ├── manual-predictor.tsx
    │   │   ├── yield-predictor.tsx
    │   │   ├── crop-doctor/ (dir present)
    │   │   └── yield/       (dir present)
    │   └── ui/              (large UI component library)
    ├── hooks/
    │   ├── use-mobile.ts
    │   ├── use-toast.ts
    │   ├── useNow.ts
    │   └── useSavedLocation.ts
    ├── lib/
    │   ├── crop-info.ts
    │   ├── tn-districts-geo.ts
    │   └── utils.ts
    ├── services/
    │   ├── communityService.ts
    │   ├── predictionService.ts
    │   └── yieldService.ts
    ├── styles/
    │   ├── globals.css
    │   └── map.css
    ├── public/
    │   ├── images/ (logo.png, heatmap.jpg, crops/...)
    │   ├── img/    (many disease/crop images; listing may be incomplete in API view)
    │   └── (various crop images)
    ├── package.json
    ├── package-lock.json
    ├── pnpm-lock.yaml
    ├── next.config.mjs
    ├── tsconfig.json
    ├── postcss.config.mjs
    └── components.json
```

---

## Features

### Yield Prediction

The backend includes:
- `backend/api/yield.py` and `backend/api/yield_api.py` (yield endpoints)
- `backend/services/yield_model.py` (model logic)
- `backend/data/yields.json` and `backend/data/prices.json` (supporting datasets)
- `backend/model/yield/*` (encoder, normalization, weights)

The frontend includes:
- `frontend/services/yieldService.ts` (API client/service)
- `frontend/components/dashboard/yield-predictor.tsx` (UI)
- `frontend/app/dashboard/yield/` (route folder exists)

Expected flow:
1. User provides crop/location-related inputs in the dashboard UI.
2. Frontend calls yield endpoints through `yieldService`.
3. Backend loads preprocessing artifacts (`encoder.pkl`, `normalization.npz`) and model weights (`weights.hdf5`) to produce predictions.

---

### Plant Disease Prediction

There are clear indicators of a plant disease classifier:
- `backend/model/cnn.py` (CNN-related code)
- `backend/model/plant_disease_model.pt` (PyTorch model artifact)
- Frontend has a component: `frontend/src/components/PlantDiseasePredictor.tsx`
- Frontend has a service: `frontend/services/predictionService.ts`
- A large set of disease/crop images exists in `frontend/public/img/` (dataset-like examples and assets)

Typical usage:
- Upload or select an image of a plant leaf/crop.
- The UI calls the prediction API.
- The backend model returns a predicted disease/health label.

---

### Community

CropIQ includes a community module:

Backend:
- `backend/api/community.py`

Frontend:
- `frontend/services/communityService.ts`

This is typically used for posting/fetching community content (e.g., posts, tips, questions), depending on how the API is implemented.

---

### Location & Map UI

There’s a location flow and mapping support:

- Pages:
  - `frontend/app/location/page.tsx`
  - `frontend/app/login/page.tsx`
- Components:
  - `frontend/components/location.tsx`
  - `frontend/components/MapContainer.tsx`
  - `frontend/components/auth/location-setup.tsx`
- Supporting geo data:
  - `frontend/lib/tn-districts-geo.ts` (Tamil Nadu districts geo dataset, based on name)

This indicates CropIQ supports choosing/saving a user location and using it in predictions (weather/yield) and map-based visuals.

---

## Tech Stack

**Frontend**
- Next.js (App Router) + TypeScript
- Component-driven UI architecture (`frontend/components/*`)
- Custom hooks (`frontend/hooks/*`)
- Client-side service layer for backend calls (`frontend/services/*`)

**Backend**
- Python app entrypoint: `backend/main.py`
- Modular routing under `backend/api/`
- Service layer under `backend/services/`
- ML artifacts under `backend/model/`
- Supporting JSON data under `backend/data/`

---

## Getting Started

### Frontend Setup

From `frontend/package.json` (Node project), typical setup is:

```bash
cd frontend
npm install
npm run dev
```

> If you prefer pnpm (a `pnpm-lock.yaml` exists):
```bash
cd frontend
pnpm install
pnpm dev
```

Then open:
- `http://localhost:3000`

---

### Backend Setup

A `requirements.txt` is present:

```bash
cd backend
python -m venv .venv
# activate your venv
pip install -r requirements.txt
python main.py
```

> If the backend is a FastAPI app (common pattern with `main.py` + `api/`), you may instead run it with uvicorn depending on how `main.py` is written.

---

## Environment Variables

There is a `backend/.env` file in the repository. For security and portability, it’s best practice to:
- move secrets into a `.env.example`
- keep real `.env` out of version control

Typical variables in this kind of project include:
- Weather API keys
- Model/config flags
- Allowed frontend origins (CORS)
- Server host/port

---

## API Overview

Backend routes appear to be organized under:

- `backend/api/community.py`
- `backend/api/yield.py`
- `backend/api/yield_api.py`

Frontend calls are organized under:

- `frontend/services/communityService.ts`
- `frontend/services/yieldService.ts`
- `frontend/services/predictionService.ts`

This separation makes it easy to:
- swap API base URLs
- reuse calls across components
- keep UI components clean

---

## Data & Model Artifacts

This repo contains model/data artifacts directly in source control:

- Yield model preprocessing & weights:
  - `backend/model/yield/encoder.pkl`
  - `backend/model/yield/normalization.npz`
  - `backend/model/yield/weights.hdf5`
- Plant disease model:
  - `backend/model/plant_disease_model.pt`
- Reference/lookup datasets:
  - `backend/data/prices.json`
  - `backend/data/yields.json`
- Many UI/public image assets:
  - `frontend/public/img/` (disease sample images; very large folder)
  - `frontend/public/images/` (logo, heatmap, etc.)

---

## Notes / Known Limitations

- Some directories (notably `frontend/public/img/` and `frontend/components/ui/`) contain **many files**. When browsing via certain APIs, directory listings may be **incomplete** due to response size limits.  
  You can view the full folders directly in GitHub:
  - `frontend/public/img/`: https://github.com/Nabanshu-Barman/CropIQ/tree/main/frontend/public/img  
  - `frontend/components/ui/`: https://github.com/Nabanshu-Barman/CropIQ/tree/main/frontend/components/ui

- The backend includes a committed `__pycache__/` directory (compiled `.pyc`). It’s usually recommended to remove it from git and add it to `.gitignore`.

---

## License

No license file was visible from the available repository listing. If you intend others to use/modify/distribute this project, add a `LICENSE` file (MIT, Apache-2.0, GPL, etc.).
