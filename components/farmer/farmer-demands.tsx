"use client";
import React, { useState, useEffect } from "react";
import {
  Package,
  Users,
  Calendar,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Building2,
  Leaf,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/lib/store";
import type { Demand } from "@/types/demand";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<
  string,
  { colorClass: string; bgClass: string; borderClass: string }
> = {
  open: {
    colorClass: "text-[#15803d] dark:text-emerald-400",
    bgClass: "bg-[rgba(34,197,94,0.15)] dark:bg-emerald-500/15",
    borderClass: "border-[rgba(34,197,94,0.35)] dark:border-emerald-400/25",
  },
  filled: {
    colorClass: "text-amber-700 dark:text-amber-400",
    bgClass: "bg-amber-500/10 dark:bg-amber-500/15",
    borderClass: "border-amber-500/25 dark:border-amber-400/25",
  },
  contracted: {
    colorClass: "text-blue-700 dark:text-blue-400",
    bgClass: "bg-blue-500/10 dark:bg-blue-500/15",
    borderClass: "border-blue-500/25 dark:border-blue-400/25",
  },
  expired: {
    colorClass: "text-red-700 dark:text-red-400",
    bgClass: "bg-red-500/10 dark:bg-red-500/15",
    borderClass: "border-red-500/25 dark:border-red-400/25",
  },
};

const STATUS_BAR: Record<string, string> = {
  open: "from-[#22c55e] to-[#10b981]",
  filled: "from-amber-500 to-amber-400",
  contracted: "from-blue-600 to-blue-500",
  expired: "from-red-600 to-red-500",
};

// 🚀 DEMO-DAY FALLBACK DATA
const DEMO_DEMANDS: Demand[] = [
  {
    id: "demo-corp-1",
    buyerId: "itc-agri",
    cropId: "wheat",
    targetQuantity: 500,
    filledQuantity: 320,
    pricePerQuintal: 2450,
    bonusPerQuintal: 150,
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    status: "open",
    contributors: 14,
    createdAt: new Date().toISOString(),
    members: [],
  },
  {
    id: "demo-corp-2",
    buyerId: "reliance-retail",
    cropId: "mustard",
    targetQuantity: 200,
    filledQuantity: 185,
    pricePerQuintal: 5400,
    bonusPerQuintal: 200,
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: "open",
    contributors: 8,
    createdAt: new Date().toISOString(),
    members: [],
  },
];

export function FarmerDemands() {
  const crops = useAppStore((s) => s.crops);
  const addTransaction = useAppStore((s) => s.addTransaction);

  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedQty, setSelectedQty] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [joinError, setJoinError] = useState<string | null>(null);

  const fetchDemands = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/demands?status=open");
      if (!res.ok) throw new Error("Failed to fetch demands");
      const data = await res.json();

      if (!data.demands || data.demands.length === 0) {
        setDemands(DEMO_DEMANDS);
      } else {
        setDemands(data.demands);
      }
    } catch (err: any) {
      console.warn("API failed, using demo data for presentation.");
      setDemands(DEMO_DEMANDS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemands();
  }, []);

  const toggleDemand = (demandId: string, remaining: number) => {
    if (activeId === demandId) {
      setActiveId(null);
      return;
    }
    setActiveId(demandId);
    setSelectedQty(Math.min(50, Math.max(10, Math.floor(remaining * 0.1))));
    setJoinError(null);
  };

  const handleJoin = async (
    demandId: string,
    pricePerQuintal: number,
    bonusPerQuintal: number,
  ) => {
    setIsProcessing(true);
    setJoinError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const demandToJoin = demands.find((d) => d.id === demandId);
      const cropInfo = crops.find((c) => c.id === demandToJoin?.cropId);

      addTransaction({
        id: `CNT-${Math.floor(Math.random() * 10000)}`,
        crop: cropInfo?.name || demandToJoin?.cropId || "Contract",
        qty: `${selectedQty}q`,
        amount: selectedQty * (pricePerQuintal + bonusPerQuintal),
        date: new Date().toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: "pending",
      });

      setDemands((prev) =>
        prev.map((d) =>
          d.id === demandId
            ? {
                ...d,
                filledQuantity: d.filledQuantity + selectedQty,
                contributors: d.contributors + 1,
              }
            : d,
        ),
      );
      setJoinedIds((prev) => new Set([...prev, demandId]));
      setActiveId(null);
    } catch (err: any) {
      setJoinError("Failed to verify transaction. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#16a34a] dark:text-emerald-400" />
        <p className="text-sm font-bold tracking-widest uppercase text-[#15803d]/60 dark:text-white/40">
          Syncing Markets...
        </p>
      </div>
    );

  return (
    <div className="space-y-5 pb-8 px-4 sm:px-6 pt-4 relative z-10">
      <div className="mb-4">
        <h2 className="text-2xl font-black text-[#14532d] dark:text-white tracking-tight flex items-center gap-2">
          <Building2 className="w-6 h-6 text-[#16a34a] dark:text-emerald-500" />
          Corporate Demands
        </h2>
        <p className="text-xs mt-1 font-bold tracking-wide uppercase text-[#14532d]/60 dark:text-slate-400 flex items-center gap-1">
          <Leaf className="w-3 h-3 text-[#16a34a] dark:text-emerald-500" />{" "}
          High-yield premium contracts
        </p>
      </div>

      {demands.map((demand, index) => {
        const crop = crops.find((c) => c.id === demand.cropId);
        const remaining = demand.targetQuantity - demand.filledQuantity;
        const fillPct = Math.min(
          100,
          Math.round((demand.filledQuantity / demand.targetQuantity) * 100),
        );
        const daysLeft = Math.ceil(
          (new Date(demand.deadline).getTime() - Date.now()) / 86400000,
        );
        const isActive = activeId === demand.id;
        const isJoined = joinedIds.has(demand.id);
        const s = STATUS_STYLE[demand.status] || STATUS_STYLE.open;
        const barGrad = STATUS_BAR[demand.status] || STATUS_BAR.open;
        const totalEarning =
          selectedQty * (demand.pricePerQuintal + demand.bonusPerQuintal);

        return (
          <motion.div
            key={demand.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className={cn(
              "relative overflow-hidden rounded-[24px] sm:rounded-[32px] border-0 transition-all duration-500 group",
              /* Light mode: soft green gradient matching AI card */
              "bg-gradient-to-br from-[#e8f5e9] via-[#f0fdf4] to-[#d1fae5]",
              /* Dark mode: glass panel */
              "dark:bg-none dark:bg-white/[0.06] dark:backdrop-blur-xl dark:border dark:border-white/[0.09]",
              isActive
                ? "ring-2 ring-[#22c55e]/50 dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
                : "hover:-translate-y-1 hover:shadow-xl dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]",
            )}
            style={{
              boxShadow: isActive
                ? "0 12px 40px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.9)"
                : "0 8px 32px rgba(34,197,94,0.15), 0 2px 8px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            {/* ⚡ Background SVG Waves */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
              <svg
                viewBox="0 0 900 340"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full opacity-[0.22] dark:opacity-[0.07]"
              >
                <defs>
                  <linearGradient
                    id={`waveGrad-${demand.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <path
                  d="M-50 220 C150 80, 350 320, 550 160 C700 40, 820 200, 960 130"
                  fill="none"
                  stroke={`url(#waveGrad-${demand.id})`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {[6, 12, 18, 24, 30, 36, 42, 48].map((offset, i) => (
                  <path
                    key={i}
                    d={`M-50 ${220 + offset} C150 ${80 + offset}, 350 ${320 + offset}, 550 ${160 + offset} C700 ${40 + offset}, 820 ${200 + offset}, 960 ${130 + offset}`}
                    fill="none"
                    stroke={`url(#waveGrad-${demand.id})`}
                    strokeWidth={i < 4 ? 1.2 : 0.7}
                    strokeLinecap="round"
                    style={{ opacity: 1 - i * 0.08 }}
                  />
                ))}
              </svg>
            </div>

            {/* ⚡ Light mode glow blobs */}
            <div
              className="absolute top-0 right-0 pointer-events-none dark:opacity-0 transition-opacity duration-500 group-hover:opacity-70"
              style={{
                width: 220,
                height: 220,
                background:
                  "radial-gradient(circle, rgba(134,239,172,0.45) 0%, transparent 70%)",
                borderRadius: "50%",
                transform: "translate(60px, -60px)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 pointer-events-none dark:opacity-0 transition-opacity duration-500 group-hover:opacity-70"
              style={{
                width: 180,
                height: 180,
                background:
                  "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)",
                borderRadius: "50%",
                transform: "translate(-50px, 50px)",
              }}
            />

            {/* Light mode sheen */}
            <div
              className="absolute top-0 left-0 right-0 pointer-events-none dark:opacity-0"
              style={{
                height: "50%",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
                borderRadius: "inherit",
              }}
            />

            {/* Dark mode shimmer */}
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-0 dark:opacity-100 bg-[radial-gradient(circle,rgba(52,211,153,0.1)_0%,transparent_70%)] translate-x-12 -translate-y-12" />

            {/* Actual Card Content */}
            <div className="relative z-10">
              <div
                className="p-5 cursor-pointer"
                onClick={() =>
                  !isJoined &&
                  demand.status === "open" &&
                  toggleDemand(demand.id, remaining)
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Upgraded Frosted Icon Box */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/55 dark:bg-white/[0.08] backdrop-blur-[12px]"
                      style={{
                        boxShadow:
                          "0 2px 8px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.9)",
                        border: "1px solid rgba(255,255,255,0.6)",
                      }}
                    >
                      <Package
                        className="w-6 h-6 text-[#16a34a] dark:text-emerald-400"
                        strokeWidth={2.5}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-lg tracking-tight truncate text-[#14532d] dark:text-white capitalize">
                          {crop?.name || demand.cropId} Contract
                        </h3>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded bg-white/55 dark:bg-white/10 backdrop-blur-md border uppercase tracking-[0.15em] shrink-0 ${s.colorClass} ${s.borderClass}`}
                        >
                          {demand.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-semibold flex-wrap text-[#14532d]/60 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />{" "}
                          {demand.contributors} Farmers
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />{" "}
                          {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[10px] uppercase font-bold tracking-widest mb-0.5 text-[#14532d]/50 dark:text-slate-400">
                      Premium Rate
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-[#14532d] dark:text-white">
                      ₹{demand.pricePerQuintal}
                    </p>
                    {demand.bonusPerQuintal > 0 && (
                      <p className="text-[10px] sm:text-[11px] font-bold tracking-wide text-[#15803d] dark:text-emerald-400">
                        +₹{demand.bonusPerQuintal} Bonus
                      </p>
                    )}
                  </div>
                </div>

                {/* Frosted Progress Bar Area */}
                <div
                  className="mt-5 p-4 rounded-2xl bg-white/45 dark:bg-white/[0.04] backdrop-blur-md border border-white/65 dark:border-white/5"
                  style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)" }}
                >
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                    <span className="text-[#14532d]/60 dark:text-slate-400">
                      Fulfilled
                    </span>
                    <span className={s.colorClass}>{fillPct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full overflow-hidden bg-[#14532d]/10 dark:bg-slate-800 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${fillPct}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${barGrad}`}
                    />
                  </div>
                  <p className="text-[11px] font-semibold mt-2 text-[#14532d]/60 dark:text-slate-400">
                    <span className="font-bold text-[#14532d] dark:text-slate-200">
                      {demand.filledQuantity}q
                    </span>{" "}
                    / {demand.targetQuantity}q ·{" "}
                    <span className="text-[#16a34a] dark:text-emerald-400">
                      {remaining}q still needed
                    </span>
                  </p>
                </div>
              </div>

              {/* Commit Panel Expansion */}
              <AnimatePresence>
                {isActive && !isJoined && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-[#16a34a]/10 dark:border-white/5"
                  >
                    <div className="p-5 space-y-5 bg-white/30 dark:bg-black/20 backdrop-blur-md">
                      <div
                        className="p-5 rounded-[20px] bg-white/60 dark:bg-white/5 border border-white/70 dark:border-white/10 shadow-sm"
                        style={{
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                        }}
                      >
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-[#14532d]/60 dark:text-slate-400">
                              Your Commitment
                            </p>
                            <p className="text-3xl font-black text-[#14532d] dark:text-white">
                              {selectedQty}{" "}
                              <span className="text-lg font-bold text-[#14532d]/50 dark:text-slate-500">
                                q
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-[#14532d]/60 dark:text-slate-400">
                              Total Payout
                            </p>
                            <p className="text-2xl font-black text-[#16a34a] dark:text-emerald-400">
                              ₹{totalEarning.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <Slider
                          value={[selectedQty]}
                          onValueChange={(v) => setSelectedQty(v[0])}
                          max={remaining}
                          min={10}
                          step={10}
                          className="py-4 cursor-pointer"
                        />
                        <p className="text-[11px] font-semibold mt-2 text-[#14532d]/60 dark:text-slate-400 text-center">
                          ₹{demand.pricePerQuintal + demand.bonusPerQuintal}/q ·
                          Max {remaining}q
                        </p>
                      </div>

                      {joinError && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-bold text-center bg-red-100 dark:bg-red-500/10 py-2 rounded-lg border border-red-200 dark:border-red-500/20">
                          {joinError}
                        </p>
                      )}

                      <button
                        disabled={isProcessing || selectedQty === 0}
                        onClick={() =>
                          handleJoin(
                            demand.id,
                            demand.pricePerQuintal,
                            demand.bonusPerQuintal,
                          )
                        }
                        className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white transition-all disabled:opacity-50 shadow-[0_8px_20px_rgba(22,197,94,0.25)] hover:shadow-[0_8px_25px_rgba(22,197,94,0.4)] hover:-translate-y-0.5"
                      >
                        {isProcessing ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                          >
                            <Loader2 className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <>
                            <span>Sign Smart Contract</span>{" "}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Success State */}
                {isJoined && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 flex flex-col items-center text-center gap-3 bg-[#e8f5e9] dark:bg-emerald-500/10 border-t border-[#bbf7d0] dark:border-emerald-500/20"
                  >
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/60 dark:bg-emerald-500/20 border border-white dark:border-emerald-500/30 shadow-sm">
                      <CheckCircle2 className="w-7 h-7 text-[#16a34a] dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-[#14532d] dark:text-white">
                        Contract Executed!
                      </h4>
                      <p className="text-sm font-semibold mt-1 text-[#14532d]/70 dark:text-slate-300">
                        You committed {selectedQty}q at ₹
                        {demand.pricePerQuintal + demand.bonusPerQuintal}/q
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
