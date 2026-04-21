"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FileText,
  Download,
  Share2,
  Copy,
  CheckCircle2,
  Building2,
  Phone,
  MapPin,
  Wheat,
  Calendar,
  Banknote,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { PaymentOrder } from "@/types/payment";

interface ContractDocumentProps {
  order: PaymentOrder;
}

export function ContractDocument({ order }: ContractDocumentProps) {
  const router = useRouter();
  const userProfile = useAppStore((s) => s.userProfile);
  const [copied, setCopied] = useState(false);

  const contractNumber = `AGR-CONTRACT-${order.id.slice(-8).toUpperCase()}`;
  const contractDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0a1409]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-[#0d1f10]/80 backdrop-blur-xl border-b border-emerald-100 dark:border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Order Contract
              </h1>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Digital Agreement
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-xl bg-emerald-50 dark:bg-white/10 hover:bg-emerald-100 dark:hover:bg-white/20 transition-colors"
            >
              {copied ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <Copy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 pb-32">
        {/* Contract Card */}
        <div className="bg-white dark:bg-[#0d1f10]/90 rounded-3xl shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wheat className="w-8 h-8" />
                <span className="text-xl font-bold">AgriLink</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">
                {contractNumber}
              </div>
            </div>
            <p className="text-emerald-100 text-sm">
              Agricultural Produce Purchase Agreement
            </p>
          </div>

          {/* Contract Details */}
          <div className="p-6 space-y-6">
            {/* Date */}
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-600 dark:text-slate-400">
                Contract Date:
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                {contractDate}
              </span>
            </div>

            {/* Deal Summary */}
            <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                Deal Summary
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Crop</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {order.cropName}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Quantity</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {order.quantity} quintals
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Rate</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    ₹{order.pricePerQuintal}/quintal
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Total Value</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                    ₹{order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Token Payment */}
            <div className="border-2 border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-emerald-800 dark:text-emerald-200">
                  Token Payment Received
                </h3>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Token Amount
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{order.tokenAmount}
                </span>
              </div>
              {order.tokenPayment?.razorpayPaymentId && (
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  Payment ID: {order.tokenPayment.razorpayPaymentId}
                </p>
              )}
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-4">
              {/* Buyer */}
              <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Buyer
                </p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {order.buyerName}
                </p>
                {order.buyerPhone && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" />
                    {order.buyerPhone}
                  </p>
                )}
              </div>

              {/* Farmer */}
              <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Farmer
                </p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {order.farmerName}
                </p>
              </div>
            </div>

            {/* Offline Payment Instructions */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800/30">
              <div className="flex items-center gap-2 mb-3">
                <Banknote className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-amber-800 dark:text-amber-200">
                  Offline Payment Instructions
                </h3>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                The buyer needs to transfer the remaining ₹
                {(order.totalAmount - order.tokenAmount).toLocaleString()} via:
              </p>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
                <li>Cheque (to be deposited)</li>
                <li>NEFT/IMPS to farmer's bank account</li>
                <li>UPI transfer</li>
              </ul>
            </div>

            {/* Terms */}
            <div className="text-xs text-slate-500 dark:text-slate-500 space-y-2">
              <p>
                <strong>Terms:</strong> This is a legally binding digital
                contract. The token payment confirms the buyer's commitment to
                purchase the specified quantity at the agreed rate.
              </p>
              <p>
                The remaining payment must be made via offline mode within 7
                days of contract generation. Failure to do so may result in
                cancellation and forfeiture of the token amount.
              </p>
              <p>
                AgriLink acts only as a platform and is not responsible for the
                actual exchange of goods or funds between buyer and farmer.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}