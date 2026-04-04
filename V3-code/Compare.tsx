import { products, ingredientConflicts } from "@/data/mockData";
import { ProductCard } from "@/components/ProductCard";
import { SafetyBadge } from "@/components/SafetyBadge";
import { ArrowLeftRight, Check, AlertTriangle, X, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SafetyStatus } from "@/data/mockData";

export default function Compare() {
  const [productA, setProductA] = useState(products[0]);
  const [productB, setProductB] = useState(products[2]);
  const [selectingSlot, setSelectingSlot] = useState<"A" | "B" | null>(null);

  const conflicts: { pair: string; level: "red" | "yellow" }[] = [];
  const overlaps: string[] = [];

  productA.ingredients.forEach((a) => {
    productB.ingredients.forEach((b) => {
      if (a.name === b.name) overlaps.push(a.name);
      const entry = ingredientConflicts[a.name];
      if (entry?.conflicts.includes(b.name)) {
        conflicts.push({ pair: `${a.name} × ${b.name}`, level: entry.level });
      }
    });
  });

  const hasRed = conflicts.some(c => c.level === "red");
  const result: SafetyStatus = hasRed ? "conflict" : conflicts.length > 0 ? "caution" : overlaps.length > 0 ? "caution" : "safe";
  const resultLabels = { safe: "Compatible", caution: "Use With Care", conflict: "Conflict Detected" };
  const resultDescriptions = {
    safe: "These products can be safely layered together.",
    caution: "Some ingredients may reduce each other's effectiveness.",
    conflict: "Direct contraindications found — avoid using together.",
  };
  const resultIcons = { safe: Check, caution: AlertTriangle, conflict: X };
  const ResultIcon = resultIcons[result];

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden md:rounded-b-3xl">
        <img
          src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&h=600&fit=crop"
          alt=""
          className="w-full h-full object-cover animate-gentle-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background" />
        <div className="absolute bottom-0 left-0 px-6 pb-8 md:px-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Compare Products</h1>
          <p className="text-xs text-muted-foreground mt-1">Tap a product to swap</p>
        </div>
      </div>

      <div className="px-5 md:px-10 space-y-5 -mt-6 relative z-10 md:max-w-3xl md:mx-auto">
        {selectingSlot ? (
          <div className="space-y-3 animate-fade-in">
            <p className="text-sm text-muted-foreground">Select product for Slot {selectingSlot}:</p>
            <div className="columns-2 md:columns-3 gap-3 space-y-3">
              {products.map((p) => (
                <div key={p.id} className="break-inside-avoid">
                  <ProductCard
                    product={p}
                    variant="compact"
                    onClick={() => {
                      if (selectingSlot === "A") setProductA(p);
                      else setProductB(p);
                      setSelectingSlot(null);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div onClick={() => setSelectingSlot("A")} className="cursor-pointer">
                <ProductCard product={productA} variant="compact" />
              </div>
              <div onClick={() => setSelectingSlot("B")} className="cursor-pointer">
                <ProductCard product={productB} variant="compact" />
              </div>
            </div>

            <div className="flex justify-center py-1">
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                <ArrowLeftRight size={16} className="text-muted-foreground" />
              </div>
            </div>

            {/* Result Card */}
            <div className={cn(
              "glass-strong rounded-2xl p-6 space-y-5 animate-fade-in-scale",
              result === "safe" && "safety-glow-safe",
              result === "caution" && "safety-glow-caution",
              result === "conflict" && "safety-glow-conflict",
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center",
                  result === "safe" && "bg-safe/15",
                  result === "caution" && "bg-caution/15",
                  result === "conflict" && "bg-conflict/15",
                )}>
                  <ResultIcon size={20} className={cn(
                    result === "safe" && "text-safe-foreground",
                    result === "caution" && "text-caution-foreground",
                    result === "conflict" && "text-conflict-foreground",
                  )} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-semibold text-foreground text-lg">{resultLabels[result]}</h3>
                  <p className="text-xs text-muted-foreground">{resultDescriptions[result]}</p>
                </div>
              </div>

              {conflicts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-conflict-foreground uppercase tracking-[0.15em]">Ingredient Conflicts</p>
                  {conflicts.map((c) => (
                    <div key={c.pair} className={cn(
                      "text-sm rounded-xl px-4 py-2.5 flex items-center gap-2",
                      c.level === "red" ? "bg-conflict/10 text-conflict-foreground" : "bg-caution/10 text-caution-foreground"
                    )}>
                      <Zap size={14} />
                      {c.pair}
                    </div>
                  ))}
                </div>
              )}

              {overlaps.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Shared Ingredients</p>
                  <div className="flex flex-wrap gap-2">
                    {overlaps.map((o) => (
                      <span key={o} className="text-xs bg-champagne rounded-full px-3 py-1 text-foreground font-medium">{o}</span>
                    ))}
                  </div>
                </div>
              )}

              {result === "safe" && conflicts.length === 0 && overlaps.length === 0 && (
                <p className="text-sm text-muted-foreground leading-relaxed">No ingredient conflicts detected. These products complement each other well.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
