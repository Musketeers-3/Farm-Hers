export interface Product {
  id: string
  name: string
  brand: string
  category: string
  image: string
  safetyScore: number
  ingredients: string[]
  ph?: number
  size?: string
  openedDate?: string
  expiryMonths?: number
}

export interface Routine {
  id: string
  name: string
  type: "am" | "pm"
  products: Product[]
}

export interface ConflictPair {
  ingredient1: string
  ingredient2: string
  severity: "high" | "medium" | "low"
  description: string
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Vitamin C Serum",
    brand: "The Ordinary",
    category: "Serums",
    image: "/images/skincare/vitamin-c.jpg",
    safetyScore: 92,
    ingredients: ["Ascorbic Acid", "Vitamin E", "Ferulic Acid", "Hyaluronic Acid"],
    ph: 3.2,
  },
  {
    id: "2",
    name: "Niacinamide 10%",
    brand: "The Ordinary",
    category: "Serums",
    image: "/images/skincare/niacinamide.jpg",
    safetyScore: 95,
    ingredients: ["Niacinamide", "Zinc PCA", "Glycerin"],
    ph: 5.5,
  },
  {
    id: "3",
    name: "Retinol 0.5%",
    brand: "Paula's Choice",
    category: "Treatments",
    image: "/images/skincare/retinol.jpg",
    safetyScore: 78,
    ingredients: ["Retinol", "Vitamin E", "Peptides", "Squalane"],
    ph: 5.0,
  },
  {
    id: "4",
    name: "Hyaluronic Acid",
    brand: "The Ordinary",
    category: "Serums",
    image: "/images/skincare/hyaluronic.jpg",
    safetyScore: 98,
    ingredients: ["Hyaluronic Acid", "Sodium Hyaluronate", "Panthenol"],
    ph: 6.5,
  },
  {
    id: "5",
    name: "AHA 30% + BHA 2%",
    brand: "The Ordinary",
    category: "Exfoliants",
    image: "/images/skincare/aha-bha.jpg",
    safetyScore: 65,
    ingredients: ["Glycolic Acid", "Lactic Acid", "Salicylic Acid", "Citric Acid"],
    ph: 3.5,
  },
  {
    id: "6",
    name: "Gentle Cleanser",
    brand: "CeraVe",
    category: "Cleansers",
    image: "/images/skincare/cleanser.jpg",
    safetyScore: 96,
    ingredients: ["Ceramides", "Hyaluronic Acid", "Niacinamide"],
    ph: 5.5,
  },
  {
    id: "7",
    name: "SPF 50 Sunscreen",
    brand: "La Roche-Posay",
    category: "Sunscreen",
    image: "/images/skincare/sunscreen.jpg",
    safetyScore: 94,
    ingredients: ["Zinc Oxide", "Titanium Dioxide", "Vitamin E"],
    ph: 7.0,
  },
  {
    id: "8",
    name: "Moisturizing Cream",
    brand: "CeraVe",
    category: "Moisturizers",
    image: "/images/skincare/moisturizer.jpg",
    safetyScore: 97,
    ingredients: ["Ceramides", "Hyaluronic Acid", "Cholesterol"],
    ph: 5.5,
  },
]

export const mockRoutines: Routine[] = [
  {
    id: "am",
    name: "Morning Routine",
    type: "am",
    products: [mockProducts[5], mockProducts[3], mockProducts[1], mockProducts[7], mockProducts[6]],
  },
  {
    id: "pm",
    name: "Evening Routine",
    type: "pm",
    products: [mockProducts[5], mockProducts[0], mockProducts[2], mockProducts[7]],
  },
]

export const ingredientConflicts: ConflictPair[] = [
  {
    ingredient1: "Vitamin C",
    ingredient2: "Niacinamide",
    severity: "low",
    description: "May reduce effectiveness when used together. Apply at different times.",
  },
  {
    ingredient1: "Retinol",
    ingredient2: "AHA/BHA",
    severity: "high",
    description: "Can cause severe irritation and sensitivity. Never use together.",
  },
  {
    ingredient1: "Vitamin C",
    ingredient2: "Retinol",
    severity: "medium",
    description: "Different pH requirements. Use Vitamin C in AM and Retinol in PM.",
  },
  {
    ingredient1: "Benzoyl Peroxide",
    ingredient2: "Retinol",
    severity: "high",
    description: "Benzoyl peroxide can deactivate retinol. Use on alternate days.",
  },
  {
    ingredient1: "AHA/BHA",
    ingredient2: "Vitamin C",
    severity: "medium",
    description: "Can increase sensitivity. Wait 30 minutes between applications.",
  },
]

export const categories = [
  { name: "All", icon: "Sparkles", count: 8 },
  { name: "Cleansers", icon: "Droplets", count: 1 },
  { name: "Serums", icon: "FlaskConical", count: 3 },
  { name: "Moisturizers", icon: "Heart", count: 1 },
  { name: "Sunscreen", icon: "Sun", count: 1 },
  { name: "Treatments", icon: "Zap", count: 1 },
  { name: "Exfoliants", icon: "Layers", count: 1 },
]

export const trendingProducts = [
  { name: "Snail Mucin", brand: "COSRX", score: 96, trend: "+12%" },
  { name: "Peptide Serum", brand: "The Inkey List", score: 91, trend: "+8%" },
  { name: "Centella Cream", brand: "SKIN1004", score: 94, trend: "+15%" },
]
