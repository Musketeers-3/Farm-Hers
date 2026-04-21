"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
  CreditCard,
  ArrowLeft,
  DollarSign,
  FileText,
} from "lucide-react";
import { useAppStore, useTranslation } from "@/lib/store";
import { createRazorpayOrder, initiatePayment, isRazorpayConfigured } from "@/lib/razorpay";
import { TOKEN_AMOUNTS, type TokenAmount } from "@/types/payment";
import { cn } from "@/lib/utils";
import { SmartEscrowModal } from "./smart-escrow-modal";

interface TokenPaymentScreenProps {
  poolDetails: {
    poolId: string;
    cropId: string;
    cropName: string;
    quantity: number;
    pricePerQuintal: number;
    totalAmount: number;
    farmerId: string;
    farmerName: string;
  };
  onSuccess: (paymentData: any) => void;
  onBack: () => void;
}

export function TokenPaymentScreen({
  poolDetails,
  onSuccess,
  onBack,
}: TokenPaymentScreenProps) {
  const router = useRouter();
  const t = useTranslation();
  const userProfile = useAppStore((s) => s.userProfile);
  const userName = useAppStore((s) => s.userName);

  const [selectedAmount, setSelectedAmount] = useState<TokenAmount>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const [razorpayReady, setRazorpayReady] = useState(false);
  const [showSmartEscrow, setShowSmartEscrow] = useState(false);

  useEffect(() => {
    setRazorpayReady(isRazorpayConfigured());
  }, []);

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;
  const isCustom = !!customAmount;

  const handlePayment = async () => {
    if (finalAmount < 100 || finalAmount > 50000) {
      setError("Amount must be between ₹100 and ₹50,000");
      return;
    }

    // Use Smart Escrow when Razorpay is not configured OR if demo mode is enabled
    if (!razorpayReady) {
      setShowSmartEscrow(true);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const receipt = `token_${poolDetails.poolId}_${Date.now()}`;
      const orderResult = await createRazorpayOrder(finalAmount, receipt);

      // Fall back to Smart Escrow if order creation fails
      if (!orderResult.success) {
        console.log("Razorpay order failed, falling back to Smart Escrow");
        setIsProcessing(false);
        setShowSmartEscrow(true);
        return;
      }

      const paymentResult = await initiatePayment({
        amount: finalAmount,
        orderId: orderResult.orderId!,
        name: userProfile?.fullName || userName || "Buyer",
        email: userProfile?.email || "",
        phone: userProfile?.phone || "",
        description: `Token payment for ${poolDetails.cropName} - ${poolDetails.quantity} quintals`,
      });

      // Fall back to Smart Escrow if payment fails
      if (!paymentResult.success) {
        console.log("Razorpay payment failed, falling back to Smart Escrow");
        setIsProcessing(false);
        setShowSmartEscrow(true);
        return;
      }

      const data = {
        orderId: poolDetails.poolId,
        razorpayOrderId: orderResult.orderId,
        razorpayPaymentId: paymentResult.paymentId,
        amount: finalAmount,
        cropName: poolDetails.cropName,
        quantity: poolDetails.quantity,
        totalAmount: poolDetails.totalAmount,
        paidAt: new Date().toISOString(),
      };
      setPaymentData(data);
      setPaymentSuccess(true);
      onSuccess(data);
    } catch (err: any) {
      // Fall back to Smart Escrow on any error
      console.log("Payment error, falling back to Smart Escrow:", err.message);
      setIsProcessing(false);
      setShowSmartEscrow(true);
    }
  };

  if (paymentSuccess && paymentData) {
    return (
      <SuccessScreen
        paymentData={paymentData}
        onViewContract={() => router.push(`/buyer/contract/${paymentData.orderId}`)}
      />
    );
  }

  // Smart Escrow Modal - Show when Razorpay not configured
  if (showSmartEscrow) {
    return (
      <SmartEscrowModal
        poolDetails={poolDetails}
        amount={finalAmount}
        onSuccess={(data) => {
          setPaymentData(data);
          setPaymentSuccess(true);
          onSuccess(data);
        }}
        onBack={() => setShowSmartEscrow(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-[#0d1f10]/80 backdrop-blur-xl border-b border-emerald-100 dark:border-white/10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Token Payment
            </h1>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Confirm your commitment
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 pb-32 overflow-y-auto">
        {/* Order Summary */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 mb-6 border border-emerald-100 dark:border-emerald-800/30">
          <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Order Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Crop</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {poolDetails.cropName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Quantity</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {poolDetails.quantity} quintals
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Total Value</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ₹{poolDetails.totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Farmer</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {poolDetails.farmerName}
              </span>
            </div>
          </div>
        </div>

        {/* Token Amount Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Select Token Amount
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            This is a commitment token. Full payment will be made offline.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {TOKEN_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
                className={cn(
                  "py-4 rounded-xl border-2 font-bold text-lg transition-all",
                  !isCustom && selectedAmount === amount
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-emerald-300",
                )}
              >
                ₹{amount}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="number"
              placeholder="Or enter custom amount (₹500-₹2000)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-bold text-lg focus:outline-none focus:border-emerald-500"
            />
            <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800/30 mb-6">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-amber-800 dark:text-amber-200">
                Why pay token?
              </p>
              <p className="text-amber-700 dark:text-amber-300/80 mt-1">
                Agricultural deals are in lakhs. The token confirms your
                commitment. The bulk payment happens directly between buyer
                and farmer via cheque/NEFT.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800/30 mb-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Smart Escrow Notice */}
        {!razorpayReady && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/30 mb-4">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Using Smart Escrow - Secure token payment without payment gateway
            </p>
          </div>
        )}
      </div>

      {/* Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#0d1f10]/80 backdrop-blur-xl border-t border-emerald-100 dark:border-white/10">
        <button
          onClick={handlePayment}
          disabled={isProcessing || (!isCustom && !selectedAmount)}
          className={cn(
            "w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all",
            "bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : razorpayReady ? (
            <>
              <CreditCard className="w-5 h-5" />
              Pay ₹{finalAmount} Token
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Pay ₹{finalAmount} Token
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SuccessScreen({
  paymentData,
  onViewContract,
}: {
  paymentData: any;
  onViewContract: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
      </motion.div>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Payment Successful!
      </h1>
      <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
        Your commitment token of ₹{paymentData.amount} has been received.
        <br />
        You can now proceed with offline payment.
      </p>

      <div className="w-full max-w-sm space-y-3">
        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-500">Token Amount</span>
            <span className="font-bold text-emerald-600">₹{paymentData.amount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Total Deal Value</span>
            <span className="font-bold">₹{paymentData.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={onViewContract}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5" />
          View Contract
        </button>
      </div>
    </div>
  );
}