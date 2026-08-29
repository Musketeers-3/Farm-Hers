"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowLeft, User, MapPin, Moon, Sun, Bell,
  ChevronRight, Shield, CreditCard, LogOut,
  Smartphone, Mail, CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/lib/auth";

function LightBg() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(130deg, #d6f5e3 0%, #e8faf2 22%, #f0fdf8 40%, #e8f5fb 62%, #daeef8 80%, #d0eaf6 100%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 55% 50% at 0% 15%, rgba(167,243,208,0.65) 0%, transparent 60%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 50% 55% at 100% 60%, rgba(186,230,253,0.55) 0%, transparent 60%)"
      }} />
    </div>
  );
}

function DarkBg() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(145deg, #071c14 0%, #040f0a 40%, #06151f 70%, #040d14 100%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 50% 60% at -5% 50%, rgba(22,163,74,0.30) 0%, transparent 65%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 45% 55% at 105% 50%, rgba(16,185,129,0.20) 0%, transparent 65%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 55% 35% at 50% 15%, rgba(74,222,128,0.08) 0%, transparent 55%)"
      }} />
    </div>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, setIsLoggedIn, setHasOnboarded, language, setLanguage } = useAppStore();
  const { setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isDark = resolvedTheme === "dark";
  const toggleDarkMode = () => setTheme(isDark ? "light" : "dark");

  const handleSignOut = async () => {
    await logout();
    setIsLoggedIn(false);
    setHasOnboarded(false);
    router.replace("/");
  };

  const languageLabels = { en: "English", hi: "हिंदी", pa: "ਪੰਜਾਬੀ" };

  if (!mounted) return null;

  const menuItems = [
    { label: "Notification Pulse", sub: "Market updates", Ico: Bell,       isNotif: true },
    { label: "Wallet & Payouts",   sub: null,             Ico: CreditCard,  isNotif: false },
    { label: "Security Vault",     sub: null,             Ico: Shield,      isNotif: false },
    { label: "Device Link",        sub: null,             Ico: Smartphone,  isNotif: false },
    { label: "AgriLink Helpdesk",  sub: null,             Ico: Mail,        isNotif: false },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {isDark ? <DarkBg /> : <LightBg />}

      {/* NAV */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 pb-4 flex items-center justify-between">
        <NavBtn onClick={() => router.back()}>
          <ArrowLeft size={20} className="text-[#14532d] dark:text-emerald-300" />
        </NavBtn>
        <div className="text-center">
          <p className="font-extrabold text-base lg:text-lg tracking-wide text-[#14532d] dark:text-white">AgriLink Profile</p>
          <p className="text-[10px] lg:text-xs font-semibold text-[#15803d]/50 dark:text-white/30">Account Settings</p>
        </div>
        <NavBtn onClick={toggleDarkMode}>
          {isDark
            ? <Sun size={20} className="text-[#14532d] dark:text-emerald-300" />
            : <Moon size={20} className="text-[#14532d] dark:text-emerald-300" />
          }
        </NavBtn>
      </div>

      {/* MAIN CONTENT — responsive width */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={cn(
            "relative rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden",
            "bg-white/65 dark:bg-black/[0.35]",
            "backdrop-blur-xl",
            "border border-white/40 dark:border-white/[0.08]",
            "shadow-[0_8px_48px_rgba(134,239,172,0.20),0_2px_60px_rgba(186,230,253,0.18)]",
            "dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          )}
        >
          {/* Corner glows */}
          <div className="absolute top-0 left-0 w-64 h-44 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(167,243,208,0.30) 0%, transparent 55%)" }} />
          <div className="absolute bottom-0 right-0 w-48 h-36 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 100% 100%, rgba(186,230,253,0.25) 0%, transparent 55%)" }} />
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-0 dark:opacity-100"
            style={{ background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)", transform: "translate(24px, -24px)" }} />

          <div className="relative z-10 p-5 lg:p-8">

            {/* TWO-COLUMN LAYOUT ON DESKTOP */}
            <div className="flex flex-col lg:flex-row lg:gap-8">

              {/* LEFT COLUMN — Profile info */}
              <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">

                {/* PROFILE CARD */}
                <GlassCard>
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="absolute inset-[-8px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(74,222,128,0.30) 0%, transparent 70%)", filter: "blur(5px)" }} />
                      <div className={cn(
                        "relative w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden",
                        "border-2 border-emerald-300/70 dark:border-emerald-400/50",
                        "dark:shadow-[0_0_30px_rgba(74,222,128,0.45)]"
                      )}>
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-200 to-emerald-400 dark:from-emerald-500/30 dark:to-emerald-600/40">
                          <User size={28} className="text-white dark:text-emerald-300" strokeWidth={1.5} />
                        </div>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#071c14] bg-emerald-500 dark:bg-emerald-400 flex items-center justify-center">
                        <CheckCircle size={8} className="text-white dark:text-emerald-900" />
                      </div>
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h2 className="text-base lg:text-lg font-extrabold tracking-tight text-[#14532d] dark:text-white">
                          {userProfile?.fullName || "AgriLink User"}
                        </h2>
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300">
                          {userProfile?.role || "Member"}
                        </span>
                      </div>
                      <p className="flex items-center gap-1 mt-0.5 text-xs lg:text-sm font-medium text-emerald-600 dark:text-emerald-400/70">
                        <MapPin size={10} /> {userProfile?.location || "India"}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-5">
                    {[
                      { label: "Auctions", value: "12"    },
                      { label: "Earnings", value: "₹2.4L" },
                      { label: "Rating",   value: "4.9 ⭐" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl py-2.5 lg:py-3 flex flex-col items-center gap-0.5 bg-white/70 dark:bg-white/[0.06]">
                        <p className="font-extrabold text-xs lg:text-sm text-[#14532d] dark:text-white">{s.value}</p>
                        <p className="text-[8px] lg:text-[9px] uppercase font-bold tracking-widest text-[#15803d]/45 dark:text-emerald-400/45">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* LANGUAGE CARD */}
                <GlassCard>
                  <p className="text-[9px] lg:text-[10px] uppercase font-bold tracking-widest mb-2 text-[#15803d]/45 dark:text-emerald-400/45">App Language</p>
                  <div className="flex p-1 rounded-xl bg-emerald-50/45 dark:bg-white/[0.05]">
                    {(["en", "hi", "pa"] as const).map((lang) => (
                      <button key={lang} onClick={() => setLanguage(lang)}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-[11px] lg:text-xs font-bold transition-all duration-300",
                          language === lang
                            ? "bg-[#16a34a] text-white shadow-[0_2px_12px_rgba(22,163,74,0.30)] dark:bg-emerald-500/30 dark:text-emerald-300 dark:shadow-[0_0_16px_rgba(74,222,128,0.25)]"
                            : "text-[#15803d]/50 dark:text-emerald-400/45 hover:bg-emerald-100/50 dark:hover:bg-white/[0.05]"
                        )}>
                        {languageLabels[lang]}
                      </button>
                    ))}
                  </div>
                </GlassCard>

                {/* SIGN OUT — desktop sidebar */}
                <button onClick={handleSignOut}
                  className={cn(
                    "w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm",
                    "transition-all hover:scale-[1.01] active:scale-[0.98] group",
                    "bg-white/55 dark:bg-red-500/10",
                    "border border-white/40 dark:border-red-500/20",
                    "text-red-600 dark:text-red-400",
                    "hover:bg-red-50 dark:hover:bg-red-500/15",
                    "shadow-sm dark:shadow-[0_0_20px_rgba(239,68,68,0.10)]",
                    "backdrop-blur-sm"
                  )}>
                  <LogOut size={15} className="group-hover:-translate-x-1 transition-transform" />
                  Sign Out of AgriLink
                </button>
              </div>

              {/* RIGHT COLUMN — Menu items */}
              <div className="flex-1 min-w-0 pt-4 lg:pt-0">

                {/* MENU ITEMS CARD */}
                <div className={cn(
                  "rounded-2xl overflow-hidden",
                  "bg-white/40 dark:bg-white/[0.06]",
                  "border border-white/65 dark:border-white/[0.08]",
                  "backdrop-blur-[20px]",
                  "dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                )}>
                  {menuItems.map((item, idx) => (
                    <div key={item.label}>
                      {/* Item row */}
                      <button
                        onClick={item.isNotif ? () => setShowNotif(!showNotif) : undefined}
                        className="w-full flex items-center justify-between px-5 py-4 lg:py-4 transition-all hover:bg-emerald-50/50 dark:hover:bg-white/[0.09] active:bg-emerald-100/50 dark:active:bg-white/[0.05]"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center shrink-0",
                            "bg-emerald-100/85 dark:bg-emerald-500/10",
                            "shadow-[0_0_12px_rgba(74,222,128,0.20)]",
                            "text-emerald-600 dark:text-emerald-400"
                          )}>
                            <item.Ico size={16} className="lg:w-[18px] lg:h-[18px]" />
                          </div>
                          <div className="text-left">
                            <span className="block font-bold text-[14px] lg:text-[15px] text-[#14532d] dark:text-white">{item.label}</span>
                            {item.sub && (
                              <span className="text-[11px] lg:text-xs font-semibold text-[#15803d]/45 dark:text-emerald-400/45">{item.sub}</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-emerald-500 dark:text-emerald-400 transition-transform duration-300 mr-1" style={{ transform: item.isNotif && showNotif ? "rotate(90deg)" : "rotate(0)" }} />
                      </button>

                      {/* Notification sub-panel */}
                      {item.isNotif && (
                        <AnimatePresence>
                          {showNotif && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22 }}
                              className="overflow-hidden"
                            >
                              <div className="mx-5 mb-3 rounded-xl overflow-hidden bg-emerald-50/55 dark:bg-white/[0.06]">
                                {["Market Price Alerts", "Smart Pool Invites", "Payment Updates"].map((lbl, i, arr) => (
                                  <YesNoRow key={lbl} label={lbl} divider={i < arr.length - 1} />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}

                      {/* Divider between items (not after last) */}
                      {idx < menuItems.length - 1 && (
                        <div className="mx-5" style={{ height: "1px", background: "rgba(134,239,172,0.15)" }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "p-4 lg:p-5 rounded-2xl overflow-hidden",
      "bg-white/40 dark:bg-white/[0.06]",
      "border border-white/65 dark:border-white/[0.08]",
      "backdrop-blur-[20px]",
      "dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)]",
      className
    )}>
      {children}
    </div>
  );
}

function NavBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className={cn(
        "w-10 h-10 lg:w-11 lg:h-11 rounded-2xl flex items-center justify-center",
        "transition-all hover:scale-110 active:scale-95",
        "bg-white/70 dark:bg-white/[0.07]",
        "border border-white/40 dark:border-white/[0.08]",
        "shadow-[0_2px_14px_rgba(134,239,172,0.14)] dark:shadow-[0_0_16px_rgba(74,222,128,0.12)]",
        "backdrop-blur-xl"
      )}>
      {children}
    </button>
  );
}

function YesNoRow({ label, divider }: { label: string; divider: boolean }) {
  const [val, setVal] = useState<"yes" | "no">("yes");
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[13px] lg:text-sm font-semibold text-[#14532d] dark:text-white">{label}</span>
        <div className="flex rounded-full p-0.5 bg-emerald-50/45 dark:bg-white/[0.05]">
          {(["yes", "no"] as const).map((opt) => (
            <button key={opt} onClick={() => setVal(opt)}
              className={cn(
                "px-3 py-1 rounded-full text-[12px] lg:text-[13px] font-bold capitalize transition-all duration-200",
                val === opt
                  ? opt === "yes"
                    ? "bg-[#16a34a] text-white shadow-[0_0_8px_rgba(22,163,74,0.45)]"
                    : "bg-red-500 text-white shadow-[0_0_8px_rgba(220,38,38,0.40)]"
                  : "text-[#15803d]/45 dark:text-emerald-400/45"
              )}>
              {opt === "yes" ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>
      {divider && <div className="mx-4" style={{ height: "1px", background: "rgba(134,239,172,0.15)" }} />}
    </div>
  );
}
