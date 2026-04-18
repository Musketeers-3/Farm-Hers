"use client";

import { useState, useEffect } from "react";
import { useAppStore, useTranslation } from "@/lib/store";
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
      {/* Base gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(130deg, #d6f5e3 0%, #e8faf2 22%, #f0fdf8 40%, #e8f5fb 62%, #daeef8 80%, #d0eaf6 100%)"
      }} />

      {/* Soft radial glows */}
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

function useTokens(isDark: boolean) {
  return isDark ? {
    outerCard:        "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
    outerShadow:      "0 0 60px rgba(74,222,128,0.18), 0 24px 80px rgba(0,0,0,0.55)",
    outerBlur:        "blur(32px)",
    cornerGlowTL:     "radial-gradient(ellipse at 0% 0%, rgba(134,239,172,0.12) 0%, transparent 60%)",
    cornerGlowBR:     "radial-gradient(ellipse at 100% 100%, rgba(16,185,129,0.10) 0%, transparent 60%)",
    rowBg:            "rgba(255,255,255,0.055)",
    rowShadow:        "0 1px 0 rgba(134,239,172,0.10) inset",
    dividerColor:     "rgba(134,239,172,0.10)",
    statBg:           "rgba(255,255,255,0.05)",
    statShadow:       "none",
    statValue:        "#ffffff",
    statLabel:        "rgba(134,239,172,0.45)",
    iconBg:           "rgba(74,222,128,0.10)",
    iconShadow:       "0 0 12px rgba(74,222,128,0.20)",
    iconColor:        "#4ade80",
    navBg:            "rgba(255,255,255,0.07)",
    navShadow:        "0 0 16px rgba(74,222,128,0.12)",
    navIcon:          "#4ade80",
    titleText:        "#ffffff",
    subText:          "rgba(134,239,172,0.50)",
    nameText:         "#ffffff",
    locationText:     "rgba(134,239,172,0.70)",
    labelText:        "rgba(134,239,172,0.45)",
    menuText:         "#ffffff",
    badge:            "rgba(74,222,128,0.12)",
    badgeText:        "#4ade80",
    langBarBg:        "rgba(255,255,255,0.05)",
    langActiveBg:     "rgba(22,163,74,0.30)",
    langActiveColor:  "#4ade80",
    langActiveShadow: "0 0 16px rgba(74,222,128,0.25)",
    langIdleColor:    "rgba(134,239,172,0.45)",
    notifRowBg:       "transparent",
    notifDivider:     "rgba(134,239,172,0.10)",
    yesNoBg:          "rgba(74,222,128,0.08)",
    idleOptColor:     "rgba(134,239,172,0.45)",
    signOutBg:        "rgba(239,68,68,0.08)",
    signOutText:      "#f87171",
    signOutShadow:    "0 0 20px rgba(239,68,68,0.10)",
    avatarBorder:     "rgba(134,239,172,0.70)",
    avatarGlow:       "0 0 30px rgba(74,222,128,0.45)",
    avatarInner:      "linear-gradient(135deg, rgba(74,222,128,0.25), rgba(16,185,129,0.35))",
    avatarIcon:       "#4ade80",
    avatarDotBg:      "#16a34a",
    avatarDotBorder:  "#071c14",
  } : {
    outerCard:        "rgba(255,255,255,0.65)",
    outerShadow:      "0 8px 48px rgba(134,239,172,0.20), 0 2px 60px rgba(186,230,253,0.18)",
    outerBlur:        "blur(24px)",
    cornerGlowTL:     "radial-gradient(ellipse at 0% 0%, rgba(167,243,208,0.30) 0%, transparent 55%)",
    cornerGlowBR:     "radial-gradient(ellipse at 100% 100%, rgba(186,230,253,0.25) 0%, transparent 55%)",
    rowBg:            "rgba(255,255,255,0.60)",
    rowShadow:        "none",
    dividerColor:     "rgba(134,239,172,0.25)",
    statBg:           "rgba(255,255,255,0.70)",
    statShadow:       "none",
    statValue:        "#14532d",
    statLabel:        "rgba(22,101,52,0.45)",
    iconBg:           "rgba(220,252,231,0.85)",
    iconShadow:       "none",
    iconColor:        "#16a34a",
    navBg:            "rgba(255,255,255,0.70)",
    navShadow:        "0 2px 14px rgba(134,239,172,0.14)",
    navIcon:          "#16a34a",
    titleText:        "#14532d",
    subText:          "rgba(22,101,52,0.50)",
    nameText:         "#14532d",
    locationText:     "#16a34a",
    labelText:        "rgba(22,101,52,0.45)",
    menuText:         "#14532d",
    badge:            "rgba(187,247,208,0.80)",
    badgeText:        "#15803d",
    langBarBg:        "rgba(220,252,231,0.45)",
    langActiveBg:     "#16a34a",
    langActiveColor:  "#ffffff",
    langActiveShadow: "0 2px 12px rgba(22,163,74,0.30)",
    langIdleColor:    "rgba(22,101,52,0.50)",
    notifRowBg:       "transparent",
    notifDivider:     "rgba(134,239,172,0.25)",
    yesNoBg:          "rgba(220,252,231,0.55)",
    idleOptColor:     "rgba(22,101,52,0.45)",
    signOutBg:        "rgba(255,255,255,0.55)",
    signOutText:      "#dc2626",
    signOutShadow:    "none",
    avatarBorder:     "rgba(134,239,172,0.75)",
    avatarGlow:       "0 0 24px rgba(74,222,128,0.30)",
    avatarInner:      "linear-gradient(135deg, #86efac, #16a34a)",
    avatarIcon:       "#ffffff",
    avatarDotBg:      "#16a34a",
    avatarDotBorder:  "#ffffff",
  };
}

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, setIsLoggedIn, setHasOnboarded, language, setLanguage } = useAppStore();
  const { setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isDark = resolvedTheme === "dark";
  const T = useTokens(isDark);
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
    <div className="min-h-screen relative overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {isDark ? <DarkBg /> : <LightBg />}

      {/* NAV */}
      <div className="relative z-20 max-w-sm mx-auto px-5 pt-10 pb-4 flex items-center justify-between">
        <NavBtn T={T} onClick={() => router.back()}>
          <ArrowLeft size={18} style={{ color: T.navIcon }} />
        </NavBtn>
        <div className="text-center">
          <p className="font-extrabold text-sm tracking-wide" style={{ color: T.titleText }}>AgriLink Profile</p>
          <p className="text-[10px] font-semibold" style={{ color: T.subText }}>Account Settings</p>
        </div>
        <NavBtn T={T} onClick={toggleDarkMode}>
          {isDark ? <Sun size={18} style={{ color: T.navIcon }} /> : <Moon size={18} style={{ color: T.navIcon }} />}
        </NavBtn>
      </div>

      {/* SINGLE OUTER GLASS CARD — narrower max-w-sm */}
      <div className="relative z-10 max-w-sm mx-auto px-3 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative rounded-[2.4rem] overflow-hidden"
          style={{
            background: T.outerCard,
            backdropFilter: T.outerBlur,
            WebkitBackdropFilter: T.outerBlur,
            boxShadow: T.outerShadow,
          }}
        >
          {/* Corner glows — no border */}
          <div className="absolute top-0 left-0 w-64 h-44 pointer-events-none"
            style={{ background: T.cornerGlowTL }} />
          <div className="absolute bottom-0 right-0 w-48 h-36 pointer-events-none"
            style={{ background: T.cornerGlowBR }} />

          <div className="relative z-10 p-5 space-y-3">

            {/* PROFILE ROW */}
            <Glass T={T}>
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="absolute inset-[-8px] rounded-full" style={{
                    background: "radial-gradient(circle, rgba(74,222,128,0.30) 0%, transparent 70%)",
                    filter: "blur(5px)",
                  }} />
                  <div className="relative w-16 h-16 rounded-full overflow-hidden"
                    style={{ border: `2px solid ${T.avatarBorder}`, boxShadow: T.avatarGlow }}>
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: T.avatarInner }}>
                      <User size={28} style={{ color: T.avatarIcon }} strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{ background: T.avatarDotBg, borderColor: T.avatarDotBorder }}>
                    <CheckCircle size={8} className="text-white" />
                  </div>
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-base font-extrabold tracking-tight" style={{ color: T.nameText }}>
                      {userProfile?.fullName || "AgriLink User"}
                    </h2>
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest"
                      style={{ background: T.badge, color: T.badgeText }}>
                      {userProfile?.role || "Member"}
                    </span>
                  </div>
                  <p className="flex items-center gap-1 mt-0.5 text-xs font-medium"
                    style={{ color: T.locationText }}>
                    <MapPin size={10} /> {userProfile?.location || "India"}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[
                  { label: "Auctions", value: "12"    },
                  { label: "Earnings", value: "₹2.4L" },
                  { label: "Rating",   value: "4.9 ⭐" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl py-2.5 flex flex-col items-center gap-0.5"
                    style={{ background: T.statBg }}>
                    <p className="font-extrabold text-xs" style={{ color: T.statValue }}>{s.value}</p>
                    <p className="text-[8px] uppercase font-bold tracking-widest" style={{ color: T.statLabel }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </Glass>

            {/* LANGUAGE ROW */}
            <Glass T={T}>
              <p className="text-[9px] uppercase font-bold tracking-widest mb-2" style={{ color: T.labelText }}>App Language</p>
              <div className="flex p-1 rounded-xl" style={{ background: T.langBarBg }}>
                {(["en", "hi", "pa"] as const).map((lang) => (
                  <button key={lang} onClick={() => setLanguage(lang)}
                    className="flex-1 py-2 rounded-lg text-[11px] font-bold transition-all duration-300"
                    style={language === lang
                      ? { background: T.langActiveBg, color: T.langActiveColor, boxShadow: T.langActiveShadow }
                      : { color: T.langIdleColor }}>
                    {languageLabels[lang]}
                  </button>
                ))}
              </div>
            </Glass>

            {/* ALL 5 MENU ITEMS IN ONE GLASS CARD */}
            <Glass T={T} noPad>
              {menuItems.map((item, idx) => (
                <div key={item.label}>
                  {/* Item row */}
                  <button
                    onClick={item.isNotif ? () => setShowNotif(!showNotif) : undefined}
                    className="w-full flex items-center justify-between px-4 py-3.5 transition-all hover:bg-white/10 active:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <GlowIcon T={T}><item.Ico size={15} /></GlowIcon>
                      <div className="text-left">
                        <span className="block font-bold text-[13px]" style={{ color: T.menuText }}>{item.label}</span>
                        {item.sub && (
                          <span className="text-[10px] font-semibold" style={{ color: T.labelText }}>{item.sub}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={14} style={{
                      color: T.iconColor,
                      transform: item.isNotif && showNotif ? "rotate(90deg)" : "rotate(0)",
                      transition: "transform 0.3s",
                    }} />
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
                          <div className="mx-4 mb-3 rounded-xl overflow-hidden"
                            style={{ background: T.yesNoBg }}>
                            {["Market Price Alerts", "Smart Pool Invites", "Payment Updates"].map((lbl, i, arr) => (
                              <YesNoRow key={lbl} label={lbl} T={T} divider={i < arr.length - 1} />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {/* Divider between items (not after last) */}
                  {idx < menuItems.length - 1 && (
                    <div className="mx-4" style={{ height: "1px", background: T.dividerColor }} />
                  )}
                </div>
              ))}
            </Glass>

            {/* SIGN OUT */}
            <button onClick={handleSignOut}
              className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.98] group"
              style={{ background: T.signOutBg, backdropFilter: "blur(8px)", color: T.signOutText, boxShadow: T.signOutShadow }}>
              <LogOut size={15} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out of AgriLink
            </button>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */
type Tok = ReturnType<typeof useTokens>;

function Glass({ children, T, className, noPad }: { children: React.ReactNode; T: Tok; className?: string; noPad?: boolean }) {
  return (
    <div className={cn(!noPad && "p-4", "rounded-2xl overflow-hidden", className)}
      style={{ background: T.rowBg, boxShadow: T.rowShadow }}>
      {children}
    </div>
  );
}

function GlowIcon({ children, T }: { children: React.ReactNode; T: Tok }) {
  return (
    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
      style={{ background: T.iconBg, boxShadow: T.iconShadow, color: T.iconColor }}>
      {children}
    </div>
  );
}

function NavBtn({ children, T, onClick }: { children: React.ReactNode; T: Tok; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      style={{ background: T.navBg, backdropFilter: "blur(12px)", boxShadow: T.navShadow }}>
      {children}
    </button>
  );
}

function YesNoRow({ label, T, divider }: { label: string; T: Tok; divider: boolean }) {
  const [val, setVal] = useState<"yes" | "no">("yes");
  return (
    <div>
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className="text-[12px] font-semibold" style={{ color: T.menuText }}>{label}</span>
        <div className="flex rounded-full p-0.5" style={{ background: T.langBarBg }}>
          {(["yes", "no"] as const).map((opt) => (
            <button key={opt} onClick={() => setVal(opt)}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize transition-all duration-200"
              style={val === opt
                ? { background: opt === "yes" ? "#16a34a" : "#dc2626", color: "#fff",
                    boxShadow: opt === "yes" ? "0 0 8px rgba(22,163,74,0.45)" : "0 0 8px rgba(220,38,38,0.40)" }
                : { color: T.idleOptColor }}>
              {opt === "yes" ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>
      {divider && <div className="mx-3" style={{ height: "1px", background: T.notifDivider }} />}
    </div>
  );
}