export function cropImageSrc(crop: string): string {
  // Uses lowercased, spaceless key matching your yields.json keys (e.g., "groundnut", "kidneybeans")
  const key = (crop || "").toLowerCase().replace(/\s+/g, "")
  return `/images/crops/${key}.png`
}

const DESCRIPTIONS: Record<string, string> = {
  rice: "Rice thrives in warm, humid climates with standing water and fertile, clayey soils.",
  maize: "Maize prefers warm temperatures, well-drained loamy soils, and moderate rainfall.",
  chickpea: "Chickpea grows best in cool, dry climates on well-drained sandy-loam soils.",
  kidneybeans: "Kidney beans like warm climates, well-drained fertile soil, and moderate rainfall.",
  pigeonpeas: "Pigeon pea tolerates heat and drought, thriving in well-drained loams with moderate rain.",
  mothbeans: "Moth bean is heat- and drought-tolerant, suited to sandy soils and low rainfall.",
  mungbean: "Mung bean prefers warm weather, well-drained soils, and light to moderate rainfall.",
  blackgram: "Black gram thrives in warm, humid conditions and fertile, well-drained soils.",
  lentil: "Lentil prefers cool, dry climates with well-drained loam or clay-loam soils.",
  pomegranate: "Pomegranate favors hot, dry climates with well-drained, slightly alkaline soils.",
  banana: "Banana needs warm, humid climates, high rainfall/irrigation, and rich, well-drained soils.",
  mango: "Mango thrives in tropical heat, dry periods for flowering, and well-drained soils.",
  grapes: "Grapes prefer warm, dry climates, abundant sun, and well-drained, slightly alkaline soils.",
  watermelon: "Watermelon likes hot weather, sandy loam soils, and plenty of sunshine.",
  muskmelon: "Muskmelon grows best in warm, dry climates on sandy, well-drained soils.",
  apple: "Apple requires cool winters for chilling, with well-drained, fertile loam soils.",
  orange: "Orange favors subtropical warmth, moderate humidity, and well-drained sandy loams.",
  papaya: "Papaya thrives in warm, frost-free climates with rich, well-drained soils and irrigation.",
  coconut: "Coconut prefers hot, humid coasts, saline-tolerant, deep sandy or loamy soils.",
  cotton: "Cotton needs long, warm frost-free periods and well-drained, fertile soils.",
  jute: "Jute likes warm, humid climates with high rainfall and alluvial, fertile soils.",
  coffee: "Coffee prefers cool, humid highlands with shade and well-drained acidic soils.",
  soybean: "Soybean grows in warm climates with moderate rain and well-drained loams.",
  groundnut: "Groundnut (peanut) favors warm weather, sandy loam soils, and moderate rainfall.",
}

export function cropDescription(crop: string): string {
  const key = (crop || "").toLowerCase().replace(/\s+/g, "")
  return DESCRIPTIONS[key] || "Suitable climate and well-drained fertile soils are recommended."
}