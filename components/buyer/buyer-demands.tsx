"use client";
import React, { useState, useEffect } from "react";
import {
  Plus, Package, TrendingUp, CircleDollarSign,
  Loader2, AlertCircle, X, Users, Calendar, CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import type { Demand } from "@/types/demand";

const G = {
  card: "rgba(18,14,8,0.72)",
  cardActive: "rgba(18,14,8,0.82)",
  border: "rgba(255,255,255,0.09)",
  borderActive: "rgba(90,158,111,0.32)",
  blur: "blur(18px)",
  textPrimary: "#ffffff",
  textSub: "rgba(255,255,255,0.55)",
  textLabel: "rgba(255,255,255,0.38)",
  accent: "#5a9e6f",
  accentDark: "#2d6a4f",
  accentBg: "rgba(45,106,79,0.22)",
  accentBorder: "rgba(90,158,111,0.28)",
};

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  open:       { color: "#5a9e6f", bg: "rgba(45,106,79,0.18)",  border: "rgba(90,158,111,0.28)" },
  filled:     { color: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.28)" },
  contracted: { color: "#3b82f6", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.28)" },
  expired:    { color: "#ef4444", bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.28)" },
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 16px", borderRadius: 12,
  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)",
  color: "#fff", fontSize: 14, fontWeight: 600, outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 10, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.1em",
  color: "rgba(255,255,255,0.38)", marginBottom: 6,
};

export function BuyerDemands() {
  const crops = useAppStore((s) => s.crops);
  const userProfile = useAppStore((s) => s.userProfile);

  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    cropId: "", targetQuantity: "", pricePerQuintal: "", bonusPerQuintal: "", deadline: "",
  });

  const fetchDemands = async () => {
    try {
      setLoading(true); setError(null);
      const res = await fetch("/api/demands");
      if (!res.ok) throw new Error("Failed to fetch demands");
      const data = await res.json();
      setDemands(data.demands);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDemands(); }, []);

  const handlePost = async () => {
    if (!form.cropId || !form.targetQuantity || !form.pricePerQuintal || !form.deadline) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/demands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropId: form.cropId,
          targetQuantity: Number(form.targetQuantity),
          pricePerQuintal: Number(form.pricePerQuintal),
          bonusPerQuintal: Number(form.bonusPerQuintal || 0),
          deadline: new Date(form.deadline).toISOString(),
          buyerId: userProfile?.uid || "buyer-pam-001",
        }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const newDemand = await res.json();
      setDemands((prev) => [newDemand, ...prev]);
      setShowForm(false);
      setForm({ cropId: "", targetQuantity: "", pricePerQuintal: "", bonusPerQuintal: "", deadline: "" });
    } catch (err: any) { alert(err.message); }
    finally { setSubmitting(false); }
  };

  const openCount   = demands.filter((d) => d.status === "open").length;
  const totalNeeded = demands.reduce((a, b) => a + b.targetQuantity, 0);
  const totalFilled = demands.reduce((a, b) => a + b.filledQuantity, 0);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: G.accent }} />
      <p className="text-sm font-semibold" style={{ color: G.textSub }}>Loading demands...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <AlertCircle className="w-8 h-8 text-red-400" />
      <p className="text-sm font-semibold text-red-400">{error}</p>
      <button onClick={fetchDemands} className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: G.accentDark }}>Retry</button>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {[
          { label: "Open Demands",  value: openCount,        icon: Package },
          { label: "Total Needed",  value: `${totalNeeded}q`, icon: TrendingUp },
          { label: "Total Filled",  value: `${totalFilled}q`, icon: CircleDollarSign },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="p-5 sm:p-6 flex items-center justify-between rounded-2xl"
            style={{ background: G.card, border: `1px solid ${G.border}`, backdropFilter: G.blur }}
          >
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1" style={{ color: G.textLabel }}>{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: G.textPrimary }}>{stat.value}</p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl" style={{ background: G.accentBg, border: `1px solid ${G.accentBorder}` }}>
              <stat.icon className="w-6 h-6" style={{ color: G.accent }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── HEADER + POST BUTTON ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">My Demand Requests</h2>
          <p className="text-xs mt-0.5" style={{ color: G.textSub }}>Post what you need — farmers will pool supply to match</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-widest"
          style={{ background: G.accentDark, color: "#fff", border: `1px solid ${G.accentBorder}`, boxShadow: "0 4px 20px rgba(45,106,79,0.4)" }}
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Post Demand"}
        </button>
      </div>

      {/* ── POST FORM ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-6 rounded-2xl space-y-5" style={{ background: G.card, border: `1px solid ${G.borderActive}`, backdropFilter: G.blur }}>
              <h3 className="font-bold text-white text-lg">New Demand Request</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Crop</label>
                  <select value={form.cropId} onChange={(e) => setForm((f) => ({ ...f, cropId: e.target.value }))} style={{ ...inputStyle, appearance: "none" as any }}>
                    <option value="" style={{ background: "#1a1a1a" }}>Select crop</option>
                    {crops.map((c) => <option key={c.id} value={c.id} style={{ background: "#1a1a1a" }}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Quantity Needed (Quintals)</label>
                  <input type="number" placeholder="e.g. 500" value={form.targetQuantity} onChange={(e) => setForm((f) => ({ ...f, targetQuantity: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Offered Price (₹/quintal)</label>
                  <input type="number" placeholder="e.g. 2200" value={form.pricePerQuintal} onChange={(e) => setForm((f) => ({ ...f, pricePerQuintal: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Bonus (₹/quintal) — optional</label>
                  <input type="number" placeholder="e.g. 100" value={form.bonusPerQuintal} onChange={(e) => setForm((f) => ({ ...f, bonusPerQuintal: e.target.value }))} style={inputStyle} />
                </div>
                <div className="sm:col-span-2">
                  <label style={labelStyle}>Deadline</label>
                  <input type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <button
                onClick={handlePost} disabled={submitting || !form.cropId || !form.targetQuantity || !form.pricePerQuintal || !form.deadline}
                className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: G.accentDark, color: "#fff", border: `1px solid ${G.accentBorder}`, boxShadow: "0 4px 20px rgba(45,106,79,0.4)" }}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-4 h-4" /><span>Post Demand</span></>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DEMAND CARDS ── */}
      {demands.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Package className="w-10 h-10" style={{ color: G.textLabel }} />
          <p className="text-sm font-semibold" style={{ color: G.textSub }}>No demands posted yet. Post your first demand above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {demands.map((demand, i) => {
            const crop = crops.find((c) => c.id === demand.cropId);
            const fillPct = Math.min(100, Math.round((demand.filledQuantity / demand.targetQuantity) * 100));
            const daysLeft = Math.ceil((new Date(demand.deadline).getTime() - Date.now()) / 86400000);
            const s = STATUS_STYLE[demand.status] || STATUS_STYLE.open;

            return (
              <motion.div
                key={demand.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="p-5 sm:p-6 rounded-2xl"
                style={{ background: G.card, border: `1px solid ${G.border}`, backdropFilter: G.blur, boxShadow: "0 4px 24px rgba(0,0,0,0.45)" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-black text-lg text-white">{crop?.name || "Unknown"} Demand</h3>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest" style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                        {demand.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold flex-wrap" style={{ color: G.textSub }}>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {demand.contributors} farmers contributing</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: G.textLabel }}>Offered Rate</p>
                    <p className="text-2xl font-mono font-black text-white">₹{demand.pricePerQuintal}</p>
                    {demand.bonusPerQuintal > 0 && (
                      <p className="text-xs font-bold mt-0.5" style={{ color: G.accent }}>+₹{demand.bonusPerQuintal} bonus</p>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                  <span style={{ color: G.textLabel }}>Supply Filled</span>
                  <span style={{ color: s.color }}>{fillPct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${fillPct}%` }} transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${G.accentDark}, ${s.color})` }}
                  />
                </div>
                <p className="text-[10px] font-semibold" style={{ color: G.textLabel }}>
                  {demand.filledQuantity}q filled · {demand.targetQuantity - demand.filledQuantity}q still needed
                </p>

                {demand.status === "filled" && (
                  <div className="mt-4 p-3.5 rounded-xl flex items-center gap-3" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#f59e0b" }} />
                    <p className="text-xs font-semibold" style={{ color: "#f59e0b" }}>
                      Demand fully filled — ready to initiate contract
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}