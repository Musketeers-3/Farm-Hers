"use client";

import { useState } from "react";
import { useAppStore, useTranslation } from "@/lib/store";
import { BottomNav } from "./bottom-nav";
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  MapPin,
  Globe,
  Moon,
  Sun,
  Bell,
  ChevronRight,
  Shield,
  CreditCard,
  LogOut,
  Settings,
  Smartphone,
  Mail,
  Edit2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";



export function ProfileScreen() {
  const router = useRouter()
  const userName = useAppStore((state) => state.userName);
  const setUserName = useAppStore((state) => state.setUserName);
  const userLocation = useAppStore((state) => state.userLocation);
  const setUserLocation = useAppStore((state) => state.setUserLocation);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const setHasOnboarded = useAppStore((state) => state.setHasOnboarded);
  
  const t = useTranslation();

  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editLocation, setEditLocation] = useState(userLocation);

  // Notification prefs
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [auctionAlerts, setAuctionAlerts] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(false);
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

  const handleSaveProfile = () => {
    setUserName(editName);
    setUserLocation(editLocation);
    setIsEditing(false);
  };

  const handleSignOut = () => {
    router.push("/farmer");
    setHasOnboarded(false);
    router.push("/")
  };

  const languageLabels = { en: "English", hi: "हिंदी", pa: "ਪੰਜਾਬੀ" };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/40">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push("/farmer")}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={1.8} />
          </button>
          <h1 className="text-xl font-serif font-bold text-foreground">
            Profile & Settings
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6 space-y-5">
        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                {isEditing ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-8 text-lg font-semibold mb-1"
                  />
                ) : (
                  <h2 className="text-lg font-semibold text-foreground">
                    {userName}
                  </h2>
                )}
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  {isEditing ? (
                    <Input
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="h-7 text-sm"
                    />
                  ) : (
                    <span className="text-sm">{userLocation}</span>
                  )}
                </div>
              </div>
            </div>
            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent transition-all"
              >
                <Edit2 className="w-4 h-4 text-foreground" />
              </button>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Crops Sold", value: "24" },
              { label: "Revenue", value: "₹4.2L" },
              { label: "Rating", value: "4.8★" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-3 rounded-xl bg-secondary"
              >
                <p className="text-lg font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <h3 className="px-5 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Appearance
          </h3>
          <SettingsRow
            icon={isDark ? Moon : Sun}
            label={isDark ? "Dark Mode" : "Light Mode"}
            trailing={
              <Switch checked={isDark} onCheckedChange={toggleDarkMode} />
            }
          />
        </div>

        {/* Language */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <h3 className="px-5 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Language
          </h3>
          <div className="px-5 pb-4 flex gap-2">
            {(["en", "hi", "pa"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                  language === lang
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-accent",
                )}
              >
                {languageLabels[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowNotifPrefs(!showNotifPrefs)}
            className="w-full px-5 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" strokeWidth={1.8} />
              <span className="font-medium text-foreground">
                Notification Preferences
              </span>
            </div>
            <ChevronRight
              className={cn(
                "w-5 h-5 text-muted-foreground transition-transform",
                showNotifPrefs && "rotate-90",
              )}
            />
          </button>

          {showNotifPrefs && (
            <div className="px-5 pb-4 space-y-1 border-t border-border/40">
              <NotifToggle
                label="Price drop alerts"
                checked={priceAlerts}
                onChange={setPriceAlerts}
              />
              <NotifToggle
                label="Auction ending soon"
                checked={auctionAlerts}
                onChange={setAuctionAlerts}
              />
              <NotifToggle
                label="Order status updates"
                checked={orderUpdates}
                onChange={setOrderUpdates}
              />
              <NotifToggle
                label="Weather warnings"
                checked={weatherAlerts}
                onChange={setWeatherAlerts}
              />
            </div>
          )}
        </div>

        {/* More Settings */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <h3 className="px-5 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Account
          </h3>
          <SettingsRow
            icon={CreditCard}
            label="Payment Methods"
            trailing={
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            }
          />
          <SettingsRow
            icon={Shield}
            label="Privacy & Security"
            trailing={
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            }
          />
          <SettingsRow
            icon={Smartphone}
            label="Connected Devices"
            trailing={
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            }
          />
          <SettingsRow
            icon={Mail}
            label="Support & Help"
            trailing={
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            }
          />
          
        </div>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          className="w-full py-4 rounded-2xl border-2 border-destructive/20 text-destructive font-medium hover:bg-destructive/5 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </main>

      <BottomNav />
    </div>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  trailing,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors",
        onClick && "cursor-pointer",
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-primary" strokeWidth={1.8} />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      {trailing}
    </div>
  );
}

function NotifToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-foreground">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
