from __future__ import annotations

import pickle
from pathlib import Path
from typing import Dict, Any

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F


class Net_64_128_64(nn.Module):
    def __init__(self, input_size: int, num_classes: int):
        super().__init__()
        self.fc1 = nn.Linear(input_size, 64)
        self.fc2 = nn.Linear(64, 128)
        self.fc3 = nn.Linear(128, 64)
        self.fc4 = nn.Linear(64, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = F.selu(self.fc1(x))
        x = F.selu(self.fc2(x))
        x = F.selu(self.fc3(x))
        x = self.fc4(x)  # logits
        return x


class YieldModel:
    def __init__(self, base_dir: Path):
        self.base_dir = base_dir
        self.model_path = base_dir / "weights.hdf5"  # PyTorch state_dict saved to .hdf5 filename
        self.norm_path = base_dir / "normalization.npz"
        self.encoder_path = base_dir / "encoder.pkl"

        for p in [self.model_path, self.norm_path, self.encoder_path]:
            if not p.exists():
                raise FileNotFoundError(f"Missing required artifact: {p}")

        # Load encoder first to get class count
        with open(self.encoder_path, "rb") as f:
            self.encoder = pickle.load(f)
        self.num_classes = int(len(self.encoder.classes_))

        # Load normalization
        with np.load(self.norm_path) as data:
            if "mean" in data.files and "std" in data.files:
                self._mean = data["mean"].astype(np.float32)
                self._std = data["std"].astype(np.float32)
            else:
                # fallback keys if someone saved via StandardScaler
                self._mean = data.get("mean_", np.zeros(7, dtype=np.float32)).astype(np.float32)
                self._std = data.get("scale_", np.ones(7, dtype=np.float32)).astype(np.float32)

        # Build and load PyTorch model
        self.model = Net_64_128_64(input_size=7, num_classes=self.num_classes)
        state = torch.load(self.model_path, map_location="cpu")
        self.model.load_state_dict(state, strict=True)
        self.model.eval()

    def _normalize(self, x_np: np.ndarray) -> np.ndarray:
        return (x_np - self._mean) / (self._std + 1e-8)

    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        vec = np.array(
            [
                [
                    float(features["nitrogen"]),
                    float(features["phosphorous"]),
                    float(features["potassium"]),
                    float(features["temperature"]),
                    float(features["humidity"]),
                    float(features["ph"]),
                    float(features["rainfall"]),
                ]
            ],
            dtype=np.float32,
        )
        x_norm = self._normalize(vec)
        x_t = torch.from_numpy(x_norm)  # shape [1, 7]

        with torch.no_grad():
            logits = self.model(x_t)  # [1, C]
            probs = torch.softmax(logits, dim=1).cpu().numpy()[0]

        idx = int(np.argmax(probs))
        conf = float(probs[idx])
        try:
            crop = str(self.encoder.classes_[idx])
        except Exception:
            crop = f"class_{idx}"

        return {"crop": crop, "confidence": conf}


# Singleton instance
BASE_DIR = Path(__file__).resolve().parent.parent / "model" / "yield"
model = YieldModel(BASE_DIR)