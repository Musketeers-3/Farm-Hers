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
        <h3 className="text-lg font-semibold text-foreground">{t.myFields}</h3>
        <button 
          onClick={() => setActiveScreen('fields')}
          className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
        >
          See All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {sampleFields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>
    </div>
  )
}

function FieldCard({ field }: { field: Field }) {
  return (
    <div className="min-w-[280px] bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-colors group cursor-pointer">
      {/* Image Header */}
      <div className="relative h-32 overflow-hidden">
        <Image
          src={field.image}
          alt={field.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Field name overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h4 className="text-white font-semibold text-lg">{field.name}</h4>
          <div className="flex items-center gap-1 text-white/80 text-xs">
            <MapPin className="w-3 h-3" />
            {field.location}
          </div>
        </div>

        {/* Health indicator */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1">
          <Leaf className="w-3 h-3 text-agri-success" />
          <span className="text-xs font-semibold text-agri-olive">{field.health}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Area</span>
            <p className="text-sm font-semibold text-foreground">{field.area}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Expected Yield</span>
            <p className="text-sm font-semibold text-agri-success flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              {field.yield}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">Harvest: {field.harvestDate}</span>
          <span className="px-2 py-1 rounded-full bg-agri-sage/20 text-xs font-medium text-agri-olive">
            {field.crop}
          </span>
        </div>
      </div>
    </div>
  )
}
