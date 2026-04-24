"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "./bottom-nav";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Package,
  AlertTriangle,
  Sun,
  Moon,
  Bell,
} from "lucide-react";

const GLASS =
  "bg-white/60 dark:bg-white/[0.06] backdrop-blur-xl border border-white/70 dark:border-white/[0.09] shadow-[0_8px_40px_rgba(16,120,50,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]";

const GLASS_INNER =
  "bg-white/70 dark:bg-white/[0.07] backdrop-blur-md border border-white/80 dark:border-white/[0.08]";

interface PendingOrder {
  orderId: string;
  poolId: string;
  cropName: string;
  quantity: number;
  pricePerQuintal: number;
  tokenAmount: number;
  totalAmount: number;
  buyerId: string;
  buyerName: string;
  status: string;
  paidAt: string;
  createdAt: string;
}

export function FarmerOrdersScreen() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const userProfile = useAppStore((state) => state.userProfile);
  const setActiveScreen = useAppStore((state) => state.setActiveScreen);

  const farmerId = userProfile?.uid || "demo-farmer-123";

  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PendingOrder | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setActiveScreen("orders");
  }, [setActiveScreen]);

  const isDark = resolvedTheme === "dark";

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payments/farmer-orders?farmerId=${farmerId}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    } finally {
      setLoading(false);
    }
  }, [farmerId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleConfirmReceipt = async (order: PendingOrder) => {
    setActionLoading(order.orderId);
    try {
      const res = await fetch("/api/payments/confirm-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poolId: order.poolId,
          orderId: order.orderId,
          farmerId: farmerId,
          buyerId: order.buyerId,
          confirmed: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.orderId !== order.orderId));
        setSelectedOrder(null);
        // Refresh to get updated list
        fetchOrders();
      }
    } catch (e) {
      console.error("Failed to confirm receipt:", e);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePaymentNotReceived = async (order: PendingOrder) => {
    setActionLoading(order.orderId);
    try {
      const res = await fetch("/api/payments/confirm-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poolId: order.poolId,
          orderId: order.orderId,
          farmerId: farmerId,
          buyerId: order.buyerId,
          confirmed: false,
          notes: "Payment not received",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.orderId !== order.orderId));
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (e) {
      console.error("Failed to report non-receipt:", e);
    } finally {
      setActionLoading(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-28 lg:pb-8 relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${isDark ? "opacity-0" : "opacity-100"}`}
          style={{
            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 25%, #e0f2fe 60%, #f0fdf4 100%)",
          }}
        />
        {isDark && (
          <>
            <Image src="/images/farmers_bg.jpg" alt="" fill priority className="object-cover object-center" style={{ opacity: 0.8 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020c04]/85 via-[#040f06]/75 to-[#020c04]/92" />
          </>
        )}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl border-b transition-colors duration-300
        bg-white/60 dark:bg-[#020c04]/75 border-white/60 dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => router.push("/farmer")}
              className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-105 hover:shadow-md", GLASS_INNER)}
            >
              <ArrowLeft className="w-5 h-5 text-emerald-700 dark:text-white" strokeWidth={1.8} />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                Token Payments
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400/80">
                Pending Confirmations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/farmer/notifications")}
              className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-105", GLASS_INNER)}
            >
              <Bell className="w-5 h-5 text-emerald-700 dark:text-emerald-400" strokeWidth={1.8} />
            </button>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-105", GLASS_INNER)}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : orders.length === 0 ? (
          <div className={cn("text-center py-16 rounded-[32px]", GLASS)}>
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-white/30" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">No pending confirmations</h3>
            <p className="text-slate-500 dark:text-white/40 text-sm mt-1">
              You don't have any token payments awaiting confirmation.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("rounded-[24px] p-5", GLASS)}
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
                      "bg-emerald-100 dark:bg-white/[0.07] border border-emerald-200 dark:border-white/[0.08]"
                    )}>
                      <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white capitalize text-lg">
                        {order.cropName}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-white/40">
                        from {order.buyerName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                      ₹{order.tokenAmount}
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/35">
                      Token Paid
                    </p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className={cn("rounded-xl p-3 text-center", GLASS_INNER)}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/30">Quantity</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">{order.quantity} q</p>
                  </div>
                  <div className={cn("rounded-xl p-3 text-center", GLASS_INNER)}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/30">Rate</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">₹{order.pricePerQuintal}/q</p>
                  </div>
                  <div className={cn("rounded-xl p-3 text-center", GLASS_INNER)}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/30">Total Value</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className={cn("rounded-xl p-3 text-center", GLASS_INNER)}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/30">Paid At</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                      {new Date(order.paidAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Notification Preview */}
                <div className={cn("rounded-xl p-4 mb-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20")}>
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                        Token received — awaiting your confirmation
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300/80 mt-1">
                        Buyer has paid token for {order.quantity} quintals of {order.cropName} at ₹{order.pricePerQuintal}/quintal.
                        Please confirm receipt.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleConfirmReceipt(order)}
                    disabled={actionLoading === order.orderId}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-white
                      bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50
                      transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
                  >
                    {actionLoading === order.orderId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Confirm Receipt
                  </button>
                  <button
                    onClick={() => handlePaymentNotReceived(order)}
                    disabled={actionLoading === order.orderId}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-red-600 dark:text-red-400
                      bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20
                      disabled:opacity-50 transition-all border border-red-200 dark:border-red-500/20
                      flex items-center justify-center gap-2"
                  >
                    {actionLoading === order.orderId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    Payment Not Received
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}