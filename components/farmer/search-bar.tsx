"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X, TrendingUp, MapPin, Wheat } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const suggestions = [
  { type: "crop", label: "Wheat", icon: Wheat },
  { type: "crop", label: "Rice", icon: Wheat },
  { type: "crop", label: "Mustard", icon: Wheat },
  { type: "mandi", label: "Ludhiana Mandi", icon: MapPin },
  { type: "mandi", label: "Amritsar Mandi", icon: MapPin },
  { type: "trending", label: "Mustard prices rising", icon: TrendingUp },
]

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const setActiveScreen = useAppStore((state) => state.setActiveScreen)

  const filtered = query
    ? suggestions.filter(s => s.label.toLowerCase().includes(query.toLowerCase()))
    : suggestions

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus()
  }, [isOpen])

  const handleSelect = (item: typeof suggestions[0]) => {
    if (item.type === "mandi" || item.type === "trending") {
      setActiveScreen("market")
    }
    setQuery("")
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-secondary hover:bg-accent transition-all"
      >
        <Search className="w-4.5 h-4.5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Search crops, mandis, buyers...</span>
      </button>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-secondary ring-2 ring-primary/20">
        <Search className="w-4.5 h-4.5 text-primary" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search crops, mandis, buyers..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        <button onClick={() => { setQuery(""); setIsOpen(false) }}>
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Dropdown */}
      <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border border-border shadow-lg overflow-hidden z-50">
        <div className="p-2">
          {filtered.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSelect(item)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-left"
            >
              <item.icon className={cn(
                "w-4 h-4",
                item.type === "trending" ? "text-agri-success" : "text-muted-foreground"
              )} />
              <span className="text-sm text-foreground">{item.label}</span>
              <span className="text-[10px] text-muted-foreground ml-auto capitalize">{item.type}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
