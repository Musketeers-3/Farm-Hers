export type SafetyStatus = "safe" | "caution" | "conflict";

export type IngredientCategory = "active" | "hydrator" | "exfoliant" | "antioxidant" | "emollient" | "spf";

export interface Ingredient {
  name: string;
  category: IngredientCategory;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  ingredients: Ingredient[];
  safety: SafetyStatus;
  category: string;
  viscosity: number;
}

export interface RoutineStep {
  id: string;
  order: number;
  label: string;
  icon: string;
  productId?: string;
  connectionSafety?: SafetyStatus;
  waitTime?: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  matchScore: number;
  concerns: string[];
  ingredients: Ingredient[];
}

export interface AdvisoryItem {
  id: string;
  concern: string;
  emoji: string;
  description: string;
  foods: string[];
  image: string;
}

export interface ProgressWeek {
  week: number;
  photo?: string;
  rating?: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Vitamin C Brightening Serum",
    brand: "GlowLab",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop",
    ingredients: [
      { name: "Vitamin C", category: "antioxidant" },
      { name: "Hyaluronic Acid", category: "hydrator" },
      { name: "Ferulic Acid", category: "antioxidant" },
      { name: "Vitamin E", category: "antioxidant" },
    ],
    safety: "safe",
    category: "Serum",
    viscosity: 2,
  },
  {
    id: "2",
    name: "Retinol Night Repair Cream",
    brand: "SkinSync",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=500&fit=crop",
    ingredients: [
      { name: "Retinol", category: "active" },
      { name: "Peptides", category: "active" },
      { name: "Squalane", category: "emollient" },
      { name: "Ceramides", category: "hydrator" },
    ],
    safety: "caution",
    category: "Moisturizer",
    viscosity: 4,
  },
  {
    id: "3",
    name: "AHA/BHA Clarifying Toner",
    brand: "ClearDerm",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop",
    ingredients: [
      { name: "Glycolic Acid", category: "exfoliant" },
      { name: "Salicylic Acid", category: "exfoliant" },
      { name: "Niacinamide", category: "active" },
      { name: "Witch Hazel", category: "active" },
    ],
    safety: "conflict",
    category: "Toner",
    viscosity: 1,
  },
  {
    id: "4",
    name: "Hydra Boost Gel Cream",
    brand: "AquaSkin",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4a38c5f?w=400&h=500&fit=crop",
    ingredients: [
      { name: "Hyaluronic Acid", category: "hydrator" },
      { name: "Aloe Vera", category: "hydrator" },
      { name: "Centella Asiatica", category: "active" },
      { name: "Glycerin", category: "hydrator" },
    ],
    safety: "safe",
    category: "Moisturizer",
    viscosity: 3,
  },
  {
    id: "5",
    name: "Mineral Shield SPF 50",
    brand: "SunGuard",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop",
    ingredients: [
      { name: "Zinc Oxide", category: "spf" },
      { name: "Titanium Dioxide", category: "spf" },
      { name: "Vitamin E", category: "antioxidant" },
      { name: "Squalane", category: "emollient" },
    ],
    safety: "safe",
    category: "Sunscreen",
    viscosity: 4,
  },
  {
    id: "6",
    name: "Gentle Foam Cleanser",
    brand: "PureSkin",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=500&fit=crop",
    ingredients: [
      { name: "Ceramides", category: "hydrator" },
      { name: "Green Tea", category: "antioxidant" },
      { name: "Panthenol", category: "hydrator" },
    ],
    safety: "safe",
    category: "Cleanser",
    viscosity: 1,
  },
];

export const amRoutineSteps: RoutineStep[] = [
  { id: "am1", order: 1, label: "Cleanser", icon: "droplets", productId: "6" },
  { id: "am2", order: 2, label: "Toner", icon: "flask-round", productId: "3", connectionSafety: "safe", waitTime: "30 sec" },
  { id: "am3", order: 3, label: "Serum", icon: "sparkles", productId: "1", connectionSafety: "conflict", waitTime: "1-2 min" },
  { id: "am4", order: 4, label: "Moisturizer", icon: "cloud", productId: "4", connectionSafety: "safe", waitTime: "1 min" },
  { id: "am5", order: 5, label: "Sunscreen", icon: "sun", productId: "5", connectionSafety: "safe", waitTime: "2 min" },
];

export const pmRoutineSteps: RoutineStep[] = [
  { id: "pm1", order: 1, label: "Cleanser", icon: "droplets", productId: "6" },
  { id: "pm2", order: 2, label: "Toner", icon: "flask-round", productId: "3", connectionSafety: "safe", waitTime: "30 sec" },
  { id: "pm3", order: 3, label: "Treatment", icon: "sparkles", productId: "2", connectionSafety: "caution", waitTime: "2 min" },
  { id: "pm4", order: 4, label: "Moisturizer", icon: "cloud", productId: "4", connectionSafety: "safe", waitTime: "1 min" },
];

// Keep backward compat
export const routineSteps = amRoutineSteps;

// Level 1 (Red): Direct contraindications
// Level 2 (Yellow): Efficacy conflicts
export const ingredientConflicts: Record<string, { conflicts: string[]; level: "red" | "yellow" }> = {
  "Retinol": { conflicts: ["Vitamin C", "Glycolic Acid", "Salicylic Acid", "Benzoyl Peroxide"], level: "red" },
  "Vitamin C": { conflicts: ["Retinol", "Benzoyl Peroxide"], level: "red" },
  "Glycolic Acid": { conflicts: ["Retinol", "Salicylic Acid"], level: "red" },
  "Salicylic Acid": { conflicts: ["Retinol", "Glycolic Acid"], level: "red" },
  "Niacinamide": { conflicts: ["Vitamin C"], level: "yellow" },
  "Benzoyl Peroxide": { conflicts: ["Retinol", "Vitamin C"], level: "red" },
};

// Simple conflict lookup (backward compat)
export const ingredientConflictsSimple: Record<string, string[]> = Object.fromEntries(
  Object.entries(ingredientConflicts).map(([k, v]) => [k, v.conflicts])
);

export function calculateSafetyScore(productIds: string[]): number {
  const activeProducts = productIds.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
  let score = 100;
  for (let i = 0; i < activeProducts.length; i++) {
    for (let j = i + 1; j < activeProducts.length; j++) {
      const a = activeProducts[i];
      const b = activeProducts[j];
      a.ingredients.forEach(ingA => {
        b.ingredients.forEach(ingB => {
          const entry = ingredientConflicts[ingA.name];
          if (entry?.conflicts.includes(ingB.name)) {
            score -= entry.level === "red" ? 20 : 5;
          }
        });
      });
    }
  }
  const categories = new Set(activeProducts.map(p => p.category));
  if (categories.has("Cleanser") && categories.has("Moisturizer") && categories.has("Sunscreen")) {
    score += 5;
  }
  return Math.max(0, Math.min(100, score));
}

export function getRoutineOrder(productIds: string[]): Product[] {
  const prods = productIds.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
  return [...prods].sort((a, b) => a.viscosity - b.viscosity);
}

export const skinTips = [
  "Always apply SPF as your last skincare step in the morning.",
  "Retinol and AHAs should not be used together — alternate nights.",
  "Vitamin C works best on clean skin before heavier layers.",
  "Hyaluronic acid locks in moisture when applied to damp skin.",
  "Niacinamide helps strengthen your skin barrier over time.",
  "Apply products from thinnest to thickest consistency.",
  "Your skin barrier takes 28 days to fully renew itself.",
];

export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: "m1",
    name: "Ceramide Barrier Repair",
    brand: "BarrierLab",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=500&fit=crop",
    price: 42,
    matchScore: 94,
    concerns: ["Sensitive", "Dryness"],
    ingredients: [
      { name: "Ceramides", category: "hydrator" },
      { name: "Panthenol", category: "hydrator" },
    ],
  },
  {
    id: "m2",
    name: "Bakuchiol Anti-Age Serum",
    brand: "PlantRx",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=500&fit=crop",
    price: 56,
    matchScore: 88,
    concerns: ["Anti-aging", "Sensitive"],
    ingredients: [
      { name: "Bakuchiol", category: "active" },
      { name: "Squalane", category: "emollient" },
    ],
  },
  {
    id: "m3",
    name: "Azelaic Acid Booster",
    brand: "ClearDerm",
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=500&fit=crop",
    price: 34,
    matchScore: 82,
    concerns: ["Acne", "Hyperpigmentation"],
    ingredients: [
      { name: "Azelaic Acid", category: "active" },
      { name: "Niacinamide", category: "active" },
    ],
  },
  {
    id: "m4",
    name: "Peptide Firming Cream",
    brand: "DermElite",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop",
    price: 68,
    matchScore: 91,
    concerns: ["Anti-aging"],
    ingredients: [
      { name: "Peptides", category: "active" },
      { name: "Hyaluronic Acid", category: "hydrator" },
    ],
  },
  {
    id: "m5",
    name: "Oil-Free Gel Moisturizer",
    brand: "AquaSkin",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop",
    price: 28,
    matchScore: 86,
    concerns: ["Oily Skin", "Acne"],
    ingredients: [
      { name: "Hyaluronic Acid", category: "hydrator" },
      { name: "Green Tea", category: "antioxidant" },
    ],
  },
  {
    id: "m6",
    name: "Tranexamic Acid Serum",
    brand: "BrightRx",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=500&fit=crop",
    price: 38,
    matchScore: 79,
    concerns: ["Hyperpigmentation", "Sensitive"],
    ingredients: [
      { name: "Tranexamic Acid", category: "active" },
      { name: "Vitamin C", category: "antioxidant" },
    ],
  },
];

export const advisoryItems: AdvisoryItem[] = [
  {
    id: "a1",
    concern: "Acne & Breakouts",
    emoji: "🫧",
    description: "Reduce inflammation and balance oil production with zinc-rich and omega-3 foods.",
    foods: ["Salmon", "Walnuts", "Pumpkin Seeds", "Spinach", "Blueberries"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  },
  {
    id: "a2",
    concern: "Dullness & Fatigue",
    emoji: "✨",
    description: "Boost radiance with vitamin C-rich produce and hydrating fruits.",
    foods: ["Oranges", "Papaya", "Red Bell Pepper", "Kiwi", "Strawberries"],
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop",
  },
  {
    id: "a3",
    concern: "Dryness & Flaking",
    emoji: "💧",
    description: "Restore moisture from within with healthy fats and water-rich foods.",
    foods: ["Avocado", "Olive Oil", "Coconut", "Cucumber", "Watermelon"],
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop",
  },
  {
    id: "a4",
    concern: "Premature Aging",
    emoji: "🧬",
    description: "Fight free radicals and boost collagen with antioxidant-rich foods.",
    foods: ["Dark Chocolate", "Green Tea", "Tomatoes", "Almonds", "Sweet Potato"],
    image: "https://images.unsplash.com/photo-1610348725531-acac202b9019?w=400&h=300&fit=crop",
  },
];

export const progressData = {
  weeks: [
    { week: 1, rating: 3 },
    { week: 2, rating: 3.5 },
    { week: 3, rating: 4 },
    { week: 4, rating: 4.2 },
  ] as ProgressWeek[],
  streakDays: [
    1,1,0,1,1,1,0,
    1,1,1,1,0,1,1,
    1,1,1,1,1,1,0,
    1,0,1,1,1,1,1,
  ],
  effectivenessScore: 78,
  totalDays: 28,
  currentStreak: 7,
};
