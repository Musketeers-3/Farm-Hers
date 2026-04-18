"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Gavel,
  Clock,
  Users,
  TrendingUp,
  Trophy,
  Flame,
  AlertCircle,
  User,
  CheckCircle2,
} from "lucide-react";
import { useAppStore, useTranslation } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BottomNav } from "../farmer/bottom-nav";

interface Bid {
  id: string;
  bidder: string;
  amount: number;
  timestamp: Date;
  isLeading: boolean;
}

const cropImages: Record<string, string> = {
  wheat:
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop",
};

const GLASS_CLASSES =
  "bg-white/[0.55] dark:bg-slate-900/[0.55] backdrop-blur-[24px] border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]";

export function AuctionScreen() {
  const language = useAppStore((state) => state.language);
  const router = useRouter();
  const auctions = useAppStore((state) => state.auctions) || [];
  const currentAuction = auctions[0];

  const [timeLeft, setTimeLeft] = useState(180);
  const [bids, setBids] = useState<Bid[]>([
    {
      id: "1",
      bidder: "Punjab Agro Mills",
      amount: 2450,
      timestamp: new Date(Date.now() - 15000),
      isLeading: false,
    },
    {
      id: "2",
      bidder: "Haryana Foods Ltd",
      amount: 2480,
      timestamp: new Date(Date.now() - 8000),
      isLeading: false,
    },
    {
      id: "3",
      bidder: "Green Valley Exports",
      amount: 2520,
      timestamp: new Date(),
      isLeading: true,
    },
  ]);

  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslation();

  const currentLeadingBid = Math.max(...bids.map((b) => b.amount));
  const basePrice = currentAuction?.startingPrice || 2300;
  const profit = currentLeadingBid - basePrice;
  const isAuctionActive = timeLeft > 0;

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isAuctionActive) return;
    const bidInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        const newBid: Bid = {
          id: Date.now().toString() + Math.random(),
          bidder: [
            "Delhi Grain Corp",
            "Rajasthan Mills",
            "MP Foods Ltd",
            "Gujarat Agro",
            "ITC Limited",
          ][Math.floor(Math.random() * 5)],
          amount: currentLeadingBid + Math.floor(Math.random() * 40) + 10,
          timestamp: new Date(),
          isLeading: true,
        };
        setBids((prev) => {
          const updated = prev.map((b) => ({ ...b, isLeading: false }));
          return [newBid, ...updated].slice(0, 20);
        });
      }
    }, 4000);
    return () => clearInterval(bidInterval);
  }, [currentLeadingBid, isAuctionActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isUrgent = timeLeft > 0 && timeLeft < 60;

  if (!isMounted) return null;

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

      <header className="sticky top-0 z-50 transition-colors duration-300 bg-white/25 dark:bg-slate-950/50 backdrop-blur-[20px] border-b border-white/30 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-white/10 flex items-center justify-center hover:scale-105 transition-all text-slate-800 dark:text-slate-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 leading-none tracking-tight">
                Live Auction
              </h1>
              <p className="text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-1 flex items-center gap-1.5">
                <Gavel className="w-3.5 h-3.5" /> Bidding Room
              </p>
            </div>
          </div>
          {isAuctionActive ? (
            <Badge className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 gap-1.5 px-3 py-1.5 animate-pulse border-none">
              <Flame className="h-4 w-4" />{" "}
              <span className="font-bold tracking-wider">LIVE</span>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold tracking-wider px-3 py-1.5 border-none"
            >
              ENDED
            </Badge>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
            <div
              className={cn("rounded-[32px] overflow-hidden", GLASS_CLASSES)}
            >
              <div className="relative h-56 sm:h-64 w-full">
                <Image
                  src={cropImages.wheat}
                  alt="Premium Wheat"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 shadow-md border-0">
                    Grade A
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
                      Premium Wheat
                    </h2>
                    <p className="text-white/80 font-bold mt-1 tracking-wide">
                      {currentAuction?.quantity || 50} Quintals
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                    <Users className="h-4 w-4 text-emerald-400" /> 47 watching
                    live
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/40 dark:bg-slate-800/40 rounded-2xl p-4 sm:p-5 border border-white/50 dark:border-white/10">
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest">
                      Base Price
                    </p>
                    <p className="text-xl sm:text-2xl font-mono font-bold text-slate-900 dark:text-slate-50">
                      ₹{basePrice}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl p-4 sm:p-5 border transition-colors duration-300",
                      isAuctionActive
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700",
                    )}
                  >
                    <p className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 uppercase tracking-widest">
                      Current Bid
                    </p>
                    <motion.div
                      key={currentLeadingBid}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="flex items-start"
                    >
                      <span className="text-lg font-light mt-0.5 mr-0.5 text-emerald-600 dark:text-emerald-400">
                        ₹
                      </span>
                      <p
                        className={cn(
                          "text-2xl sm:text-3xl font-mono font-black tracking-tighter",
                          isAuctionActive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-900 dark:text-slate-50",
                        )}
                      >
                        {currentLeadingBid}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {isAuctionActive ? (
              <motion.div
                animate={isUrgent ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: isUrgent ? Infinity : 0, duration: 2 }}
                className={cn(
                  "rounded-[32px] p-5 sm:p-6 border-2 transition-all duration-300",
                  isUrgent ? "border-red-500/50 bg-red-500/5" : GLASS_CLASSES,
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                        isUrgent ? "bg-red-500/10" : "bg-emerald-500/10",
                      )}
                    >
                      <Clock
                        className={cn(
                          "h-6 w-6",
                          isUrgent
                            ? "text-red-500 animate-pulse"
                            : "text-emerald-600 dark:text-emerald-400",
                        )}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Auction ends in
                    </span>
                  </div>
                  <motion.span
                    key={timeLeft}
                    initial={{ scale: 1.1, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      "text-4xl font-mono font-black tracking-tighter",
                      isUrgent
                        ? "text-red-500"
                        : "text-slate-900 dark:text-slate-50",
                    )}
                  >
                    {formatTime(timeLeft)}
                  </motion.span>
                </div>
                {isUrgent && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-sm font-bold bg-red-500/10 py-3 rounded-xl border border-red-500/20"
                  >
                    <AlertCircle className="h-5 w-5" />{" "}
                    <span>Hurry! Auction ending soon</span>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div
                className={cn(
                  "rounded-[32px] p-6 sm:p-8 border-2 border-emerald-500/30 bg-emerald-500/5 shadow-lg flex flex-col items-center justify-center text-center gap-4",
                  GLASS_CLASSES,
                )}
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <CheckCircle2
                    className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <h3 className="font-black text-2xl text-slate-900 dark:text-slate-50 tracking-tight">
                    Auction Ended
                  </h3>
                  <p className="text-base text-slate-500 dark:text-slate-400 font-medium mt-2">
                    Final Sale Price:{" "}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xl ml-1 tracking-tight">
                      ₹{currentLeadingBid}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <div
              className={cn(
                "rounded-[32px] flex flex-col overflow-hidden h-[600px] lg:h-[750px]",
                GLASS_CLASSES,
              )}
            >
              <div className="p-5 sm:p-6 border-b border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl z-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <TrendingUp
                      className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                      strokeWidth={2.5}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                    Live Bid History
                  </h3>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-sm border border-emerald-500/20 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />+
                  {profit > 0 ? profit : 0} ₹ Profit
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar bg-white/10 dark:bg-slate-950/20">
                <AnimatePresence mode="popLayout">
                  {bids.map((bid) => (
                    <motion.div
                      key={bid.id}
                      initial={{ opacity: 0, y: -20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={cn(
                        "flex items-center justify-between p-4 sm:p-5 rounded-[24px] transition-all duration-300 border",
                        bid.isLeading
                          ? "bg-white/80 dark:bg-slate-800 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20"
                          : "bg-white/40 dark:bg-slate-900/40 border-white/50 dark:border-white/10 hover:border-emerald-500/30",
                      )}
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors shadow-sm shrink-0",
                            bid.isLeading
                              ? "bg-emerald-500 text-white shadow-emerald-500/30"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
                          )}
                        >
                          {bid.isLeading ? (
                            <Trophy className="h-5 w-5" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p
                            className={cn(
                              "font-bold text-sm sm:text-base tracking-tight",
                              bid.isLeading
                                ? "text-slate-900 dark:text-slate-50"
                                : "text-slate-600 dark:text-slate-300",
                            )}
                          >
                            {bid.bidder}
                          </p>
                          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold uppercase tracking-wider mt-0.5">
                            {bid.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end justify-center">
                        <p
                          className={cn(
                            "font-black font-mono tracking-tighter text-lg sm:text-xl",
                            bid.isLeading
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-900 dark:text-slate-50",
                          )}
                        >
                          ₹{bid.amount}
                        </p>
                        {bid.isLeading && isAuctionActive && (
                          <span className="mt-1 text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                            Leading
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
