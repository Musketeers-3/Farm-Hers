"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Users, Gavel, Flame, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

// ✅ CHANGE: Shared paddy green token set — mirrors buyer-pools.tsx
const G = {
  card:         "rgba(8,18,10,0.65)",
  border:       "rgba(90,158,111,0.15)",
  blur:         "blur(18px)",
  accent:       "#5a9e6f",
  accentDark:   "#2d6a4f",
  accentBg:     "rgba(45,106,79,0.2)",
  accentBorder: "rgba(90,158,111,0.3)",
  textSub:      "rgba(255,255,255,0.4)",
};

export function BuyerAuctions() {
  const router = useRouter();
  const [activeAuctionId, setActiveAuctionId] = useState<string | null>(null);

  const auctions = useAppStore((state) => state.auctions);
  const crops    = useAppStore((state) => state.crops);
  const placeBid = useAppStore((state) => state.placeBid);

  const getCropEmoji = (cropName: string) => {
    if (!cropName) return "🌱";
    if (cropName.toLowerCase().includes("wheat"))   return "🌾";
    if (cropName.toLowerCase().includes("rice") || cropName.toLowerCase().includes("basmati")) return "🍚";
    if (cropName.toLowerCase().includes("mustard")) return "🌻";
    return "🌱";
  };

  if (auctions.length === 0) {
    return (
      <div
        className="rounded-3xl p-10 text-center border-2 border-dashed"
        style={{ background: G.card, borderColor: G.accentBorder, backdropFilter: G.blur }}
      >
        <Gavel className="w-10 h-10 mx-auto mb-3 opacity-40" style={{ color: G.accent }} />
        <h3 className="text-lg font-bold text-white">No Live Auctions</h3>
        <p className="text-sm mt-1" style={{ color: G.textSub }}>Check back later when farmers list new crops.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {auctions.map((auction) => {
        const isActive     = activeAuctionId === auction.id;
        const cropDetails  = crops.find((c) => c.id === auction.cropId);
        const cropName     = cropDetails?.name || auction.cropId;
        const isEndingSoon = auction.id === "auction-1";

        return (
          <motion.div
            layout
            key={auction.id}
            className="rounded-2xl overflow-hidden"
            style={{
              background:          G.card,
              backdropFilter:      G.blur,
              WebkitBackdropFilter: G.blur,
              border: isEndingSoon ? "1px solid rgba(239,68,68,0.4)" : `1px solid ${G.border}`,
              boxShadow: isEndingSoon
                ? "0 4px 24px rgba(239,68,68,0.15)"
                : "0 4px 24px rgba(0,0,0,0.35)",
            }}
          >
            {/* ✅ CHANGE: top bar uses paddy green gradient */}
            <div
              className={`h-1 w-full ${isEndingSoon ? "animate-pulse" : ""}`}
              style={{ background: isEndingSoon ? "#ef4444" : `linear-gradient(to right, ${G.accentDark}, ${G.accent})` }}
            />

            <div className="p-5 cursor-pointer" onClick={() => setActiveAuctionId(isActive ? null : auction.id)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* ✅ CHANGE: emoji box paddy green tint */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: G.accentBg, border: `1px solid ${G.accentBorder}` }}>
                    {getCropEmoji(cropName)}
                  </div>
                  <div>
                    <h3 className="font-semibold uppercase tracking-wide text-white">{cropName}</h3>
                    <p className="text-xs font-mono" style={{ color: G.textSub }}>Lot #{auction.id}</p>
                  </div>
                </div>

                {isEndingSoon ? (
                  <Badge variant="destructive" className="gap-1 animate-pulse text-[10px] uppercase font-bold">
                    <Flame className="w-3 h-3" /> Ending
                  </Badge>
                ) : (
                  // ✅ CHANGE: Live badge paddy green
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                    style={{ border: `1px solid ${G.accentBorder}`, color: G.accent, background: G.accentBg }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G.accent }} />
                    Live
                  </span>
                )}
              </div>

              {/* ✅ CHANGE: stat boxes all dark glass with paddy green accent on current bid */}
              <div className="grid grid-cols-4 gap-2">
                <div className="rounded-lg p-2.5 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: G.textSub }}>Qty</p>
                  <p className="text-sm font-bold text-white">{auction.quantity}q</p>
                </div>
                <div className="rounded-lg p-2.5 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: G.textSub }}>Base</p>
                  <p className="text-sm font-bold line-through" style={{ color: "rgba(255,255,255,0.3)" }}>₹{auction.startingPrice}</p>
                </div>
                <div className="rounded-lg p-2.5 text-center" style={{ background: G.accentBg, border: `1px solid ${G.accentBorder}` }}>
                  <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: G.accent }}>Current</p>
                  <p className="text-sm font-bold" style={{ color: G.accent }}>₹{auction.currentBid}</p>
                </div>
                <div className="rounded-lg p-2.5 text-center"
                  style={{ background: isEndingSoon ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)" }}>
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: G.textSub }}>Time</p>
                  <p className="text-sm font-bold font-mono" style={{ color: isEndingSoon ? "#ef4444" : "rgba(255,255,255,0.8)" }}>12:45</p>
                </div>
              </div>
            </div>

            {/* Expandable bidding console */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                  style={{ background: "rgba(5,14,7,0.7)", borderTop: `1px solid ${G.accentBorder}` }}
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold" style={{ color: G.textSub }}>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Active Bidding Open</span>
                      </div>
                      <span>Min increment: ₹50</span>
                    </div>

                    {/* ✅ CHANGE: bid buttons paddy green outline */}
                    <div className="flex gap-2">
                      {[50, 100].map((inc) => (
                        <button
                          key={inc}
                          className="flex-1 py-2 rounded-xl text-sm font-bold transition-colors"
                          style={{ border: `1px solid ${G.accentBorder}`, color: G.accent, background: G.accentBg }}
                          onClick={() => placeBid(auction.id, auction.currentBid + inc, "buyer-pam-001")}
                        >
                          +₹{inc}
                        </button>
                      ))}
                    </div>

                    {/* ✅ CHANGE: CTA button paddy green */}
                    <button
                      onClick={() => router.push(`/buyer/auctions/${auction.id}`)}
                      className="w-full h-12 rounded-xl text-base font-bold text-white flex items-center justify-center transition-all"
                      style={{ background: G.accentDark, border: `1px solid ${G.accentBorder}`, boxShadow: "0 2px 16px rgba(45,106,79,0.4)" }}
                    >
                      Enter Live Auction Room <ArrowUpRight className="w-5 h-5 ml-2" />
                    </button>
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