"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "./bottom-nav";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  TrendingUp,
  Gavel,
  Layers,
  Truck,
  CreditCard,
  CheckCircle2,
  Trash2,
  BellRing,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import type { NotificationType } from "@/types/notifications";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  relatedId?: string;
  createdAt?: string;
}

const iconMap: Record<NotificationType, LucideIcon> = {
  pool_join: Layers,
  demand_join: Truck,
  order_update: Truck,
  payment: CreditCard,
  auction_bid: Gavel,
  price_alert: TrendingUp,
};

const colorMap: Record<NotificationType, string> = {
  pool_join: "bg-violet-500 text-white shadow-violet-500/30",
  demand_join: "bg-blue-500 text-white shadow-blue-500/30",
  order_update: "bg-blue-500 text-white shadow-blue-500/30",
  payment: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
  auction_bid: "bg-amber-500 text-white shadow-amber-500/30",
  price_alert: "bg-emerald-500 text-white shadow-emerald-500/30",
};

const GLASS_CLASSES =
  "bg-white/[0.55] dark:bg-slate-900/[0.55] backdrop-blur-[24px] border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]";

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN");
}

export function NotificationsScreen() {
  const router = useRouter();
  const userProfile = useAppStore((state) => state.userProfile);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => setIsMounted(true), []);

  // Fetch real notifications from Firestore
  useEffect(() => {
    if (!userProfile?.uid) return;

    setLoading(true);
    const notifQuery = query(
      collection(db, "notifications"),
      where("userId", "==", userProfile.uid),
    );

    const unsubscribe = onSnapshot(
      notifQuery,
      (snapshot) => {
        const firestoreNotifs = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              type: (data.type || "order") as Notification["type"],
              title: data.title || "",
              message: data.message || "",
              time: data.createdAt ? timeAgo(data.createdAt) : "Just now",
              read: data.read ?? false,
              poolId: data.poolId,
              orderId: data.orderId,
              createdAt: data.createdAt,
            };
          })
          .sort((a, b) => {
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });

        setNotifications(firestoreNotifs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userProfile]);

  const markAllRead = async () => {
    if (!userProfile?.uid) return;
    try {
      const notifQuery = query(
        collection(db, "notifications"),
        where("userId", "==", userProfile.uid),
        where("read", "==", false),
      );
      const snapshot = await getDocs(notifQuery);
      const updatePromises = snapshot.docs.map((docSnap) =>
        updateDoc(doc(db, "notifications", docSnap.id), { read: true }),
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = async (id: string) => {
    const notif = notifications.find((n) => n.id === id);
    if (!notif) return;

    // Mark as read locally first
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

    // Update in Firestore only for real documents
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }

    // Navigate based on notification type (after marking read)
    handleNotificationNavigation(notif);
  };

  const handleNotificationNavigation = (notif: Notification) => {
    switch (notif.type) {
      case "auction_bid":
      case "pool_join":
        if (notif.relatedId) {
          router.push(`/farmer/market?pool=${notif.relatedId}`);
        }
        break;
      case "demand_join":
      case "order_update":
        if (notif.relatedId) {
          router.push(`/farmer/orders?order=${notif.relatedId}`);
        }
        break;
      case "payment":
        router.push("/farmer/orders");
        break;
      case "price_alert":
        // No navigation for these types
        break;
    }
  };

  const clearAll = () => setNotifications([]);

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen pb-24 lg:pb-8 overflow-x-hidden bg-[linear-gradient(135deg,#dcfce7_0%,#dcfce7_20%,#bfdbfe_100%)] dark:bg-none dark:bg-slate-950 transition-colors duration-500">
      {/* Background Wave Pattern */}
      <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden opacity-40 dark:opacity-100 transition-opacity duration-500">
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

      {/* HEADER */}
      <header className="sticky top-0 z-40 transition-colors duration-300 bg-white/25 dark:bg-slate-950/50 backdrop-blur-[20px] border-b border-white/30 dark:border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/farmer")}
                className="w-10 h-10 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-white/10 flex items-center justify-center hover:scale-105 transition-all text-slate-800 dark:text-slate-200"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                    Notifications
                  </h1>
                  {unreadCount > 0 && (
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                  Mandi Activity Feed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold px-3 py-2 rounded-lg bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark all read
                </button>
              )}
              <button
                onClick={clearAll}
                className="w-10 h-10 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-white/10 flex items-center justify-center hover:text-red-500 transition-colors text-slate-500 dark:text-slate-400"
              >
                <Trash2 className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* FILTER TABS */}
          <div className="flex p-1 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/50 dark:border-white/10 overflow-x-auto scrollbar-hide">
            {[
              { id: "all", label: "All" },
              { id: "price_alert", label: "Prices" },
              { id: "auction_bid", label: "Auctions" },
              { id: "order_update", label: "Orders" },
            ].map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "flex-1 py-2 px-4 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-300 relative",
                    isActive
                      ? "text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-700/50",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="notification-filter"
                      className="absolute inset-0 bg-emerald-500 rounded-xl -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* NOTIFICATION FEED */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-[24px] bg-white/40 dark:bg-slate-800/40 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-24"
              >
                <div className="w-20 h-20 rounded-full bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-white/10 flex items-center justify-center mb-4 shadow-xl">
                  <BellRing
                    className="w-10 h-10 text-slate-400"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  All caught up!
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">
                  No new alerts for now
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filtered.map((notif, index) => {
                  const Icon = iconMap[notif.type as NotificationType] ?? BellRing;
                  return (
                    <motion.button
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={cn(
                        "w-full text-left p-5 rounded-[24px] transition-all duration-300 relative overflow-hidden group",
                        GLASS_CLASSES,
                        notif.read
                          ? "opacity-70 hover:opacity-100"
                          : "border-emerald-500/30 dark:border-emerald-500/20",
                      )}
                    >
                      {!notif.read && (
                        <>
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 blur-3xl pointer-events-none" />
                        </>
                      )}

                      <div className="flex gap-4 relative z-10 items-start">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-transform group-hover:scale-105",
                            colorMap[notif.type as NotificationType] ?? "bg-slate-500 text-white",
                          )}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3
                              className={cn(
                                "text-sm sm:text-base font-bold tracking-tight truncate",
                                !notif.read
                                  ? "text-slate-900 dark:text-slate-50"
                                  : "text-slate-600 dark:text-slate-300",
                              )}
                            >
                              {notif.title}
                            </h3>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              {notif.time}
                            </span>
                          </div>
                          <p
                            className={cn(
                              "text-xs sm:text-sm font-medium leading-relaxed",
                              !notif.read
                                ? "text-slate-700 dark:text-slate-200"
                                : "text-slate-500 dark:text-slate-400",
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
        )}
      </main>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}