"use client";

import { useState } from "react";
import { CheckCircle2, Truck, PackageCheck, ChevronDown, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const makeTokens = (isDark: boolean) => isDark ? {
  card:         "rgba(8,18,10,0.65)",
  border:       "rgba(90,158,111,0.15)",
  blur:         "blur(18px)",
  accent:       "#5a9e6f",
  accentDark:   "#2d6a4f",
  accentBg:     "rgba(45,106,79,0.20)",
  accentBorder: "rgba(90,158,111,0.30)",
  textSub:      "rgba(255,255,255,0.45)",
  textLabel:    "rgba(255,255,255,0.38)",
  expandBg:     "rgba(5,14,7,0.70)",
  timelineLine: "rgba(90,158,111,0.20)",
  nodeEmpty:    "rgba(8,18,10,0.90)",
  shadow:       "0 4px 24px rgba(0,0,0,0.35)",
} : {
  card:         "rgba(200,225,255,0.18)",
  border:       "rgba(180,210,255,0.30)",
  blur:         "blur(32px)",
  accent:       "#4ade80",
  accentDark:   "#16a34a",
  accentBg:     "rgba(74,222,128,0.15)",
  accentBorder: "rgba(74,222,128,0.30)",
  textSub:      "rgba(255,255,255,0.75)",
  textLabel:    "rgba(255,255,255,0.52)",
  expandBg:     "rgba(0,10,30,0.20)",
  timelineLine: "rgba(180,210,255,0.25)",
  nodeEmpty:    "rgba(200,225,255,0.12)",
  shadow:       "0 4px 24px rgba(0,10,30,0.25)",
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

export function BuyerOrders({ isDark = true }: { isDark?: boolean }) {
  const G = makeTokens(isDark);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Delivered":
        return { iconBg: G.accentBg, iconColor: G.accent,    badgeBg: G.accentBg,              badgeText: G.accent,    borderLeft: G.accentDark, icon: PackageCheck };
      case "In Transit":
        return { iconBg: G.accentBg, iconColor: "#86efac",   badgeBg: "rgba(74,222,128,0.10)", badgeText: "#86efac",   borderLeft: G.accent,     icon: Truck };
      default:
        return { iconBg: "rgba(234,179,8,0.15)", iconColor: "#fbbf24", badgeBg: "rgba(234,179,8,0.12)", badgeText: "#fbbf24", borderLeft: "#92660a", icon: CheckCircle2 };
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
              background:           G.card,
              backdropFilter:       G.blur,
              WebkitBackdropFilter: G.blur,
              borderTop:            `1px solid ${G.border}`,
              borderRight:          `1px solid ${G.border}`,
              borderBottom:         `1px solid ${G.border}`,
              borderLeft:           `4px solid ${style.borderLeft}`,
              boxShadow:            G.shadow,
            }}
          >
            <div
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: style.iconBg, border: `1px solid ${style.iconColor}35` }}>
                  <Icon className="w-6 h-6" style={{ color: style.iconColor }} />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white">{order.crop}</h3>
                  <p className="text-[11px] font-mono uppercase tracking-widest mt-0.5" style={{ color: G.textLabel }}>
                    {order.id} • {order.qty}q
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="text-lg font-serif font-bold text-white">{order.amount}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-1 rounded-full"
                    style={{ background: style.badgeBg, color: style.badgeText, border: `1px solid ${style.badgeText}35` }}>
                    {order.status}
                  </span>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown className="w-4 h-4" style={{ color: G.textLabel }} />
                  </motion.div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                  style={{ background: G.expandBg, borderTop: `1px solid ${G.border}` }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">Live Tracking</h4>
                      <button className="h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                        style={{ border: `1px solid ${G.accentBorder}`, color: G.accent, background: G.accentBg }}>
                        <FileText className="w-3.5 h-3.5" /> Invoice
                      </button>
                    </div>

                    <div className="relative pl-6 space-y-6">
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 rounded-full"
                        style={{ background: G.timelineLine }} />

                      {trackingSteps.map((step, index) => {
                        const isCompleted = index < order.step;
                        const isCurrent   = index === order.step - 1;
                        return (
                          <div key={index} className="relative flex items-start gap-4">
                            <div
                              className="absolute -left-[30px] w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors"
                              style={{
                                background:  isCurrent ? G.accentDark : G.nodeEmpty,
                                borderColor: isCompleted ? G.accent : "rgba(255,255,255,0.20)",
                                boxShadow:   isCurrent ? "0 0 10px rgba(22,163,74,0.6)" : "none",
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
