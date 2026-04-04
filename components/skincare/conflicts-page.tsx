"use client"

import { useState } from "react"
import { AlertTriangle, AlertCircle, Info, Search, Shield, Zap } from "lucide-react"
import { ingredientConflicts } from "@/lib/skincare-data"
import { cn } from "@/lib/utils"

export function ConflictsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState<"all" | "high" | "medium" | "low">("all")

  const filteredConflicts = ingredientConflicts.filter((conflict) => {
    const matchesSearch =
      conflict.ingredient1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conflict.ingredient2.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = severityFilter === "all" || conflict.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case "medium":
        return <AlertCircle className="w-5 h-5 text-amber-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 border-red-200 hover:bg-red-100/80"
      case "medium":
        return "bg-amber-50 border-amber-200 hover:bg-amber-100/80"
      default:
        return "bg-blue-50 border-blue-200 hover:bg-blue-100/80"
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <header>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown-dark">Ingredient Conflicts</h1>
        <p className="text-taupe text-sm mt-1">Know what not to mix in your routine</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-brown-dark">
            {ingredientConflicts.filter((c) => c.severity === "high").length}
          </div>
          <div className="text-xs text-taupe font-medium">High Risk</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-brown-dark">
            {ingredientConflicts.filter((c) => c.severity === "medium").length}
          </div>
          <div className="text-xs text-taupe font-medium">Medium Risk</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-brown-dark">
            {ingredientConflicts.filter((c) => c.severity === "low").length}
          </div>
          <div className="text-xs text-taupe font-medium">Low Risk</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-taupe/50" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-warm text-brown-dark placeholder:text-taupe/50 focus:outline-none focus:ring-2 focus:ring-rose/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "high", "medium", "low"] as const).map((severity) => (
            <button
              key={severity}
              onClick={() => setSeverityFilter(severity)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                severityFilter === severity
                  ? "bg-gradient-to-r from-rose to-coral text-white shadow-md"
                  : "glass-warm text-taupe hover:text-brown-dark"
              )}
            >
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Conflicts List */}
      <div className="space-y-4">
        {filteredConflicts.map((conflict, index) => (
          <div
            key={index}
            className={cn(
              "rounded-2xl border p-5 transition-all",
              getSeverityStyle(conflict.severity)
            )}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">{getSeverityIcon(conflict.severity)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-3 py-1.5 rounded-full text-sm bg-white/80 text-brown-dark font-medium shadow-sm">
                    {conflict.ingredient1}
                  </span>
                  <Zap className="w-4 h-4 text-coral" />
                  <span className="px-3 py-1.5 rounded-full text-sm bg-white/80 text-brown-dark font-medium shadow-sm">
                    {conflict.ingredient2}
                  </span>
                </div>
                <p className="text-sm text-taupe">{conflict.description}</p>
              </div>
              <span
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold",
                  conflict.severity === "high"
                    ? "bg-red-200 text-red-700"
                    : conflict.severity === "medium"
                    ? "bg-amber-200 text-amber-700"
                    : "bg-blue-200 text-blue-700"
                )}
              >
                {conflict.severity.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Tips */}
      <section className="glass-peach rounded-2xl p-6">
        <h3 className="font-serif text-lg font-semibold text-brown-dark mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-coral" />
          Safety Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-xl p-4">
            <h4 className="font-medium text-brown-dark mb-2">High Risk Conflicts</h4>
            <p className="text-sm text-taupe">
              Never use together. Can cause severe irritation, chemical burns, or deactivation.
            </p>
          </div>
          <div className="bg-white/60 rounded-xl p-4">
            <h4 className="font-medium text-brown-dark mb-2">Medium Risk Conflicts</h4>
            <p className="text-sm text-taupe">
              Use at different times of day or wait 30+ minutes between applications.
            </p>
          </div>
          <div className="bg-white/60 rounded-xl p-4">
            <h4 className="font-medium text-brown-dark mb-2">Low Risk Conflicts</h4>
            <p className="text-sm text-taupe">
              May reduce effectiveness. Consider alternating days for best results.
            </p>
          </div>
          <div className="bg-white/60 rounded-xl p-4">
            <h4 className="font-medium text-brown-dark mb-2">When in Doubt</h4>
            <p className="text-sm text-taupe">
              Patch test new combinations and consult a dermatologist for personalized advice.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
