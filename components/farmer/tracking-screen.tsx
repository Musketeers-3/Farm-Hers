"use client";

import { useState } from "react";
import { useAppStore, useTranslation } from "@/lib/store";
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  Shield,
  Package,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BottomNav } from "./bottom-nav";

type OrderStatus =
  | "pending"
  | "in-transit"
  | "quality-verified"
  | "payment-released";

const GLASS_CLASSES =
  "bg-white/[0.55] dark:bg-slate-900/[0.55] backdrop-blur-[24px] border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]";

const trackingSteps = [
  {
    id: "pending",
    icon: Package,
    title: "Order Confirmed",
    titleHi: "ऑर्डर कन्फर्म",
    titlePa: "ਆਰਡਰ ਕਨਫਰਮ",
    desc: "Your sale has been confirmed. Awaiting pickup.",
    time: "Today, 10:30 AM",
  },
  {
    id: "in-transit",
    icon: Truck,
    title: "In Transit",
    titleHi: "रास्ते में",
    titlePa: "ਰਸਤੇ ਵਿੱਚ",
    desc: "Your crop is on the way to the buyer.",
    time: "Estimated: 2 hours",
  },
  {
    id: "quality-verified",
    icon: CheckCircle2,
    title: "Quality Verified",
    titleHi: "गुणवत्ता सत्यापित",
    titlePa: "ਗੁਣਵੱਤਾ ਪ੍ਰਮਾਣਿਤ",
    desc: "Buyer inspects and confirms quality.",
    time: "Pending",
  },
  {
    id: "payment-released",
    icon: Shield,
    title: "Payment Released",
    titleHi: "भुगतान जारी",
    titlePa: "ਭੁਗਤਾਨ ਜਾਰੀ",
    desc: "Escrow funds transferred to your account.",
    time: "Pending",
  },
];

export function TrackingScreen() {
  const router = useRouter();
  const language = useAppStore((state) => state.language);
  const t = useTranslation();

  const [status, setStatus] = useState<OrderStatus>("pending");
  const currentIndex = trackingSteps.findIndex((step) => step.id === status);

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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push("/farmer")}
            className="w-10 h-10 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-white/10 flex items-center justify-center hover:scale-105 transition-transform text-slate-800 dark:text-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {t.tracking || "Live Tracking"}
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Order #AGR-2026-0412
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className={cn("rounded-[32px] p-6", GLASS_CLASSES)}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-50 text-lg">
                Wheat - 50 Quintals
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Sold via FarmHers Pool
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ₹1,21,250
              </p>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-500">
                +₹7,500 bonus
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-slate-800/40 p-3 rounded-xl border border-white/50 dark:border-white/10">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>Estimated completion: Tomorrow, 6:00 PM</span>
          </div>
        </div>

        <div className={cn("rounded-[32px] p-6 sm:p-8", GLASS_CLASSES)}>
          <div className="relative">
            {trackingSteps.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isActive = index === currentIndex;
              const isPending = index > currentIndex;

              return (
                <div
                  key={step.id}
                  className="relative flex gap-5 pb-8 last:pb-0"
                >
                  {index !== trackingSteps.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-800 rounded-full">
                      <motion.div
                        className="absolute top-0 w-full bg-emerald-500 rounded-full"
                        initial={{ height: "0%" }}
                        animate={{ height: isCompleted ? "100%" : "0%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </div>
                  )}

                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor:
                          isCompleted || isActive
                            ? "#10b981"
                            : "var(--tw-colors-slate-200)",
                        color:
                          isCompleted || isActive
                            ? "#ffffff"
                            : "var(--tw-colors-slate-500)",
                        scale: isActive ? 1.15 : 1,
                      }}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shadow-md relative",
                        !isCompleted &&
                          !isActive &&
                          "dark:bg-slate-800 dark:text-slate-500",
                      )}
                    >
                      <step.icon
                        className="w-4 h-4"
                        strokeWidth={isActive ? 3 : 2}
                      />
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-emerald-500"
                          initial={{ opacity: 0.8, scale: 1 }}
                          animate={{ opacity: 0, scale: 1.6 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeOut",
                          }}
                        />
                      )}
                    </motion.div>
                  </div>

                  <div
                    className={cn(
                      "pt-2 transition-opacity duration-300",
                      isPending ? "opacity-40" : "opacity-100",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <h4
                        className={cn(
                          "font-bold text-lg",
                          isActive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-900 dark:text-slate-50",
                        )}
                      >
                        {getTitle(step)}
                      </h4>
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                      {step.desc}
                    </p>
                    <p
                      className={cn(
                        "text-xs font-bold mt-1.5 uppercase tracking-wider",
                        isActive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-500",
                      )}
                    >
                      {step.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={cn(
            "rounded-[24px] p-5 flex items-center gap-4 border-emerald-500/20 bg-emerald-500/5",
            GLASS_CLASSES,
          )}
        >
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-emerald-100 dark:border-emerald-900 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-50">
              Escrow Protected
            </h4>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Funds securely held in an RBI-compliant nodal account until
              delivery.
            </p>
          </div>
        </div>

        <button
          onClick={simulateNextStep}
          className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white rounded-2xl text-sm font-bold transition-colors shadow-xl"
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
