"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "./bottom-nav";
import { Pool } from "@/types/pool";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Users,
  Search,
  PlusCircle,
  MapPin,
  Clock,
  Target,
  Sprout,
  CheckCircle2,
  TrendingUp,
  Loader2,
  IndianRupee,
} from "lucide-react";

// ✅ FIX: was dark:bg-slate-900/[0.55] — too dark/blue-black
// Now uses a warm dark green tint to match the app's nature theme
const GLASS_CLASSES =
  "bg-white/[0.55] dark:bg-[#1a2e1e]/80 backdrop-blur-[24px] border border-white/40 dark:border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]";

// ✅ FIX: was dark:bg-slate-800/40 — slate tint clashes with green theme
const GLASS_INNER_CLASSES =
  "bg-white/40 dark:bg-[#1e3524]/60 border border-white/50 dark:border-white/[0.09] text-[#166534] dark:text-emerald-400";

const GLASS_INPUT =
  "w-full bg-white/50 dark:bg-[#1a2e1e]/70 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all";

export default function FarmerPools() {
  const router = useRouter();
  const userProfile = useAppStore((state) => state.userProfile);
  const setActiveScreen = useAppStore((state) => state.setActiveScreen);
  const [isMounted, setIsMounted] = useState(false);

  const farmerId = userProfile?.uid || "demo-farmer-123";
  const farmerName = userProfile?.fullName || "Arshvir Kaur";

  const [pools, setPools] = useState<Pool[]>([]);
  const [tab, setTab] = useState<"browse" | "mine" | "create">("browse");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [form, setForm] = useState({
    commodity: "",
    pricePerUnit: "",
    unit: "quintal",
    targetQuantity: "",
    deadline: "",
    location: "",
    description: "",
  });

  const [joining, setJoining] = useState<{ pool: Pool | null; qty: string }>({
    pool: null,
    qty: "",
  });

  useEffect(() => {
    setIsMounted(true);
    setActiveScreen("pools");
  }, [setActiveScreen]);

  const fetchPools = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pools?status=open");
      const data = await res.json();
      setPools(data.pools || []);
    } catch (err) {
      console.error("Failed to fetch pools", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "browse" || tab === "mine") fetchPools();
  }, [tab]);

  const handleCreate = async () => {
    if (!form.commodity || !form.pricePerUnit || !form.targetQuantity) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/pools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pricePerUnit: Number(form.pricePerUnit),
          targetQuantity: Number(form.targetQuantity),
          creatorId: farmerId,
          creatorName: farmerName,
          creatorRole: "farmer",
        }),
      });
      if (res.ok) {
        setTab("mine");
        setForm({
          commodity: "",
          pricePerUnit: "",
          unit: "quintal",
          targetQuantity: "",
          deadline: "",
          location: "",
          description: "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!joining.pool || !joining.qty) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/pools/${joining.pool.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmerId,
          farmerName,
          quantity: Number(joining.qty),
        }),
      });
      if (res.ok) {
        setJoining({ pool: null, qty: "" });
        fetchPools();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const buyerRequestPools = pools.filter((p) => p.creatorRole === "buyer");
  const myPools = pools.filter(
    (p) =>
      p.creatorId === farmerId ||
      p.members?.some((m: any) => m.farmerId === farmerId),
  );

  if (!isMounted) return null;

  return (
    <div className="min-h-screen pb-28 lg:pb-8 overflow-x-hidden relative bg-[linear-gradient(135deg,#dcfce7_0%,#dcfce7_20%,#bfdbfe_100%)] dark:bg-none dark:bg-slate-950 transition-colors duration-500">
      {/* ── Background Wave Pattern ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60 dark:opacity-70 transition-opacity duration-500">
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

      {/* HEADER */}
      {/* ✅ FIX: was dark:bg-slate-950/50 — now warm dark green */}
      <header className="sticky top-0 z-40 transition-colors duration-300 bg-white/25 dark:bg-[#111a13]/80 backdrop-blur-[20px] border-b border-white/30 dark:border-white/[0.07]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => router.push("/farmer")}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105",
                GLASS_INNER_CLASSES,
              )}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-50">
                Community Pools
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Micro-Pooling Engine
              </p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="max-w-5xl mx-auto px-4 pb-4">
          {/* ✅ FIX: was dark:bg-slate-800/40 — too dark blue */}
          <div className="flex p-1 rounded-2xl bg-white/40 dark:bg-[#1a2e1e]/70 backdrop-blur-md border border-white/50 dark:border-white/[0.09]">
            {(["browse", "mine", "create"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-2.5 text-sm font-bold rounded-xl capitalize transition-all duration-300",
                  tab === t
                    // ✅ FIX: was bg-emerald-500 (eye-burning bright). Now muted emerald-600.
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-[#1e3524]/60",
                )}
              >
                {t === "browse"
                  ? "Buyer Requests"
                  : t === "mine"
                  ? "My Pools"
                  : "Create Pool"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AnimatePresence mode="wait">

          {/* BROWSE TAB */}
          {tab === "browse" && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                </div>
              ) : buyerRequestPools.length === 0 ? (
                <div className={cn("text-center py-16 rounded-[32px]", GLASS_CLASSES)}>
                  <Search className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-50" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                    No active requests
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Check back later for new buyer pools.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {buyerRequestPools.map((pool) => {
                    const progress = Math.min(
                      ((pool.filledQuantity || 0) / (pool.targetQuantity || 1)) * 100,
                      100,
                    );
                    return (
                      <div
                        key={pool.id}
                        className={cn(
                          "rounded-[24px] p-5 hover:border-emerald-600/40 transition-colors group",
                          GLASS_CLASSES,
                        )}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-3 items-center">
                            {/* ✅ FIX: was dark:bg-emerald-900/30 — barely visible. Now clearer. */}
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-800/40 flex items-center justify-center border border-emerald-200 dark:border-emerald-700/40">
                              <Sprout className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-800 dark:text-slate-100 capitalize text-lg leading-none">
                                {pool.commodity}
                              </h3>
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                                by {pool.creatorName}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {/* ✅ FIX: was dark:text-emerald-400 (bright). Now slightly softer. */}
                            <span className="text-xl font-black text-emerald-600 dark:text-emerald-300">
                              ₹{pool.pricePerUnit}
                            </span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                              per {pool.unit}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-5">
                          <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300">
                            <span>Filled: {pool.filledQuantity || 0} {pool.unit}</span>
                            <span>Target: {pool.targetQuantity} {pool.unit}</span>
                          </div>
                          {/* ✅ FIX: progress bar track was dark:bg-slate-800 — invisible. Now visible. */}
                          <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                              // ✅ FIX: was bg-emerald-500 (eye-burning). Now emerald-600.
                              className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-1000"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-5">
                          {pool.location && (
                            <span className={cn(
                              "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1",
                              GLASS_INNER_CLASSES,
                            )}>
                              <MapPin className="w-3 h-3" /> {pool.location}
                            </span>
                          )}
                          {pool.deadline && (
                            <span className={cn(
                              "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1",
                              GLASS_INNER_CLASSES,
                            )}>
                              <Clock className="w-3 h-3" />{" "}
                              {new Date(pool.deadline).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          )}
                        </div>

                        {/* ✅ FIX: was bg-emerald-500 — eye-burning bright green on dark bg */}
                        <button
                          onClick={() => setJoining({ pool, qty: "" })}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
                        >
                          <PlusCircle className="w-4 h-4" /> Join & Add Quantity
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* MINE TAB */}
          {tab === "mine" && (
            <motion.div
              key="mine"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                </div>
              ) : myPools.length === 0 ? (
                <div className={cn("text-center py-16 rounded-[32px]", GLASS_CLASSES)}>
                  <Target className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-50" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                    No active pools
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    You haven't created or joined any pools yet.
                  </p>
                  <button
                    onClick={() => setTab("create")}
                    className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-full font-bold text-sm shadow-md"
                  >
                    Create One Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myPools.map((pool) => (
                    <div key={pool.id} className={cn("rounded-[24px] p-5", GLASS_CLASSES)}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-slate-100 capitalize text-lg">
                            {pool.commodity}
                          </h3>
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1",
                            pool.status === "open"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : "bg-slate-200 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400",
                          )}>
                            {pool.status === "open" ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            {pool.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-black text-emerald-600 dark:text-emerald-300">
                            ₹{pool.pricePerUnit}
                          </span>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            per {pool.unit}
                          </p>
                        </div>
                      </div>
                      {/* ✅ FIX: was dark:bg-slate-800/40 dark:border-white/10 — invisible */}
                      <div className="flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-[#1e3524]/50 p-3 rounded-xl border border-white/50 dark:border-white/[0.09]">
                        <div className="flex items-center gap-1.5">
                          <Target className="w-4 h-4 text-slate-400" />
                          <span>{pool.filledQuantity}/{pool.targetQuantity} {pool.unit}</span>
                        </div>
                        <div className="flex items-center gap-1.5 border-l border-slate-300 dark:border-slate-600/60 pl-4">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>{pool.members?.length || 1} Member(s)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* CREATE TAB */}
          {tab === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className={cn("rounded-[32px] p-6 sm:p-8 space-y-6", GLASS_CLASSES)}>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-50 tracking-tight">
                    Create Selling Pool
                  </h2>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                    Group your harvest with neighbors to unlock premium enterprise buyer rates.
                  </p>
                </div>

                <div className="space-y-4">
                  <input
                    className={GLASS_INPUT}
                    placeholder="Commodity (e.g. Wheat, Rice)"
                    value={form.commodity}
                    onChange={(e) => setForm({ ...form, commodity: e.target.value })}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <IndianRupee className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
                      <input
                        className={cn(GLASS_INPUT, "pl-10")}
                        placeholder="Expected Price"
                        type="number"
                        value={form.pricePerUnit}
                        onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })}
                      />
                    </div>
                    <select
                      className={GLASS_INPUT}
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    >
                      <option value="kg">Per Kg</option>
                      <option value="quintal">Per Quintal</option>
                      <option value="ton">Per Ton</option>
                    </select>
                  </div>

                  <input
                    className={GLASS_INPUT}
                    placeholder="Target Group Quantity (e.g. 500)"
                    type="number"
                    value={form.targetQuantity}
                    onChange={(e) => setForm({ ...form, targetQuantity: e.target.value })}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className={GLASS_INPUT}
                      placeholder="Hub/Village"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                    <input
                      className={GLASS_INPUT}
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={handleCreate}
                    disabled={actionLoading || !form.commodity || !form.pricePerUnit || !form.targetQuantity}
                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Broadcast Pool to Neighbors"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* JOIN MODAL */}
      <AnimatePresence>
        {joining.pool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // ✅ FIX: was dark:bg-slate-950/80 — pure black overlay
            className="fixed inset-0 bg-slate-900/40 dark:bg-[#0a1409]/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className={cn(
                "w-full max-w-md rounded-[32px] p-6 sm:p-8",
                GLASS_CLASSES,
                // ✅ FIX: was dark:bg-slate-900/90 — cold blue-black
                "bg-white/90 dark:bg-[#1a2e1e]/95",
              )}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-800/40 flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Sprout className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Join {joining.pool.commodity} Pool
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Target: {joining.pool.targetQuantity} {joining.pool.unit} • Current:{" "}
                  {joining.pool.filledQuantity || 0}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
                    Your Contribution
                  </label>
                  <div className="relative">
                    <input
                      className={cn(GLASS_INPUT, "text-center text-2xl font-black py-4")}
                      type="number"
                      placeholder="0"
                      value={joining.qty}
                      onChange={(e) => setJoining({ ...joining, qty: e.target.value })}
                      autoFocus
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                      {joining.pool.unit}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setJoining({ pool: null, qty: "" })}
                    className="flex-1 py-4 rounded-2xl text-sm font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleJoin}
                    disabled={actionLoading || !joining.qty}
                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-900/20 transition-all flex justify-center items-center gap-2"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Confirm Join"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}