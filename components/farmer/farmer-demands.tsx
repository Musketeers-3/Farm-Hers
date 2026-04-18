"use client";
import React, { useState, useEffect } from "react";
import {
  Package,
  Users,
  Calendar,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/lib/store";
import { auth } from "@/lib/firebase";
import type { Demand } from "@/types/demand";
import { BottomNav } from "./bottom-nav";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<
  string,
  { colorClass: string; bgClass: string; borderClass: string }
> = {
  open: {
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-500/10 dark:bg-emerald-500/15",
    borderClass: "border-emerald-500/25 dark:border-emerald-500/30",
  },
  filled: {
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-500/10 dark:bg-amber-500/15",
    borderClass: "border-amber-500/25 dark:border-amber-500/30",
  },
  contracted: {
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-500/10 dark:bg-blue-500/15",
    borderClass: "border-blue-500/25 dark:border-blue-500/30",
  },
  expired: {
    colorClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-500/10 dark:bg-red-500/15",
    borderClass: "border-red-500/25 dark:border-red-500/30",
  },
};

const STATUS_BAR: Record<string, string> = {
  open: "from-[#10b981] to-[#34d399]",
  filled: "from-amber-600 to-amber-500",
  contracted: "from-blue-600 to-blue-500",
  expired: "from-red-600 to-red-500",
};

const GLASS_CLASSES =
  "bg-white/[0.55] dark:bg-slate-900/[0.55] backdrop-blur-[24px] border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]";
const GLASS_INNER_CLASSES =
  "bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-white/10 text-[#166534] dark:text-emerald-400";

export function FarmerDemands() {
  const router = useRouter();
  const crops = useAppStore((s) => s.crops);
  const userProfile = useAppStore((s) => s.userProfile);

  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedQty, setSelectedQty] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [joinError, setJoinError] = useState<string | null>(null);

  const fetchDemands = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/demands?status=open");
      if (!res.ok) throw new Error("Failed to fetch demands");
      const data = await res.json();
      setDemands(data.demands);
    } catch (err: any) {
      setError(err.message);
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
    const farmerId = auth.currentUser?.uid || userProfile?.uid || "farmer-001";
    setIsProcessing(true);
    setJoinError(null);
    try {
      const res = await fetch(`/api/demands/${demandId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmerId, quantity: selectedQty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join");

      setDemands((prev) =>
        prev.map((d) =>
          d.id === demandId
            ? {
                ...d,
                filledQuantity: data.filledQuantity,
                status: data.status,
                contributors: d.contributors + 1,
              }
            : d,
        ),
      );
      setJoinedIds((prev) => new Set([...prev, demandId]));
      setActiveId(null);
    } catch (err: any) {
      setJoinError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-24 lg:pb-8 overflow-x-hidden bg-[linear-gradient(135deg,#dcfce7_0%,#dcfce7_20%,#bfdbfe_100%)] dark:bg-none dark:bg-slate-950 transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40 dark:opacity-20 transition-opacity duration-500">
        <svg viewBox="0 0 1200 800" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {[...Array(15)].map((_, i) => (
            <path
              key={i}
              d={`M-200 ${300 + i * 15} Q 300 ${100 - i * 10}, 600 ${400} T 1400 ${200 + i * 20}`}
              fill="none"
              stroke="url(#waveGrad)"
              strokeWidth="1.5"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </svg>
      </div>

      <header className="sticky top-0 z-40 transition-colors duration-300 bg-white/25 dark:bg-slate-950/50 backdrop-blur-[20px] border-b border-white/30 dark:border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => router.push("/farmer")}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105",
                GLASS_INNER_CLASSES,
              )}
            >
              <ArrowLeft
                className="w-5 h-5 text-slate-800 dark:text-slate-200"
                strokeWidth={1.8}
              />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-50">
                Buyer Demands
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Direct Corporate Contracts
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Loading buyer demands...
            </p>
          </div>
        ) : error ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center p-12 gap-4 rounded-[32px]",
              GLASS_CLASSES,
            )}
          >
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {error}
            </p>
            <button
              onClick={fetchDemands}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20"
            >
              Retry Connection
            </button>
          </div>
        ) : demands.length === 0 ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center p-16 gap-4 rounded-[32px] text-center",
              GLASS_CLASSES,
            )}
          >
            <div className="w-20 h-20 rounded-full bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-white/10 flex items-center justify-center">
              <Package className="w-10 h-10 text-emerald-600/50 dark:text-emerald-400/50" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                No open demands
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Check back later — buyers post new bulk demands daily.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {demands.map((demand, index) => {
              const crop = crops.find((c) => c.id === demand.cropId);
              const remaining = demand.targetQuantity - demand.filledQuantity;
              const fillPct = Math.min(
                100,
                Math.round(
                  (demand.filledQuantity / demand.targetQuantity) * 100,
                ),
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
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "overflow-hidden rounded-[28px] transition-all duration-300",
                    GLASS_CLASSES,
                    isActive ? "border-emerald-500/50 shadow-lg" : "",
                  )}
                >
                  <div
                    className="p-5 sm:p-6 cursor-pointer"
                    onClick={() =>
                      !isJoined &&
                      demand.status === "open" &&
                      toggleDemand(demand.id, remaining)
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-white/10 shadow-sm">
                          <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-lg truncate text-slate-900 dark:text-slate-50">
                              {crop?.name || "Unknown"} Demand
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest shrink-0 border ${s.colorClass} ${s.bgClass} ${s.borderClass}`}
                            >
                              {demand.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-semibold flex-wrap text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5 bg-white/30 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-white/40 dark:border-white/5">
                              <Users className="w-3 h-3" />{" "}
                              {demand.contributors} joined
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/30 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-white/40 dark:border-white/5">
                              <Calendar className="w-3 h-3" />{" "}
                              {daysLeft > 0 ? `${daysLeft}d left` : "Expired"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] uppercase font-bold tracking-widest mb-0.5 text-slate-500 dark:text-slate-400">
                          Rate
                        </p>
                        <p className="text-xl sm:text-2xl font-mono font-black text-slate-900 dark:text-slate-50">
                          ₹{demand.pricePerQuintal}
                        </p>
                        {demand.bonusPerQuintal > 0 && (
                          <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            +₹{demand.bonusPerQuintal}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                        <span className="text-slate-500 dark:text-slate-400">
                          Filled
                        </span>
                        <span className={s.colorClass}>{fillPct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${fillPct}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full bg-gradient-to-r ${barGrad}`}
                        />
                      </div>
                      <p className="text-[11px] font-semibold mt-2 text-slate-500 dark:text-slate-400">
                        {demand.filledQuantity}q / {demand.targetQuantity}q{" "}
                        <span className="mx-1 opacity-50">•</span> {remaining}q
                        still needed
                      </p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isActive && !isJoined && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/20 dark:border-white/10"
                      >
                        <div className="p-5 sm:p-6 space-y-5 bg-white/20 dark:bg-slate-900/30">
                          <div className="p-5 rounded-[24px] bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-white/10 shadow-sm">
                            <div className="flex justify-between items-end mb-4">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">
                                  Your Quantity
                                </p>
                                <p className="text-3xl font-black font-mono text-slate-900 dark:text-slate-50">
                                  {selectedQty}{" "}
                                  <span className="text-base font-bold text-slate-500">
                                    q
                                  </span>
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">
                                  You Earn
                                </p>
                                <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
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
                              className="py-4"
                            />
                            <p className="text-[10px] font-bold uppercase tracking-wider mt-2 text-slate-500 dark:text-slate-400 text-center">
                              ₹{demand.pricePerQuintal + demand.bonusPerQuintal}
                              /q • max {remaining}q available
                            </p>
                          </div>

                          {joinError && (
                            <p className="text-xs text-red-500 font-bold text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
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
                            className="w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                <span>Commit My Supply</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {isJoined && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-6 flex flex-col items-center text-center gap-3 bg-emerald-500/10 dark:bg-emerald-900/30 border-t border-emerald-500/20"
                      >
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-500/20 border border-emerald-500/30">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-slate-900 dark:text-slate-50">
                            Supply Committed!
                          </h4>
                          <p className="text-xs mt-1 text-slate-600 dark:text-slate-400 font-medium">
                            You committed {selectedQty}q at ₹
                            {demand.pricePerQuintal + demand.bonusPerQuintal}/q
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
