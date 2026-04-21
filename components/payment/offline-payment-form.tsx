"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { useAppStore, useTranslation } from "@/lib/store";
import { cn } from "@/lib/utils";

interface OfflinePaymentFormProps {
  orderId: string;
  totalAmount: number;
  farmerName: string;
  onSubmit: (data: { mode: "cheque" | "neft" | "upi"; reference: string }) => void;
  existingPayment?: {
    mode: "cheque" | "neft" | "upi";
    reference: string;
    submittedAt: string;
  };
}

export function OfflinePaymentForm({
  orderId,
  totalAmount,
  farmerName,
  onSubmit,
  existingPayment,
}: OfflinePaymentFormProps) {
  const router = useRouter();
  const t = useTranslation();
  const userProfile = useAppStore((s) => s.userProfile);

  const [mode, setMode] = useState<"cheque" | "neft" | "upi">("cheque");
  const [reference, setReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reference.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ mode, reference: reference.trim() });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted || existingPayment) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800/30">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-emerald-800 dark:text-emerald-200">
            Payment Details Submitted
          </h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Mode</span>
            <span className="font-medium text-slate-900 dark:text-white capitalize">
              {existingPayment?.mode || mode}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Reference</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {existingPayment?.reference || reference}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Submitted</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {existingPayment?.submittedAt
                ? new Date(existingPayment.submittedAt).toLocaleDateString()
                : "Just now"}
            </span>
          </div>
        </div>
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-4">
          The farmer will confirm once they receive the payment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0d1f10]/80 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800/30">
      <h3 className="font-bold text-slate-900 dark:text-white mb-1">
        Offline Payment Details
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Submit your {mode === "cheque" ? "cheque number" : "UTR reference"} for
        the total ₹{totalAmount.toLocaleString()}
      </p>

      {/* Payment Mode Selection */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={() => setMode("cheque")}
          className={cn(
            "py-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all",
            mode === "cheque"
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
              : "border-slate-200 dark:border-white/10 hover:border-emerald-300",
          )}
        >
          <Building2
            className={cn(
              "w-5 h-5",
              mode === "cheque"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-400",
            )}
          />
          <span
            className={cn(
              "text-xs font-medium",
              mode === "cheque"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500",
            )}
          >
            Cheque
          </span>
        </button>
        <button
          onClick={() => setMode("neft")}
          className={cn(
            "py-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all",
            mode === "neft"
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
              : "border-slate-200 dark:border-white/10 hover:border-emerald-300",
          )}
        >
          <CreditCard
            className={cn(
              "w-5 h-5",
              mode === "neft"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-400",
            )}
          />
          <span
            className={cn(
              "text-xs font-medium",
              mode === "neft"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500",
            )}
          >
            NEFT/IMPS
          </span>
        </button>
        <button
          onClick={() => setMode("upi")}
          className={cn(
            "py-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all",
            mode === "upi"
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
              : "border-slate-200 dark:border-white/10 hover:border-emerald-300",
          )}
        >
          <Smartphone
            className={cn(
              "w-5 h-5",
              mode === "upi"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-400",
            )}
          />
          <span
            className={cn(
              "text-xs font-medium",
              mode === "upi"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500",
            )}
          >
            UPI
          </span>
        </button>
      </div>

      {/* Reference Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {mode === "cheque"
            ? "Cheque Number"
            : mode === "neft"
              ? "UTR / Transaction Reference"
              : "UPI Transaction ID"}
        </label>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value.toUpperCase())}
          placeholder={
            mode === "cheque"
              ? "e.g., CHQ123456"
              : mode === "neft"
                ? "e.g., UTR123456789"
                : "e.g., UPI123456789@upi"
          }
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!reference.trim() || isSubmitting}
        className={cn(
          "w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
          "bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            Submit Payment Details
          </>
        )}
      </button>
    </div>
  );
}