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
  XCircle,
  Copy,
  ExternalLink,
  Clock,
} from "lucide-react";
import { useAppStore, useTranslation } from "@/lib/store";
import { createRazorpayOrder, initiatePayment, verifyPayment, isRazorpayConfigured } from "@/lib/razorpay";
import { TOKEN_AMOUNTS, type TokenAmount } from "@/types/payment";
import { cn } from "@/lib/utils";

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

interface PaymentVerificationResult {
  success: boolean;
  orderId?: string;
  razorpayPaymentId?: string;
  error?: string;
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailure, setPaymentFailure] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [failureReason, setFailureReason] = useState<string>("");

  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    setRazorpayReady(isRazorpayConfigured());
  }, []);

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;
  const isCustom = !!customAmount;

  // Handle demo/mock payment for testing when Razorpay doesn't work
  const handleDemoPayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create demo payment data
    const demoPaymentId = `DEMO_${Date.now()}`;
    const data = {
      orderId: poolDetails.poolId,
      tokenPaymentId: demoPaymentId,
      razorpayOrderId: `demo_order_${Date.now()}`,
      razorpayPaymentId: demoPaymentId,
      amount: finalAmount,
      cropName: poolDetails.cropName,
      quantity: poolDetails.quantity,
      totalAmount: poolDetails.totalAmount,
      paidAt: new Date().toISOString(),
      isDemo: true,
    };

    setIsProcessing(false);
    setPaymentData(data);
    setPaymentSuccess(true);
    onSuccess(data);
  };

  const handlePayment = async () => {
    if (finalAmount < 100 || finalAmount > 50000) {
      setError("Amount must be between ₹100 and ₹50,000");
      return;
    }

    // Block payment if Razorpay is not configured
    if (!razorpayReady) {
      setError("Payment gateway is not configured. Please contact support.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPaymentFailure(false);

    try {
      // Step 1: Create Razorpay order
      const receipt = `token_${poolDetails.poolId}_${Date.now()}`;
      const orderResult = await createRazorpayOrder(finalAmount, receipt);

      if (!orderResult.success || !orderResult.orderId) {
        setError(orderResult.error || "Failed to create payment order");
        setIsProcessing(false);
        // Show failure with option to use demo mode
        setPaymentFailure(true);
        setFailureReason(orderResult.error || "Failed to create payment order. You can try Demo Mode below.");
        return;
      }

      // Step 2: Initiate Razorpay payment
      const paymentResult = await initiatePayment({
        amount: finalAmount,
        orderId: orderResult.orderId,
        name: userProfile?.fullName || userName || "Buyer",
        email: userProfile?.email || "",
        phone: userProfile?.phone || "",
        description: `Token payment for ${poolDetails.cropName} - ${poolDetails.quantity} quintals`,
      });

      // Payment was cancelled or failed
      if (!paymentResult.success) {
        setError(paymentResult.error || "Payment failed or was cancelled");
        setIsProcessing(false);
        setPaymentFailure(true);
        setFailureReason(paymentResult.error || "Payment failed or was cancelled");
        return;
      }

      // Step 3: Verify payment with backend (CRITICAL - must verify before marking as success)
      setIsVerifying(true);

      // Pass signature from Razorpay response for verification
      const verificationResult: PaymentVerificationResult = await callVerificationEndpoint(
        orderResult.orderId,
        paymentResult.paymentId || "",
        paymentResult.signature,
        poolDetails,
        userProfile?.uid || "",
        userProfile?.fullName || userName || "Buyer"
      );

      setIsVerifying(false);
      setIsProcessing(false);

      if (!verificationResult.success) {
        setError(verificationResult.error || "Payment verification failed");
        setPaymentFailure(true);
        setFailureReason(verificationResult.error || "Payment verification failed");
        return;
      }

      // Payment verified successfully - show success
      const data = {
        orderId: poolDetails.poolId,
        tokenPaymentId: verificationResult.orderId,
        razorpayOrderId: orderResult.orderId,
        razorpayPaymentId: verificationResult.razorpayPaymentId,
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
      console.error("Payment error:", err);
      setIsProcessing(false);
      setIsVerifying(false);
      setError(err.message || "An unexpected error occurred");
      setPaymentFailure(true);
      setFailureReason(err.message || "An unexpected error occurred");
    }
  };

  // Show payment failure screen
  if (paymentFailure) {
    return (
      <FailureScreen
        reason={failureReason}
        amount={finalAmount}
        onRetry={() => {
          setPaymentFailure(false);
          setFailureReason("");
          setError(null);
        }}
        onBack={onBack}
        onDemoMode={handleDemoPayment}
      />
    );
  }

  // Show payment success screen
  if (paymentSuccess && paymentData) {
    return (
      <SuccessScreen
        paymentData={paymentData}
        onViewContract={() => router.push(`/buyer/contract/${paymentData.orderId}`)}
        onDone={() => router.push("/buyer/dashboard")}
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
              Secure payment via Razorpay
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

        {/* Razorpay Status */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/30 mb-4 flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            Secured by Razorpay Payment Gateway
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800/30 mb-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Processing/Verifying State */}
        {(isProcessing || isVerifying) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/30 mb-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {isVerifying
                  ? "Verifying payment with Razorpay..."
                  : "Processing payment..."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#0d1f10]/80 backdrop-blur-xl border-t border-emerald-100 dark:border-white/10 space-y-2">
        <button
          onClick={handlePayment}
          disabled={isProcessing || isVerifying || (!isCustom && !selectedAmount)}
          className={cn(
            "w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all",
            "bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {isProcessing || isVerifying ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {isVerifying ? "Verifying Payment..." : "Processing..."}
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pay ₹{finalAmount} Token
            </>
          )}
        </button>

        {/* Demo Mode Button */}
        <button
          onClick={handleDemoPayment}
          disabled={isProcessing || isVerifying}
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50"
        >
          <Shield className="w-4 h-4" />
          Demo Mode (Testing Only)
        </button>
      </div>
    </div>
  );
}

// Helper function to call verification endpoint
async function callVerificationEndpoint(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string | undefined,
  poolDetails: any,
  buyerId: string,
  buyerName: string
): Promise<PaymentVerificationResult> {
  try {
    const response = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        poolDetails: {
          poolId: poolDetails.poolId,
          farmerId: poolDetails.farmerId,
          farmerName: poolDetails.farmerName,
          cropName: poolDetails.cropName,
          quantity: poolDetails.quantity,
          pricePerQuintal: poolDetails.pricePerQuintal,
          tokenAmount: poolDetails.totalAmount,
          totalAmount: poolDetails.totalAmount,
        },
        buyerId,
        buyerName,
      }),
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        orderId: data.orderId,
        razorpayPaymentId: razorpayPaymentId,
      };
    }

    return {
      success: false,
      error: data.error || "Payment verification failed",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Network error during verification",
    };
  }
}

function SuccessScreen({
  paymentData,
  onViewContract,
  onDone,
}: {
  paymentData: any;
  onViewContract: () => void;
  onDone: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      {/* Transaction Details */}
      <div className="w-full max-w-sm bg-slate-50 dark:bg-white/5 rounded-xl p-4 mb-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Transaction Details
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Amount Paid</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              ₹{paymentData.amount}
            </span>
          </div>

          <div className="border-t border-slate-200 dark:border-white/10 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">Razorpay Payment ID</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                  {paymentData.razorpayPaymentId?.substring(0, 12)}...
                </span>
                <button
                  onClick={() => copyToClipboard(paymentData.razorpayPaymentId)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Token Payment ID</span>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
              {paymentData.tokenPaymentId?.substring(0, 16)}...
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Date & Time</span>
            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
              <Clock className="w-3 h-3" />
              {new Date(paymentData.paidAt).toLocaleString()}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              paymentData.isDemo
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
            }`}>
              {paymentData.isDemo ? "Demo Mode ✓" : "Verified ✓"}
            </span>
          </div>

          {paymentData.isDemo && (
            <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                ⚠️ This is a demo payment. No real money was transferred.
              </p>
            </div>
          )}
        </div>
      </div>

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

        <button
          onClick={onDone}
          className="w-full py-4 rounded-2xl border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-white/5"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function FailureScreen({
  reason,
  amount,
  onRetry,
  onBack,
  onDemoMode,
}: {
  reason: string;
  amount: number;
  onRetry: () => void;
  onBack: () => void;
  onDemoMode?: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6"
      >
        <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
      </motion.div>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Payment Failed
      </h1>
      <p className="text-slate-600 dark:text-slate-400 text-center mb-2">
        Your payment could not be processed.
      </p>
      <p className="text-red-600 dark:text-red-400 text-sm text-center mb-8">
        {reason}
      </p>

      {/* Error Details */}
      <div className="w-full max-w-sm bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-sm text-red-700 dark:text-red-300">
            <p className="font-semibold mb-1">What went wrong?</p>
            <p className="text-red-600 dark:text-red-400">
              The payment was either cancelled, declined, or could not be verified.
              Please try again or use a different payment method.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={onRetry}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2"
        >
          <CreditCard className="w-5 h-5" />
          Try Again
        </button>

        {onDemoMode && (
          <button
            onClick={onDemoMode}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Try Demo Mode (Testing)
          </button>
        )}

        <button
          onClick={onBack}
          className="w-full py-4 rounded-2xl border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-white/5"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-6 text-center">
        If the problem persists, please contact support with your transaction details.
      </p>
    </div>
  );
}