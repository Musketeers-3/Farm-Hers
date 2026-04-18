"use client";

import { useState, useEffect } from "react";
import { useAppStore, useTranslation } from "@/lib/store";
import {
  ArrowLeft, Truck, CheckCircle2, Shield,
  Package, Clock, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Image from "next/image";
import { BottomNav } from "./bottom-nav";

type OrderStatus = "pending" | "in-transit" | "quality-verified" | "payment-released";

// ── Shared glass token — matches farmer-dashboard exactly ──────────────────
const GLASS =
  "bg-white/[0.55] dark:bg-white/[0.06] backdrop-blur-[24px] border border-white/40 dark:border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]";

const GLASS_INNER =
  "bg-white/40 dark:bg-white/[0.07] backdrop-blur-md border border-white/50 dark:border-white/[0.08]";

const trackingSteps = [
  {
    id:      "pending",
    icon:    Package,
    title:   "Order Confirmed",
    titleHi: "ऑर्डर कन्फर्म",
    titlePa: "ਆਰਡਰ ਕਨਫਰਮ",
    desc:    "Your sale has been confirmed. Awaiting pickup.",
    time:    "Today, 10:30 AM",
  },
  {
    id:      "in-transit",
    icon:    Truck,
    title:   "In Transit",
    titleHi: "रास्ते में",
    titlePa: "ਰਸਤੇ ਵਿੱਚ",
    desc:    "Your crop is on the way to the buyer.",
    time:    "Estimated: 2 hours",
  },
  {
    id:      "quality-verified",
    icon:    CheckCircle2,
    title:   "Quality Verified",
    titleHi: "गुणवत्ता सत्यापित",
    titlePa: "ਗੁਣਵੱਤਾ ਪ੍ਰਮਾਣਿਤ",
    desc:    "Buyer inspects and confirms quality.",
    time:    "Pending",
  },
  {
    id:      "payment-released",
    icon:    Shield,
    title:   "Payment Released",
    titleHi: "भुगतान जारी",
    titlePa: "ਭੁਗਤਾਨ ਜਾਰੀ",
    desc:    "Escrow funds transferred to your account.",
    time:    "Pending",
  },
];

export function TrackingScreen() {
  const router   = useRouter();
  const language = useAppStore((state) => state.language);
  const t        = useTranslation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [status, setStatus] = useState<OrderStatus>("pending");
  const currentIndex = trackingSteps.findIndex((step) => step.id === status);

  useEffect(() => { setMounted(true); }, []);
  const isDark = resolvedTheme === "dark";

  const getTitle = (step: (typeof trackingSteps)[0]) => {
    if (language === "hi") return step.titleHi;
    if (language === "pa") return step.titlePa;
    return step.title;
  };

  const simulateNextStep = () => {
    if (currentIndex < trackingSteps.length - 1)
      setStatus(trackingSteps[currentIndex + 1].id as OrderStatus);
    else setStatus("pending");
  };

  return (
    <div className="relative min-h-screen pb-24 lg:pb-8 overflow-x-hidden">

      {/* ── FIXED BACKGROUND — same system as farmer-dashboard ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Light mode: original gradient, untouched */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${mounted && isDark ? "opacity-0" : "opacity-100"}`}
          style={{ background: "linear-gradient(135deg,#dcfce7 0%,#dcfce7 20%,#bfdbfe 100%)" }}
        />

        {/* Dark mode: farmers_bg.jpg at 0.8 opacity + dark green scrim */}
        {mounted && isDark && (
          <>
            <Image
              src="/images/farmers_bg.jpg"
              alt=""
              fill
              priority
              className="object-cover object-center"
              style={{ opacity: 0.8 }}
            />
            {/* Dark scrim — same palette as farmer-dashboard */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020c04]/80 via-[#040f06]/70 to-[#020c04]/88" />
            {/* Radial vignette for depth */}
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,20,8,0.25) 0%, rgba(2,8,3,0.65) 100%)" }}
            />
          </>
        )}

        {/* Light mode decorative wave SVG (unchanged) */}
        <div className={`absolute inset-0 overflow-hidden opacity-40 transition-opacity duration-500 ${mounted && isDark ? "opacity-0" : ""}`}>
          <svg viewBox="0 0 1200 800" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="trackWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#22c55e" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {[...Array(15)].map((_, i) => (
              <path
                key={i}
                d={`M-200 ${300 + i * 15} Q 300 ${100 - i * 10}, 600 ${400} T 1400 ${200 + i * 20}`}
                fill="none"
                stroke="url(#trackWaveGrad)"
                strokeWidth="1.5"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-white/75 dark:bg-[#020c04]/75 backdrop-blur-2xl border-b border-white/30 dark:border-white/[0.06] transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push("/farmer")}
            className={cn("w-10 h-10 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform", GLASS_INNER)}
          >
            <ArrowLeft className="w-5 h-5 text-slate-800 dark:text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.tracking || "Live Tracking"}
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/30">
              Order #AGR-2026-0412
            </p>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Order summary card */}
        <div className={cn("rounded-[32px] p-6", GLASS)}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                Wheat — 50 Quintals
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-white/40">
                Sold via FarmHers Pool
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹1,21,250</p>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-500">+₹7,500 bonus</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-white/60 p-3 rounded-xl",
            GLASS_INNER,
          )}>
            <Clock className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>Estimated completion: Tomorrow, 6:00 PM</span>
          </div>
        </div>

        {/* Timeline card */}
        <div className={cn("rounded-[32px] p-6 sm:p-8", GLASS)}>
          <div className="relative">
            {trackingSteps.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isActive    = index === currentIndex;
              const isPending   = index > currentIndex;

              return (
                <div key={step.id} className="relative flex gap-5 pb-8 last:pb-0">
                  {/* Connector line */}
                  {index !== trackingSteps.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-black/10 dark:bg-white/10 rounded-full">
                      <motion.div
                        className="absolute top-0 w-full bg-emerald-500 rounded-full"
                        initial={{ height: "0%" }}
                        animate={{ height: isCompleted ? "100%" : "0%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </div>
                  )}

                  {/* Step icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor: isCompleted || isActive ? "#10b981" : undefined,
                        scale: isActive ? 1.15 : 1,
                      }}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shadow-md relative",
                        isCompleted || isActive
                          ? "text-white"
                          : "bg-white/50 dark:bg-white/[0.07] text-slate-400 dark:text-white/30 border border-white/50 dark:border-white/[0.08]",
                      )}
                    >
                      <step.icon className="w-4 h-4" strokeWidth={isActive ? 3 : 2} />
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-emerald-500"
                          initial={{ opacity: 0.8, scale: 1 }}
                          animate={{ opacity: 0, scale: 1.6 }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                        />
                      )}
                    </motion.div>
                  </div>

                  {/* Step text */}
                  <div className={cn("pt-2 transition-opacity duration-300", isPending ? "opacity-40" : "opacity-100")}>
                    <div className="flex items-center gap-2">
                      <h4 className={cn(
                        "font-bold text-lg",
                        isActive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-900 dark:text-white",
                      )}>
                        {getTitle(step)}
                      </h4>
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-white/50 mt-1">
                      {step.desc}
                    </p>
                    <p className={cn(
                      "text-xs font-bold mt-1.5 uppercase tracking-wider",
                      isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-white/25",
                    )}>
                      {step.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Escrow card */}
        <div className={cn("rounded-[24px] p-5 flex items-center gap-4", GLASS)}>
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", GLASS_INNER)}>
            <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">Escrow Protected</h4>
            <p className="text-xs font-medium text-slate-500 dark:text-white/40 mt-0.5">
              Funds securely held in an RBI-compliant nodal account until delivery.
            </p>
          </div>
        </div>

        {/* Simulate button */}
        <button
          onClick={simulateNextStep}
          className="w-full flex items-center justify-center gap-2 py-4
            bg-slate-900 hover:bg-slate-800
            dark:bg-white/[0.08] dark:hover:bg-white/[0.13]
            dark:border dark:border-white/[0.09]
            text-white dark:text-white
            rounded-2xl text-sm font-bold transition-all shadow-xl dark:shadow-none
            backdrop-blur-sm"
        >
          <span>Simulate Logistics Update</span>
          <ChevronRight className="w-4 h-4" />
        </button>

      </main>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
