"use client";
 
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "./bottom-nav";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  TrendingUp,
  Gavel,
  Truck,
  CreditCard,
  CloudRain,
  CheckCircle2,
  Trash2,
  BellRing,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
 
interface Notification {
  id: string;
  type: "price" | "auction" | "order" | "payment" | "weather";
  title: string;
  message: string;
  time: string;
  read: boolean;
}
 
const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "price",
    title: "Wheat price rising",
    message: "Wheat prices up 3.5% at Ludhiana Mandi. Consider selling now.",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    type: "auction",
    title: "Auction ending soon",
    message: "Your wheat auction ends in 15 minutes. Current bid: ₹2,450/q",
    time: "15m ago",
    read: false,
  },
  {
    id: "3",
    type: "order",
    title: "Order shipped",
    message: "Your 50q wheat order has been picked up and is in transit.",
    time: "1h ago",
    read: false,
  },
  {
    id: "4",
    type: "payment",
    title: "Payment received",
    message: "₹1,12,500 credited to your account for Order #AG-1247",
    time: "3h ago",
    read: true,
  },
  {
    id: "5",
    type: "weather",
    title: "Rain expected",
    message: "Heavy rainfall predicted tomorrow. Plan harvest accordingly.",
    time: "5h ago",
    read: true,
  },
  {
    id: "6",
    type: "price",
    title: "Mustard price drop",
    message: "Mustard prices fell 2.1% across Punjab mandis.",
    time: "8h ago",
    read: true,
  },
  {
    id: "7",
    type: "order",
    title: "Quality verified",
    message: "Your rice shipment passed quality check. Payment processing.",
    time: "1d ago",
    read: true,
  },
  {
    id: "8",
    type: "auction",
    title: "New bid received",
    message: "A new bid of ₹5,400/q placed on your mustard auction.",
    time: "1d ago",
    read: true,
  },
];
 
const iconMap = {
  price: TrendingUp,
  auction: Gavel,
  order: Truck,
  payment: CreditCard,
  weather: CloudRain,
};
 
// UI from file 7 — emerald/green theme
const colorMap = {
  price:   "bg-[#16a34a] text-white",
  auction: "bg-[#15803d] text-white",
  order:   "bg-emerald-100 text-[#14532d]",
  payment: "bg-green-100 text-[#15803d]",
  weather: "bg-teal-100 text-[#15803d]",
};
 
export function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [filter, setFilter] = useState<string>("all");
  const [isMounted, setIsMounted] = useState(false);
 
  useEffect(() => setIsMounted(true), []);
 
  const unreadCount = notifications.filter((n) => !n.read).length;
 
  // markAllRead from file 8
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };
 
  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };
 
  const clearAll = () => {
    setNotifications([]);
  };
 
  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);
 
  if (!isMounted) return null;
 
  return (
    <div
      className="min-h-screen pb-28 overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)" }}
    >
      {/* GLASS HEADER */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl transition-all duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/farmer")}
                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-emerald-50 transition-all shadow-sm shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-[#14532d]" strokeWidth={2.5} />
              </button>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-[#14532d] leading-none tracking-tighter">
                    Notifications
                  </h1>
                  {unreadCount > 0 && (
                    <span className="bg-[#16a34a] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-black text-[#15803d]/50 uppercase tracking-[0.15em] mt-1">
                  Mandi Activity Feed
                </p>
              </div>
            </div>
 
            {/* markAllRead button from file 8 + clear */}
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="hidden sm:flex items-center gap-1.5 text-xs text-[#16a34a] font-black px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark all read
                </button>
              )}
              <button
                onClick={clearAll}
                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:text-red-500 transition-colors shadow-sm text-[#15803d]/40"
              >
                <Trash2 className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>
 
          {/* Filter Pills — UI from file 7 */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: "all",     label: "All Activity" },
              { id: "price",   label: "Prices" },
              { id: "auction", label: "Auctions" },
              { id: "order",   label: "Orders" },
              { id: "payment", label: "Payments" },
            ].map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "relative px-5 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all z-10",
                    isActive
                      ? "text-white"
                      : "text-[#15803d]/60 bg-white shadow-sm hover:text-[#15803d]",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="notification-filter"
                      className="absolute inset-0 bg-[#16a34a] rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>
 
      {/* NOTIFICATION FEED */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4 shadow-xl shadow-green-900/5">
                <BellRing className="w-10 h-10 text-[#16a34a]/20" strokeWidth={1.5} />
              </div>
              <p className="text-lg font-black text-[#14532d]">All caught up!</p>
              <p className="text-xs text-[#15803d]/40 font-bold uppercase tracking-widest mt-1">
                No new alerts for now
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filtered.map((notif, index) => {
                const Icon = iconMap[notif.type];
                return (
                  <motion.button
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={cn(
                      "w-full text-left p-5 rounded-[1.5rem] transition-all duration-500 relative overflow-hidden group",
                      notif.read
                        ? "bg-white/60 shadow-sm"
                        : "bg-white shadow-[0_8px_30px_rgba(34,197,94,0.08)]",
                    )}
                  >
                    {/* Unread: soft glow from file 7 + left bar accent from file 8 */}
                    {!notif.read && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#16a34a] rounded-l-[1.5rem]" />
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/10 blur-3xl pointer-events-none" />
                      </>
                    )}
 
                    <div className="flex gap-5 relative z-10">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-green-900/5 transition-transform group-hover:scale-105",
                          colorMap[notif.type],
                        )}
                      >
                        <Icon className="w-6 h-6" strokeWidth={2.5} />
                      </div>
 
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3
                            className={cn(
                              "text-sm sm:text-base font-black tracking-tight truncate pr-2",
                              !notif.read ? "text-[#14532d]" : "text-[#15803d]/50",
                            )}
                          >
                            {notif.title}
                          </h3>
                          <span className="text-[10px] font-black text-[#15803d]/30 whitespace-nowrap uppercase tracking-tighter">
                            {notif.time}
                          </span>
                        </div>
                        <p
                          className={cn(
                            "text-xs sm:text-sm leading-relaxed",
                            !notif.read
                              ? "text-[#14532d]/80 font-bold"
                              : "text-[#15803d]/40 font-medium",
                          )}
                        >
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </main>
 
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}