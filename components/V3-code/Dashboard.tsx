import { SafetyScoreRing } from "@/components/SafetyScoreRing";
import { SafetyBadge } from "@/components/SafetyBadge";
import { skinTips, products, calculateSafetyScore, amRoutineSteps, pmRoutineSteps, ingredientConflicts } from "@/data/mockData";
import { ArrowRight, Sparkles, Lightbulb, AlertTriangle, Shield, Sun, Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [tipIndex, setTipIndex] = useState(0);

  const safetyScore = useMemo(() => {
    const ids = amRoutineSteps.map(s => s.productId).filter(Boolean) as string[];
    return calculateSafetyScore(ids);
  }, []);

  const activeConflicts = useMemo(() => {
    const conflicts: string[] = [];
    const routineProducts = amRoutineSteps
      .map(s => products.find(p => p.id === s.productId))
      .filter(Boolean);
    for (let i = 0; i < routineProducts.length; i++) {
      for (let j = i + 1; j < routineProducts.length; j++) {
        const a = routineProducts[i]!;
        const b = routineProducts[j]!;
        a.ingredients.forEach(ingA => {
          b.ingredients.forEach(ingB => {
            const entry = ingredientConflicts[ingA.name];
            if (entry?.conflicts.includes(ingB.name)) {
              conflicts.push(`${ingA.name} + ${ingB.name}`);
            }
          });
        });
      }
    }
    return [...new Set(conflicts)];
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTipIndex((i) => (i + 1) % skinTips.length), 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Full-bleed Hero */}
      <div className="relative overflow-hidden h-[55vh] min-h-[400px] md:h-[50vh] md:rounded-b-3xl">
        <img
          src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&h=800&fit=crop"
          alt=""
          className="w-full h-full object-cover animate-gentle-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />

        {/* Greeting overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:pb-12 md:px-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">{getGreeting()}</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mt-1 tracking-tight">Sarah</h1>
              <p className="text-muted-foreground text-sm mt-1.5 font-light">Your molecular skin analysis is ready</p>
            </div>
            <div className="hidden md:block animate-float">
              <SafetyScoreRing score={safetyScore} size={120} strokeWidth={6} />
            </div>
          </div>
        </div>

        {/* Floating environment pills */}
        <div className="absolute top-6 right-6 flex gap-2">
          <span className="glass-strong rounded-full px-3 py-1.5 text-[10px] font-medium flex items-center gap-1.5">
            <Sun size={12} className="text-caution" /> UV 6 — High
          </span>
          <span className="glass-strong rounded-full px-3 py-1.5 text-[10px] font-medium flex items-center gap-1.5">
            <Wind size={12} className="text-muted-foreground" /> AQI 42
          </span>
        </div>
      </div>

      <div className="px-5 md:px-10 -mt-8 space-y-6 relative z-10">
        {/* Staggered: Skin Status (large) + Daily Tip (small) */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="glass-strong rounded-2xl p-6 flex items-center justify-between animate-slide-up flex-1 md:flex-[2]">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-primary" />
                <h2 className="font-display font-semibold text-lg text-foreground">Skin Status</h2>
              </div>
              <SafetyBadge status={safetyScore >= 75 ? "safe" : safetyScore >= 45 ? "caution" : "conflict"} size="lg" />
              <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
                {safetyScore >= 75
                  ? "Your routine is well-balanced with minimal conflicts."
                  : "Some ingredient conflicts detected in your routine."}
              </p>
            </div>
            <div className="md:hidden">
              <SafetyScoreRing score={safetyScore} />
            </div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-3 animate-slide-up flex-1" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2">
              <Lightbulb size={16} className="text-caution" />
              <h3 className="font-display font-semibold text-foreground">Daily Insight</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed transition-all duration-700">
              {skinTips[tipIndex]}
            </p>
          </div>
        </div>

        {/* Proactive Alert */}
        {activeConflicts.length > 0 && (
          <div
            className="glass rounded-2xl p-4 flex items-start gap-3 animate-slide-up border border-conflict/15"
            style={{ animationDelay: "0.15s" }}
          >
            <AlertTriangle size={18} className="text-conflict shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Conflict detected in routine</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeConflicts.slice(0, 2).join(" · ")}
              </p>
            </div>
            <button
              onClick={() => navigate("/conflicts")}
              className="text-[10px] font-semibold text-primary uppercase tracking-wider shrink-0"
            >
              View
            </button>
          </div>
        )}

        {/* AM Routine Carousel */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              <Sun size={16} className="text-caution" /> AM Routine
            </h2>
            <button onClick={() => navigate("/routine")} className="text-xs text-primary font-medium flex items-center gap-1">
              Edit <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
            {amRoutineSteps.map((step, i) => {
              const product = products.find(p => p.id === step.productId);
              if (!product) return null;
              return (
                <div key={step.id} className="relative shrink-0 w-36 md:w-44 group cursor-pointer" style={{ marginLeft: i > 0 ? "-8px" : 0 }}>
                  <div className="rounded-2xl overflow-hidden h-48 md:h-56 relative hover-lift">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <div className="absolute top-2 left-2">
                      <span className="glass-strong rounded-full px-2 py-0.5 text-[9px] font-semibold">Step {step.order}</span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <SafetyBadge status={product.safety} size="sm" showLabel={false} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{step.label}</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5 leading-snug">{product.name}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PM Routine Carousel */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              <Sparkles size={16} className="text-skin-rose" /> PM Routine
            </h2>
            <button onClick={() => navigate("/routine")} className="text-xs text-primary font-medium flex items-center gap-1">
              Edit <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
            {pmRoutineSteps.map((step, i) => {
              const product = products.find(p => p.id === step.productId);
              if (!product) return null;
              return (
                <div key={step.id} className="relative shrink-0 w-36 md:w-44 group cursor-pointer" style={{ marginLeft: i > 0 ? "-8px" : 0 }}>
                  <div className="rounded-2xl overflow-hidden h-48 md:h-56 relative hover-lift">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <div className="absolute top-2 left-2">
                      <span className="glass-strong rounded-full px-2 py-0.5 text-[9px] font-semibold">Step {step.order}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{step.label}</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5 leading-snug">{product.name}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shelf CTA */}
        <button
          onClick={() => navigate("/shelf")}
          className="glass rounded-2xl p-5 w-full flex items-center justify-between hover-lift group animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div>
            <h3 className="font-display font-semibold text-foreground text-left">Your Digital Shelf</h3>
            <p className="text-sm text-muted-foreground">{products.length} products tracked</p>
          </div>
          <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>
    </div>
  );
}
