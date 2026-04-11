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
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

export function AuctionScreen() {
  const language = useAppStore((state) => state.language);
  const router = useRouter();
  const auctions = useAppStore((state) => state.auctions) || [];
  const currentAuction = auctions[0]; // Use first auction for demo

  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
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

  const t = {
    en: {
      liveAuction: "Live Auction",
      back: "Back",
      wheat: "Premium Wheat",
      quintal: "Quintals",
      basePrice: "Base Price",
      currentBid: "Current Bid",
      timeRemaining: "Time Remaining",
      participants: "Participants",
      bidHistory: "Live Bid History",
      leading: "Leading",
      auctionEnds: "Auction ends in",
      auctionEnded: "Auction Ended",
      watchingLive: "watching live",
      hotAuction: "Hot Auction",
      premium: "Grade A",
      profit: "Profit",
    },
    // ... (Keep your hi and pa translations here)
  };

  const text = t[language as keyof typeof t] || t.en;
  const currentLeadingBid = Math.max(...bids.map((b) => b.amount));
  const basePrice = currentAuction?.startingPrice || 2300;
  const profit = currentLeadingBid - basePrice;
  const isAuctionActive = timeLeft > 0;

  useEffect(() => setIsMounted(true), []);

  // Countdown timer
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

  // Simulate incoming bids
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
    <div className="min-h-screen bg-background pb-28 overflow-x-hidden">
      {/* ---------------------------------------------------------------------- */}
      {/* HIGH-DENSITY GLASS HEADER */}
      {/* ---------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-2xl border-b border-border/40 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => router.back()}
              className="w-10.5 h-10.5 rounded-xl bg-secondary/80 flex items-center justify-center hover:bg-accent transition-all shadow-sm shrink-0"
            >
              <ArrowLeft
                className="w-5.5 h-5.5 text-foreground"
                strokeWidth={1.8}
              />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-none tracking-tight">
                  {text.liveAuction}
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1 flex items-center gap-1.5">
                <Gavel className="w-3.5 h-3.5" />
                Bidding Room
              </p>
            </div>
          </div>

          {isAuctionActive ? (
            <Badge className="bg-destructive hover:bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 gap-1.5 px-3 py-1.5 animate-pulse">
              <Flame className="h-4 w-4" />
              <span className="font-bold tracking-wider">LIVE</span>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-muted text-muted-foreground font-bold tracking-wider px-3 py-1.5"
            >
              ENDED
            </Badge>
          )}
        </div>
      </header>

      {/* ---------------------------------------------------------------------- */}
      {/* MAIN GRID */}
      {/* ---------------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: Asset & Timer (Spans 5 columns) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
            {/* Hero Asset Card */}
            <div className="glass-card rounded-3xl overflow-hidden premium-shadow border border-border/50">
              {/* Premium Image Header */}
              <div className="relative h-56 sm:h-64 w-full">
                <Image
                  src={cropImages.wheat}
                  alt={text.wheat}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/20" />

                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 shadow-md border-0">
                    {text.premium}
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
                      {text.wheat}
                    </h2>
                    <p className="text-white/80 font-bold mt-1 tracking-wide">
                      {currentAuction?.quantity || 50} {text.quintal}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                    <Users className="h-4 w-4 text-agri-gold" />
                    47 {text.watchingLive}
                  </div>
                </div>
              </div>

              {/* Financial Stats */}
              <div className="p-5 sm:p-6 bg-card">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/50 rounded-2xl p-4 sm:p-5 border border-border/50">
                    <p className="text-[10px] sm:text-xs font-bold text-muted-foreground mb-1 uppercase tracking-widest">
                      {text.basePrice}
                    </p>
                    <p className="text-xl sm:text-2xl font-mono font-bold text-foreground">
                      ₹{basePrice}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl p-4 sm:p-5 border transition-colors duration-300",
                      isAuctionActive
                        ? "bg-primary/10 border-primary/30 shadow-inner"
                        : "bg-muted border-border/50",
                    )}
                  >
                    <p className="text-[10px] sm:text-xs font-bold text-primary/70 mb-1 uppercase tracking-widest">
                      {text.currentBid}
                    </p>
                    <motion.div
                      key={currentLeadingBid}
                      initial={{ scale: 1.1, color: "var(--primary)" }}
                      animate={{ scale: 1, color: "var(--foreground)" }}
                      className="flex items-start"
                    >
                      <span className="text-lg font-light mt-0.5 mr-0.5 text-primary">
                        ₹
                      </span>
                      <p
                        className={cn(
                          "text-2xl sm:text-3xl font-mono font-black tracking-tighter",
                          isAuctionActive ? "text-primary" : "text-foreground",
                        )}
                      >
                        {currentLeadingBid}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timer Card */}
            {isAuctionActive ? (
              <motion.div
                animate={isUrgent ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: isUrgent ? Infinity : 0, duration: 2 }}
                className={cn(
                  "glass-card rounded-3xl p-5 sm:p-6 border-2 transition-all duration-300 shadow-lg",
                  isUrgent
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-border/50",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                        isUrgent ? "bg-destructive/10" : "bg-primary/10",
                      )}
                    >
                      <Clock
                        className={cn(
                          "h-6 w-6",
                          isUrgent
                            ? "text-destructive animate-pulse"
                            : "text-primary",
                        )}
                      />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      {text.auctionEnds}
                    </span>
                  </div>
                  <motion.span
                    key={timeLeft}
                    initial={{ scale: 1.1, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      "text-4xl font-mono font-black tracking-tighter",
                      isUrgent ? "text-destructive" : "text-foreground",
                    )}
                  >
                    {formatTime(timeLeft)}
                  </motion.span>
                </div>
                {isUrgent && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 flex items-center justify-center gap-2 text-destructive text-sm font-bold bg-destructive/10 py-3 rounded-xl"
                  >
                    <AlertCircle className="h-5 w-5" />
                    <span>Hurry! Auction ending soon</span>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border-2 border-agri-success/30 bg-agri-success/5 shadow-lg flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-agri-success/20 flex items-center justify-center shadow-[0_0_30px_rgba(var(--agri-success-rgb),0.3)]">
                  <CheckCircle2
                    className="h-8 w-8 text-agri-success"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <h3 className="font-black text-2xl text-foreground tracking-tight">
                    {text.auctionEnded}
                  </h3>
                  <p className="text-base text-muted-foreground font-medium mt-2">
                    Final Sale Price:{" "}
                    <span className="font-bold text-agri-success text-xl ml-1 tracking-tight">
                      ₹{currentLeadingBid}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Live Bid History (Spans 7 columns) */}
          <div className="lg:col-span-7">
            <div className="glass-card premium-shadow rounded-3xl flex flex-col border border-border/50 overflow-hidden h-[600px] lg:h-[750px]">
              {/* Sticky Header for Feed */}
              <div className="p-5 sm:p-6 border-b border-border/50 bg-card/80 backdrop-blur-xl z-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <TrendingUp
                      className="h-5 w-5 text-primary"
                      strokeWidth={2.5}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    {text.bidHistory}
                  </h3>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-agri-success/15 text-agri-success font-mono font-bold text-sm shadow-sm flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />+
                  {profit > 0 ? profit : 0} ₹ {text.profit}
                </div>
              </div>

              {/* Scrollable Feed */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar bg-background/30">
                <AnimatePresence mode="popLayout">
                  {bids.map((bid, index) => (
                    <motion.div
                      key={bid.id}
                      initial={{ opacity: 0, y: -20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.4,
                        type: "spring",
                        bounce: 0.4,
                      }}
                      className={cn(
                        "flex items-center justify-between p-4 sm:p-5 rounded-2xl transition-all duration-300 border",
                        bid.isLeading
                          ? "bg-primary/10 border-primary/30 shadow-md ring-1 ring-primary/20"
                          : "bg-card border-border/50 hover:border-primary/20",
                      )}
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors shadow-sm shrink-0",
                            bid.isLeading
                              ? "bg-primary text-primary-foreground shadow-primary/30"
                              : "bg-secondary text-muted-foreground",
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
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {bid.bidder}
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground font-mono font-semibold uppercase tracking-wider mt-0.5">
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
                            bid.isLeading ? "text-primary" : "text-foreground",
                          )}
                        >
                          ₹{bid.amount}
                        </p>
                        {bid.isLeading && isAuctionActive && (
                          <span className="mt-1 text-[9px] sm:text-[10px] bg-primary/20 text-primary font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                            {text.leading}
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
    </div>
  );
}
