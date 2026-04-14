"use client";
import React, { useState } from "react";
import {
  Flame, MapPin, TrendingUp, Package, CircleDollarSign,
  ShieldCheck, Star, CheckCircle2, Clock, ChevronRight, ArrowRight,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";

// ─── TOKEN FACTORY ─────────────────────────────────────────────────────────────
const makeTokens = (isDark: boolean) => isDark ? {
  // ── DARK (image 1 — paddy green) ──────────────────────────────────────────
  card:         "rgba(8,18,10,0.65)",
  cardActive:   "rgba(8,18,10,0.82)",
  border:       "rgba(90,158,111,0.15)",
  borderActive: "rgba(90,158,111,0.32)",
  blur:         "blur(18px)",
  textPrimary:  "#ffffff",
  textSub:      "rgba(255,255,255,0.55)",
  textLabel:    "rgba(255,255,255,0.38)",
  accent:       "#5a9e6f",
  accentDark:   "#2d6a4f",
  accentBg:     "rgba(45,106,79,0.22)",
  accentBorder: "rgba(90,158,111,0.28)",
  expandBg:     "rgba(0,0,0,0.30)",
  statBox:      "rgba(255,255,255,0.06)",
  progressTrack:"rgba(255,255,255,0.08)",
  signedBg:     "rgba(45,106,79,0.18)",
  chevronBg:    "rgba(255,255,255,0.06)",
  glowActive:   "0 0 0 1px rgba(90,158,111,0.12), 0 8px 32px rgba(0,0,0,0.5)",
  shadow:       "0 4px 24px rgba(0,0,0,0.45)",
} : {
  // ── LIGHT (sky-blue frosted glass) ────────────────────────────────────────
  card:         "rgba(200,225,255,0.18)",
  cardActive:   "rgba(200,225,255,0.28)",
  border:       "rgba(180,210,255,0.30)",
  borderActive: "rgba(74,222,128,0.45)",
  blur:         "blur(32px)",
  textPrimary:  "#ffffff",
  textSub:      "rgba(255,255,255,0.75)",
  textLabel:    "rgba(255,255,255,0.52)",
  accent:       "#4ade80",
  accentDark:   "#16a34a",
  accentBg:     "rgba(74,222,128,0.15)",
  accentBorder: "rgba(74,222,128,0.30)",
  expandBg:     "rgba(0,10,30,0.20)",
  statBox:      "rgba(200,225,255,0.14)",
  progressTrack:"rgba(200,225,255,0.18)",
  signedBg:     "rgba(22,163,74,0.18)",
  chevronBg:    "rgba(200,225,255,0.14)",
  glowActive:   "0 0 0 1px rgba(74,222,128,0.15), 0 8px 32px rgba(0,10,30,0.35)",
  shadow:       "0 4px 24px rgba(0,10,30,0.25)",
};

export function BuyerPools({ isDark = true }: { isDark?: boolean }) {
  const G = makeTokens(isDark);

  const pools    = useAppStore((s) => s.pools);
  const crops    = useAppStore((s) => s.crops);
  const addOrder = useAppStore((s) => s.addOrder);

  const [activePoolId,   setActivePoolId]   = useState<string | null>(null);
  const [selectedQty,    setSelectedQty]    = useState<number>(0);
  const [isProcessing,   setIsProcessing]   = useState(false);
  const [contractSigned, setContractSigned] = useState<string | null>(null);

  const togglePool = (poolId: string, maxQty: number) => {
    if (activePoolId === poolId) { setActivePoolId(null); return; }
    setActivePoolId(poolId);
    setSelectedQty(Math.floor(maxQty * 0.25));
  };

  const handleInitiateContract = (poolId: string, cropId: string, price: number, qty: number) => {
    setIsProcessing(true);
    setTimeout(() => {
      addOrder({
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        cropId, quantity: qty, pricePerQuintal: price,
        totalAmount: qty * price, status: "pending",
        buyerId: "buyer-pam-001", farmerId: "pool-collective",
        createdAt: new Date().toISOString(),
      });
      setIsProcessing(false);
      setContractSigned(poolId);
    }, 1500);
  };

  const totalVolume = pools.reduce((a, b) => a + b.totalQuantity, 0);
  const avgBonus    = pools.length > 0
    ? Math.round(pools.reduce((a, b) => a + b.bonusPerQuintal, 0) / pools.length) : 0;

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {[
          { label: "Active Pools",  value: pools.length,      icon: Package },
          { label: "Total Volume",  value: `${totalVolume}q`, icon: TrendingUp },
          { label: "Avg Bonus",     value: `₹${avgBonus}/q`,  icon: CircleDollarSign },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 sm:p-6 flex items-center justify-between rounded-2xl"
            style={{
              background:           G.card,
              border:               `1px solid ${G.border}`,
              backdropFilter:       G.blur,
              WebkitBackdropFilter: G.blur,
              boxShadow:            G.shadow,
            }}
          >
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1" style={{ color: G.textLabel }}>
                {stat.label}
              </p>
              <p className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: G.textPrimary }}>
                {stat.value}
              </p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl"
              style={{ background: G.accentBg, border: `1px solid ${G.accentBorder}` }}>
              <stat.icon className="w-6 h-6" style={{ color: G.accent }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* LEFT — Pool cards */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          {pools.map((pool, index) => {
            const cropDetails = crops.find((c) => c.id === pool.cropId);
            const cropName    = cropDetails?.name || "Unknown Asset";
            const finalPrice  = (cropDetails?.currentPrice || 0) + pool.bonusPerQuintal;
            const isActive    = activePoolId === pool.id;
            const fillPct     = Math.round((pool.totalQuantity / pool.targetQuantity) * 100);
            const isSigned    = contractSigned === pool.id;

            return (
              <motion.div
                key={pool.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
                className="overflow-hidden rounded-2xl transition-all duration-300"
                style={{
                  background:           isActive ? G.cardActive : G.card,
                  border:               `1px solid ${isActive ? G.borderActive : G.border}`,
                  backdropFilter:       G.blur,
                  WebkitBackdropFilter: G.blur,
                  boxShadow:            isActive ? G.glowActive : G.shadow,
                }}
              >
                <div
                  className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  onClick={() => !isSigned && togglePool(pool.id, pool.targetQuantity - pool.totalQuantity)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: G.accentBg, border: `1px solid ${G.accentBorder}` }}>
                      <Flame className="w-6 h-6" style={{ color: G.accent }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-black text-lg sm:text-xl tracking-tight text-white">{cropName} Pool</h3>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest"
                          style={{ background: G.accentBg, color: G.accent, border: `1px solid ${G.accentBorder}` }}>
                          Grade A
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold" style={{ color: G.textSub }}>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Punjab</span>
                        <span className="flex items-center gap-1" style={{ color: G.accent }}>
                          <TrendingUp className="w-3.5 h-3.5" /> +₹{pool.bonusPerQuintal} Bonus
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-0.5">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: G.textLabel }}>Target Rate</p>
                      <p className="text-xl sm:text-2xl font-mono font-black text-white">₹{finalPrice}</p>
                    </div>
                    {!isActive && !isSigned && (
                      <div className="p-2 rounded-xl sm:hidden" style={{ background: G.chevronBg }}>
                        <ChevronRight className="w-5 h-5 text-white/40" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span style={{ color: G.textLabel }}>Pool Filled</span>
                    <span style={{ color: G.accent }}>{fillPct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: G.progressTrack }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${fillPct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${G.accentDark}, ${G.accent})` }}
                    />
                  </div>
                  <p className="text-[10px] font-semibold mt-2" style={{ color: G.textLabel }}>
                    {pool.totalQuantity}q / {pool.targetQuantity}q collected
                  </p>
                </div>

                {/* Expanded */}
                <AnimatePresence>
                  {isActive && !isSigned && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                      style={{ borderTop: `1px solid ${G.border}` }}
                    >
                      <div className="p-5 sm:p-6 space-y-5" style={{ background: G.expandBg }}>
                        <div className="p-5 rounded-xl"
                          style={{ background: G.card, border: `1px solid ${G.border}`, backdropFilter: G.blur, WebkitBackdropFilter: G.blur }}>
                          <div className="flex justify-between items-end mb-4">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: G.textLabel }}>
                                Procurement Volume
                              </p>
                              <p className="text-2xl font-black font-mono text-white">
                                {selectedQty} <span className="text-base font-medium" style={{ color: G.textSub }}>Quintals</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: G.textLabel }}>Total Value</p>
                              <p className="text-xl font-bold font-mono" style={{ color: G.accent }}>
                                ₹{(selectedQty * finalPrice).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Slider
                            value={[selectedQty]}
                            onValueChange={(v) => setSelectedQty(v[0])}
                            max={pool.targetQuantity - pool.totalQuantity}
                            step={10}
                            className="py-4"
                          />
                        </div>
                        <button
                          disabled={isProcessing || selectedQty === 0}
                          onClick={() => handleInitiateContract(pool.id, pool.cropId, finalPrice, selectedQty)}
                          className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                          style={isProcessing
                            ? { background: G.statBox, color: G.textSub }
                            : { background: G.accentDark, color: "#fff", border: `1px solid ${G.accentBorder}`, boxShadow: "0 4px 20px rgba(22,163,74,0.4)" }
                          }
                        >
                          {isProcessing
                            ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Clock className="w-5 h-5" /></motion.div>
                            : <><span>Initiate Contract</span><ArrowRight className="w-4 h-4" /></>
                          }
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {isSigned && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 flex flex-col items-center text-center gap-3"
                      style={{ background: G.signedBg, borderTop: `1px solid ${G.accentBorder}` }}
                    >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: G.accentBg, border: `1px solid ${G.accentBorder}` }}>
                        <CheckCircle2 className="w-6 h-6" style={{ color: G.accent }} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Contract Initiated Successfully</h4>
                        <p className="text-xs mt-1" style={{ color: G.textSub }}>
                          Awaiting farmer collective approval for {selectedQty}q at ₹{finalPrice}/q
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT — Quality Assurance */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-32">
          <div className="rounded-2xl p-6"
            style={{
              background:           G.card,
              border:               `1px solid ${G.border}`,
              backdropFilter:       G.blur,
              WebkitBackdropFilter: G.blur,
              boxShadow:            G.shadow,
            }}>
            <h3 className="font-bold text-lg flex items-center gap-2 mb-5 text-white">
              <ShieldCheck className="w-5 h-5" style={{ color: G.accent }} />
              Quality Assurance
            </h3>
            <div className="space-y-3">
              {[
                { title: "Moisture Content",  value: "< 12%", status: "Optimal" },
                { title: "Foreign Matter",    value: "< 1%",  status: "Grade A" },
                { title: "Pesticide Residue", value: "Zero",  status: "Certified Organic" },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl"
                  style={{ background: G.statBox, border: `1px solid ${G.border}` }}>
                  <span className="text-sm font-semibold" style={{ color: G.textSub }}>{m.title}</span>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{m.value}</p>
                    <p className="text-[9px] uppercase tracking-wider font-bold" style={{ color: G.accent }}>{m.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 rounded-xl flex items-start gap-3"
              style={{ background: G.accentBg, border: `1px solid ${G.accentBorder}` }}>
              <Star className="w-5 h-5 shrink-0 mt-0.5" style={{ color: G.accent }} />
              <div>
                <p className="text-sm font-bold text-white">Premium Supply</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: G.textSub }}>
                  These pools are sourced from top-rated farmer collectives with strict quality control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}