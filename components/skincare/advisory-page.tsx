"use client"

import { useState } from "react"
import { Search, BookOpen, Leaf, Beaker, AlertTriangle, CheckCircle2, Info, ChevronRight, Apple, Droplets, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

const nutritionGuides = [
  {
    title: "Vitamin C Rich Foods",
    description: "Boost collagen production and skin brightness",
    icon: Apple,
    color: "from-orange-500/30 to-yellow-500/30",
    borderColor: "border-orange-500/30",
    foods: ["Citrus fruits", "Bell peppers", "Strawberries", "Broccoli"],
  },
  {
    title: "Omega-3 Sources",
    description: "Support skin barrier and reduce inflammation",
    icon: Droplets,
    color: "from-blue-500/30 to-cyan-500/30",
    borderColor: "border-blue-500/30",
    foods: ["Salmon", "Walnuts", "Flaxseeds", "Sardines"],
  },
  {
    title: "Antioxidant Foods",
    description: "Protect against UV damage and aging",
    icon: Sun,
    color: "from-purple-500/30 to-pink-500/30",
    borderColor: "border-purple-500/30",
    foods: ["Blueberries", "Dark chocolate", "Green tea", "Tomatoes"],
  },
]

const diyIngredients = [
  { name: "Honey", safety: "safe", uses: "Moisturizing, antibacterial masks" },
  { name: "Aloe Vera", safety: "safe", uses: "Soothing, hydrating treatments" },
  { name: "Oatmeal", safety: "safe", uses: "Gentle exfoliation, calming masks" },
  { name: "Lemon Juice", safety: "caution", uses: "Can cause photosensitivity, use diluted only at night" },
  { name: "Baking Soda", safety: "avoid", uses: "Too alkaline, disrupts skin barrier" },
  { name: "Apple Cider Vinegar", safety: "caution", uses: "Must be heavily diluted, can burn" },
  { name: "Turmeric", safety: "safe", uses: "Anti-inflammatory, brightening (may stain)" },
  { name: "Yogurt", safety: "safe", uses: "Gentle lactic acid exfoliation" },
]

export function AdvisoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"nutrition" | "diy">("nutrition")

  const filteredIngredients = diyIngredients.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getSafetyStyle = (safety: string) => {
    switch (safety) {
      case "safe":
        return { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/20 border-green-500/30" }
      case "caution":
        return { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/20 border-yellow-500/30" }
      case "avoid":
        return { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/20 border-red-500/30" }
      default:
        return { icon: Info, color: "text-blue-400", bg: "bg-blue-500/20 border-blue-500/30" }
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <header>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">Skin Advisory</h1>
        <p className="text-white/60 text-sm">Nutrition guides and DIY ingredient safety</p>
      </header>

      {/* Tab Toggle */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl liquid-glass w-fit">
        <button
          onClick={() => setActiveTab("nutrition")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "nutrition"
              ? "bg-white/20 text-white"
              : "text-white/50 hover:text-white/70"
          )}
        >
          <Apple className="w-4 h-4" />
          Nutrition
        </button>
        <button
          onClick={() => setActiveTab("diy")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "diy"
              ? "bg-white/20 text-white"
              : "text-white/50 hover:text-white/70"
          )}
        >
          <Beaker className="w-4 h-4" />
          DIY Safety
        </button>
      </div>

      {activeTab === "nutrition" ? (
        /* Nutrition Guides */
        <div className="space-y-4">
          {nutritionGuides.map((guide, index) => (
            <div
              key={index}
              className={cn(
                "rounded-2xl border p-5 bg-gradient-to-br transition-all hover:scale-[1.01]",
                guide.color,
                guide.borderColor
              )}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <guide.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{guide.title}</h3>
                  <p className="text-sm text-white/70 mb-3">{guide.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {guide.foods.map((food) => (
                      <span
                        key={food}
                        className="px-3 py-1 rounded-full text-sm bg-white/10 text-white/80"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40 flex-shrink-0" />
              </div>
            </div>
          ))}

          {/* Quick Tips */}
          <div className="glass-border rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-400" />
              Quick Nutrition Tips
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-violet-400 font-bold">1</span>
                </span>
                <p className="text-sm text-white/70">
                  <span className="text-white font-medium">Stay hydrated</span> - Drink at least 8 glasses of water daily for plump, healthy skin.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-violet-400 font-bold">2</span>
                </span>
                <p className="text-sm text-white/70">
                  <span className="text-white font-medium">Limit sugar</span> - Excess sugar can accelerate glycation and aging.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-violet-400 font-bold">3</span>
                </span>
                <p className="text-sm text-white/70">
                  <span className="text-white font-medium">Eat the rainbow</span> - Different colored fruits and vegetables provide varied antioxidants.
                </p>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        /* DIY Safety Checker */
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search DIY ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl glass-border bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>

          {/* Legend */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-white/60">Safe to use</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm text-white/60">Use with caution</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-white/60">Avoid</span>
            </div>
          </div>

          {/* Ingredients List */}
          <div className="space-y-3">
            {filteredIngredients.map((ingredient) => {
              const style = getSafetyStyle(ingredient.safety)
              return (
                <div
                  key={ingredient.name}
                  className={cn(
                    "rounded-xl border p-4 flex items-center gap-4",
                    style.bg
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center", style.color)}>
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{ingredient.name}</h4>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs capitalize", style.bg, style.color)}>
                        {ingredient.safety}
                      </span>
                    </div>
                    <p className="text-sm text-white/60">{ingredient.uses}</p>
                  </div>
                  <style.icon className={cn("w-5 h-5 flex-shrink-0", style.color)} />
                </div>
              )
            })}
          </div>

          {/* Disclaimer */}
          <div className="glass-border rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-white/60">
              <span className="text-white font-medium">Disclaimer:</span> DIY skincare can be unpredictable. Always patch test and consult a dermatologist for persistent skin concerns.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
