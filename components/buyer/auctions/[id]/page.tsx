"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Gavel, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store"; // 🚀 Import the store

export default function DedicatedAuctionRoom({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  // 1. Pull real data from Zustand
  const auctions = useAppStore((state) => state.auctions);
  const placeBid = useAppStore((state) => state.placeBid);

  // Find the exact auction from the URL parameter
  const auctionDetails = auctions.find((a) => a.id === params.id);

  const [isBidding, setIsBidding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 404 Fallback if auction isn't found
  if (!auctionDetails)
    return <div className="p-10 text-center">Auction not found or ended.</div>;

  const handlePlaceBid = (increment: number) => {
    setIsBidding(true);

    // Simulate network latency for realism
    setTimeout(() => {
      const newAmount = auctionDetails.currentBid + increment;
      // 2. Dispatch global state update! (Using a mock buyer ID)
      placeBid(auctionDetails.id, newAmount, "buyer-pam-001");

      setIsBidding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 600);
  };

  // Use the Golden Hour Image you requested
  const coverImage =
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1920&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* CINEMATIC HEADER */}
      <div className="relative h-[40vh] min-h-[300px] w-full">
        <Image
          src={coverImage}
          alt="Golden hour field"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />

        <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-10">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/40 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Badge
            variant="destructive"
            className="animate-pulse bg-destructive/90 text-white border-0 px-3 py-1"
          >
            <span className="w-2 h-2 rounded-full bg-white mr-2 animate-ping" />{" "}
            LIVE AUCTION
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <p className="text-primary-foreground/80 font-bold tracking-widest text-xs uppercase drop-shadow-md mb-1">
            Lot #{auctionDetails.id}
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-lg leading-tight uppercase">
            {auctionDetails.cropId}{" "}
            {/* We'd normally map this to the full name */}
          </h1>
          <div className="flex items-center gap-4 mt-3">
            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30">
              {auctionDetails.quantity} Quintals
            </Badge>
            <div className="flex items-center gap-1.5 text-white/90 text-sm font-medium drop-shadow-md">
              <ShieldCheck className="w-4 h-4 text-agri-success" /> Quality
              Verified
            </div>
          </div>
        </div>
      </div>

      {/* THE TRADING FLOOR */}
      <main className="max-w-3xl mx-auto px-5 -mt-6 relative z-20 space-y-4">
        {/* Current Bid Card */}
        <div className="glass-card premium-shadow rounded-3xl p-6 border border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-6">
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Current Highest Bid
              </p>
              <div className="flex items-baseline gap-2">
                {/* 🚀 This number will now update globally! */}
                <span className="text-5xl font-mono font-bold text-primary">
                  ₹{auctionDetails.currentBid}
                </span>
                <span className="text-muted-foreground font-medium">/q</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-14 rounded-2xl text-primary text-lg font-bold"
                onClick={() => handlePlaceBid(50)}
                disabled={isBidding}
              >
                + ₹50
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-14 rounded-2xl text-primary text-lg font-bold"
                onClick={() => handlePlaceBid(100)}
                disabled={isBidding}
              >
                + ₹100
              </Button>
            </div>
            <Button
              className={`w-full h-16 rounded-2xl text-lg font-bold transition-all duration-300 ${showSuccess ? "bg-agri-success" : "bg-primary"}`}
              onClick={() => handlePlaceBid(250)}
              disabled={isBidding}
            >
              {isBidding
                ? "Processing Bid..."
                : showSuccess
                  ? "Bid Placed Successfully!"
                  : "Place Custom Bid"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
