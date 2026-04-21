"use client";
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  Flame,
  MapPin,
  TrendingUp,
  Package,
  CircleDollarSign,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowRight,
  Loader2,
  AlertCircle,
  Plus,
  Users,
  Wheat,
  CreditCard,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import type { Pool } from "@/types/pool";
import { TokenPaymentScreen } from "@/components/payment/token-payment-screen";

// ─── AUTH HOOK (swap with your real auth) ──────────────────────────────────────

// ─── TOKEN FACTORY ─────────────────────────────────────────────────────────────
const makeTokens = (isDark: boolean) =>
  isDark
    ? {
        card: "rgba(8,18,10,0.65)",
        cardActive: "rgba(8,18,10,0.82)",
        border: "rgba(90,158,111,0.15)",
        borderActive: "rgba(90,158,111,0.32)",
        blur: "blur(18px)",
        textPrimary: "#ffffff",
        textSub: "rgba(255,255,255,0.55)",
        textLabel: "rgba(255,255,255,0.38)",
        accent: "#5a9e6f",
        accentDark: "#2d6a4f",
        accentBg: "rgba(45,106,79,0.22)",
        accentBorder: "rgba(90,158,111,0.28)",
        expandBg: "rgba(0,0,0,0.30)",
        statBox: "rgba(255,255,255,0.06)",
        progressTrack: "rgba(255,255,255,0.08)",
        signedBg: "rgba(45,106,79,0.18)",
        chevronBg: "rgba(255,255,255,0.06)",
        glowActive:
          "0 0 0 1px rgba(90,158,111,0.12), 0 8px 32px rgba(0,0,0,0.5)",
        shadow: "0 4px 24px rgba(0,0,0,0.45)",
        inputBg: "rgba(255,255,255,0.05)",
        inputBorder: "rgba(90,158,111,0.25)",
      }
    : {
        card: "rgba(200,225,255,0.18)",
        cardActive: "rgba(200,225,255,0.28)",
        border: "rgba(180,210,255,0.30)",
        borderActive: "rgba(74,222,128,0.45)",
        blur: "blur(32px)",
        textPrimary: "#ffffff",
        textSub: "rgba(255,255,255,0.75)",
        textLabel: "rgba(255,255,255,0.52)",
        accent: "#4ade80",
        accentDark: "#16a34a",
        accentBg: "rgba(74,222,128,0.15)",
        accentBorder: "rgba(74,222,128,0.30)",
        expandBg: "rgba(0,10,30,0.20)",
        statBox: "rgba(200,225,255,0.14)",
        progressTrack: "rgba(200,225,255,0.18)",
        signedBg: "rgba(22,163,74,0.18)",
        chevronBg: "rgba(200,225,255,0.14)",
        glowActive:
          "0 0 0 1px rgba(74,222,128,0.15), 0 8px 32px rgba(0,10,30,0.35)",
        shadow: "0 4px 24px rgba(0,10,30,0.25)",
        inputBg: "rgba(200,225,255,0.10)",
        inputBorder: "rgba(74,222,128,0.30)",
      };

const inputStyle = (G: ReturnType<typeof makeTokens>): React.CSSProperties => ({
  background: G.inputBg,
  border: `1px solid ${G.inputBorder}`,
  color: G.textPrimary,
  borderRadius: "12px",
  padding: "10px 14px",
  fontSize: "14px",
  width: "100%",
  outline: "none",
});

function RoleBadge({
  role,
  G,
}: {
  role: string;
  G: ReturnType<typeof makeTokens>;
}) {
  const isBuyer = role === "buyer";
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
      style={{
        background: isBuyer ? "rgba(59,130,246,0.18)" : G.accentBg,
        color: isBuyer ? "#60a5fa" : G.accent,
        border: `1px solid ${isBuyer ? "rgba(59,130,246,0.35)" : G.accentBorder}`,
      }}
    >
      {isBuyer ? "Buyer Post" : "Farmer Pool"}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export function BuyerPools({ isDark = true }: { isDark?: boolean }) {
  const G = makeTokens(isDark);
  const { user: authUser, authReady } = useCurrentUser();
  const buyer = {
    id: authUser?.uid ?? "",
    name: authUser?.displayName ?? authUser?.email ?? "Buyer",
  };
  const crops = useAppStore((s) => s.crops);
  const addOrder = useAppStore((s) => s.addOrder);

  const [tab, setTab] = useState<"browse" | "mine" | "create">("browse");
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [activePoolId, setActivePoolId] = useState<string | null>(null);
  const [selectedQty, setSelectedQty] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contractSigned, setContractSigned] = useState<string | null>(null);

  // Token payment flow
  const [showTokenPayment, setShowTokenPayment] = useState(false);
  const [pendingPoolDetails, setPendingPoolDetails] = useState<{
    pool: Pool;
    quantity: number;
  } | null>(null);

  const addPaymentOrder = useAppStore((s) => s.addPaymentOrder);

  const [form, setForm] = useState({
    commodity: "",
    pricePerUnit: "",
    unit: "quintal",
    targetQuantity: "",
    deadline: "",
    location: "",
    description: "",
  });
  const [creating, setCreating] = useState(false);

  const fetchPools = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/pools?status=open");
      if (!res.ok) throw new Error("Failed to fetch pools");
      const data = await res.json();
      setPools(data.pools || []);
    } catch (err: any) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authReady && (tab === "browse" || tab === "mine")) fetchPools();
  }, [tab, authReady]);
  const togglePool = (poolId: string, maxQty: number) => {
    if (activePoolId === poolId) {
      setActivePoolId(null);
      return;
    }
    setActivePoolId(poolId);
    setSelectedQty(Math.max(1, Math.floor(maxQty * 0.25)));
  };

  // Buyer commits to purchase from a farmer-created pool - triggers token payment
  const handleJoinAsBuyer = async (pool: Pool, qty: number) => {
    // Store pool details and show token payment screen
    const cropDetails = crops.find((c) => c.id === pool.commodity) || crops[0];
    setPendingPoolDetails({
      pool,
      quantity: qty,
    });
    setShowTokenPayment(true);
  };

  // After successful token payment, actually join the pool
  const handleTokenPaymentSuccess = async (paymentData: any) => {
    if (!pendingPoolDetails) return;
    const { pool, quantity } = pendingPoolDetails;

    setIsProcessing(true);
    try {
      // Join the pool
      const res = await fetch(`/api/pools/${pool.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: buyer.id,
          buyerName: buyer.name,
          quantity: quantity,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        // Create payment order
        const cropDetails = crops.find((c) => c.id === pool.commodity) || crops[0];
        addPaymentOrder({
          id: `PAY-${Date.now()}`,
          cropId: pool.commodity || "",
          cropName: cropDetails?.name || pool.commodity || "Unknown",
          quantity: quantity,
          pricePerQuintal: pool.pricePerUnit || cropDetails?.currentPrice || 0,
          totalAmount: quantity * (pool.pricePerUnit || cropDetails?.currentPrice || 0),
          tokenAmount: paymentData.amount,
          buyerId: buyer.id,
          buyerName: buyer.name,
          buyerPhone: "",
          farmerId: pool.creatorId || "",
          farmerName: pool.creatorName || "Unknown Farmer",
          poolId: pool.id,
          status: "token-paid",
          razorpayOrderId: paymentData.razorpayOrderId,
          razorpayPaymentId: paymentData.razorpayPaymentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        setContractSigned(pool.id!);
        setShowTokenPayment(false);
        setPendingPoolDetails(null);
        fetchPools();
      } else {
        alert(data.error || "Failed to join pool");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTokenPaymentBack = () => {
    setShowTokenPayment(false);
    setPendingPoolDetails(null);
  };

  // Buyer initiates contract on another buyer's open pool (legacy flow)
  const handleInitiateContract = (
    poolId: string,
    cropId: string,
    price: number,
    qty: number,
  ) => {
    setIsProcessing(true);
    setTimeout(() => {
      addOrder({
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        cropId,
        quantity: qty,
        pricePerQuintal: price,
        totalAmount: qty * price,
        status: "pending",
        buyerId: buyer.id,
        farmerId: "pool-collective",
        createdAt: new Date().toISOString(),
      });
      setIsProcessing(false);
      setContractSigned(poolId);
    }, 1500);
  };

  const handleCreate = async () => {
    if (!form.commodity || !form.pricePerUnit || !form.targetQuantity) {
      alert("Please fill in commodity, price, and target quantity.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/pools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pricePerUnit: Number(form.pricePerUnit),
          targetQuantity: Number(form.targetQuantity),
          creatorId: buyer.id,
          creatorName: buyer.name,
          creatorRole: "buyer",
        }),
      });
      if (res.ok) {
        setForm({
          commodity: "",
          pricePerUnit: "",
          unit: "quintal",
          targetQuantity: "",
          deadline: "",
          location: "",
          description: "",
        });
        setTab("mine");
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  // Deduplicate by id first (guards against double Firestore docs)
  const uniquePools = pools.filter(
    (p, idx, arr) => arr.findIndex((x) => x.id === p.id) === idx,
  );

  const myPools = uniquePools.filter((p) => p.creatorId === buyer.id);
  const farmerPools = uniquePools.filter(
    (p) => p.creatorRole === "farmer" && p.creatorId !== buyer.id,
  );
  const buyerPools = uniquePools.filter(
    (p) => p.creatorRole === "buyer" && p.creatorId !== buyer.id,
  );

  const tabs = [
    { key: "browse", label: "Browse Pools" },
    { key: "mine", label: "My Requests" },
    { key: "create", label: "Post Request" },
  ] as const;

  // ── POOL CARD ──────────────────────────────────────────────────────────────
  const PoolCard = ({ pool, index }: { pool: Pool; index: number }) => {
    const cropDetails = crops.find((c) => c.id === pool.commodity) || crops[0];
    const cropName = pool.commodity
      ? pool.commodity.charAt(0).toUpperCase() + pool.commodity.slice(1)
      : "Unknown";

    const targetQty = pool.targetQuantity || 1;
    const filledQty = pool.filledQuantity || 0;
    const finalPrice = pool.pricePerUnit || cropDetails?.currentPrice || 0;
    const availableQty = Math.max(0, targetQty - filledQty);
    const fillPct = Math.min(100, Math.round((filledQty / targetQty) * 100));

    const isActive = activePoolId === pool.id;
    const isSigned = contractSigned === pool.id;
    const isMyPool = pool.creatorId === buyer.id;
    const alreadyJoined = pool.members?.some((m) => m.farmerId === buyer.id);
    const canInteract = !isMyPool && !isSigned && !alreadyJoined;
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.35 }}
        className="overflow-hidden rounded-2xl transition-all duration-300"
        style={{
          background: isActive ? G.cardActive : G.card,
          border: `1px solid ${isActive ? G.borderActive : G.border}`,
          backdropFilter: G.blur,
          WebkitBackdropFilter: G.blur,
          boxShadow: isActive ? G.glowActive : G.shadow,
        }}
      >
        {/* Header */}
        <div
          className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          onClick={() => canInteract && togglePool(pool.id!, availableQty)}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: G.accentBg,
                border: `1px solid ${G.accentBorder}`,
              }}
            >
              <Wheat className="w-6 h-6" style={{ color: G.accent }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-black text-lg sm:text-xl tracking-tight text-white">
                  {cropName} Pool
                </h3>
                <RoleBadge role={pool.creatorRole || "farmer"} G={G} />
                {isMyPool && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
                    style={{
                      background: "rgba(234,179,8,0.18)",
                      color: "#facc15",
                      border: "1px solid rgba(234,179,8,0.35)",
                    }}
                  >
                    Your Post
                  </span>
                )}
              </div>
              <div
                className="flex items-center gap-3 text-xs sm:text-sm font-semibold"
                style={{ color: G.textSub }}
              >
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {pool.creatorName || "Unknown"}
                </span>
                {pool.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {pool.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-0.5">
            <div className="text-left sm:text-right">
              <p
                className="text-[10px] uppercase font-bold tracking-widest"
                style={{ color: G.textLabel }}
              >
                {pool.creatorRole === "buyer" ? "Offering" : "Asking"} Rate
              </p>
              <p className="text-xl sm:text-2xl font-mono font-black text-white">
                ₹{finalPrice}
                <span
                  className="text-sm font-medium ml-1"
                  style={{ color: G.textSub }}
                >
                  /{pool.unit || "q"}
                </span>
              </p>
            </div>
            {canInteract && !isActive && (
              <div
                className="p-2 rounded-xl"
                style={{ background: G.chevronBg }}
              >
                <ChevronRight className="w-5 h-5 text-white/40" />
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
            <span style={{ color: G.textLabel }}>Pool Filled</span>
            <span style={{ color: G.accent }}>{fillPct}%</span>
          </div>
          <div
            className="h-1.5 w-full rounded-full overflow-hidden"
            style={{ background: G.progressTrack }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillPct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${G.accentDark}, ${G.accent})`,
              }}
            />
          </div>
          <p
            className="text-[10px] font-semibold mt-2"
            style={{ color: G.textLabel }}
          >
            {filledQty} / {targetQty} {pool.unit || "q"} ·{" "}
            {pool.members?.length || 0} member(s)
            {pool.deadline && (
              <span>
                {" "}
                · Deadline:{" "}
                {new Date(pool.deadline).toLocaleDateString("en-IN")}
              </span>
            )}
          </p>
        </div>

        {/* Expanded commit panel */}
        <AnimatePresence>
          {isActive && canInteract && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
              style={{ borderTop: `1px solid ${G.border}` }}
            >
              <div
                className="p-5 sm:p-6 space-y-5"
                style={{ background: G.expandBg }}
              >
                <div
                  className="p-5 rounded-xl"
                  style={{
                    background: G.card,
                    border: `1px solid ${G.border}`,
                    backdropFilter: G.blur,
                    WebkitBackdropFilter: G.blur,
                  }}
                >
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p
                        className="text-xs font-bold uppercase tracking-wider mb-1"
                        style={{ color: G.textLabel }}
                      >
                        Procurement Volume
                      </p>
                      <p className="text-2xl font-black font-mono text-white">
                        {selectedQty}{" "}
                        <span
                          className="text-base font-medium"
                          style={{ color: G.textSub }}
                        >
                          {pool.unit || "Quintals"}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-xs font-bold uppercase tracking-wider mb-1"
                        style={{ color: G.textLabel }}
                      >
                        Total Value
                      </p>
                      <p
                        className="text-xl font-bold font-mono"
                        style={{ color: G.accent }}
                      >
                        ₹{(selectedQty * finalPrice).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <Slider
                    value={[selectedQty]}
                    onValueChange={(v) => setSelectedQty(v[0])}
                    max={availableQty}
                    min={1}
                    step={pool.unit === "kg" ? 50 : 5}
                    className="py-4"
                  />
                  <p
                    className="text-[10px] mt-1 font-semibold"
                    style={{ color: G.textLabel }}
                  >
                    Max available: {availableQty} {pool.unit || "q"}
                  </p>
                </div>

                <button
                  disabled={isProcessing || selectedQty === 0}
                  onClick={() => {
                    if (pool.creatorRole === "farmer") {
                      handleJoinAsBuyer(pool, selectedQty);
                    } else {
                      handleInitiateContract(
                        pool.id!,
                        pool.commodity,
                        finalPrice,
                        selectedQty,
                      );
                    }
                  }}
                  className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  style={
                    isProcessing
                      ? { background: G.statBox, color: G.textSub }
                      : {
                          background: G.accentDark,
                          color: "#fff",
                          border: `1px solid ${G.accentBorder}`,
                          boxShadow: "0 4px 20px rgba(22,163,74,0.4)",
                        }
                  }
                >
                  {isProcessing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <Clock className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      <span>
                        {pool.creatorRole === "farmer"
                          ? "Commit to Purchase"
                          : "Initiate Contract"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {isSigned && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 flex flex-col items-center text-center gap-3"
              style={{
                background: G.signedBg,
                borderTop: `1px solid ${G.accentBorder}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: G.accentBg,
                  border: `1px solid ${G.accentBorder}`,
                }}
              >
                <CheckCircle2 className="w-6 h-6" style={{ color: G.accent }} />
              </div>
              <div>
                <h4 className="font-bold text-white">
                  {pool.creatorRole === "farmer"
                    ? "Purchase Committed!"
                    : "Contract Initiated!"}
                </h4>
                <p className="text-xs mt-1" style={{ color: G.textSub }}>
                  {pool.creatorRole === "farmer"
                    ? `You've committed to buy ${selectedQty} ${pool.unit || "q"} at ₹${finalPrice}/${pool.unit || "q"}`
                    : `Awaiting farmer collective approval for ${selectedQty} ${pool.unit || "q"} at ₹${finalPrice}/${pool.unit || "q"}`}
                </p>
              </div>
            </motion.div>
          )}
          {alreadyJoined && !isSigned && (
            <div
              className="p-4 flex items-center gap-3"
              style={{
                borderTop: `1px solid ${G.border}`,
                background: G.signedBg,
              }}
            >
              <CheckCircle2 className="w-5 h-5" style={{ color: G.accent }} />
              <p className="text-sm font-semibold" style={{ color: G.accent }}>
                You've already committed to this pool.
              </p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────

  // Show token payment screen when buyer commits
  if (showTokenPayment && pendingPoolDetails) {
    const pool = pendingPoolDetails.pool;
    const quantity = pendingPoolDetails.quantity;
    const cropDetails = crops.find((c) => c.id === pool.commodity) || crops[0];

    return (
      <TokenPaymentScreen
        poolDetails={{
          poolId: pool.id || "",
          cropId: pool.commodity || "",
          cropName: cropDetails?.name || pool.commodity || "Unknown",
          quantity: quantity,
          pricePerQuintal: pool.pricePerUnit || cropDetails?.currentPrice || 0,
          totalAmount: quantity * (pool.pricePerUnit || cropDetails?.currentPrice || 0),
          farmerId: pool.creatorId || "",
          farmerName: pool.creatorName || "Unknown",
        }}
        onSuccess={handleTokenPaymentSuccess}
        onBack={handleTokenPaymentBack}
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* TABS */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded-full text-sm font-bold transition-all"
            style={
              tab === t.key
                ? {
                    background: G.accentDark,
                    color: "#fff",
                    border: `1px solid ${G.accentBorder}`,
                    boxShadow: "0 2px 12px rgba(22,163,74,0.3)",
                  }
                : {
                    background: G.statBox,
                    color: G.textSub,
                    border: `1px solid ${G.border}`,
                  }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* METRIC CARDS */}
      {tab !== "create" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              label: "Total Open Pools",
              value: uniquePools.length,
              icon: Package,
            },
            {
              label: "Farmer Pools",
              value: farmerPools.length,
              icon: TrendingUp,
            },
            {
              label: "Buyer Requests",
              value: buyerPools.length,
              icon: CircleDollarSign,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-5 sm:p-6 flex items-center justify-between rounded-2xl"
              style={{
                background: G.card,
                border: `1px solid ${G.border}`,
                backdropFilter: G.blur,
                WebkitBackdropFilter: G.blur,
                boxShadow: G.shadow,
              }}
            >
              <div>
                <p
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1"
                  style={{ color: G.textLabel }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-2xl sm:text-3xl font-black tracking-tight"
                  style={{ color: G.textPrimary }}
                >
                  {stat.value}
                </p>
              </div>
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl"
                style={{
                  background: G.accentBg,
                  border: `1px solid ${G.accentBorder}`,
                }}
              >
                <stat.icon className="w-6 h-6" style={{ color: G.accent }} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ══ BROWSE TAB ══ */}
      {tab === "browse" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: G.accent }}
                />
                <p
                  className="text-sm font-semibold"
                  style={{ color: G.textSub }}
                >
                  Loading pools...
                </p>
              </div>
            ) : fetchError ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
                <p className="text-sm font-semibold text-red-400">
                  {fetchError}
                </p>
                <button
                  onClick={fetchPools}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ background: G.accentDark }}
                >
                  Retry
                </button>
              </div>
            ) : pools.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Package className="w-10 h-10" style={{ color: G.textLabel }} />
                <p
                  className="text-sm font-semibold"
                  style={{ color: G.textSub }}
                >
                  No open pools available right now.
                </p>
              </div>
            ) : (
              <>
                {farmerPools.length > 0 && (
                  <div className="space-y-3">
                    <p
                      className="text-xs font-bold uppercase tracking-widest px-1"
                      style={{ color: G.textLabel }}
                    >
                      🌾 Farmer Pools — Commit to Buy
                    </p>
                    {farmerPools.map((pool, i) => (
                      <PoolCard key={pool.id} pool={pool} index={i} />
                    ))}
                  </div>
                )}
                {buyerPools.length > 0 && (
                  <div className="space-y-3">
                    <p
                      className="text-xs font-bold uppercase tracking-widest px-1"
                      style={{ color: G.textLabel }}
                    >
                      🏢 Buyer Requests — Open for Farmers
                    </p>
                    {buyerPools.map((pool, i) => (
                      <PoolCard
                        key={pool.id}
                        pool={pool}
                        index={farmerPools.length + i}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quality panel */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-32">
            <div
              className="rounded-2xl p-6"
              style={{
                background: G.card,
                border: `1px solid ${G.border}`,
                backdropFilter: G.blur,
                WebkitBackdropFilter: G.blur,
                boxShadow: G.shadow,
              }}
            >
              <h3 className="font-bold text-lg flex items-center gap-2 mb-5 text-white">
                <ShieldCheck className="w-5 h-5" style={{ color: G.accent }} />
                Quality Assurance
              </h3>
              <div className="space-y-3">
                {[
                  {
                    title: "Moisture Content",
                    value: "< 12%",
                    status: "Optimal",
                  },
                  { title: "Foreign Matter", value: "< 1%", status: "Grade A" },
                  {
                    title: "Pesticide Residue",
                    value: "Zero",
                    status: "Certified Organic",
                  },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3.5 rounded-xl"
                    style={{
                      background: G.statBox,
                      border: `1px solid ${G.border}`,
                    }}
                  >
                    <span
                      className="text-sm font-semibold"
                      style={{ color: G.textSub }}
                    >
                      {m.title}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{m.value}</p>
                      <p
                        className="text-[9px] uppercase tracking-wider font-bold"
                        style={{ color: G.accent }}
                      >
                        {m.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="mt-5 p-4 rounded-xl flex items-start gap-3"
                style={{
                  background: G.accentBg,
                  border: `1px solid ${G.accentBorder}`,
                }}
              >
                <Star
                  className="w-5 h-5 shrink-0 mt-0.5"
                  style={{ color: G.accent }}
                />
                <div>
                  <p className="text-sm font-bold text-white">Premium Supply</p>
                  <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{ color: G.textSub }}
                  >
                    Pools are sourced from verified farmer collectives with
                    strict quality controls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ MY REQUESTS TAB ══ */}
      {tab === "mine" && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2
                className="w-7 h-7 animate-spin"
                style={{ color: G.accent }}
              />
            </div>
          ) : myPools.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 gap-4 rounded-2xl"
              style={{ background: G.card, border: `1px solid ${G.border}` }}
            >
              <Package className="w-10 h-10" style={{ color: G.textLabel }} />
              <p className="text-sm font-semibold" style={{ color: G.textSub }}>
                You haven't posted any buying requests yet.
              </p>
              <button
                onClick={() => setTab("create")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{
                  background: G.accentDark,
                  border: `1px solid ${G.accentBorder}`,
                }}
              >
                <Plus className="w-4 h-4" /> Post a Request
              </button>
            </div>
          ) : (
            myPools.map((pool, i) => (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl p-5 sm:p-6"
                style={{
                  background: G.card,
                  border: `1px solid ${G.border}`,
                  backdropFilter: G.blur,
                  WebkitBackdropFilter: G.blur,
                  boxShadow: G.shadow,
                }}
              >
                <div className="flex justify-between items-start gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-black text-lg text-white capitalize">
                        {pool.commodity}
                      </h3>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest"
                        style={{
                          background:
                            pool.status === "open"
                              ? G.accentBg
                              : "rgba(255,255,255,0.06)",
                          color:
                            pool.status === "open" ? G.accent : G.textLabel,
                          border: `1px solid ${pool.status === "open" ? G.accentBorder : G.border}`,
                        }}
                      >
                        {pool.status}
                      </span>
                    </div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: G.textSub }}
                    >
                      ₹{pool.pricePerUnit}/{pool.unit} · {pool.filledQuantity}/
                      {pool.targetQuantity} {pool.unit} filled
                    </p>
                    {pool.location && (
                      <p
                        className="text-xs mt-1 flex items-center gap-1"
                        style={{ color: G.textLabel }}
                      >
                        <MapPin className="w-3 h-3" /> {pool.location}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p
                      className="text-[10px] uppercase font-bold tracking-widest mb-1"
                      style={{ color: G.textLabel }}
                    >
                      Farmers Joined
                    </p>
                    <p
                      className="text-2xl font-black font-mono"
                      style={{ color: G.accent }}
                    >
                      {pool.members?.length || 0}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div
                    className="h-1.5 w-full rounded-full overflow-hidden"
                    style={{ background: G.progressTrack }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, Math.round(((pool.filledQuantity || 0) / (pool.targetQuantity || 1)) * 100))}%`,
                        background: `linear-gradient(90deg, ${G.accentDark}, ${G.accent})`,
                      }}
                    />
                  </div>
                  <p
                    className="text-[10px] mt-1.5 font-semibold"
                    style={{ color: G.textLabel }}
                  >
                    {Math.min(
                      100,
                      Math.round(
                        ((pool.filledQuantity || 0) /
                          (pool.targetQuantity || 1)) *
                          100,
                      ),
                    )}
                    % filled
                    {pool.deadline && (
                      <span>
                        {" "}
                        · Deadline:{" "}
                        {new Date(pool.deadline).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* ══ CREATE TAB ══ */}
      {tab === "create" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-xl"
        >
          <div
            className="rounded-2xl p-6 sm:p-8 space-y-5"
            style={{
              background: G.card,
              border: `1px solid ${G.border}`,
              backdropFilter: G.blur,
              WebkitBackdropFilter: G.blur,
              boxShadow: G.shadow,
            }}
          >
            <div>
              <h2 className="font-black text-xl text-white mb-1">
                Post a Buying Request
              </h2>
              <p className="text-sm" style={{ color: G.textSub }}>
                Create a pool and let farmer collectives respond with their
                produce.
              </p>
            </div>

            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: G.textLabel }}
              >
                Commodity
              </label>
              <input
                style={inputStyle(G)}
                placeholder="e.g. Wheat, Rice, Soybean"
                value={form.commodity}
                onChange={(e) =>
                  setForm({ ...form, commodity: e.target.value })
                }
              />
            </div>

            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: G.textLabel }}
              >
                Offered Price per Unit
              </label>
              <div className="flex gap-3">
                <input
                  style={{ ...inputStyle(G), flex: 1, width: "auto" }}
                  type="number"
                  placeholder="Price in ₹"
                  value={form.pricePerUnit}
                  onChange={(e) =>
                    setForm({ ...form, pricePerUnit: e.target.value })
                  }
                />
                <select
                  style={{ ...inputStyle(G), flex: "0 0 110px", width: "auto" }}
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                >
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="ton">ton</option>
                </select>
              </div>
            </div>

            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: G.textLabel }}
              >
                Total Quantity Needed
              </label>
              <input
                style={inputStyle(G)}
                type="number"
                placeholder={`Target quantity in ${form.unit}`}
                value={form.targetQuantity}
                onChange={(e) =>
                  setForm({ ...form, targetQuantity: e.target.value })
                }
              />
            </div>

            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: G.textLabel }}
              >
                Preferred Location{" "}
                <span
                  style={{
                    color: G.textLabel,
                    textTransform: "none",
                    letterSpacing: "normal",
                  }}
                >
                  (optional)
                </span>
              </label>
              <input
                style={inputStyle(G)}
                placeholder="e.g. Ludhiana, Punjab"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: G.textLabel }}
              >
                Deadline{" "}
                <span
                  style={{
                    color: G.textLabel,
                    textTransform: "none",
                    letterSpacing: "normal",
                  }}
                >
                  (optional)
                </span>
              </label>
              <input
                style={inputStyle(G)}
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>

            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: G.textLabel }}
              >
                Additional Notes{" "}
                <span
                  style={{
                    color: G.textLabel,
                    textTransform: "none",
                    letterSpacing: "normal",
                  }}
                >
                  (optional)
                </span>
              </label>
              <textarea
                style={
                  {
                    ...inputStyle(G),
                    resize: "vertical",
                  } as React.CSSProperties
                }
                placeholder="Quality requirements, packaging specs, delivery terms..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <button
              disabled={creating}
              onClick={handleCreate}
              className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              style={
                creating
                  ? { background: G.statBox, color: G.textSub }
                  : {
                      background: G.accentDark,
                      color: "#fff",
                      border: `1px solid ${G.accentBorder}`,
                      boxShadow: "0 4px 20px rgba(22,163,74,0.4)",
                    }
              }
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Posting...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Post Buying Request
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
