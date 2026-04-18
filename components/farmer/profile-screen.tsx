"use client";

import { useState, useEffect } from "react";
import { useAppStore, useTranslation } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowLeft, User, MapPin, Moon, Sun, Bell,
  ChevronRight, Shield, CreditCard, LogOut,
  Smartphone, Mail, CheckCircle, BadgeCheck,
  Star, Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { logout } from "@/lib/auth";
import Image from "next/image";

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, setIsLoggedIn, setHasOnboarded, language, setLanguage } = useAppStore();
  const t = useTranslation();
  const { setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
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

  return (
    <div className="min-h-screen pb-32 relative overflow-x-hidden selection:bg-emerald-500/30">

      {/* ── FIXED BACKGROUND — same as farmer-dashboard ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Light mode */}
        <div className={`absolute inset-0 bg-gradient-to-b from-[#f0fdf4] to-white transition-opacity duration-500 ${mounted && isDark ? "opacity-0" : "opacity-100"}`} />
        {/* Dark mode: farmers_bg.jpg */}
        {mounted && isDark && (
          <>
            <Image
              src="/images/farmers_bg.jpg"
              alt=""
              fill
              priority
              className="object-cover object-center"
              style={{ opacity: 0.28 }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020c04]/85 via-[#040f06]/75 to-[#020c04]/92" />
            <div className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,20,8,0.3) 0%, rgba(2,8,3,0.7) 100%)" }}
            />
          </>
        )}
      </div>

      {mounted && (
        <>
          {/* ── HEADER ── */}
          <header className="sticky top-0 z-40 bg-white/75 dark:bg-[#020c04]/75 backdrop-blur-2xl border-b border-white/50 dark:border-white/[0.06] transition-colors duration-300">
            <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-white/[0.07] backdrop-blur-md border border-white/60 dark:border-white/[0.08] flex items-center justify-center hover:scale-105 transition-transform shadow-sm"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-800 dark:text-white" />
                </button>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Account Settings
                </h1>
              </div>
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-white/[0.07] backdrop-blur-md border border-white/60 dark:border-white/[0.08] flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm hover:scale-105 transition-transform"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </header>

          {/* ── MAIN ── */}
          <main className="relative z-10 max-w-2xl mx-auto px-6 py-8 space-y-6">

            {/* PROFILE CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[2.5rem]
                bg-white/50 dark:bg-white/[0.06]
                backdrop-blur-2xl
                border border-white/60 dark:border-white/[0.09]
                p-8
                shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
            >
              {/* Subtle top-right glow */}
              <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none
                bg-[radial-gradient(circle,rgba(52,211,153,0.08)_0%,transparent_70%)]
                translate-x-12 -translate-y-12 dark:opacity-100 opacity-0" />

              <div className="absolute top-0 right-0 p-6">
                <BadgeCheck className="w-8 h-8 text-emerald-600/20 dark:text-emerald-400/15" />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/30">
                    <User className="w-12 h-12 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white dark:bg-[#0d1f10] border-2 border-emerald-500 w-8 h-8 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-50 dark:fill-transparent" />
                  </div>
                </div>

                <div className="text-center md:text-left space-y-1">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {userProfile?.fullName || "AgriLink User"}
                    </h2>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/25">
                      {userProfile?.role || "Member"}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-white/50 flex items-center gap-1.5 justify-center md:justify-start font-medium">
                    <MapPin className="w-4 h-4" /> {userProfile?.location || "India"}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { label: "Auctions", value: "12",   icon: Star      },
                  { label: "Earnings", value: "₹2.4L", icon: Wallet    },
                  { label: "Rating",   value: "4.9",   icon: BadgeCheck },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/60 dark:bg-white/[0.06] backdrop-blur-md border border-white/60 dark:border-white/[0.08] rounded-2xl p-4 text-center shadow-sm dark:shadow-none"
                  >
                    <p className="text-lg font-black text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-white/35 tracking-tighter mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* LANGUAGE SELECTOR */}
            <div className="space-y-3">
              <h3 className="px-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-emerald-400/80">
                App Language
              </h3>
              <div className="grid grid-cols-3 gap-2
                bg-white/40 dark:bg-white/[0.05]
                backdrop-blur-xl p-1.5 rounded-2xl
                border border-white/60 dark:border-white/[0.08]
                shadow-sm dark:shadow-none">
                {(["en", "hi", "pa"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "py-3 rounded-xl text-sm font-bold transition-all backdrop-blur-md",
                      language === lang
                        ? "bg-white dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 shadow-md border border-emerald-100 dark:border-emerald-500/30"
                        : "text-slate-600 dark:text-white/50 hover:bg-white/50 dark:hover:bg-white/[0.07]",
                    )}
                  >
                    {languageLabels[lang]}
                  </button>
                ))}
              </div>
            </div>

            {/* SETTINGS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <SettingsBox icon={CreditCard}  label="Wallet & Payouts"  />
              <SettingsBox icon={Shield}       label="Security Vault"    />
              <SettingsBox icon={Smartphone}   label="Device Link"       />
              <SettingsBox icon={Mail}          label="AgriLink Helpdesk" />
            </div>

            {/* LOGOUT */}
            <button
              onClick={handleSignOut}
              className="w-full mt-4 py-5 rounded-[2rem]
                bg-red-500/10 dark:bg-red-500/[0.08]
                border-2 border-red-500/20 dark:border-red-500/20
                text-red-600 dark:text-red-400 font-bold
                hover:bg-red-500 dark:hover:bg-red-500/20 hover:text-white
                transition-all flex items-center justify-center gap-3 group
                backdrop-blur-md shadow-sm"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Sign Out of AgriLink
            </button>

          </main>
        </>
      )}
    </div>
  );
}

function SettingsBox({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex items-center justify-between p-5 rounded-3xl
      bg-white/40 dark:bg-white/[0.06]
      backdrop-blur-xl
      border border-white/60 dark:border-white/[0.08]
      hover:border-emerald-400/60 dark:hover:border-emerald-500/30
      shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]
      transition-all group">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-xl bg-white/60 dark:bg-white/[0.07] border border-white/60 dark:border-white/[0.08] shadow-inner">
          <Icon className="w-5 h-5 text-slate-600 dark:text-white/60 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
        </div>
        <span className="font-bold text-sm text-slate-800 dark:text-white">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400 dark:text-white/20 opacity-0 group-hover:opacity-100 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
    </button>
  );
}
