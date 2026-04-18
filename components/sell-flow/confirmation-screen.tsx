"use client";

import { Check, ShieldCheck, MapPin, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Crop } from "@/lib/store";
import { motion } from "framer-motion";

function ReceiptRow({
  label, value, highlight, success,
}: {
  label: string; value: string; highlight?: boolean; success?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs font-black text-slate-400 dark:text-white/30 uppercase tracking-widest">{label}</span>
      <span className={cn(
        "font-black text-right tracking-tight",
        highlight
          ? "text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/15 px-3 py-1 rounded-lg text-[10px] uppercase tracking-[0.1em] border border-blue-500/20"
          : "text-slate-900 dark:text-white text-sm",
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
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">

      {/* 1. Status Icon Section */}
      <div className="text-center space-y-4 py-2">
        <div className="relative inline-block">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 rounded-[2rem] bg-emerald-500/10 dark:bg-emerald-500/20 border-2 border-emerald-500/30 dark:border-emerald-400/30 flex items-center justify-center mx-auto backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.2)]"
          >
            <ShieldCheck className="w-12 h-12 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
          </motion.div>
          {/* Decorative Ring */}
          <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-[2.2rem] scale-110 animate-pulse" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Review & Confirm</h2>
          <p className="text-xs font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mt-1">Transaction Summary</p>
        </div>
      </div>

      {/* 2. Hyper-Realistic Receipt Card */}
      <div 
        className="relative bg-white/40 dark:bg-white/5 backdrop-blur-[50px] border-[1.5px] border-white dark:border-white/10 rounded-[2.5rem] p-7 space-y-6 shadow-2xl overflow-hidden"
        style={{
          boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.9), 0 30px 60px rgba(0,0,0,0.08)'
        }}
      >
        {/* Glossy Reflection Top */}
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
        
        <div className="space-y-4">
          <ReceiptRow label="Commodity" value={getCropName(crop)} />
          <ReceiptRow label="Quantity"  value={`${quantity} ${t.quintals || "quintals"}`} />
          <ReceiptRow label="Current Rate" value={`₹${crop.currentPrice.toLocaleString("en-IN")}/${crop.unit}`} />
          <ReceiptRow
            label="Sale Method"
            value={method === "pool" ? "Community Pool" : method === "auction" ? "Live Auction" : "Direct Sell"}
            highlight
          />
        </div>

        {chosenPool && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/5 dark:bg-white/[0.03] rounded-2xl p-4 border border-emerald-500/10 dark:border-white/5 space-y-3 shadow-inner"
          >
            <ReceiptRow label="Buyer" value={chosenPool.creatorName} />
            <ReceiptRow label="Price Offered" value={`₹${chosenPool.pricePerUnit}/${chosenPool.unit}`} success />
            {chosenPool.location && (
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                   <MapPin size={12} className="text-emerald-500" /> {chosenPool.location}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {poolBonus > 0 && (
          <div className="flex items-center justify-between px-1">
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Bonus Applied</span>
             <span className="text-sm font-black text-emerald-600">+₹{poolBonus.toLocaleString("en-IN")}</span>
          </div>
        )}

        {/* Thick Divider */}
        <div className="relative h-[1.5px] w-full">
            <div className="absolute inset-0 bg-slate-200 dark:bg-white/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        </div>

        {/* 3. High-Gloss Final Payout Section */}
        <div className="relative py-2">
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.3em]">
                Total Payout
              </span>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">Funds Secured</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-500">₹</span>
              <span className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                {(totalValue + poolBonus).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          
          {/* Subtle glow behind total */}
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none" />
        </div>
      </div>

      {/* 4. Error State */}
      {error && (
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-red-500/5 dark:bg-red-500/10 border-[1.5px] border-red-500/20 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shrink-0">
             <Info className="text-white w-5 h-5" />
          </div>
          <p className="text-sm font-black text-red-600 dark:text-red-400 italic">
            {error}
          </p>
        </motion.div>
      )}

      {/* 5. Footer Terms */}
      <div className="px-6 space-y-4">
        <div className="flex items-center gap-3 justify-center">
          <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
          <ShieldCheck size={14} className="text-slate-400" />
          <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
        </div>
        <p className="text-[10px] text-center font-black text-slate-400 dark:text-white/20 uppercase tracking-widest leading-relaxed">
          Funds are held in <span className="text-emerald-500">FarmHers Escrow</span>. Payment released instantly upon physical handover verification.
        </p>
      </div>

    </div>
  );
}