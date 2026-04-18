"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Mic,
  Sprout,
  Globe2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Users,
  Play,
} from "lucide-react";
import { AgriLinkLogo } from "@/components/agrilink-logo";

const GLASS_PANEL =
  "bg-white/5 dark:bg-[#020c04]/40 backdrop-blur-[24px] border border-white/20 dark:border-white/[0.08] shadow-2xl";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  // Parallax effects for the hero section
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 overflow-x-hidden">
      {/* ── BACKGROUND EFFECTS ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between p-3 rounded-3xl transition-all duration-500 ${GLASS_PANEL}`}
        >
          <div className="flex items-center gap-2 px-2">
            <AgriLinkLogo size="md" className="text-white drop-shadow-md" />
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-4 border-r border-white/10">
              Built by FarmHers
            </span>
            <button
              onClick={() => router.push("/onboarding")}
              className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-95 hover:scale-100"
            >
              Launch App
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 pt-40 pb-20 px-6 min-h-screen flex items-center">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left: Typography */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md"
            >
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                Google Solution Challenge 2026
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05]"
            >
              The Voice of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400">
                Bharat's Farmers.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg sm:text-xl text-slate-400 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              A voice-first, AI-driven market intelligence platform. Bypassing
              middlemen, unlocking direct enterprise contracts, and fighting for
              zero hunger through smart micro-pooling.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4"
            >
              <button
                onClick={() => router.push("/onboarding")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-950 font-black text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5 fill-current" /> Watch Demo
              </button>
            </motion.div>
          </div>

          {/* Right: Floating Bolo Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute inset-4 border border-emerald-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-8 border border-emerald-400/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

              <div
                className={`relative z-10 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.5)] ${GLASS_PANEL}`}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Mic
                    className="w-20 h-20 text-white drop-shadow-2xl"
                    strokeWidth={1.5}
                  />
                </motion.div>
              </div>

              {/* Floating UI Badges */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className={`absolute top-10 -left-10 px-4 py-2 rounded-2xl ${GLASS_PANEL} flex items-center gap-2`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Listening in Punjabi
                </span>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity }}
                className={`absolute bottom-20 -right-12 px-4 py-2 rounded-2xl ${GLASS_PANEL} flex items-center gap-2`}
              >
                <span className="text-xl">🌾</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Wheat Listed
                  </span>
                  <span className="text-xs font-black text-emerald-400">
                    + 500 Quintals
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── IMPACT BAR (SDGs) ── */}
      <section className="relative z-20 py-8 border-y border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center sm:justify-between items-center gap-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Targeting UN SDGs
          </p>
          <div className="flex items-center gap-8 lg:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-3">
              <span className="text-3xl">2</span>
              <span className="font-black leading-tight text-sm">
                ZERO
                <br />
                HUNGER
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">8</span>
              <span className="font-black leading-tight text-sm">
                DECENT WORK &<br />
                ECONOMIC GROWTH
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">9</span>
              <span className="font-black leading-tight text-sm">
                INDUSTRY &<br />
                INNOVATION
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">12</span>
              <span className="font-black leading-tight text-sm">
                RESPONSIBLE
                <br />
                CONSUMPTION
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO GRID FEATURES ── */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Empowerment at Scale.
            </h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto">
              Built for the realities of rural connectivity, designed for the
              future of global agriculture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Voice AI (Spans 2 columns on tablet/desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`md:col-span-2 rounded-[2rem] p-8 sm:p-12 relative overflow-hidden group ${GLASS_PANEL}`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-8">
                  <Mic className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-3">
                    Bolo Voice Assistant
                  </h3>
                  <p className="text-slate-400 font-medium max-w-md">
                    Illiteracy is no longer a barrier. Farmers can ask for
                    prices, list crops, and join auctions entirely through
                    natural local dialects (Hindi, Punjabi).
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Micro-Pooling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`rounded-[2rem] p-8 sm:p-12 relative overflow-hidden group ${GLASS_PANEL}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-8">
                  <Users className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3">Micro-Pooling</h3>
                  <p className="text-slate-400 font-medium text-sm">
                    Smallholder farmers combine their yields to fulfill massive
                    corporate contracts, unlocking premium tier pricing.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Smart Escrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`rounded-[2rem] p-8 sm:p-12 relative overflow-hidden group ${GLASS_PANEL}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-8">
                  <ShieldCheck className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3">100% Secure</h3>
                  <p className="text-slate-400 font-medium text-sm">
                    Smart escrow ensures buyers get verified quality and farmers
                    get paid instantly upon delivery. Zero default risk.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 4: Live Market Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`md:col-span-2 rounded-[2rem] p-8 sm:p-12 relative overflow-hidden group ${GLASS_PANEL}`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-8">
                  <TrendingUp className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-3">
                    Live Mandi Intelligence
                  </h3>
                  <p className="text-slate-400 font-medium max-w-md">
                    IoT integration and live data feeds provide real-time price
                    tracking, ensuring farmers never sell below fair market
                    value again.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40 pt-20 pb-10 px-6 text-center">
        <h2 className="text-4xl font-black mb-6">
          Ready to change the system?
        </h2>
        <button
          onClick={() => router.push("/onboarding")}
          className="px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.3)]"
        >
          Launch AgriLink Platform
        </button>
        <p className="mt-16 text-xs font-bold text-slate-500 tracking-widest uppercase">
          © 2026 FarmHers Team • Google Solution Challenge
        </p>
      </footer>
    </div>
  );
}
