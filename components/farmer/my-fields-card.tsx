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
 
// ── Health Ring: UI from file 5 (white/90 bg, shadow-md, #166534 stroke) ──
function HealthRing({ health }: { health: number }) {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (health / 100) * circumference;
 
  // Color logic from file 6
  const strokeColor =
    health >= 90 ? "#166534" : health >= 75 ? "#ca8a04" : "#dc2626";
 
  return (
    <div className="relative flex items-center justify-center bg-white/90 rounded-xl p-1.5 shadow-md">
      <svg className="w-10 h-10 transform -rotate-90">
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-slate-100"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="20"
          cy="20"
          r={radius}
          stroke={strokeColor}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-black text-slate-950">{health}</span>
      </div>
    </div>
  );
}
 
// ── Field Card: UI from file 5 + interactions from file 6 ──
function FieldCard({ field }: { field: Field }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="min-w-[280px] w-full sm:min-w-0 bg-[#f0fdf4] rounded-3xl overflow-hidden shadow-lg flex flex-col relative border-none cursor-pointer group"
    >
      <div className="relative h-32 sm:h-36 overflow-hidden">
        <Image
          src={field.image}
          alt={field.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#166534]/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 right-3">
          <h4 className="text-white font-black text-lg drop-shadow-md">{field.name}</h4>
          <div className="flex items-center gap-1.5 text-white/90 font-bold text-xs">
            <MapPin className="w-3.5 h-3.5" strokeWidth={3} />
            {field.location}
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <HealthRing health={field.health} />
        </div>
      </div>
 
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 p-2.5 rounded-xl">
            <span className="text-[10px] text-green-950 uppercase font-black flex items-center gap-1">
              <Sprout className="w-3 h-3" /> Area
            </span>
            <p className="text-sm font-bold text-slate-950">{field.area}</p>
          </div>
          <div className="bg-white/60 p-2.5 rounded-xl">
            <span className="text-[10px] text-green-950 uppercase font-black flex items-center gap-1">
              <BarChart3 className="w-3 h-3" /> Yield
            </span>
            <p className="text-sm font-bold text-green-900">{field.yield}</p>
          </div>
        </div>
 
        {/* Footer Row: "Harvest:" label from file 6, pill hover from file 6 */}
        <div className="flex items-center justify-between pt-4 mt-4">
          <div className="flex items-center gap-1.5 text-xs font-black text-green-950/70">
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Harvest:</span>{" "}
            {field.harvestDate}
          </div>
          <span className="px-3 py-1 rounded-full bg-green-800 text-[10px] font-black text-white uppercase tracking-wider shadow-sm group-hover:bg-[#14532d] transition-colors">
            {field.crop}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
 
export function MyFieldsCard() {
  const t = useTranslation();
  const router = useRouter();
 
  return (
    <div className="relative space-y-4 w-full p-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm sm:text-base font-black text-slate-950 tracking-tight uppercase">
          {t.myFields || "My Fields"}
        </h3>
        <button
          onClick={() => router.push("/farmer/fields")}
          className="text-xs sm:text-sm text-green-900 font-black flex items-center gap-0.5 hover:opacity-70 transition-opacity group"
        >
          See All{" "}
          <ChevronRight
            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
            strokeWidth={3}
          />
        </button>
      </div>
 
      {/* Mobile bleed scroll from file 6, grid on desktop */}
      <div className="flex sm:grid sm:grid-cols-2 gap-4 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {sampleFields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>
    </div>
  );
}