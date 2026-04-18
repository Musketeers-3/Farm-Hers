"use client";
 
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "./bottom-nav";
import { Pool } from "@/types/pool";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  ArrowLeft, Users, Search, PlusCircle, MapPin,
  Clock, Target, Sprout, CheckCircle2, TrendingUp,
  Loader2, IndianRupee, Sun, Moon,
} from "lucide-react";
 
// ── Glass tokens — warm green theme, attractive in both light and dark ──────
const GLASS =
  "bg-white/60 dark:bg-white/[0.06] backdrop-blur-xl border border-white/70 dark:border-white/[0.09] shadow-[0_8px_40px_rgba(16,120,50,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]";
 
const GLASS_INNER =
  "bg-white/70 dark:bg-white/[0.07] backdrop-blur-md border border-white/80 dark:border-white/[0.08]";
 
const GLASS_INPUT =
  "w-full bg-white/70 dark:bg-white/[0.07] backdrop-blur-md border border-white/80 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all shadow-sm";
 
export default function FarmerPools() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const userProfile = useAppStore((state) => state.userProfile);
  const setActiveScreen = useAppStore((state) => state.setActiveScreen);
  const [mounted, setMounted] = useState(false);
 
  const farmerId   = userProfile?.uid      || "demo-farmer-123";
  const farmerName = userProfile?.fullName || "Arshvir Kaur";
 
  const [pools, setPools]               = useState<Pool[]>([]);
  const [tab, setTab]                   = useState<"browse" | "mine" | "create">("browse");
  const [loading, setLoading]           = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [form, setForm] = useState({
    commodity: "", pricePerUnit: "", unit: "quintal",
    targetQuantity: "", deadline: "", location: "", description: "",
  });
  const [joining, setJoining] = useState<{ pool: Pool | null; qty: string }>({
    pool: null, qty: "",
  });
 
  useEffect(() => { setMounted(true); setActiveScreen("pools"); }, [setActiveScreen]);
 
  const isDark = resolvedTheme === "dark";
 
  const fetchPools = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pools?status=open");
      const data = await res.json();
      setPools(data.pools || []);
    } catch (e) {
      console.error(e);
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
          commodity:      form.commodity,
          pricePerUnit:   Number(form.pricePerUnit),
          unit:           form.unit,
          targetQuantity: Number(form.targetQuantity),
          deadline:       form.deadline,
          location:       form.location,
          description:    form.description,
          creatorId:      farmerId,
          creatorName:    farmerName,
          creatorRole:    "farmer",
          status:         "open",
        }),
      });
      if (res.ok) {
        setTab("mine");
        setForm({ commodity: "", pricePerUnit: "", unit: "quintal", targetQuantity: "", deadline: "", location: "", description: "" });
      }
    } catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  };
 
  const handleJoin = async () => {
    if (!joining.pool || !joining.qty) return;
    setActionLoading(true);
    try {
      await fetch(`/api/pools/${joining.pool.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmerId, farmerName, quantity: Number(joining.qty) }),
      });
      setJoining({ pool: null, qty: "" });
      fetchPools();
    } catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  };
 
  const buyerRequestPools = pools.filter((p) => p.creatorRole === "buyer");
  const myPools = pools.filter(
    (p) => p.creatorId === farmerId || p.members?.some((m: any) => m.farmerId === farmerId),
  );
 
  if (!mounted) return null;
 
  return (
    <div className="min-h-screen pb-28 lg:pb-8 relative overflow-x-hidden">
 
      {/* ── FIXED BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Light mode: fresh meadow gradient with animated SVG wave layer */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${isDark ? "opacity-0" : "opacity-100"}`}
          style={{
            background:
              "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 25%, #e0f2fe 60%, #f0fdf4 100%)",
          }}
        />
        {/* Light mode wave pattern overlay */}
        {!isDark && (
          <div className="absolute inset-0 opacity-40">
            <svg viewBox="0 0 1200 800" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="waveGradA" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="waveGradB" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {[...Array(12)].map((_, i) => (
                <path
                  key={i}
                  d={`M-200 ${280 + i * 20} Q 300 ${80 - i * 8}, 600 ${380 + i * 5} T 1400 ${180 + i * 18}`}
                  fill="none"
                  stroke={i % 2 === 0 ? "url(#waveGradA)" : "url(#waveGradB)"}
                  strokeWidth="1.8"
                />
              ))}
              {/* Decorative blobs */}
              <circle cx="100" cy="120" r="180" fill="#bbf7d0" fillOpacity="0.25" />
              <circle cx="1100" cy="650" r="220" fill="#bfdbfe" fillOpacity="0.2" />
              <circle cx="600" cy="750" r="150" fill="#a7f3d0" fillOpacity="0.18" />
            </svg>
          </div>
        )}
 
        {/* Dark mode: forest night photo */}
        {isDark && (
          <>
            <Image src="/images/farmers_bg.jpg" alt="" fill priority
              className="object-cover object-center" style={{ opacity: 0.8 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020c04]/85 via-[#040f06]/75 to-[#020c04]/92" />
          </>
        )}
      </div>
 
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl border-b transition-colors duration-300
        bg-white/60 dark:bg-[#020c04]/75
        border-white/60 dark:border-white/[0.06]"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => router.push("/farmer")}
              className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-105 hover:shadow-md",
                GLASS_INNER
              )}
            >
              <ArrowLeft className="w-5 h-5 text-emerald-700 dark:text-white" strokeWidth={1.8} />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                Community Pools
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400/80">
                Micro-Pooling Engine
              </p>
            </div>
          </div>
 
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-105 text-emerald-600 dark:text-emerald-400",
              GLASS_INNER
            )}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
 
        {/* Tab bar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4 relative z-10">
          <div className={cn("flex p-1 rounded-2xl", GLASS)}>
            {(["browse", "mine", "create"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-2.5 text-sm font-bold rounded-xl capitalize transition-all duration-300",
                  tab === t
                    ? "bg-emerald-600 dark:bg-emerald-600/90 text-white shadow-lg shadow-emerald-700/25"
                    : "text-slate-600 dark:text-white/50 hover:bg-white/70 dark:hover:bg-white/[0.07]",
                )}
              >
                {t === "browse" ? "Buyer Requests" : t === "mine" ? "My Pools" : "Create Pool"}
              </button>
            ))}
          </div>
        </div>
      </header>
 
      {/* ── MAIN ── */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AnimatePresence mode="wait">
 
          {/* ── BROWSE TAB ── */}
          {tab === "browse" && (
            <motion.div key="browse"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
              ) : buyerRequestPools.length === 0 ? (
                <div className={cn("text-center py-16 rounded-[32px]", GLASS)}>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/30 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-emerald-500 dark:text-white/30" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">No active requests</h3>
                  <p className="text-slate-500 dark:text-white/40 text-sm mt-1">Check back later for new buyer pools.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {buyerRequestPools.map((pool) => {
                    const fillPct = Math.round(((pool.filledQuantity || 0) / pool.targetQuantity) * 100);
                    const remaining = pool.targetQuantity - (pool.filledQuantity || 0);
                    const isMine = pool.members?.some((m: any) => m.farmerId === farmerId);
                    return (
                      <div key={pool.id}
                        className={cn(
                          "rounded-[24px] p-5 transition-all group hover:shadow-[0_12px_48px_rgba(16,120,50,0.14)] dark:hover:border-emerald-400/30",
                          GLASS
                        )}
                      >
                        {/* Card header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-3 items-center">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
                              "bg-emerald-100 dark:bg-white/[0.07] border border-emerald-200 dark:border-white/[0.08]"
                            )}>
                              <Sprout className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-800 dark:text-white capitalize text-lg leading-none">{pool.commodity}</h3>
                              <p className="text-xs font-medium text-slate-500 dark:text-white/40 mt-1">by {pool.creatorName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">₹{pool.pricePerUnit}</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/35">per {pool.unit}</p>
                          </div>
                        </div>
 
                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[
                            { label: "Target",    value: `${pool.targetQuantity}q` },
                            { label: "Remaining", value: `${remaining}q`           },
                            { label: "Farmers",   value: pool.members?.length || 0  },
                          ].map((s) => (
                            <div key={s.label} className={cn("rounded-xl p-2.5 text-center", GLASS_INNER)}>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/30">{s.label}</p>
                              <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">{s.value}</p>
                            </div>
                          ))}
                        </div>
 
                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                            <span className="text-slate-500 dark:text-white/30">Filled</span>
                            <span className="text-emerald-600 dark:text-emerald-400">{fillPct}%</span>
                          </div>
                          <div className="h-2 bg-emerald-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }} animate={{ width: `${fillPct}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                            />
                          </div>
                        </div>
 
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {pool.location && (
                            <span className={cn(
                              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400",
                              "bg-emerald-50 dark:bg-white/[0.07] border border-emerald-200 dark:border-white/[0.08]"
                            )}>
                              <MapPin className="w-3 h-3" /> {pool.location}
                            </span>
                          )}
                          {pool.deadline && (
                            <span className={cn(
                              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400",
                              "bg-sky-50 dark:bg-white/[0.07] border border-sky-200 dark:border-white/[0.08]"
                            )}>
                              <Clock className="w-3 h-3" />
                              {new Date(pool.deadline).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
 
                        {isMine ? (
                          <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-400/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4" /> Already Joined
                          </div>
                        ) : (
                          <button
                            onClick={() => setJoining({ pool, qty: "" })}
                            className="w-full py-3 rounded-xl text-sm font-bold text-white
                              bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600/90 dark:hover:bg-emerald-500
                              transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
                          >
                            <PlusCircle className="w-4 h-4" /> Join & Add Quantity
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
 
          {/* ── MY POOLS TAB ── */}
          {tab === "mine" && (
            <motion.div key="mine"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
              ) : myPools.length === 0 ? (
                <div className={cn("text-center py-16 rounded-[32px]", GLASS)}>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/30 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-emerald-500 dark:text-white/30" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">No pools yet</h3>
                  <p className="text-slate-500 dark:text-white/40 text-sm mt-1">Create or join a pool to see it here.</p>
                  <button
                    onClick={() => setTab("create")}
                    className="mt-5 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-700/20"
                  >
                    Create Pool
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myPools.map((pool) => {
                    const fillPct = Math.round(((pool.filledQuantity || 0) / pool.targetQuantity) * 100);
                    const myContrib = pool.members?.find((m: any) => m.farmerId === farmerId)?.quantity || 0;
                    return (
                      <div key={pool.id} className={cn("rounded-[24px] p-5", GLASS)}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-slate-800 dark:text-white capitalize text-lg">{pool.commodity}</h3>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className={cn(
                                "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border",
                                pool.status === "open"
                                  ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
                                  : "text-slate-500 dark:text-white/40 bg-white/60 dark:bg-white/[0.06] border-slate-200 dark:border-white/[0.08]"
                              )}>
                                {pool.status === "open" ? <TrendingUp className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                {pool.status}
                              </span>
                              {pool.creatorId === farmerId && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-blue-500/10 text-sky-700 dark:text-blue-400 border border-sky-200 dark:border-blue-500/20 uppercase tracking-widest">
                                  Creator
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">₹{pool.pricePerUnit}</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/35">per {pool.unit}</p>
                          </div>
                        </div>
 
                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                            <span className="text-slate-500 dark:text-white/30">Progress</span>
                            <span className="text-emerald-600 dark:text-emerald-400">{fillPct}%</span>
                          </div>
                          <div className="h-2 bg-emerald-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }} animate={{ width: `${fillPct}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                            />
                          </div>
                        </div>
 
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className={cn("rounded-xl p-3 text-center", GLASS_INNER)}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/30">My Contribution</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">{myContrib}q</p>
                          </div>
                          <div className={cn("rounded-xl p-3 text-center", GLASS_INNER)}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/30">Farmers</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">{pool.members?.length || 0}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
 
          {/* ── CREATE TAB ── */}
          {tab === "create" && (
            <motion.div key="create"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-5">
              <div className={cn("rounded-[32px] p-6 sm:p-8 space-y-5", GLASS)}>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Create Selling Pool</h2>
                  <p className="text-sm text-slate-500 dark:text-white/40 mt-1">
                    Group your harvest with neighbors to unlock premium enterprise buyer rates.
                  </p>
                </div>
 
                {/* Commodity */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 dark:text-white/40 uppercase tracking-widest">Commodity</label>
                  <input
                    type="text"
                    value={form.commodity}
                    onChange={(e) => setForm((f) => ({ ...f, commodity: e.target.value }))}
                    placeholder="e.g. Wheat, Rice, Mustard"
                    className={GLASS_INPUT}
                  />
                </div>
 
                {/* Price + Unit row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-600 dark:text-white/40 uppercase tracking-widest">Price (₹)</label>
                    <div className="relative">
                      <IndianRupee className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        value={form.pricePerUnit}
                        onChange={(e) => setForm((f) => ({ ...f, pricePerUnit: e.target.value }))}
                        placeholder="e.g. 2200"
                        className={cn(GLASS_INPUT, "pl-10")}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-600 dark:text-white/40 uppercase tracking-widest">Unit</label>
                    <select
                      value={form.unit}
                      onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                      className={GLASS_INPUT}
                    >
                      <option value="quintal">Quintal</option>
                      <option value="kg">Kilogram</option>
                      <option value="tonne">Tonne</option>
                    </select>
                  </div>
                </div>
 
                {/* Target qty */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 dark:text-white/40 uppercase tracking-widest">Target Quantity</label>
                  <input
                    type="number"
                    value={form.targetQuantity}
                    onChange={(e) => setForm((f) => ({ ...f, targetQuantity: e.target.value }))}
                    placeholder="e.g. 500"
                    className={GLASS_INPUT}
                  />
                </div>
 
                {/* Location + Deadline row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-600 dark:text-white/40 uppercase tracking-widest">Hub / Village</label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      placeholder="e.g. Ludhiana Mandi"
                      className={GLASS_INPUT}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-600 dark:text-white/40 uppercase tracking-widest">Deadline</label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                      className={GLASS_INPUT}
                    />
                  </div>
                </div>
 
                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 dark:text-white/40 uppercase tracking-widest">Description (optional)</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Any notes for buyers..."
                    className={GLASS_INPUT}
                  />
                </div>
 
                <button
                  onClick={handleCreate}
                  disabled={actionLoading || !form.commodity || !form.pricePerUnit || !form.targetQuantity}
                  className="w-full h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-2
                    bg-emerald-600 hover:bg-emerald-500 text-white transition-all
                    disabled:opacity-50 shadow-lg shadow-emerald-700/25"
                >
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                  {actionLoading ? "Creating..." : "Broadcast Pool to Neighbors"}
                </button>
              </div>
            </motion.div>
          )}
 
        </AnimatePresence>
      </main>
 
      {/* ── JOIN MODAL ── */}
      <AnimatePresence>
        {joining.pool && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setJoining({ pool: null, qty: "" })}
              className="fixed inset-0 z-50 bg-emerald-950/30 dark:bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.97 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-sm w-full"
            >
              <div className="bg-white/95 dark:bg-[#0d1f10]/95 backdrop-blur-xl rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 space-y-5 border border-white/80 dark:border-white/[0.08]">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-800/40 border border-emerald-200 dark:border-emerald-700/30 flex items-center justify-center mx-auto mb-3">
                    <Sprout className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">Join Pool</h3>
                  <p className="text-sm text-slate-500 dark:text-white/40 mt-1">
                    <span className="font-bold capitalize text-emerald-600 dark:text-emerald-400">{joining.pool.commodity}</span>
                    {" "}at ₹{joining.pool.pricePerUnit}/{joining.pool.unit}
                  </p>
                </div>
 
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 dark:text-white/35 uppercase tracking-widest">Your Quantity ({joining.pool.unit}s)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={joining.qty}
                      onChange={(e) => setJoining((j) => ({ ...j, qty: e.target.value }))}
                      placeholder="0"
                      className={cn(GLASS_INPUT, "text-center text-2xl font-black py-4")}
                      autoFocus
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 dark:text-white/30">
                      {joining.pool.unit}
                    </span>
                  </div>
                </div>
 
                <div className="flex gap-3">
                  <button
                    onClick={() => setJoining({ pool: null, qty: "" })}
                    className="flex-1 py-3.5 rounded-2xl font-bold text-sm bg-slate-100 dark:bg-white/[0.07] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/[0.12] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleJoin}
                    disabled={actionLoading || !joining.qty}
                    className="flex-1 py-3.5 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Join"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
 
      <div className="lg:hidden"><BottomNav /></div>
    </div>
  );
}