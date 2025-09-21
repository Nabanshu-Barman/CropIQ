import React, { useState } from 'react';
import { predictPlantDisease } from '../services/predictionService';

export default function PlantDiseasePredictor() {
  const [result, setResult] = useState<{ disease: string; confidence: number } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const prediction = await predictPlantDisease(e.target.files[0]);
        setResult(prediction);
      } catch (error) {
        alert('Prediction failed!');
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {result && (
        <div>
          <p>Disease: {result.disease}</p>
          <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}
