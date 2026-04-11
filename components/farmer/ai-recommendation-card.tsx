"use client";

import {
  Sparkles,
  TrendingUp,
  Droplets,
  ThermometerSun,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const recommendations = [
  {
    crop: "Mustard",
    confidence: 92,
    reason:
      "High soil moisture + rising prices make mustard ideal this season.",
    factors: [
      { icon: ThermometerSun, label: "Soil temp optimal", positive: true },
      { icon: Droplets, label: "Good moisture levels", positive: true },
      { icon: TrendingUp, label: "Price up 5.2% this week", positive: true },
    ],
  },
  {
    crop: "Wheat",
    confidence: 78,
    reason: "Stable demand with good weather window for sowing.",
    factors: [
      { icon: ThermometerSun, label: "Temp slightly high", positive: false },
      { icon: TrendingUp, label: "Steady prices", positive: true },
    ],
  },
];

export function AIRecommendationCard() {
  const top = recommendations[0];

  return (
    <Card className="w-full glass-card premium-shadow border-0 overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-300">
      <div className="p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center relative">
            <Sparkles className="w-5 h-5 text-primary relative z-10" />
            <span className="absolute inset-0 bg-primary/20 rounded-xl animate-ping opacity-20" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              AI Crop Recommendation
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Based on local soil, weather & market
            </p>
          </div>
        </div>

        {/* Top Pick Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl p-4 sm:p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Grow {top.crop}
              </span>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-agri-success/15 text-agri-success border border-agri-success/20">
                <Sparkles className="w-3 h-3" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  {top.confidence}% Match
                </span>
              </div>
            </div>
            <button className="hidden sm:flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
              Full Analysis <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-2xl">
            {top.reason}
          </p>

          {/* Staggered Factors */}
          <div className="flex flex-wrap gap-2 pt-1">
            {top.factors.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border",
                  f.positive
                    ? "bg-agri-success/5 text-agri-success border-agri-success/15"
                    : "bg-destructive/5 text-destructive border-destructive/15",
                )}
              >
                {f.positive ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                {f.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Secondary Suggestions */}
        <div className="pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
            Other Viable Options
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.slice(1).map((rec, i) => (
              <motion.div
                key={rec.crop}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-foreground">
                    {rec.crop}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    {rec.confidence}% match
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
