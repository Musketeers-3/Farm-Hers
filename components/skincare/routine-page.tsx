"use client"

import { useState } from "react"
import { Sun, Moon, GripVertical, Plus, Trash2, CheckCircle2, Info, FlaskConical } from "lucide-react"
import { mockRoutines, mockProducts } from "@/lib/skincare-data"
import { cn } from "@/lib/utils"
import { SafetyScoreRing } from "./safety-score-ring"

export function RoutinePage() {
  const [activeTime, setActiveTime] = useState<"am" | "pm">("am")
  const [routines, setRoutines] = useState(mockRoutines)

  const currentRoutine = routines.find((r) => r.type === activeTime)

  const getRoutineScore = () => {
    if (!currentRoutine) return 0
    const avg = currentRoutine.products.reduce((sum, p) => sum + p.safetyScore, 0) / currentRoutine.products.length
    return Math.round(avg)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown-dark">Your Routine</h1>
          <p className="text-taupe text-sm mt-1">Build your perfect skincare sequence</p>
        </div>
      </header>

      {/* AM/PM Toggle */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 p-2 rounded-2xl glass-warm">
          <button
            onClick={() => setActiveTime("am")}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300",
              activeTime === "am"
                ? "bg-gradient-to-r from-peach to-gold text-brown-dark shadow-md"
                : "text-taupe hover:text-brown-dark"
            )}
          >
            <Sun className="w-5 h-5" />
            Morning
          </button>
          <button
            onClick={() => setActiveTime("pm")}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300",
              activeTime === "pm"
                ? "bg-gradient-to-r from-rose-light to-rose text-brown-dark shadow-md"
                : "text-taupe hover:text-brown-dark"
            )}
          >
            <Moon className="w-5 h-5" />
            Evening
          </button>
        </div>
      </div>

      {/* Routine Score Card */}
      <div className="glass-rose rounded-3xl p-6">
        <div className="flex items-center gap-6">
          <div className="p-3 bg-white/50 rounded-2xl">
            <SafetyScoreRing score={getRoutineScore()} size="lg" />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-xl font-bold text-brown-dark mb-1">
              {activeTime === "am" ? "Morning" : "Evening"} Routine Score
            </h2>
            <p className="text-sm text-taupe mb-3">
              {currentRoutine?.products.length || 0} products in this routine
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="badge-safe flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium">
                <CheckCircle2 className="w-3 h-3" />
                pH balanced
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-rose/20 text-rose-dark border border-rose/30">
                <Info className="w-3 h-3" />
                Optimized order
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Routine Steps */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-brown-dark">Routine Steps</h2>
          <button className="btn-secondary flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        </div>

        <div className="space-y-3">
          {currentRoutine?.products.map((product, index) => (
            <div
              key={product.id}
              className="glass-card rounded-2xl p-4 flex items-center gap-4 group"
            >
              <button className="cursor-grab text-taupe/40 hover:text-taupe transition-colors">
                <GripVertical className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose to-coral flex items-center justify-center text-white font-bold shadow-md">
                {index + 1}
              </div>

              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-peach-light to-rose-light flex-shrink-0 flex items-center justify-center">
                <FlaskConical className="w-7 h-7 text-rose-dark/50" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-brown-dark truncate">{product.name}</h3>
                <p className="text-sm text-taupe">{product.brand}</p>
                {product.ph && (
                  <span className="text-xs text-taupe/70">pH {product.ph}</span>
                )}
              </div>

              <SafetyScoreRing score={product.safetyScore} size="sm" />

              <button className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-coral/70 hover:text-coral hover:bg-coral/10 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add Step Button */}
          <button className="w-full glass-warm rounded-2xl p-4 flex items-center justify-center gap-2 text-taupe hover:text-rose-dark hover:bg-white/50 transition-all duration-200 border-2 border-dashed border-rose/20">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add product to routine</span>
          </button>
        </div>
      </section>

      {/* Tips Section */}
      <section className="glass-peach rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-brown-dark mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-coral" />
          Routine Tips
        </h3>
        <ul className="space-y-2 text-sm text-taupe">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-coral mt-2 flex-shrink-0" />
            Apply products from thinnest to thickest consistency
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-coral mt-2 flex-shrink-0" />
            Wait 1-2 minutes between active ingredients
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-coral mt-2 flex-shrink-0" />
            Always finish with SPF in the morning
          </li>
        </ul>
      </section>
    </div>
  )
}
