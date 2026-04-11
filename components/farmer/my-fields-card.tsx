"use client";

import { useTranslation, useAppStore } from "@/lib/store";
import {
  MapPin,
  BarChart3,
  ChevronRight,
  Calendar,
  Sprout,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Field {
  id: string;
  name: string;
  location: string;
  area: string;
  crop: string;
  health: number;
  image: string;
  harvestDate: string;
  yield: string;
}

const sampleFields: Field[] = [
  {
    id: "field-1",
    name: "Wheat Field",
    location: "Punjab Valley",
    area: "8.5 ha",
    crop: "Wheat",
    health: 93,
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
    harvestDate: "Apr 15, 2026",
    yield: "8200 Kg/ha",
  },
  {
    id: "field-2",
    name: "Rice Paddy",
    location: "Central Valley",
    area: "5.2 ha",
    crop: "Rice",
    health: 87,
    image:
      "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&h=400&fit=crop",
    harvestDate: "Oct 20, 2026",
    yield: "7200 Kg/ha",
  },
];

// ----------------------------------------------------------------------
// 1. ANIMATED HEALTH RING COMPONENT (Repaired!)
// ----------------------------------------------------------------------
function HealthRing({ health }: { health: number }) {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (health / 100) * circumference;

  // Color logic based on health percentage
  const strokeColor =
    health >= 90
      ? "stroke-agri-success"
      : health >= 75
        ? "stroke-agri-gold"
        : "stroke-destructive";

  return (
    <div className="relative flex items-center justify-center bg-black/40 backdrop-blur-md rounded-xl p-1.5 border border-white/10 shadow-lg">
      <svg className="w-10 h-10 transform -rotate-90">
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-white/20"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="20"
          cy="20"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          className={cn("drop-shadow-md", strokeColor)}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white tracking-tighter">
          {health}
        </span>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. PREMIUM FIELD CARD
// ----------------------------------------------------------------------
function FieldCard({ field }: { field: Field }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="min-w-[280px] w-full sm:min-w-0 bg-card rounded-2xl sm:rounded-3xl overflow-hidden border border-border/60 hover:border-primary/30 transition-colors duration-300 group cursor-pointer premium-shadow flex flex-col relative"
    >
      {/* Top Half: Image & Glass Overlays */}
      <div className="relative h-32 sm:h-36 overflow-hidden">
        <Image
          src={field.image}
          alt={field.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500" />

        {/* Bottom Left: Name & Location */}
        <div className="absolute bottom-3 left-4 right-3">
          <h4 className="text-white font-bold text-lg tracking-tight drop-shadow-sm">
            {field.name}
          </h4>
          <div className="flex items-center gap-1.5 text-white/80 text-xs font-medium mt-0.5">
            <MapPin
              className="w-3.5 h-3.5 text-primary drop-shadow-md"
              strokeWidth={2.5}
            />
            {field.location}
          </div>
        </div>

        {/* Top Right: Animated Health Ring */}
        <div className="absolute top-3 right-3">
          <HealthRing health={field.health} />
        </div>
      </div>

      {/* Bottom Half: Data Grid */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-card relative z-10">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 bg-muted/30 p-2.5 rounded-xl border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1">
              <Sprout className="w-3 h-3" /> Area
            </span>
            <p className="text-sm font-bold text-foreground font-mono">
              {field.area}
            </p>
          </div>

          <div className="space-y-1 bg-primary/5 p-2.5 rounded-xl border border-primary/10">
            <span className="text-[10px] text-primary/70 uppercase tracking-widest font-semibold flex items-center gap-1">
              <BarChart3 className="w-3 h-3" /> Yield
            </span>
            <p className="text-sm font-bold text-primary font-mono">
              {field.yield}
            </p>
          </div>
        </div>

        {/* Footer Row */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Harvest:</span>{" "}
            {field.harvestDate}
          </div>

          {/* Glass Pill Badge */}
          <span className="px-2.5 py-1 rounded-md bg-secondary text-[10px] font-bold text-foreground uppercase tracking-widest shadow-sm border border-border/50 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
            {field.crop}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 3. MAIN COMPONENT (Repaired!)
// ----------------------------------------------------------------------
export function MyFieldsCard() {
  const t = useTranslation();
  const router = useRouter(); // Upgraded to Next.js App Router

  return (
    <div className="space-y-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight uppercase">
          {t.myFields || "My Fields"}
        </h3>
        <button
          onClick={() => router.push("/farmer/fields")}
          className="text-xs sm:text-sm text-primary font-bold flex items-center gap-0.5 hover:opacity-80 transition-opacity group"
        >
          See All
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* MOBILE-FIRST GRID: 
        Horizontal swipe on mobile (-mx-4 to bleed to edges). 
        2-column grid on tablets/desktop! 
      */}
      <div className="flex sm:grid sm:grid-cols-2 gap-4 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {sampleFields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>
    </div>
  );
}
