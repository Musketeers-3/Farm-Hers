import { products, ingredientConflicts } from "@/data/mockData";
import { SafetyBadge } from "@/components/SafetyBadge";
import { AlertOctagon, Check, AlertTriangle, X, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const conflictExamples = [
  {
    pair: "Retinol × Glycolic Acid",
    level: "red" as const,
    severity: "HIGH",
    explanation: "Both accelerate cell turnover. Together they can cause severe irritation, redness, and compromised barrier function.",
    fix: "Alternate nights: AHA on Day 1, Retinol on Day 2. Never layer in the same routine.",
  },
  {
    pair: "Vitamin C × Retinol",
    level: "red" as const,
    severity: "HIGH",
    explanation: "Vitamin C works at low pH; Retinol at higher pH. Combined, neither performs optimally and irritation risk spikes.",
    fix: "Use Vitamin C in AM routine and Retinol in PM routine.",
  },
  {
    pair: "Vitamin C × Niacinamide",
    level: "yellow" as const,
    severity: "MEDIUM",
    explanation: "Older research suggested conflict; modern formulations show they can coexist. Efficacy may reduce slightly.",
    fix: "Apply Vitamin C first, wait 1-2 minutes, then Niacinamide. Or use in separate routines.",
  },
  {
    pair: "Salicylic Acid × Glycolic Acid",
    level: "red" as const,
    severity: "HIGH",
    explanation: "Both are exfoliants. Layering doubles the exfoliation intensity, risking chemical burns and barrier damage.",
    fix: "Choose one exfoliant per routine. Use BHA for oily/acne skin, AHA for texture/dullness.",
  },
];

export default function Conflicts() {
  // Build compatibility matrix from shelf products
  const matrix = useMemo(() => {
    const results: { a: string; b: string; status: "safe" | "caution" | "conflict" }[] = [];
    for (let i = 0; i < products.length; i++) {
      for (let j = i + 1; j < products.length; j++) {
        let hasRed = false;
        let hasYellow = false;
        products[i].ingredients.forEach(ingA => {
          products[j].ingredients.forEach(ingB => {
            const entry = ingredientConflicts[ingA.name];
            if (entry?.conflicts.includes(ingB.name)) {
              if (entry.level === "red") hasRed = true;
              else hasYellow = true;
            }
          });
        });
        results.push({
          a: products[i].name,
          b: products[j].name,
          status: hasRed ? "conflict" : hasYellow ? "caution" : "safe",
        });
      }
    }
    return results;
  }, []);

  const conflictCount = matrix.filter(m => m.status === "conflict").length;
  const cautionCount = matrix.filter(m => m.status === "caution").length;

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden md:rounded-b-3xl">
        <img
          src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200&h=600&fit=crop"
          alt=""
          className="w-full h-full object-cover animate-gentle-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Ingredient Conflicts</h1>
          <p className="text-xs text-muted-foreground mt-1">Molecular compatibility analysis of your shelf</p>
        </div>
      </div>

      <div className="px-5 md:px-10 -mt-6 space-y-6 relative z-10">
        {/* Status summary floating card */}
        <div className="glass-strong rounded-2xl p-5 flex items-center gap-4 animate-slide-up">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
            conflictCount > 0 ? "bg-conflict/15" : "bg-safe/15"
          )}>
            {conflictCount > 0
              ? <AlertOctagon size={24} className="text-conflict" />
              : <Shield size={24} className="text-safe" />
            }
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-foreground">
              {conflictCount > 0 ? `${conflictCount} Conflicts Detected` : "No Conflicts Found"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {cautionCount > 0 ? `${cautionCount} caution-level interactions · ` : ""}
              {products.length} products analyzed
            </p>
          </div>
        </div>

        {/* Compatibility Matrix */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-display font-semibold text-foreground text-lg px-1">Compatibility Matrix</h2>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="p-3 text-left text-muted-foreground font-medium">Product Pair</th>
                    <th className="p-3 text-center text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((m, i) => (
                    <tr key={i} className="border-t border-border/20">
                      <td className="p-3">
                        <span className="text-foreground font-medium">{m.a.split(' ').slice(0, 3).join(' ')}</span>
                        <span className="text-muted-foreground mx-2">×</span>
                        <span className="text-foreground font-medium">{m.b.split(' ').slice(0, 3).join(' ')}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={cn(
                          "inline-block w-3 h-3 rounded-full",
                          m.status === "safe" && "bg-safe",
                          m.status === "caution" && "bg-caution",
                          m.status === "conflict" && "bg-conflict animate-pulse-warning",
                        )} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Common Conflict Examples — Staggered cards */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="font-display font-semibold text-foreground text-lg px-1">Common Conflicts Database</h2>
          <div className="space-y-4">
            {conflictExamples.map((item, i) => (
              <div
                key={item.pair}
                className={cn(
                  "glass rounded-2xl p-5 space-y-3 hover-lift",
                  i % 2 === 0 ? "md:ml-0 md:mr-12" : "md:ml-12 md:mr-0",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className={item.level === "red" ? "text-conflict" : "text-caution"} />
                    <h3 className="font-semibold text-foreground text-sm">{item.pair}</h3>
                  </div>
                  <span className={cn(
                    "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                    item.level === "red" ? "bg-conflict/15 text-conflict" : "bg-caution/15 text-caution"
                  )}>
                    {item.severity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.explanation}</p>
                <div className="flex items-start gap-2 bg-safe/8 rounded-xl p-3 border border-safe/15">
                  <Check size={12} className="text-safe shrink-0 mt-0.5" />
                  <p className="text-[11px] text-foreground">{item.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
