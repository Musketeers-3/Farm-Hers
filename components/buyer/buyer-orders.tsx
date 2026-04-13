"use client";

import { useState } from "react";
import { CheckCircle2, Truck, PackageCheck, ChevronDown, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ CHANGE: Shared paddy green token set — mirrors buyer-pools.tsx
const G = {
  card:         "rgba(8,18,10,0.65)",
  blur:         "blur(18px)",
  border:       "rgba(90,158,111,0.15)",
  accent:       "#5a9e6f",
  accentDark:   "#2d6a4f",
  accentBg:     "rgba(45,106,79,0.2)",
  accentBorder: "rgba(90,158,111,0.3)",
  textSub:      "rgba(255,255,255,0.4)",
};

const mockOrders = [
  { id: "ORD001", crop: "Premium Wheat",  qty: 200, status: "Delivered",  date: "28 Mar 2026", amount: "₹4.70L", step: 4 },
  { id: "ORD002", crop: "Basmati Rice",   qty: 150, status: "In Transit", date: "10 Apr 2026", amount: "₹5.70L", step: 3 },
  { id: "ORD003", crop: "Yellow Mustard", qty: 100, status: "Processing", date: "12 Apr 2026", amount: "₹5.20L", step: 1 },
];

const trackingSteps = [
  { label: "Contract Signed",  desc: "Escrow funded securely" },
  { label: "Processing",       desc: "Farmer preparing dispatch" },
  { label: "In Transit",       desc: "Logistics partner assigned" },
  { label: "Quality Verified", desc: "Cleared at weighing bridge" },
];

export function BuyerOrders() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ✅ CHANGE: all status styles now use paddy green palette; no more bg-agri-* classes
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Delivered":
        return {
          iconBg:     G.accentBg,
          iconColor:  G.accent,
          badgeBg:    G.accentBg,
          badgeText:  G.accent,
          borderLeft: G.accentDark,
          icon: PackageCheck,
        };
      case "In Transit":
        return {
          iconBg:     "rgba(45,106,79,0.15)",
          iconColor:  "#86c49a",
          badgeBg:    "rgba(45,106,79,0.15)",
          badgeText:  "#86c49a",
          borderLeft: G.accent,
          icon: Truck,
        };
      default: // Processing
        return {
          iconBg:     "rgba(180,130,40,0.2)",
          iconColor:  "#c9a84c",
          badgeBg:    "rgba(180,130,40,0.15)",
          badgeText:  "#c9a84c",
          borderLeft: "#8a6820",
          icon: CheckCircle2,
        };
    }
  };

  return (
    <div className="space-y-4">
      {mockOrders.map((order) => {
        const style      = getStatusStyle(order.status);
        const isExpanded = expandedId === order.id;
        const Icon       = style.icon;

        return (
          <motion.div
            layout
            key={order.id}
            className="rounded-2xl overflow-hidden"
            style={{
              // ✅ CHANGE: dark glass card with paddy green left border accent
              background:           G.card,
              backdropFilter:       G.blur,
              WebkitBackdropFilter: G.blur,
              border:               `1px solid ${G.border}`,
              borderLeft:           `4px solid ${style.borderLeft}`,
              boxShadow:            "0 4px 24px rgba(0,0,0,0.35)",
            }}
          >
            {/* Summary row */}
            <div
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
            >
              <div className="flex items-center gap-4">
                {/* ✅ CHANGE: icon box dark tinted */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: style.iconBg, border: `1px solid ${style.iconColor}30` }}>
                  <Icon className="w-6 h-6" style={{ color: style.iconColor }} />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white">{order.crop}</h3>
                  <p className="text-[11px] font-mono uppercase tracking-widest mt-0.5" style={{ color: G.textSub }}>
                    {order.id} • {order.qty}q
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="text-lg font-serif font-bold text-white">{order.amount}</p>
                <div className="flex items-center gap-2">
                  {/* ✅ CHANGE: status badge dark glass */}
                  <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-1 rounded-full"
                    style={{ background: style.badgeBg, color: style.badgeText, border: `1px solid ${style.badgeText}40` }}>
                    {order.status}
                  </span>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown className="w-4 h-4" style={{ color: G.textSub }} />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Expanded tracking */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                  style={{ background: "rgba(5,14,7,0.7)", borderTop: `1px solid ${G.accentBorder}` }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">Live Tracking</h4>
                      {/* ✅ CHANGE: invoice button paddy green outline */}
                      <button className="h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                        style={{ border: `1px solid ${G.accentBorder}`, color: G.accent, background: G.accentBg }}>
                        <FileText className="w-3.5 h-3.5" /> Invoice
                      </button>
                    </div>

                    <div className="relative pl-6 space-y-6">
                      {/* ✅ CHANGE: timeline line paddy green tint */}
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 rounded-full"
                        style={{ background: "rgba(90,158,111,0.2)" }} />

                      {trackingSteps.map((step, index) => {
                        const isCompleted = index < order.step;
                        const isCurrent   = index === order.step - 1;

                        return (
                          <div key={index} className="relative flex items-start gap-4">
                            {/* ✅ CHANGE: timeline node paddy green for completed/current */}
                            <div
                              className="absolute -left-[30px] w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors"
                              style={{
                                background:  isCurrent ? G.accentDark : "rgba(8,18,10,0.9)",
                                borderColor: isCompleted ? G.accent : "rgba(255,255,255,0.15)",
                                boxShadow:   isCurrent ? "0 0 10px rgba(45,106,79,0.6)" : "none",
                              }}
                            >
                              {isCompleted && !isCurrent && (
                                <div className="w-2 h-2 rounded-full" style={{ background: G.accent }} />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold" style={{ color: isCompleted ? "white" : "rgba(255,255,255,0.35)" }}>
                                {step.label}
                              </p>
                              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
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