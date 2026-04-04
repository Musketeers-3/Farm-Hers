import { amRoutineSteps, pmRoutineSteps, products, calculateSafetyScore } from "@/data/mockData";
import { SafetyBadge } from "@/components/SafetyBadge";
import { SafetyScoreRing } from "@/components/SafetyScoreRing";
import { Droplets, FlaskRound, Sparkles, Cloud, Sun, ArrowDownUp, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SafetyStatus, RoutineStep } from "@/data/mockData";
import { useMemo, useState } from "react";

const stepIcons: Record<string, React.ElementType> = {
  droplets: Droplets,
  "flask-round": FlaskRound,
  sparkles: Sparkles,
  cloud: Cloud,
  sun: Sun,
};

const connectorColors: Record<SafetyStatus, string> = {
  safe: "bg-safe",
  caution: "bg-caution",
  conflict: "bg-conflict",
};

const connectorGlow: Record<SafetyStatus, string> = {
  safe: "shadow-[0_0_10px_hsl(145,30%,62%,0.35)]",
  caution: "shadow-[0_0_10px_hsl(38,65%,68%,0.35)]",
  conflict: "shadow-[0_0_10px_hsl(0,50%,65%,0.35)]",
};

export default function Routine() {
  const [period, setPeriod] = useState<"am" | "pm">("am");
  const steps = period === "am" ? amRoutineSteps : pmRoutineSteps;

  const safetyScore = useMemo(() => {
    const ids = steps.map(s => s.productId).filter(Boolean) as string[];
    return calculateSafetyScore(ids);
  }, [steps]);

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden md:rounded-b-3xl">
        <img
          src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&h=600&fit=crop"
          alt=""
          className="w-full h-full object-cover animate-gentle-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-10 flex items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Routine Sequencer</h1>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowDownUp size={12} /> Optimized by pH & texture
            </p>
          </div>
          <SafetyScoreRing score={safetyScore} size={80} strokeWidth={5} />
        </div>

        {/* Floating AM/PM toggle */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-10">
          <div className="glass-strong rounded-full p-1 flex gap-1 shadow-lg">
            <button
              onClick={() => setPeriod("am")}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-semibold transition-all duration-300",
                period === "am" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sun size={12} className="inline mr-1.5" /> AM
            </button>
            <button
              onClick={() => setPeriod("pm")}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-semibold transition-all duration-300",
                period === "pm" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles size={12} className="inline mr-1.5" /> PM
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 md:px-10 space-y-4 mt-10">
        {/* Auto-sort button */}
        <div className="flex justify-end">
          <button className="glass rounded-full px-4 py-1.5 text-[10px] font-semibold text-primary flex items-center gap-1.5 hover-lift">
            <ArrowDownUp size={12} /> Auto-Sort
          </button>
        </div>

        {/* Timeline */}
        <div className="relative space-y-0 md:max-w-2xl md:mx-auto">
          {steps.map((step, index) => {
            const product = products.find((p) => p.id === step.productId);
            const Icon = stepIcons[step.icon] || Sparkles;

            return (
              <div key={step.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.08}s` }}>
                {/* Connector with wait time */}
                {step.connectionSafety && (
                  <div className="flex items-center justify-center py-1 relative">
                    <div className={cn(
                      "w-0.5 h-10 rounded-full transition-all duration-500",
                      connectorColors[step.connectionSafety],
                      connectorGlow[step.connectionSafety],
                      step.connectionSafety === "safe" && "animate-breathe",
                      step.connectionSafety === "conflict" && "animate-pulse-warning",
                    )} />
                    {step.waitTime && (
                      <span className="absolute left-1/2 ml-4 glass-strong rounded-full px-2.5 py-0.5 text-[9px] font-medium text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                        <Clock size={9} /> {step.waitTime}
                      </span>
                    )}
                  </div>
                )}

                {/* Step Card — image-first */}
                <div className={cn(
                  "glass rounded-2xl overflow-hidden hover-lift group",
                  step.connectionSafety === "conflict" && "border-conflict/25 ring-1 ring-conflict/10",
                )}>
                  <div className="flex">
                    {/* Product image */}
                    {product && (
                      <div className="w-24 md:w-32 shrink-0 relative overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30" />
                      </div>
                    )}
                    <div className="p-4 flex-1 flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        "bg-gradient-to-br from-champagne to-skin-pink"
                      )}>
                        <Icon size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.15em]">
                          Step {step.order} · {step.label}
                        </p>
                        {product ? (
                          <div className="flex items-center gap-2 mt-1">
                            <p className="font-semibold text-foreground text-sm truncate">{product.name}</p>
                            <SafetyBadge status={product.safety} size="sm" showLabel={false} />
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic mt-1">Tap to assign product</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timing Guide */}
        <div className="glass rounded-2xl p-5 space-y-3 animate-slide-up md:max-w-2xl md:mx-auto" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-2">
            <Info size={14} className="text-primary" />
            <h3 className="font-display font-semibold text-foreground">Timing Guide</h3>
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Wait 1-2 minutes between active serums for full absorption</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Apply SPF as the final step, at least 15 min before sun exposure</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Thinnest → thickest consistency ensures maximum penetration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
