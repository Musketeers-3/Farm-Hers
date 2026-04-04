"use client"

import { useTranslation, useAppStore } from "@/lib/store"
import { MapPin, Leaf, BarChart3, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Field {
  id: string
  name: string
  location: string
  area: string
  crop: string
  health: number
  image: string
  harvestDate: string
  yield: string
}

const sampleFields: Field[] = [
  {
    id: "field-1",
    name: "Wheat Field",
    location: "Punjab Valley",
    area: "8.5 ha",
    crop: "Wheat",
    health: 93,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
    harvestDate: "Apr 15, 2026",
    yield: "8200 Kg/ha"
  },
  {
    id: "field-2",
    name: "Rice Paddy",
    location: "Central Valley",
    area: "5.2 ha",
    crop: "Rice",
    health: 87,
    image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&h=300&fit=crop",
    harvestDate: "Oct 20, 2026",
    yield: "7200 Kg/ha"
  },
]

export function MyFieldsCard() {
  const t = useTranslation()
  const setActiveScreen = useAppStore((state) => state.setActiveScreen)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-foreground tracking-tight">{t.myFields}</h3>
        <button 
          onClick={() => setActiveScreen('fields')}
          className="text-[13px] text-primary font-medium flex items-center gap-0.5 hover:underline underline-offset-4 transition-all"
        >
          See All
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {sampleFields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>
    </div>
  )
}

function FieldCard({ field }: { field: Field }) {
  return (
    <div className="min-w-[260px] bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-primary/20 transition-all duration-300 group cursor-pointer premium-shadow">
      {/* Image */}
      <div className="relative h-28 overflow-hidden">
        <Image
          src={field.image}
          alt={field.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        
        <div className="absolute bottom-3 left-3 right-3">
          <h4 className="text-white font-semibold text-base tracking-tight">{field.name}</h4>
          <div className="flex items-center gap-1 text-white/70 text-[11px]">
            <MapPin className="w-3 h-3" strokeWidth={2} />
            {field.location}
          </div>
        </div>

        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm flex items-center gap-1">
          <Leaf className="w-3 h-3 text-primary" strokeWidth={2} />
          <span className="text-[11px] font-semibold text-primary">{field.health}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Area</span>
            <p className="text-sm font-semibold text-foreground">{field.area}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Yield</span>
            <p className="text-sm font-semibold text-primary flex items-center gap-1">
              <BarChart3 className="w-3 h-3" strokeWidth={2} />
              {field.yield}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-border/40">
          <span className="text-[11px] text-muted-foreground">Harvest: {field.harvestDate}</span>
          <span className="px-2 py-0.5 rounded-md bg-accent text-[11px] font-medium text-accent-foreground">
            {field.crop}
          </span>
        </div>
      </div>
    </div>
  )
}
