"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  MapPin,
  Users,
  Star,
  Clock,
  Flame,
  Package,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data (To be replaced by Zustand store)
const farmerPools = [
  {
    id: "1",
    crop: "Wheat",
    availableQty: 500,
    pricePerQuintal: 2350,
    location: "Ludhiana, Punjab",
    farmersCount: 24,
    quality: "Premium",
    rating: 4.8,
    isHot: true,
    expiresIn: "2h 30m",
  },
  {
    id: "2",
    crop: "Mustard",
    availableQty: 320,
    pricePerQuintal: 5200,
    location: "Alwar, Rajasthan",
    farmersCount: 18,
    quality: "Standard",
    rating: 4.5,
    isHot: false,
    expiresIn: "5h 15m",
  },
  {
    id: "3",
    crop: "Rice (Basmati)",
    availableQty: 750,
    pricePerQuintal: 3800,
    location: "Karnal, Haryana",
    farmersCount: 32,
    quality: "Premium",
    rating: 4.9,
    isHot: true,
    expiresIn: "1h 45m",
  },
];

export function BuyerPools() {
  const [activePoolId, setActivePoolId] = useState<string | null>(null);
  const [selectedQty, setSelectedQty] = useState<number>(0);

  const getCropEmoji = (crop: string) => {
    if (crop.includes("Wheat")) return "🌾";
    if (crop.includes("Basmati")) return "🍚";
    if (crop.includes("Mustard")) return "🌻";
    return "🌱";
  };

  const getQualityStyle = (quality: string) => {
    switch (quality) {
      case "Premium":
        return "bg-agri-gold/15 text-agri-earth border-agri-gold/30";
      case "Standard":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  // Handle opening a pool card and resetting the slider
  const togglePool = (poolId: string, maxQty: number) => {
    if (activePoolId === poolId) {
      setActivePoolId(null);
    } else {
      setActivePoolId(poolId);
      setSelectedQty(Math.floor(maxQty * 0.25)); // Default to 25% of available pool
    }
  };

  return (
    <div className="space-y-4">
      {farmerPools.map((pool, i) => {
        const isActive = activePoolId === pool.id;
        const totalValue = (selectedQty * pool.pricePerQuintal) / 100000; // Convert to Lakhs

        return (
          <motion.div
            layout
            key={pool.id}
            className="glass-card rounded-2xl overflow-hidden premium-shadow transition-all border border-border/50 hover:border-primary/30"
          >
            {/* The Main Card (Always Visible) */}
            <div
              className="p-4 sm:p-5 cursor-pointer hover:bg-secondary/10 transition-colors"
              onClick={() => togglePool(pool.id, pool.availableQty)}
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-secondary flex items-center justify-center text-2xl sm:text-3xl shrink-0">
                  {getCropEmoji(pool.crop)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-base sm:text-lg">
                          {pool.crop}
                        </h3>
                        {pool.isHot && (
                          <Badge className="bg-destructive/10 text-destructive border-0 text-[10px] gap-0.5 px-1.5 py-0.5 uppercase tracking-wider font-bold">
                            <Flame className="w-3 h-3" /> Hot Pool
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-primary/70" />
                        <span>{pool.location}</span>
                      </div>
                    </div>
                    <Badge
                      className={`${getQualityStyle(pool.quality)} border text-[10px] font-bold`}
                    >
                      {pool.quality}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2">
                    <div className="bg-secondary/60 rounded-xl p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">
                        Available
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {pool.availableQty}q
                      </p>
                    </div>
                    <div className="bg-secondary/60 rounded-xl p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">
                        Price
                      </p>
                      <p className="text-sm font-bold text-primary">
                        ₹{pool.pricePerQuintal}/q
                      </p>
                    </div>
                    <div className="bg-secondary/60 rounded-xl p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">
                        Farmers
                      </p>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">
                          {pool.farmersCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsed State Footer */}
              {!isActive && (
                <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-agri-gold fill-agri-gold" />
                      <span className="text-xs font-bold text-foreground">
                        {pool.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Closes in {pool.expiresIn}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary font-semibold hover:bg-primary/10"
                  >
                    Procure <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>

            {/* EXPANDABLE PROCUREMENT DRAWER */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-primary/5 border-t border-primary/20"
                >
                  <div className="p-5 space-y-5">
                    {/* Trust Banner */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border/50 text-xs text-muted-foreground font-medium">
                      <ShieldCheck className="w-4 h-4 text-agri-success" />
                      <p>
                        Funds held in 100% secure escrow until quality
                        verification.
                      </p>
                    </div>

                    {/* Volume Slider */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-foreground">
                          Select Procurement Volume
                        </label>
                        <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                          {selectedQty} / {pool.availableQty}q
                        </span>
                      </div>

                      {/* Note: Ensure you have the Shadcn UI Slider component installed! */}
                      <Slider
                        defaultValue={[selectedQty]}
                        max={pool.availableQty}
                        step={10}
                        className="w-full py-2"
                        onValueChange={(val) => setSelectedQty(val[0])}
                      />

                      <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                        <span>Min: 10q</span>
                        <span>Max: {pool.availableQty}q</span>
                      </div>
                    </div>

                    {/* Checkout Footer */}
                    <div className="pt-4 border-t border-primary/10 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
                          Total Value
                        </p>
                        <p className="text-2xl font-serif font-bold text-foreground">
                          ₹{totalValue.toFixed(2)}
                          <span className="text-base text-muted-foreground">
                            L
                          </span>
                        </p>
                      </div>

                      <Button className="h-12 px-6 bg-primary text-white font-bold text-base hover:shadow-lg hover:shadow-primary/30 transition-all rounded-xl">
                        <Package className="w-5 h-5 mr-2" />
                        Initiate Contract
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
