import { motion } from "framer-motion";
import { Package, Users, Gavel, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MethodSelectionProps {
  sellMethod: "direct" | "pool" | "auction" | null;
  onMethodSelect: (method: "direct" | "pool" | "auction") => void;
  hasPool: boolean;
  poolBonus: number;
  t: any;
}

export function MethodSelection({
  sellMethod,
  onMethodSelect,
  hasPool,
  poolBonus,
  t,
}: MethodSelectionProps) {
  const methods = [
    {
      id: "direct" as const,
      icon: Package,
      title: "Direct Sell",
      desc: "Sell immediately at current market rate",
      badge: null,
    },
    {
      id: "pool" as const,
      icon: Users,
      title: t.joinPool || "Join Pool",
      desc: "Combine with neighbors for better rates",
      badge: hasPool ? `+₹${poolBonus}/q Bonus` : "Create New Pool",
      highlight: true,
    },
    {
      id: "auction" as const,
      icon: Gavel,
      title: t.startAuction || "Start Auction",
      desc: "Let buyers compete for your produce",
      badge: "Max Profit",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground tracking-tight">
        How do you want to sell?
      </h2>
      <div className="space-y-4">
        {methods.map((method) => {
          const isSelected = sellMethod === method.id;
          return (
            <motion.button
              key={method.id}
              onClick={() => onMethodSelect(method.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full p-5 sm:p-6 rounded-3xl text-left transition-all duration-300 relative overflow-hidden group",
                isSelected
                  ? "bg-primary/5 border-2 border-primary shadow-md"
                  : "bg-card border-2 border-border/50 hover:border-primary/30 premium-shadow",
              )}
            >
              {method.highlight && !isSelected && (
                <div className="absolute inset-0 bg-agri-gold/5 pointer-events-none" />
              )}
              <div className="flex items-start gap-4 sm:gap-5 relative z-10">
                <div
                  className={cn(
                    "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-secondary text-muted-foreground group-hover:text-primary group-hover:bg-primary/10",
                  )}
                >
                  <method.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3
                      className={cn(
                        "text-lg font-bold truncate",
                        isSelected ? "text-primary" : "text-foreground",
                      )}
                    >
                      {method.title}
                    </h3>
                    {method.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                          method.id === "pool"
                            ? "bg-agri-gold/20 text-agri-earth"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground pr-4 leading-snug">
                    {method.desc}
                  </p>
                </div>
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-2 transition-all",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30",
                  )}
                >
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
