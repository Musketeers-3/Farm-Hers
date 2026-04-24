"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Lock,
  Shield,
  CheckCircle2,
  Loader2,
  Banknote,
  ArrowRight,
  Sparkles,
  DollarSign,
} from "lucide-react";
import { useAppStore, useTranslation } from "@/lib/store";
import { cn } from "@/lib/utils";

interface SmartEscrowModalProps {
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
  amount: number;
  onSuccess: (paymentData: any) => void;
  onBack: () => void;
}

type EscrowPhase = "locked" | "verifying" | "secured" | "complete";

const escrowMessages: Record<EscrowPhase, { title: string; subtitle: string }> = {
  locked: {
    title: "Securing Your Funds",
    subtitle: "Initializing Smart Escrow Protocol...",
  },
  verifying: {
    title: "Verifying Commitment",
    subtitle: "Confirming buyer credentials & token validity...",
  },
  secured: {
    title: "Funds Locked",
    subtitle: "Smart Escrow secured. Notifying farmer...",
  },
  complete: {
    title: "Commitment Confirmed",
    subtitle: "Your token is secured in the AgriLink Escrow Vault",
  },
};

export function SmartEscrowModal({
  poolDetails,
  amount,
  onSuccess,
  onBack,
}: SmartEscrowModalProps) {
  const router = useRouter();
  const userProfile = useAppStore((s) => s.userProfile);
  const userName = useAppStore((s) => s.userName);

  const [phase, setPhase] = useState<EscrowPhase>("locked");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const phaseSequence: EscrowPhase[] = ["locked", "verifying", "secured", "complete"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < phaseSequence.length - 1) {
        currentIndex++;
        setPhase(phaseSequence[currentIndex]);
      } else {
        clearInterval(interval);
        handleSuccess();
      }
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  const handleSuccess = async () => {
    const paymentData = {
      orderId: poolDetails.poolId,
      escrowId: `ESC_${Date.now()}`,
      razorpayOrderId: `mock_${Date.now()}`,
      razorpayPaymentId: `pay_mock_${Date.now()}`,
      amount: amount,
      cropName: poolDetails.cropName,
      quantity: poolDetails.quantity,
      totalAmount: poolDetails.totalAmount,
      paidAt: new Date().toISOString(),
      escrowStatus: "secured",
      escrowLockedAt: new Date().toISOString(),
    };

    // Notify farmer about the token payment via backend API
    try {
      // Access store state directly using getState() - works outside React hooks
      const storeState = useAppStore.getState();
      const buyerId = storeState.userProfile?.uid || "demo-buyer";
      const buyerName = storeState.userProfile?.fullName || storeState.userName || "Demo Buyer";
      await fetch("/api/payments/create-token-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poolId: poolDetails.poolId,
          buyerId: buyerId,
          buyerName: buyerName,
          farmerId: poolDetails.farmerId,
          farmerName: poolDetails.farmerName,
          cropName: poolDetails.cropName,
          quantity: poolDetails.quantity,
          pricePerQuintal: poolDetails.pricePerQuintal,
          tokenAmount: amount,
          totalAmount: poolDetails.totalAmount,
          paymentMode: "smart_escrow",
        }),
      });
    } catch (err) {
      console.error("Failed to notify farmer:", err);
    }

    onSuccess(paymentData);
  };

  const isComplete = phase === "complete";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-xl"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative z-10 w-full max-w-md mx-4">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                Smart Escrow Protocol
              </span>
              <span className="text-xs font-medium text-emerald-400">
                {progress}%
              </span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Main Icon */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <AnimatePresence mode="wait">
              {!isComplete ? (
                <motion.div
                  key="lock"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative">
                    {/* Glowing Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-emerald-500/30"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {/* Lock Icon */}
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                      <Lock className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative">
                    {/* Success Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-green-500/30"
                      animate={{ scale: [1, 1.5, 1.5] }}
                      transition={{ duration: 0.6 }}
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/50"
                    >
                      <CheckCircle2 className="w-14 h-14 text-white" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Text Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                  AgriLink Smart Escrow
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {escrowMessages[phase].title}
              </h2>
              <p className="text-slate-400">
                {escrowMessages[phase].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Transaction Details */}
          {!isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-slate-700"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Token Amount</span>
                  <span className="font-bold text-white">₹{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Crop</span>
                  <span className="font-medium text-white">{poolDetails.cropName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Quantity</span>
                  <span className="font-medium text-white">{poolDetails.quantity} quintals</span>
                </div>
                <div className="h-px bg-slate-700 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Total Deal Value</span>
                  <span className="font-bold text-emerald-400">
                    ₹{poolDetails.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success Details */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 space-y-4"
            >
              <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Amount Secured</p>
                    <p className="font-bold text-white text-lg">
                      ₹{amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Escrow ID</p>
                    <p className="font-mono text-emerald-400 text-sm">
                      ESC_{Date.now().toString().slice(-8)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push(`/buyer/contract/${poolDetails.poolId}`)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
              >
                <ArrowRight className="w-5 h-5" />
                View Contract
              </button>
            </motion.div>
          )}

          {/* Cancel Button (only before completion) */}
          {!isComplete && (
            <button
              onClick={onBack}
              className="mt-6 text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Cancel Transaction
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}