export type DistrictCoords = { lat: number; lon: number }

// Canonical names match your dropdown used elsewhere: e.g. "Kanniyakumari", "Tiruvallur", "Tiruvarur", "Sivagangai", "Villupuram", "Kanchipuram", "Tirupathur".
export const DISTRICT_COORDS: Record<string, DistrictCoords> = {
  Ariyalur: { lat: 11.1395, lon: 79.0670 },
  Chengalpattu: { lat: 12.6899, lon: 79.9980 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Coimbatore: { lat: 11.0168, lon: 76.9558 },
  Cuddalore: { lat: 11.7440, lon: 79.7645 },
  Dharmapuri: { lat: 12.1364, lon: 78.1560 },
  Dindigul: { lat: 10.3677, lon: 77.9803 },
  Erode: { lat: 11.3410, lon: 77.7172 },
  Kallakurichi: { lat: 11.7371, lon: 78.9671 },
  Kanchipuram: { lat: 12.8342, lon: 79.7036 },
  Kanniyakumari: { lat: 8.0883, lon: 77.5385 },
  Karur: { lat: 10.9601, lon: 78.0766 },
  Krishnagiri: { lat: 12.5192, lon: 78.2138 },
  Madurai: { lat: 9.9252, lon: 78.1198 },
  Mayiladuthurai: { lat: 11.1036, lon: 79.6520 },
  Nagapattinam: { lat: 10.7666, lon: 79.8440 },
  Namakkal: { lat: 11.2187, lon: 78.1676 },
  Perambalur: { lat: 11.2333, lon: 78.8847 },
  Pudukkottai: { lat: 10.3822, lon: 78.8203 },
  Ramanathapuram: { lat: 9.3689, lon: 78.8358 },
  Ranipet: { lat: 12.9539, lon: 79.3086 },
  Salem: { lat: 11.6643, lon: 78.1460 },
  Sivagangai: { lat: 9.8406, lon: 78.4797 },
  Tenkasi: { lat: 8.9590, lon: 77.3155 },
  Thanjavur: { lat: 10.7867, lon: 79.1378 },
  Theni: { lat: 9.9267, lon: 77.0966 },
  Thoothukudi: { lat: 8.7642, lon: 78.1348 },
  Tiruchirappalli: { lat: 10.7905, lon: 78.7047 },
  Tirunelveli: { lat: 8.7139, lon: 77.7564 },
  Tirupathur: { lat: 12.5173, lon: 78.6569 },
  Tiruppur: { lat: 11.1085, lon: 77.3411 },
  Tiruvallur: { lat: 13.1536, lon: 79.9085 },
  Tiruvannamalai: { lat: 12.2253, lon: 79.0747 },
  Tiruvarur: { lat: 10.7760, lon: 79.6320 },
  Vellore: { lat: 12.9165, lon: 79.1325 },
  Villupuram: { lat: 11.9421, lon: 79.4883 },
  Virudhunagar: { lat: 9.5850, lon: 77.9734 },
  "The Nilgiris": { lat: 11.4064, lon: 76.6950 },
}

// Accept common alternate spellings; map them to the canonical keys above.
const ALIASES: Record<string, keyof typeof DISTRICT_COORDS> = {
  kanyakumari: "Kanniyakumari",
  thiruvallur: "Tiruvallur",
  thiruvarur: "Tiruvarur",
  sivaganga: "Sivagangai",
  viluppuram: "Villupuram",
  kancheepuram: "Kanchipuram",
  tirupattur: "Tirupathur",
  udhagamandalam: "The Nilgiris",
  ooty: "The Nilgiris",
  tuticorin: "Thoothukudi",
  trichy: "Tiruchirappalli",
}

export function coordsForDistrict(name: string | null | undefined): DistrictCoords | null {
  if (!name) return null
  const trimmed = name.trim()
  if (!trimmed) return null
  // Try exact canonical first
  if (trimmed in DISTRICT_COORDS) return DISTRICT_COORDS[trimmed as keyof typeof DISTRICT_COORDS]
  // Try case-insensitive + alias
  const key = trimmed.toLowerCase()
  if (ALIASES[key]) return DISTRICT_COORDS[ALIASES[key]]
  // Last attempt: remove spaces
  const noSpace = key.replace(/\s+/g, "")
  for (const canon of Object.keys(DISTRICT_COORDS)) {
    if (canon.toLowerCase().replace(/\s+/g, "") === noSpace) {
      return DISTRICT_COORDS[canon]
    }
  }
  return null
}