"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Users, Gavel, Flame, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

const makeTokens = (isDark: boolean) => isDark ? {
  card:         "rgba(8,18,10,0.65)",
  border:       "rgba(90,158,111,0.15)",
  blur:         "blur(18px)",
  accent:       "#5a9e6f",
  accentDark:   "#2d6a4f",
  accentBg:     "rgba(45,106,79,0.20)",
  accentBorder: "rgba(90,158,111,0.30)",
  textSub:      "rgba(255,255,255,0.45)",
  textLabel:    "rgba(255,255,255,0.38)",
  statBox:      "rgba(255,255,255,0.06)",
  expandBg:     "rgba(5,14,7,0.70)",
  shadow:       "0 4px 24px rgba(0,0,0,0.35)",
} : {
  card:         "rgba(200,225,255,0.18)",
  border:       "rgba(180,210,255,0.30)",
  blur:         "blur(32px)",
  accent:       "#4ade80",
  accentDark:   "#16a34a",
  accentBg:     "rgba(74,222,128,0.15)",
  accentBorder: "rgba(74,222,128,0.30)",
  textSub:      "rgba(255,255,255,0.75)",
  textLabel:    "rgba(255,255,255,0.52)",
  statBox:      "rgba(200,225,255,0.14)",
  expandBg:     "rgba(0,10,30,0.20)",
  shadow:       "0 4px 24px rgba(0,10,30,0.25)",
};

export function BuyerAuctions({ isDark = true }: { isDark?: boolean }) {
  const G = makeTokens(isDark);
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
      <div className="rounded-3xl p-10 text-center border-2 border-dashed"
        style={{ background: G.card, borderColor: G.accentBorder, backdropFilter: G.blur }}>
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
              background:           G.card,
              backdropFilter:       G.blur,
              WebkitBackdropFilter: G.blur,
              border: isEndingSoon ? "1px solid rgba(239,68,68,0.40)" : `1px solid ${G.border}`,
              boxShadow: isEndingSoon ? "0 4px 24px rgba(239,68,68,0.15)" : G.shadow,
            }}
          >
            <div
              className={`h-1 w-full ${isEndingSoon ? "animate-pulse" : ""}`}
              style={{ background: isEndingSoon ? "#ef4444" : `linear-gradient(to right, ${G.accentDark}, ${G.accent})` }}
            />

            <div className="p-5 cursor-pointer" onClick={() => setActiveAuctionId(isActive ? null : auction.id)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: G.accentBg, border: `1px solid ${G.accentBorder}` }}>
                    {getCropEmoji(cropName)}
                  </div>
                  <div>
                    <h3 className="font-semibold uppercase tracking-wide text-white">{cropName}</h3>
                    <p className="text-xs font-mono" style={{ color: G.textLabel }}>Lot #{auction.id}</p>
                  </div>
                </div>

                {isEndingSoon ? (
                  <Badge variant="destructive" className="gap-1 animate-pulse text-[10px] uppercase font-bold">
                    <Flame className="w-3 h-3" /> Ending
                  </Badge>
                ) : (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                    style={{ border: `1px solid ${G.accentBorder}`, color: G.accent, background: G.accentBg }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G.accent }} />
                    Live
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="rounded-lg p-2.5 text-center" style={{ background: G.statBox }}>
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: G.textLabel }}>Qty</p>
                  <p className="text-sm font-bold text-white">{auction.quantity}q</p>
                </div>
                <div className="rounded-lg p-2.5 text-center" style={{ background: G.statBox }}>
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: G.textLabel }}>Base</p>
                  <p className="text-sm font-bold line-through" style={{ color: "rgba(255,255,255,0.30)" }}>₹{auction.startingPrice}</p>
                </div>
                <div className="rounded-lg p-2.5 text-center"
                  style={{ background: G.accentBg, border: `1px solid ${G.accentBorder}` }}>
                  <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: G.accent }}>Current</p>
                  <p className="text-sm font-bold" style={{ color: G.accent }}>₹{auction.currentBid}</p>
                </div>
                <div className="rounded-lg p-2.5 text-center"
                  style={{ background: isEndingSoon ? "rgba(239,68,68,0.15)" : G.statBox }}>
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: G.textLabel }}>Time</p>
                  <p className="text-sm font-bold font-mono" style={{ color: isEndingSoon ? "#ef4444" : "rgba(255,255,255,0.85)" }}>12:45</p>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                  style={{ background: G.expandBg, borderTop: `1px solid ${G.border}` }}
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold" style={{ color: G.textSub }}>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Active Bidding Open</span>
                      </div>
                      <span>Min increment: ₹50</span>
                    </div>
                    <div className="flex gap-2">
                      {[50, 100].map((inc) => (
                        <button key={inc}
                          className="flex-1 py-2 rounded-xl text-sm font-bold transition-colors"
                          style={{ border: `1px solid ${G.accentBorder}`, color: G.accent, background: G.accentBg }}
                          onClick={() => placeBid(auction.id, auction.currentBid + inc, "buyer-pam-001")}
                        >
                          +₹{inc}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => router.push(`/buyer/auctions/${auction.id}`)}
                      className="w-full h-12 rounded-xl text-base font-bold text-white flex items-center justify-center transition-all"
                      style={{ background: G.accentDark, border: `1px solid ${G.accentBorder}`, boxShadow: "0 2px 16px rgba(22,163,74,0.4)" }}
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
