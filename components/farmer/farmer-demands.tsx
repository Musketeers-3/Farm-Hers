"use client";
import React, { useState, useEffect } from "react";
import {
  Package, Users, Calendar, ArrowRight,
  Loader2, AlertCircle, CheckCircle2, Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/lib/store";
import { auth } from "@/lib/firebase";
import type { Demand } from "@/types/demand";

const G = {
  card: "rgba(255,255,255,0.85)",
  cardActive: "rgba(255,255,255,0.98)",
  border: "rgba(0,0,0,0.07)",
  borderActive: "rgba(22,163,74,0.35)",
  textPrimary: "#14532d",
  textSub: "rgba(20,83,45,0.6)",
  textLabel: "rgba(20,83,45,0.4)",
  accent: "#16a34a",
  accentDark: "#15803d",
  accentBg: "rgba(22,163,74,0.08)",
  accentBorder: "rgba(22,163,74,0.2)",
};

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  open:       { color: "#16a34a", bg: "rgba(22,163,74,0.1)",  border: "rgba(22,163,74,0.25)" },
  filled:     { color: "#d97706", bg: "rgba(217,119,6,0.1)",  border: "rgba(217,119,6,0.25)" },
  contracted: { color: "#2563eb", bg: "rgba(37,99,235,0.1)",  border: "rgba(37,99,235,0.25)" },
  expired:    { color: "#dc2626", bg: "rgba(220,38,38,0.1)",  border: "rgba(220,38,38,0.25)" },
};

export function FarmerDemands() {
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
      setLoading(true); setError(null);
      const res = await fetch("/api/demands?status=open");
      if (!res.ok) throw new Error("Failed to fetch demands");
      const data = await res.json();
      setDemands(data.demands);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDemands(); }, []);

  const toggleDemand = (demandId: string, remaining: number) => {
    if (activeId === demandId) { setActiveId(null); return; }
    setActiveId(demandId);
    setSelectedQty(Math.min(50, Math.max(10, Math.floor(remaining * 0.1))));
    setJoinError(null);
  };

  const handleJoin = async (demandId: string, pricePerQuintal: number, bonusPerQuintal: number) => {
    const farmerId = auth.currentUser?.uid || userProfile?.uid || "farmer-001";
    setIsProcessing(true); setJoinError(null);
    try {
      const res = await fetch(`/api/demands/${demandId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmerId, quantity: selectedQty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join");

      setDemands((prev) => prev.map((d) =>
        d.id === demandId
          ? { ...d, filledQuantity: data.filledQuantity, status: data.status, contributors: d.contributors + 1 }
          : d
      ));
      setJoinedIds((prev) => new Set([...prev, demandId]));
      setActiveId(null);
    } catch (err: any) { setJoinError(err.message); }
    finally { setIsProcessing(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      <p className="text-sm font-semibold text-emerald-700/60">Loading buyer demands...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <AlertCircle className="w-8 h-8 text-red-500" />
      <p className="text-sm font-semibold text-red-500">{error}</p>
      <button onClick={fetchDemands} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-emerald-700">Retry</button>
    </div>
  );

  if (demands.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Package className="w-10 h-10 text-emerald-300" />
      <p className="text-sm font-semibold text-emerald-700/50">No open buyer demands right now.</p>
      <p className="text-xs text-emerald-700/30">Check back later — buyers post new demands daily.</p>
    </div>
  );

  return (
    <div className="space-y-4 pb-8 px-4 sm:px-6 pt-4">
      <div className="mb-2">
        <h2 className="text-xl font-black text-[#14532d]">Buyer Demands</h2>
        <p className="text-xs mt-0.5 text-[#14532d]/50">Commit your supply to fulfill what buyers need</p>
      </div>

      {demands.map((demand, index) => {
        const crop = crops.find((c) => c.id === demand.cropId);
        const remaining = demand.targetQuantity - demand.filledQuantity;
        const fillPct = Math.min(100, Math.round((demand.filledQuantity / demand.targetQuantity) * 100));
        const daysLeft = Math.ceil((new Date(demand.deadline).getTime() - Date.now()) / 86400000);
        const isActive = activeId === demand.id;
        const isJoined = joinedIds.has(demand.id);
        const s = STATUS_STYLE[demand.status] || STATUS_STYLE.open;
        const totalEarning = selectedQty * (demand.pricePerQuintal + demand.bonusPerQuintal);

        return (
          <motion.div
            key={demand.id} layout
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
            className="overflow-hidden rounded-2xl transition-all duration-300"
            style={{
              background: isActive ? G.cardActive : G.card,
              border: `1px solid ${isActive ? G.borderActive : G.border}`,
              boxShadow: isActive ? "0 8px 32px rgba(22,163,74,0.12)" : "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            {/* Header */}
            <div
              className="p-5 cursor-pointer"
              onClick={() => !isJoined && demand.status === "open" && toggleDemand(demand.id, remaining)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: G.accentBg, border: `1px solid ${G.accentBorder}` }}>
                    <Package className="w-5 h-5" style={{ color: G.accent }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 className="font-black text-base truncate" style={{ color: G.textPrimary }}>{crop?.name || "Unknown"} Demand</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0" style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                        {demand.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold flex-wrap" style={{ color: G.textSub }}>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{demand.contributors} joined</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{daysLeft > 0 ? `${daysLeft}d left` : "Expired"}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] uppercase font-bold tracking-widest mb-0.5" style={{ color: G.textLabel }}>Rate</p>
                  <p className="text-xl font-mono font-black" style={{ color: G.textPrimary }}>₹{demand.pricePerQuintal}</p>
                  {demand.bonusPerQuintal > 0 && (
                    <p className="text-[11px] font-bold" style={{ color: G.accent }}>+₹{demand.bonusPerQuintal}</p>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <span style={{ color: G.textLabel }}>Filled</span>
                  <span style={{ color: s.color }}>{fillPct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${fillPct}%` }} transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, #15803d, ${s.color})` }}
                  />
                </div>
                <p className="text-[10px] font-semibold mt-1.5" style={{ color: G.textLabel }}>
                  {demand.filledQuantity}q / {demand.targetQuantity}q · {remaining}q still needed
                </p>
              </div>
            </div>

            {/* Expanded commit panel */}
            <AnimatePresence>
              {isActive && !isJoined && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden" style={{ borderTop: `1px solid ${G.border}` }}
                >
                  <div className="p-5 space-y-4" style={{ background: "rgba(240,253,244,0.8)" }}>
                    <div className="p-4 rounded-xl bg-white" style={{ border: `1px solid ${G.border}` }}>
                      <div className="flex justify-between items-end mb-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: G.textLabel }}>Your Quantity</p>
                          <p className="text-2xl font-black font-mono" style={{ color: G.textPrimary }}>
                            {selectedQty} <span className="text-base font-medium" style={{ color: G.textSub }}>q</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: G.textLabel }}>You Earn</p>
                          <p className="text-xl font-bold font-mono" style={{ color: G.accent }}>₹{totalEarning.toLocaleString()}</p>
                        </div>
                      </div>
                      <Slider value={[selectedQty]} onValueChange={(v) => setSelectedQty(v[0])} max={remaining} min={10} step={10} className="py-3" />
                      <p className="text-[10px] font-semibold mt-1" style={{ color: G.textLabel }}>
                        ₹{demand.pricePerQuintal + demand.bonusPerQuintal}/q · max {remaining}q available
                      </p>
                    </div>

                    {joinError && <p className="text-xs text-red-500 font-semibold text-center">{joinError}</p>}

                    <button
                      disabled={isProcessing || selectedQty === 0}
                      onClick={() => handleJoin(demand.id, demand.pricePerQuintal, demand.bonusPerQuintal)}
                      className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      style={{ background: G.accentDark, color: "#fff", boxShadow: "0 4px 16px rgba(22,163,74,0.3)" }}
                    >
                      {isProcessing
                        ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Clock className="w-5 h-5" /></motion.div>
                        : <><span>Commit My Supply</span><ArrowRight className="w-4 h-4" /></>
                      }
                    </button>
                  </div>
                </motion.div>
              )}

              {isJoined && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-5 flex flex-col items-center text-center gap-3"
                  style={{ background: "rgba(22,163,74,0.08)", borderTop: `1px solid ${G.accentBorder}` }}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: G.accentBg, border: `1px solid ${G.accentBorder}` }}>
                    <CheckCircle2 className="w-5 h-5" style={{ color: G.accent }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: G.textPrimary }}>Supply Committed!</h4>
                    <p className="text-xs mt-0.5" style={{ color: G.textSub }}>
                      You committed {selectedQty}q at ₹{demand.pricePerQuintal + demand.bonusPerQuintal}/q
                    </p>
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