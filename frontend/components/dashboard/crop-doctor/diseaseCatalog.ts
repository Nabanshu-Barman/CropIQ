// Build crop -> diseases from your idx_to_classes
export const IDX_TO_CLASSES: string[] = [
  'Apple___Apple_scab',
  'Apple___Black_rot',
  'Apple___Cedar_apple_rust',
  'Apple___healthy',
  'Background_without_leaves',
  'Blueberry___healthy',
  'Cherry___Powdery_mildew',
  'Cherry___healthy',
  'Corn___Cercospora_leaf_spot Gray_leaf_spot',
  'Corn___Common_rust',
  'Corn___Northern_Leaf_Blight',
  'Corn___healthy',
  'Grape___Black_rot',
  'Grape___Esca_(Black_Measles)',
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
  'Grape___healthy',
  'Orange___Haunglongbing_(Citrus_greening)',
  'Peach___Bacterial_spot',
  'Peach___healthy',
  'Pepper,_bell___Bacterial_spot',
  'Pepper,_bell___healthy',
  'Potato___Early_blight',
  'Potato___Late_blight',
  'Potato___healthy',
  'Raspberry___healthy',
  'Soybean___healthy',
  'Squash___Powdery_mildew',
  'Strawberry___Leaf_scorch',
  'Strawberry___healthy',
  'Tomato___Bacterial_spot',
  'Tomato___Early_blight',
  'Tomato___Late_blight',
  'Tomato___Leaf_Mold',
  'Tomato___Septoria_leaf_spot',
  'Tomato___Spider_mites Two-spotted_spider_mite',
  'Tomato___Target_Spot',
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  'Tomato___Tomato_mosaic_virus',
  'Tomato___healthy',
]

// Utility: normalize display labels
const nice = (s: string) =>
  s
    .replace(/_/g, ' ')
    .replace(/, /g, ', ')
    .replace(/\(\s*/g, '(')
    .replace(/\s*\)/g, ')')
    .replace('Pepper, bell', 'Pepper (Bell)')

export type CropId = string
export type DiseaseId = string

export type CropOption = { id: CropId; label: string }
export type DiseaseOption = { id: DiseaseId; label: string }

export function parseModelLabel(labelOrObj: string | { name?: string }) {
  const raw = typeof labelOrObj === 'string' ? labelOrObj : (labelOrObj?.name ?? '')
  const parts = raw.split('___')
  if (parts.length < 2) return { cropId: '', diseaseId: '', cropLabel: '', diseaseLabel: '' }
  const cropId = parts[0]
  const diseaseId = parts.slice(1).join('___')
  return { cropId, diseaseId, cropLabel: nice(cropId), diseaseLabel: nice(diseaseId) }
}

// Build CROP -> DISEASES (skip "Background_without_leaves")
const byCrop = new Map<CropId, Set<DiseaseId>>()
for (const label of IDX_TO_CLASSES) {
  if (label === 'Background_without_leaves') continue
  const { cropId, diseaseId } = parseModelLabel(label)
  if (!cropId || !diseaseId) continue
  if (!byCrop.has(cropId)) byCrop.set(cropId, new Set())
  byCrop.get(cropId)!.add(diseaseId)
}

export const CROPS: CropOption[] = Array.from(byCrop.keys())
  .sort()
  .map(id => ({ id, label: nice(id) }))

export const DISEASES_BY_CROP: Record<CropId, DiseaseOption[]> = {}
for (const [crop, set] of byCrop) {
  DISEASES_BY_CROP[crop] = Array.from(set).sort().map(id => ({ id, label: nice(id) }))
}