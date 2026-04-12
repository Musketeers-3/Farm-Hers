"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Gavel, Flame, Zap, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store"; // 🚀 Import the global store

export function BuyerAuctions() {
  const router = useRouter();
  const [activeAuctionId, setActiveAuctionId] = useState<string | null>(null);

  // 1. 🚀 PULL REAL AUCTIONS FROM ZUSTAND
  const auctions = useAppStore((state) => state.auctions);
  const crops = useAppStore((state) => state.crops);
  const placeBid = useAppStore((state) => state.placeBid);

  const getCropEmoji = (cropName: string) => {
    if (!cropName) return "🌱";
    if (cropName.toLowerCase().includes("wheat")) return "🌾";
    if (
      cropName.toLowerCase().includes("rice") ||
      cropName.toLowerCase().includes("basmati")
    )
      return "🍚";
    if (cropName.toLowerCase().includes("mustard")) return "🌻";
    return "🌱";
  };

  // If no auctions are live, show a sleek empty state
  if (auctions.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center border-dashed border-2 border-border/50">
        <Gavel className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
        <h3 className="text-lg font-bold text-foreground">No Live Auctions</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Check back later when farmers list new crops.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {auctions.map((auction, i) => {
        const isActive = activeAuctionId === auction.id;

        // Match the auction's cropId to the actual crop details in the store
        const cropDetails = crops.find((c) => c.id === auction.cropId);
        const cropName = cropDetails?.name || auction.cropId;

        // Determine if it's ending soon (For UI purposes, let's say yes if it's auction-1)
        const isEndingSoon = auction.id === "auction-1";

        return (
          <motion.div
            layout
            key={auction.id}
            className={`glass-card rounded-2xl overflow-hidden premium-shadow transition-all ${
              isEndingSoon
                ? "border border-destructive/30"
                : "border border-border/50 hover:border-primary/30"
            }`}
          >
            {/* Top Border Indicator */}
            <div
              className={`h-1 w-full ${isEndingSoon ? "bg-destructive animate-pulse" : "bg-gradient-to-r from-primary to-agri-gold"}`}
            />

            <div
              className="p-5 cursor-pointer hover:bg-secondary/10 transition-colors"
              onClick={() => setActiveAuctionId(isActive ? null : auction.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                    {getCropEmoji(cropName)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground uppercase tracking-wide">
                      {cropName}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      Lot #{auction.id}
                    </p>
                  </div>
                </div>

                {isEndingSoon ? (
                  <Badge
                    variant="destructive"
                    className="gap-1 animate-pulse text-[10px] uppercase font-bold"
                  >
                    <Flame className="w-3 h-3" /> Ending
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="gap-1 text-[10px] text-primary border-primary/30 uppercase font-bold"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />{" "}
                    Live
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div className="bg-secondary/60 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                    Qty
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {auction.quantity}q
                  </p>
                </div>
                <div className="bg-secondary/60 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                    Base
                  </p>
                  <p className="text-sm font-bold text-muted-foreground line-through">
                    ₹{auction.startingPrice}
                  </p>
                </div>
                <div className="bg-primary/10 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-primary uppercase tracking-widest font-bold">
                    Current
                  </p>
                  <p className="text-sm font-bold text-primary">
                    ₹{auction.currentBid}
                  </p>
                </div>
                <div
                  className={`${isEndingSoon ? "bg-destructive/10" : "bg-secondary/60"} rounded-lg p-2.5 text-center`}
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                    Time
                  </p>
                  <p
                    className={`text-sm font-bold font-mono ${isEndingSoon ? "text-destructive" : "text-foreground"}`}
                  >
                    12:45 {/* We would format the ISO string here */}
                  </p>
                </div>
              </div>
            </div>

            {/* EXPANDABLE BIDDING CONSOLE */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-secondary/30 border-t border-border/50"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Active Bidding Open</span>
                      </div>
                      <span>Min increment: ₹50</span>
                    </div>

                    {/* Quick Bid Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-primary/20 hover:bg-primary/10 text-primary font-bold"
                        onClick={() =>
                          placeBid(
                            auction.id,
                            auction.currentBid + 50,
                            "buyer-pam-001",
                          )
                        }
                      >
                        +₹50
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-primary/20 hover:bg-primary/10 text-primary font-bold"
                        onClick={() =>
                          placeBid(
                            auction.id,
                            auction.currentBid + 100,
                            "buyer-pam-001",
                          )
                        }
                      >
                        +₹100
                      </Button>
                    </div>

                    {/* 2. 🚀 THE LINK TO THE DEDICATED ROOM */}
                    <Button
                      onClick={() =>
                        router.push(`/buyer/auctions/${auction.id}`)
                      }
                      className="w-full h-12 bg-primary text-white font-bold text-base hover:shadow-lg hover:shadow-primary/30 transition-all rounded-xl flex items-center justify-center"
                    >
                      Enter Live Auction Room{" "}
                      <ArrowUpRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
