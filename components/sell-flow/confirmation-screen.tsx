"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Crop } from "@/lib/store";

function ReceiptRow({
  label, value, highlight, success,
}: {
  label: string; value: string; highlight?: boolean; success?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-500 dark:text-white/40">{label}</span>
      <span className={cn(
        "font-bold text-right",
        highlight
          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 px-2.5 py-1 rounded-md text-xs uppercase tracking-wider border border-emerald-500/15 dark:border-emerald-400/20"
          : "text-slate-800 dark:text-white text-sm",
        success && "text-emerald-600 dark:text-emerald-400",
      )}>
        {value}
      </span>
    </div>
  );
}

export function ConfirmationScreen({
  crop, quantity, totalValue, poolBonus,
  method, getCropName, t, error, chosenPool,
}: {
  crop: Crop;
  quantity: number;
  totalValue: number;
  poolBonus: number;
  method: string | null;
  getCropName: (crop: Crop) => string;
  t: any;
  error: string | null;
  chosenPool: any;
}) {
  return (
    <div className="space-y-6">

      {/* Icon + title */}
      <div className="text-center space-y-3 py-4">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/25 dark:border-emerald-400/25 flex items-center justify-center mx-auto">
          <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review &amp; Confirm</h2>
      </div>

      {/* Receipt card */}
      <div className="bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl border border-white/60 dark:border-white/[0.09] rounded-3xl p-6 space-y-5 shadow-md dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <ReceiptRow label="Commodity" value={getCropName(crop)} />
        <ReceiptRow label="Quantity"  value={`${quantity} ${t.quintals || "quintals"}`} />
        <ReceiptRow label="Base Rate" value={`₹${crop.currentPrice.toLocaleString("en-IN")}/${crop.unit}`} />
        <ReceiptRow
          label="Method"
          value={method === "pool" ? "Community Pool" : method === "auction" ? "Live Auction" : "Direct Sell"}
          highlight
        />
        {chosenPool && (
          <>
            <ReceiptRow label="Buyer"       value={chosenPool.creatorName} />
            <ReceiptRow label="Offered Rate" value={`₹${chosenPool.pricePerUnit}/${chosenPool.unit}`} success />
            {chosenPool.location && (
              <ReceiptRow label="Location" value={`📍 ${chosenPool.location}`} />
            )}
            <ReceiptRow
              label="Your Contribution"
              value={`${Math.min(quantity, chosenPool.targetQuantity - (chosenPool.filledQuantity || 0))}/${chosenPool.targetQuantity} ${chosenPool.unit}`}
            />
          </>
        )}
        {poolBonus > 0 && (
          <ReceiptRow label="Pool Bonus" value={`+₹${poolBonus.toLocaleString("en-IN")}`} success />
        )}

        {/* Divider */}
        <div className="h-px bg-white/60 dark:bg-white/[0.08] my-4" />

        {/* Final payout */}
        <div className="flex items-end justify-between pt-2">
          <span className="text-sm font-bold text-slate-500 dark:text-white/35 uppercase tracking-wider">
            Final Payout
          </span>
          <span className="text-4xl font-bold tracking-tighter text-emerald-600 dark:text-emerald-400">
            ₹{(totalValue + poolBonus).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 dark:bg-red-500/[0.12] border border-red-500/20 dark:border-red-400/20 rounded-2xl p-4 text-sm text-red-600 dark:text-red-400 font-medium text-center">
          ⚠️ {error}
        </div>
      )}

      <p className="text-xs text-center font-medium text-slate-500 dark:text-white/30 px-4">
        By tapping confirm, you agree to FarmHers' terms. Funds are secured in escrow until handover.
      </p>

    </div>
  );
}
