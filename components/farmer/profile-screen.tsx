"use client";

import { useState } from "react";
import { useAppStore, useTranslation } from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  MapPin,
  Moon,
  Sun,
  Bell,
  ChevronRight,
  Shield,
  CreditCard,
  LogOut,
  Smartphone,
  Mail,
  Edit2,
  CheckCircle,
  BadgeCheck,
  Star,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/lib/auth";

export function ProfileScreen() {
  const router = useRouter();
  const {
    userProfile,
    setUserRole,
    setIsLoggedIn,
    setHasOnboarded,
    language,
    setLanguage,
  } = useAppStore();

  const t = useTranslation();

  // Dark Mode Logic
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showNotifPrefs, setShowNotifPrefs] = useState(false);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
    setIsDark(!isDark);
  };

  const handleSignOut = async () => {
    await logout();
    setIsLoggedIn(false);
    setHasOnboarded(false);
    router.replace("/");
  };

  const languageLabels = { en: "English", hi: "हिंदी", pa: "ਪੰਜਾਬੀ" };

  return (
    <div className="min-h-screen bg-background pb-32 selection:bg-primary/30">
      {/* 🟢 TOP NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">
              Account Settings
            </h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* 🚀 PREMIUM PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 p-8 shadow-2xl shadow-primary/5"
        >
          <div className="absolute top-0 right-0 p-6">
            <BadgeCheck className="w-8 h-8 text-primary opacity-20" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
                <User className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-background border-2 border-primary w-8 h-8 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary fill-primary/10" />
              </div>
            </div>

            <div className="text-center md:text-left space-y-1">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h2 className="text-2xl font-bold tracking-tight">
                  {userProfile?.fullName || "AgriLink User"}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                  {userProfile?.role || "Member"}
                </span>
              </div>
              <p className="text-muted-foreground flex items-center gap-1.5 justify-center md:justify-start font-medium">
                <MapPin className="w-4 h-4" />{" "}
                {userProfile?.location || "India"}
              </p>
            </div>
          </div>

          {/* Stats Bento Row */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: "Auctions", value: "12", icon: Star },
              { label: "Earnings", value: "₹2.4L", icon: Wallet },
              { label: "Rating", value: "4.9", icon: BadgeCheck },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center"
              >
                <p className="text-lg font-black">{stat.value}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 🌍 LANGUAGE SELECTOR (SMOOTHER) */}
        <div className="space-y-3">
          <h3 className="px-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            App Language
          </h3>
          <div className="grid grid-cols-3 gap-2 bg-secondary/30 p-1.5 rounded-2xl border border-border/40">
            {(["en", "hi", "pa"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  "py-3 rounded-xl text-sm font-bold transition-all",
                  language === lang
                    ? "bg-background text-primary shadow-lg"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {languageLabels[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* 🔔 NOTIFICATIONS (COLLAPSIBLE BENTO) */}
        <div
          className={cn(
            "rounded-3xl border border-border/40 bg-secondary/20 transition-all duration-300 overflow-hidden",
            showNotifPrefs ? "pb-4" : "",
          )}
        >
          <button
            onClick={() => setShowNotifPrefs(!showNotifPrefs)}
            className="w-full px-6 py-5 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold">Notification Pulse</span>
            </div>
            <ChevronRight
              className={cn(
                "w-5 h-5 transition-transform",
                showNotifPrefs && "rotate-90",
              )}
            />
          </button>

          <AnimatePresence>
            {showNotifPrefs && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-6 space-y-4"
              >
                <NotifToggle label="Market Price Volatility" />
                <NotifToggle label="Smart Pool Invites" />
                <NotifToggle label="Instant Payment Success" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🛠 SETTINGS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsBox icon={CreditCard} label="Wallet & Payouts" />
          <SettingsBox icon={Shield} label="Security Vault" />
          <SettingsBox icon={Smartphone} label="Device Link" />
          <SettingsBox icon={Mail} label="AgriLink Helpdesk" />
        </div>

        {/* 🛑 LOGOUT */}
        <button
          onClick={handleSignOut}
          className="w-full mt-10 py-5 rounded-[2rem] bg-destructive/5 border-2 border-destructive/10 text-destructive font-bold hover:bg-destructive hover:text-white transition-all flex items-center justify-center gap-3 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Sign Out of AgriLink
        </button>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function SettingsBox({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex items-center justify-between p-5 rounded-3xl bg-secondary/20 border border-border/40 hover:border-primary/40 transition-all group">
      <div className="flex items-center gap-4">
        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="font-bold text-sm">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
    </button>
  );
}

function NotifToggle({ label }: { label: string }) {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-foreground/80">{label}</span>
      <Switch checked={enabled} onCheckedChange={setEnabled} />
    </div>
  );
}
