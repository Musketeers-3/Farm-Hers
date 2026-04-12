"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Gavel, Flame, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data (This will eventually come from useAppStore)
const liveAuctions = [
  {
    id: "1",
    crop: "Organic Wheat",
    quantity: 50,
    currentBid: 2650,
    basePrice: 2400,
    timeLeft: "04:45",
    participants: 8,
    farmer: "Gurpreet Singh",
    isEndingSoon: true,
  },
  {
    id: "2",
    crop: "Premium Basmati",
    quantity: 30,
    currentBid: 4200,
    basePrice: 3800,
    timeLeft: "08:22",
    participants: 12,
    farmer: "Ramesh Kumar",
    isEndingSoon: false,
  },
  {
    id: "3",
    crop: "Yellow Mustard",
    quantity: 25,
    currentBid: 5450,
    basePrice: 5100,
    timeLeft: "25:10",
    participants: 5,
    farmer: "Harjinder Kaur",
    isEndingSoon: false,
  },
];

export function BuyerAuctions() {
  const [activeAuctionId, setActiveAuctionId] = useState<string | null>(null);

  const getCropEmoji = (crop: string) => {
    if (crop.includes("Wheat")) return "🌾";
    if (crop.includes("Basmati")) return "🍚";
    if (crop.includes("Mustard")) return "🌻";
    return "🌱";
  };

  return (
    <div className="space-y-4">
      {liveAuctions.map((auction, i) => {
        const isActive = activeAuctionId === auction.id;

        return (
          <motion.div
            layout
            key={auction.id}
            className={`glass-card rounded-2xl overflow-hidden premium-shadow transition-all ${
              auction.isEndingSoon ? "border border-destructive/30" : ""
            }`}
          >
            {/* Top Border Indicator */}
            <div
              className={`h-1 w-full ${auction.isEndingSoon ? "bg-destructive animate-pulse" : "bg-gradient-to-r from-primary to-agri-gold"}`}
            />

            <div
              className="p-5 cursor-pointer hover:bg-secondary/20 transition-colors"
              onClick={() => setActiveAuctionId(isActive ? null : auction.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                    {getCropEmoji(auction.crop)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {auction.crop}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {auction.farmer}
                    </p>
                  </div>
                </div>

                {auction.isEndingSoon ? (
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
                  <p className="text-[10px] text-muted-foreground">Qty</p>
                  <p className="text-sm font-semibold text-foreground">
                    {auction.quantity}q
                  </p>
                </div>
                <div className="bg-secondary/60 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-muted-foreground">Base</p>
                  <p className="text-sm font-semibold text-muted-foreground line-through">
                    ₹{auction.basePrice}
                  </p>
                </div>
                <div className="bg-primary/10 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-muted-foreground">Current</p>
                  <p className="text-sm font-bold text-primary">
                    ₹{auction.currentBid}
                  </p>
                </div>
                <div
                  className={`${auction.isEndingSoon ? "bg-destructive/10" : "bg-secondary/60"} rounded-lg p-2.5 text-center`}
                >
                  <p className="text-[10px] text-muted-foreground">Time</p>
                  <p
                    className={`text-sm font-bold font-mono ${auction.isEndingSoon ? "text-destructive" : "text-foreground"}`}
                  >
                    {auction.timeLeft}
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
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{auction.participants} active bidders</span>
                      </div>
                      <span>Min increment: ₹50</span>
                    </div>

                    {/* Quick Bid Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-primary/20 hover:bg-primary/10 text-primary"
                      >
                        +₹50
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-primary/20 hover:bg-primary/10 text-primary"
                      >
                        +₹100
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-primary/20 hover:bg-primary/10 text-primary"
                      >
                        <Zap className="w-3 h-3 mr-1" /> Max
                      </Button>
                    </div>

                    <Button className="w-full h-12 bg-primary text-white font-bold text-base hover:shadow-lg hover:shadow-primary/30 transition-all rounded-xl">
                      <Gavel className="w-5 h-5 mr-2" />
                      Place Bid at ₹{auction.currentBid + 50}
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
