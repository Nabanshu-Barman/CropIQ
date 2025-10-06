// Pixel coordinates for /public/images/heatmap.jpg
// x,y are NATURAL image pixels from the TOP-LEFT corner of the image.
// anchor: "topleft" means the heat circle's top-left sits at (x,y).
//
// How to manually nudge positions:
// 1) To shift ALL districts:
//    - Change GLOBAL_OFFSET.x (negative = move LEFT, positive = move RIGHT)
//    - Change GLOBAL_OFFSET.y (negative = move UP,   positive = move DOWN)
//    Example: if everything looks a bit to the right, try GLOBAL_OFFSET.x = -8
//
// 2) To tweak a SINGLE district:
//    - Add an entry in PER_DISTRICT_OFFSET below, e.g.:
//      "Chennai": { x: -2, y: 1 } // moves Chennai 2px left and 1px down
//
// 3) Save file and reload the page to see changes.
//
// Note: Keep the image file and resolution unchanged; these coordinates are for heatmap.jpg.

export type DistrictPoint = {
  id: string
  name: string
  x: number
  y: number
  anchor?: "topleft" | "center"
}

// Global pixel offset applied to EVERY district.
// Start with a small left shift if everything is slightly to the right.
const GLOBAL_OFFSET = {
  x: -60, // <--- adjust this to move all markers horizontally (e.g., -8 moves left by 8px)
  y: -48,  // <--- adjust this to move all markers vertically
}

// Per-district fine-tune overrides (optional). Empty by default.
const PER_DISTRICT_OFFSET: Partial<Record<string, { x: number; y: number }>> = {
  // "Chennai": { x: -2, y: 0 },
}

const BASE_POINTS: DistrictPoint[] = [
  { id: "Chennai", name: "Chennai", x: 1304, y: 184, anchor: "topleft" },
  { id: "Tiruvallur", name: "Tiruvallur", x: 1200, y: 139, anchor: "topleft" },
  { id: "Vellore", name: "Vellore", x: 916, y: 251, anchor: "topleft" },
  { id: "Tirupattur", name: "Tirupattur", x: 786, y: 349, anchor: "topleft" },
  { id: "Krishnagiri", name: "Krishnagiri", x: 568, y: 329, anchor: "topleft" },
  { id: "Ariyalur", name: "Ariyalur", x: 978, y: 805, anchor: "topleft" },
  { id: "Chengalpattu", name: "Chengalpattu", x: 1240, y: 353, anchor: "topleft" },
  { id: "Coimbatore", name: "Coimbatore", x: 241, y: 909, anchor: "topleft" },
  { id: "Cuddalore", name: "Cuddalore", x: 1073, y: 687, anchor: "topleft" },
  { id: "Dharmapuri", name: "Dharmapuri", x: 621, y: 483, anchor: "topleft" },
  { id: "Dindigul", name: "Dindigul", x: 527, y: 1060, anchor: "topleft" },
  { id: "Erode", name: "Erode", x: 393, y: 685, anchor: "topleft" },
  { id: "Kallakurichi", name: "Kallakurichi", x: 924, y: 592, anchor: "topleft" },
  { id: "Kanchipuram", name: "Kanchipuram", x: 1177, y: 260, anchor: "topleft" },
  { id: "Kanniyakumari", name: "Kanniyakumari", x: 376, y: 1731, anchor: "topleft" },
  { id: "Karur", name: "Karur", x: 627, y: 884, anchor: "topleft" },
  { id: "Madurai", name: "Madurai", x: 564, y: 1209, anchor: "topleft" },
  { id: "Mayiladuthurai", name: "Mayiladuthurai", x: 1131, y: 811, anchor: "topleft" },
  { id: "Nagapattinam", name: "Nagapattinam", x: 1162, y: 989, anchor: "topleft" },
  { id: "Namakkal", name: "Namakkal", x: 630, y: 761, anchor: "topleft" },
  { id: "Perambalur", name: "Perambalur", x: 878, y: 767, anchor: "topleft" },
  { id: "Pudukkottai", name: "Pudukkottai", x: 862, y: 1043, anchor: "topleft" },
  { id: "Ramanathapuram", name: "Ramanathapuram", x: 801, y: 1382, anchor: "topleft" },
  { id: "Ranipet", name: "Ranipet", x: 1044, y: 230, anchor: "topleft" },
  { id: "Salem", name: "Salem", x: 625, y: 622, anchor: "topleft" },
  { id: "Sivagangai", name: "Sivagangai", x: 770, y: 1202, anchor: "topleft" },
  { id: "Tenkasi", name: "Tenkasi", x: 401, y: 1478, anchor: "topleft" },
  { id: "Thanjavur", name: "Thanjavur", x: 970, y: 944, anchor: "topleft" },
  { id: "Theni", name: "Theni", x: 394, y: 1217, anchor: "topleft" },
  { id: "Thoothukudi", name: "Thoothukudi", x: 589, y: 1539, anchor: "topleft" },
  { id: "Tiruchirappalli", name: "Tiruchirappalli", x: 798, y: 881, anchor: "topleft" },
  { id: "Tirunelveli", name: "Tirunelveli", x: 463, y: 1657, anchor: "topleft" },
  { id: "Tiruppur", name: "Tiruppur", x: 389, y: 890, anchor: "topleft" },
  { id: "Tiruvannamalai", name: "Tiruvannamalai", x: 934, y: 376, anchor: "topleft" },
  { id: "Tiruvarur", name: "Tiruvarur", x: 1075, y: 964, anchor: "topleft" },
  { id: "Villupuram", name: "Villupuram", x: 1084, y: 488, anchor: "topleft" },
  { id: "Virudhunagar", name: "Virudhunagar", x: 547, y: 1350, anchor: "topleft" },
  { id: "The Nilgiris", name: "The Nilgiris", x: 162, y: 711, anchor: "topleft" },
]

// Apply global and per-district offsets without changing public API.
export const TNDistrictPoints: DistrictPoint[] = BASE_POINTS.map((p) => {
  const d = PER_DISTRICT_OFFSET[p.name] ?? { x: 0, y: 0 }
  return {
    ...p,
    x: p.x + GLOBAL_OFFSET.x + d.x,
    y: p.y + GLOBAL_OFFSET.y + d.y,
  }
})

export const TNDistrictNames = TNDistrictPoints.map((d) => d.name)
export const TN_PIXEL_BY_NAME = new Map(TNDistrictPoints.map((p) => [p.name, p]))