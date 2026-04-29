"use client";

import { useState, useEffect, use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ShieldCheck,
  Activity,
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

export default function DedicatedAuctionRoom({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const auctionId = resolvedParams.id;
  const router = useRouter();

  // Store connections
  const auctions = useAppStore((state) => state.auctions);
  const crops = useAppStore((state) => state.crops);
  const placeBid = useAppStore((state) => state.placeBid);

  const auctionDetails = auctions.find((a) => a.id === auctionId);
  const cropDetails = crops.find((c) => c.id === auctionDetails?.cropId);
  const cropName =
    cropDetails?.name || auctionDetails?.cropId || "Premium Crop";

  // States
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isBidding, setIsBidding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // 🚀 Parallax state

  const basePrice = auctionDetails?.startingPrice || 2300;
  const currentLeadingBid = auctionDetails?.currentBid || basePrice;
  const profit = currentLeadingBid - basePrice;
  const isAuctionActive = timeLeft > 0;

  const [bids, setBids] = useState<Bid[]>([
    {
      id: "initial-1",
      bidder: "Current Leader",
      amount: currentLeadingBid,
      timestamp: new Date(),
      isLeading: true,
    },
  ]);

  // Handle Hydration & Mouse Parallax
  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (window.innerWidth / 2 - e.pageX) / 80, // Subtle movement
        y: (window.innerHeight / 2 - e.pageY) / 80,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

  // Simulate competing incoming bids
  useEffect(() => {
    if (!isAuctionActive) return;
    const bidInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAmount =
          currentLeadingBid + Math.floor(Math.random() * 20) + 10;
        placeBid(
          auctionId,
          newAmount,
          `competitor-${Math.floor(Math.random() * 100)}`,
        );
        const newBid: Bid = {
          id: Date.now().toString() + Math.random(),
          bidder: ["Delhi Grain Corp", "Rajasthan Mills", "MP Foods Ltd"][
            Math.floor(Math.random() * 3)
          ],
          amount: newAmount,
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
  }, [currentLeadingBid, isAuctionActive, auctionId, placeBid]);

  // Handle manual bid
  const handleManualBid = (increment: number) => {
    setIsBidding(true);
    setTimeout(() => {
      const newAmount = currentLeadingBid + increment;
      placeBid(auctionId, newAmount, "buyer-pam-001");
      const newBid: Bid = {
        id: Date.now().toString(),
        bidder: "Punjab Agro Mills (You)",
        amount: newAmount,
        timestamp: new Date(),
        isLeading: true,
      };
      setBids((prev) => {
        const updated = prev.map((b) => ({ ...b, isLeading: false }));
        return [newBid, ...updated].slice(0, 20);
      });
      setIsBidding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isUrgent = timeLeft > 0 && timeLeft < 60;

  if (!isMounted || !auctionDetails) return null;

  // The requested sunset grass image
  const bgImage =
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920&auto=format&fit=crop";

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white selection:bg-primary/30">
      {/* 1. 🚀 GLOBAL PARALLAX BACKGROUND */}
      <motion.div
        animate={{ x: mousePos.x, y: mousePos.y, scale: 1.05 }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
        className="fixed inset-[-5%] w-[110%] h-[110%] z-0 pointer-events-none"
      >
        <Image
          src={bgImage}
          alt="Background"
          fill
          className="object-cover opacity-40"
          priority
        />
        {/* Dark gradient vignette to ensure text readability */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
      </motion.div>

      {/* 2. HEADER */}
      <header className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Live Trading Floor
              </h1>
              <p className="text-xs text-white/50 font-mono uppercase tracking-widest mt-0.5">
                Contract ID: {auctionId}
              </p>
            </div>
          </div>

          {isAuctionActive ? (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-sm font-bold text-red-500 tracking-widest uppercase">
                Live Market
              </span>
            </div>
          ) : (
            <Badge
              variant="outline"
              className="border-white/20 text-white/50 px-4 py-2 uppercase tracking-widest"
            >
              Market Closed
            </Badge>
          )}
        </div>
      </header>

      {/* 3. MAIN IMMERSIVE GRID */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8 flex flex-col">
        {/* Mobile: stacked layout, Desktop: side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1">
          {/* LEFT COLUMN: Asset & Command Center */}
          <div className="lg:col-span-7 flex flex-col gap-4 lg:gap-6 order-2 lg:order-1">
            {/* Ultra-Premium Glass Hero */}
            <div className="relative rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />

              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 mb-3 lg:mb-4 px-2.5 lg:px-3 py-1 backdrop-blur-md text-xs lg:text-sm">
                    <ShieldCheck className="w-3.5 h-3.5 lg:w-4 h-4 mr-1.5" /> Verified Grade A
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-black text-white tracking-tight capitalize drop-shadow-xl leading-tight">
                    {cropName}
                  </h2>
                  <p className="text-lg lg:text-2xl text-white/70 font-light mt-1 lg:mt-2">
                    {auctionDetails.quantity} Quintals Vol.
                  </p>
                </div>

                {/* Dynamic Timer Sphere */}
                <div className="text-right shrink-0">
                  <div className="inline-block p-1 rounded-2xl lg:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div
                      className={cn(
                        "px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl flex flex-col items-center",
                        isUrgent ? "bg-red-500/20" : "bg-black/40",
                      )}
                    >
                      <Clock
                        className={cn(
                          "w-5 h-5 lg:w-6 h-6 mb-1.5 lg:mb-2",
                          isUrgent
                            ? "text-red-400 animate-pulse"
                            : "text-white/50",
                        )}
                      />
                      <span
                        className={cn(
                          "text-2xl lg:text-4xl font-mono font-black tracking-tighter",
                          isUrgent ? "text-red-400" : "text-white",
                        )}
                      >
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bidding Command Console */}
            {isAuctionActive ? (
              <div className="rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl mt-auto">
                <div className="grid grid-cols-2 gap-4 lg:gap-8 mb-6 lg:mb-8">
                  <div>
                    <p className="text-xs lg:text-sm font-bold text-white/40 uppercase tracking-widest mb-1 lg:mb-2">
                      Starting Base
                    </p>
                    <p className="text-xl lg:text-2xl font-mono text-white/70">
                      ₹{basePrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm font-bold text-primary uppercase tracking-widest mb-1 lg:mb-2 flex items-center gap-1.5 lg:gap-2">
                      <Activity className="w-3.5 h-3.5 lg:w-4 h-4 animate-pulse" /> Market
                      Price
                    </p>
                    <motion.div
                      key={currentLeadingBid}
                      initial={{ scale: 1.1, y: -10 }}
                      animate={{ scale: 1, y: 0 }}
                      className="flex items-start"
                    >
                      <span className="text-lg lg:text-2xl text-primary font-light mt-1 mr-1">
                        ₹
                      </span>
                      <p className="text-4xl lg:text-6xl font-mono font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(30,77,43,0.5)]">
                        {currentLeadingBid}
                      </p>
                    </motion.div>
                  </div>
                </div>

                <div className="flex gap-3 lg:gap-4">
                  <Button
                    onClick={() => handleManualBid(50)}
                    disabled={isBidding}
                    className="flex-1 h-14 lg:h-16 rounded-xl lg:rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-lg lg:text-xl font-bold backdrop-blur-md transition-all active:scale-95"
                  >
                    +₹50
                  </Button>
                  <Button
                    onClick={() => handleManualBid(100)}
                    disabled={isBidding}
                    className="flex-1 h-14 lg:h-16 rounded-xl lg:rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-lg lg:text-xl font-bold backdrop-blur-md transition-all active:scale-95"
                  >
                    +₹100
                  </Button>
                  <Button
                    onClick={() => handleManualBid(250)}
                    disabled={isBidding}
                    className={cn(
                      "flex-[2] h-14 lg:h-16 rounded-xl lg:rounded-2xl text-lg lg:text-xl font-black transition-all active:scale-95 shadow-[0_0_30px_rgba(30,77,43,0.3)] border-0",
                      showSuccess
                        ? "bg-green-500 text-white"
                        : "bg-primary hover:bg-primary/90 text-white",
                    )}
                  >
                    {isBidding
                      ? "..."
                      : showSuccess
                        ? "BID ACCEPTED"
                        : "+₹250"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 border border-green-500/30 bg-green-500/10 backdrop-blur-3xl shadow-2xl flex items-center justify-between mt-auto">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight mb-2">
                    Contract Closed
                  </h3>
                  <p className="text-green-400 font-bold text-lg lg:text-xl">
                    Settled at ₹{currentLeadingBid}/q
                  </p>
                </div>
                <div className="w-16 lg:w-20 h-16 lg:h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 lg:w-10 h-8 lg:h-10 text-green-500" />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Bloomberg-style Feed */}
          <div className="lg:col-span-5 h-[400px] sm:h-[350px] lg:h-auto pb-8 lg:pb-0 order-1 lg:order-2">
            <div className="h-full min-h-[350px] lg:min-h-0 rounded-2xl lg:rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl flex flex-col overflow-hidden shadow-2xl">
              <div className="p-4 lg:p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white/90 uppercase tracking-widest text-xs lg:text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Live Order Book
                </h3>
                <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-2.5 py-1.5 rounded-full text-white/70">
                  <Users className="w-3.5 h-3.5 text-primary" /> 47 Active
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {bids.map((bid) => (
                    <motion.div
                      key={bid.id}
                      initial={{ opacity: 0, x: 50, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", bounce: 0.4 }}
                      className={cn(
                        "p-3 lg:p-4 rounded-xl lg:rounded-2xl flex justify-between items-center border",
                        bid.isLeading
                          ? "bg-primary/20 border-primary/40 shadow-[0_0_20px_rgba(30,77,43,0.3)]"
                          : "bg-white/5 border-white/5",
                      )}
                    >
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div
                          className={cn(
                            "w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center",
                            bid.isLeading
                              ? "bg-primary text-white"
                              : "bg-white/10 text-white/50",
                          )}
                        >
                          {bid.isLeading ? (
                            <Trophy className="w-4.5 h-4.5 lg:w-5 h-5" />
                          ) : (
                            <User className="w-4.5 h-4.5 lg:w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p
                            className={cn(
                              "font-bold text-sm",
                              bid.isLeading ? "text-white" : "text-white/70",
                            )}
                          >
                            {bid.bidder}
                          </p>
                          <p className="text-[10px] text-white/40 font-mono mt-0.5">
                            {bid.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "text-lg lg:text-xl font-mono font-black",
                            bid.isLeading ? "text-primary" : "text-white/50",
                          )}
                        >
                          ₹{bid.amount}
                        </p>
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
