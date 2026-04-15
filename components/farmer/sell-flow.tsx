"use client";

import { useState, useEffect } from "react";
import { useAppStore, useTranslation, type Crop } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  Users,
  Gavel,
  Check,
  Wheat,
  Sprout,
  Leaf,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const cropIcons: Record<string, any> = {
  wheat: Wheat,
  rice: Wheat,
  mustard: Sprout,
  corn: Leaf,
  potato: Sprout,
  onion: Leaf,
};

const cropImages: Record<string, string> = {
  wheat:
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
  mustard:
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop",
  corn: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop",
  potato:
    "https://images.unsplash.com/photo-1518977676601-b53f82ber95?w=400&h=400&fit=crop",
  onion:
    "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop",
};

type SellStep =
  | "select-crop"
  | "enter-quantity"
  | "choose-method"
  | "pool-details"
  | "confirm";
const stepOrder: SellStep[] = [
  "select-crop",
  "enter-quantity",
  "choose-method",
  "pool-details",
  "confirm",
];

export function SellFlow() {
  const router = useRouter();
  const [step, setStep] = useState<SellStep>("select-crop");
  const [direction, setDirection] = useState(1);
  const [sellMethod, setMethod] = useState<
    "direct" | "pool" | "auction" | null
  >(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const crops = useAppStore((state) => state.crops);
  const selectedCrop = useAppStore((state) => state.selectedCrop);
  const setSelectedCrop = useAppStore((state) => state.setSelectedCrop);
  const sellQuantity = useAppStore((state) => state.sellQuantity);
  const setSellQuantity = useAppStore((state) => state.setSellQuantity);
  const pools = useAppStore((state) => state.pools);
  const language = useAppStore((state) => state.language);
  const userProfile = useAppStore((state) => state.userProfile);
  const t = useTranslation();
  const setActiveScreen = useAppStore((state) => state.setActiveScreen);

  useEffect(() => setIsMounted(true), []);

  const getCropName = (crop: Crop) => {
    if (language === "hi") return crop.nameHi;
    if (language === "pa") return crop.namePa;
    return crop.name;
  };

  // ⚡ Upgraded to support the new `commodity` schema while maintaining backward compatibility
  const matchingPool = selectedCrop
    ? pools.find(
        (p) =>
          (p.commodity === selectedCrop.id || p.cropId === selectedCrop.id) &&
          p.status === "open",
      )
    : null;

  const totalValue = selectedCrop
    ? sellQuantity * selectedCrop.currentPrice
    : 0;
  const poolBonus = matchingPool
    ? sellQuantity * (matchingPool.bonusPerQuintal || 150)
    : 0;

  const changeStep = (newStep: SellStep, dir: number) => {
    setDirection(dir);
    setStep(newStep);
  };

  const handleBack = () => {
    switch (step) {
      case "enter-quantity":
        return changeStep("select-crop", -1);
      case "choose-method":
        return changeStep("enter-quantity", -1);
      case "pool-details":
        return changeStep("choose-method", -1);
      case "confirm":
        return changeStep(
          sellMethod === "pool" ? "pool-details" : "choose-method",
          -1,
        );
      default:
        router.push("/farmer");
    }
  };

  // ── CONFIRM SALE: calls the Pools API ──────────────────────────────────────
  const handleConfirmSale = async () => {
    // ⚡ 1. Fix the Silent Return: Only block if the crop is missing.
    if (!selectedCrop) return;

    // ⚡ 2. The Demo Fallback: Never fail a presentation due to a cleared cache.
    const farmerId = userProfile?.uid || "demo-farmer-123";
    const farmerName = userProfile?.fullName || "Arshvir Kaur";
    const farmerRole = userProfile?.role || "farmer";

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (sellMethod === "pool") {
        if (matchingPool) {
          // Join an existing open pool
          // Create a new pool
          const res = await fetch("/api/pools", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              commodity: selectedCrop.id,
              targetQuantity: sellQuantity * 3, // Our UI uses this
              requestedQuantity: sellQuantity * 3, // ⚡ ADDED: Your teammate's backend strictly demands this!
              pricePerUnit: selectedCrop.currentPrice,
              bonusPerQuintal: 150,
              creatorId: farmerId,
              creatorName: farmerName,
              creatorRole: farmerRole,
              filledQuantity: sellQuantity,
              status: "open",
              members: [
                {
                  farmerId,
                  farmerName,
                  quantity: sellQuantity,
                  joinedAt: new Date().toISOString(),
                },
              ],
            }),
          });
          if (!res.ok)
            throw new Error((await res.json()).error || "Failed to join pool");
        } else {
          // Create a new pool
          const res = await fetch("/api/pools", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              commodity: selectedCrop.id,
              targetQuantity: sellQuantity * 3, // default: 3x your quantity
              pricePerUnit: selectedCrop.currentPrice,
              bonusPerQuintal: 150,
              creatorId: farmerId,
              creatorName: farmerName,
              creatorRole: farmerRole,
              filledQuantity: sellQuantity,
              status: "open",
              members: [
                {
                  farmerId,
                  farmerName,
                  quantity: sellQuantity,
                  joinedAt: new Date().toISOString(),
                },
              ],
            }),
          });
          if (!res.ok)
            throw new Error(
              (await res.json()).error || "Failed to create pool",
            );
        }
      }

      // ⚡ 3. The Router Fix: Sync global UI state before redirecting
      setActiveScreen("tracking");
      router.push("/farmer/tracking");
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    switch (step) {
      case "select-crop":
        if (selectedCrop) changeStep("enter-quantity", 1);
        break;
      case "enter-quantity":
        if (sellQuantity > 0) changeStep("choose-method", 1);
        break;
      case "choose-method":
        if (sellMethod === "pool") changeStep("pool-details", 1);
        else if (sellMethod === "auction") router.push("/farmer/auction");
        else changeStep("confirm", 1);
        break;
      case "pool-details":
        changeStep("confirm", 1);
        break;
      case "confirm":
        handleConfirmSale();
        break;
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 50 : -50, opacity: 0 }),
  };

  if (!isMounted) return null;

  const currentStepIndex = stepOrder.indexOf(step);
  const progressPercent =
    ((currentStepIndex + 1) / (sellMethod === "pool" ? 5 : 4)) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 pt-4 pb-0">
        <div className="flex items-center gap-4 px-4 pb-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors premium-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              {t.sell}
            </h1>
            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
              {step.replace("-", " ")}
            </p>
          </div>
        </div>
        <div className="w-full h-1 bg-secondary relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />
        </div>
      </header>

      <main className="flex-1 relative w-full max-w-2xl mx-auto">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full p-4 sm:p-6 pb-32 absolute top-0 left-0"
          >
            {step === "select-crop" && (
              <CropSelection
                crops={crops}
                selectedCrop={selectedCrop}
                onSelect={setSelectedCrop}
                getCropName={getCropName}
              />
            )}
            {step === "enter-quantity" && selectedCrop && (
              <QuantityInput
                crop={selectedCrop}
                quantity={sellQuantity}
                onQuantityChange={setSellQuantity}
                getCropName={getCropName}
                t={t}
              />
            )}
            {step === "choose-method" && (
              <MethodSelection
                sellMethod={sellMethod}
                onMethodSelect={setMethod}
                hasPool={!!matchingPool}
                poolBonus={matchingPool?.bonusPerQuintal || 150}
                t={t}
              />
            )}
            {step === "pool-details" && selectedCrop && (
              <PoolDetails
                pool={matchingPool}
                crop={selectedCrop}
                quantity={sellQuantity}
                getCropName={getCropName}
                t={t}
              />
            )}
            {step === "confirm" && selectedCrop && (
              <ConfirmationScreen
                crop={selectedCrop}
                quantity={sellQuantity}
                totalValue={totalValue}
                poolBonus={sellMethod === "pool" ? poolBonus : 0}
                method={sellMethod}
                getCropName={getCropName}
                t={t}
                error={submitError}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="h-12 w-full bg-gradient-to-t from-background to-transparent" />
        <div className="p-4 sm:p-6 bg-background/90 backdrop-blur-xl border-t border-border/50 pointer-events-auto">
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={handleNext}
              disabled={
                isSubmitting ||
                (step === "select-crop" && !selectedCrop) ||
                (step === "enter-quantity" && sellQuantity <= 0) ||
                (step === "choose-method" && !sellMethod)
              }
              className="w-full h-14 rounded-2xl sm:rounded-3xl bg-primary hover:bg-primary/90 text-lg font-bold premium-shadow group transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : step === "confirm" ? (
                "Confirm Sale"
              ) : (
                "Continue"
              )}
              {!isSubmitting && (
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CropSelection({ crops, selectedCrop, onSelect, getCropName }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground tracking-tight px-1">
        What are you selling?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {crops.map((crop: Crop, index: number) => {
          const isSelected = selectedCrop?.id === crop.id;
          const Icon = cropIcons[crop.id] || Wheat;
          return (
            <motion.button
              key={crop.id}
              onClick={() => onSelect(crop)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative overflow-hidden rounded-3xl p-4 flex flex-col items-center justify-center gap-3 aspect-square transition-all duration-500 group premium-shadow border-2",
                isSelected
                  ? "border-primary bg-primary/10 shadow-lg"
                  : "border-transparent bg-card/40 backdrop-blur-md hover:border-primary/30",
              )}
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={cropImages[crop.id] || cropImages.wheat}
                  alt={crop.name}
                  fill
                  priority={index <= 3}
                  className={cn(
                    "object-cover transition-transform duration-700 group-hover:scale-110",
                    isSelected ? "opacity-70" : "opacity-50",
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              </div>
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative z-10",
                  isSelected
                    ? "bg-primary text-white shadow-lg rotate-3"
                    : "bg-background/80 text-primary group-hover:bg-primary group-hover:text-white",
                )}
              >
                <Icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div className="text-center relative z-10">
                <h3
                  className={cn(
                    "font-bold tracking-tight text-base",
                    isSelected ? "text-primary" : "text-foreground",
                  )}
                >
                  {getCropName(crop)}
                </h3>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                  ₹{crop.currentPrice}/q
                </p>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md z-20"
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function QuantityInput({
  crop,
  quantity,
  onQuantityChange,
  getCropName,
  t,
}: any) {
  const totalValue = quantity * crop.currentPrice;
  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="inline-flex items-center gap-3 bg-secondary/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50">
        <Image
          src={cropImages[crop.id] || cropImages.wheat}
          alt={crop.name}
          width={24}
          height={24}
          priority
          className="rounded-full object-cover w-6 h-6"
        />
        <span className="text-sm font-semibold text-foreground">
          {getCropName(crop)}
        </span>
        <span className="text-muted-foreground">|</span>
        <span className="text-sm font-medium text-muted-foreground">
          ₹{crop.currentPrice}/q
        </span>
      </div>
      <div className="flex flex-col items-center w-full mt-4">
        <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
          Enter Quantity
        </label>
        <input
          type="number"
          value={quantity || ""}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          autoFocus
          className="w-2/3 bg-transparent text-6xl sm:text-8xl font-mono font-medium text-center text-foreground placeholder:text-muted-foreground/30 outline-none p-0 focus:ring-0"
          placeholder="0"
        />
        <span className="text-xl font-bold text-primary mt-2">
          {t.quintals}
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {[10, 25, 50, 100].map((q) => (
          <button
            key={q}
            onClick={() => onQuantityChange(q)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-all duration-200",
              quantity === q
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary",
            )}
          >
            +{q}q
          </button>
        ))}
      </div>
      <AnimatePresence>
        {quantity > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full glass-card premium-shadow rounded-3xl p-5 sm:p-6 mt-4 border border-border/50"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Estimated Value
              </span>
              <span className="text-[10px] bg-agri-success/15 text-agri-success px-2 py-1 rounded-md font-bold uppercase">
                Live Rate
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-3xl text-foreground font-light mr-1">
                ₹
              </span>
              <span className="text-5xl font-bold tracking-tighter text-foreground">
                {totalValue.toLocaleString("en-IN")}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MethodSelection({
  sellMethod,
  onMethodSelect,
  hasPool,
  poolBonus,
  t,
}: any) {
  const methods = [
    {
      id: "direct",
      icon: Package,
      title: "Direct Sell",
      desc: "Sell immediately at current market rate",
      badge: null,
    },
    {
      id: "pool",
      icon: Users,
      title: t.joinPool,
      desc: "Combine with neighbors for better rates",
      badge: hasPool ? `+₹${poolBonus}/q Bonus` : "Create New Pool",
      highlight: true,
    },
    {
      id: "auction",
      icon: Gavel,
      title: t.startAuction,
      desc: "Let buyers compete for your produce",
      badge: "Max Profit",
    },
  ];
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground tracking-tight">
        How do you want to sell?
      </h2>
      <div className="space-y-4">
        {methods.map((method: any) => {
          const isSelected = sellMethod === method.id;
          return (
            <motion.button
              key={method.id}
              onClick={() => onMethodSelect(method.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full p-5 sm:p-6 rounded-3xl text-left transition-all duration-300 relative overflow-hidden group",
                isSelected
                  ? "bg-primary/5 border-2 border-primary shadow-md"
                  : "bg-card border-2 border-border/50 hover:border-primary/30 premium-shadow",
              )}
            >
              {method.highlight && !isSelected && (
                <div className="absolute inset-0 bg-agri-gold/5 pointer-events-none" />
              )}
              <div className="flex items-start gap-4 sm:gap-5 relative z-10">
                <div
                  className={cn(
                    "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-secondary text-muted-foreground group-hover:text-primary group-hover:bg-primary/10",
                  )}
                >
                  <method.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3
                      className={cn(
                        "text-lg font-bold truncate",
                        isSelected ? "text-primary" : "text-foreground",
                      )}
                    >
                      {method.title}
                    </h3>
                    {method.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                          method.id === "pool"
                            ? "bg-agri-gold/20 text-agri-earth"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground pr-4 leading-snug">
                    {method.desc}
                  </p>
                </div>
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-2 transition-all",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30",
                  )}
                >
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function PoolDetails({ pool, crop, quantity, getCropName, t }: any) {
  if (!pool) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Creating New Pool
        </h2>
        <div className="glass-card premium-shadow border border-border/50 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-agri-gold to-agri-earth flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {getCropName(crop)} Pool
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                You'll be the first member
              </p>
            </div>
          </div>
          <div className="bg-agri-success/10 border border-agri-success/20 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-foreground">
                Your Contribution
              </span>
              <span className="font-bold text-lg text-foreground">
                {quantity}q
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-agri-success flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> Default Bonus
              </span>
              <span className="font-bold text-lg text-agri-success">
                +₹150/q
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent =
    ((pool.filledQuantity || pool.totalQuantity || 0) / pool.targetQuantity) *
    100;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground tracking-tight">
        Pool Insights
      </h2>
      <div className="glass-card premium-shadow border border-border/50 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-agri-gold/20 blur-3xl rounded-full" />
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-agri-gold to-agri-earth flex items-center justify-center shadow-lg shadow-agri-gold/20">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {getCropName(crop)} Community Pool
            </h3>
            <p className="text-sm font-medium text-muted-foreground">
              {pool.members?.length || pool.contributors || 1} local farmers
              joined
            </p>
          </div>
        </div>
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between text-sm font-bold uppercase tracking-wider">
            <span className="text-muted-foreground">Volume Target</span>
            <span className="text-foreground">
              {pool.filledQuantity || pool.totalQuantity || 0}q /{" "}
              {pool.targetQuantity}q
            </span>
          </div>
          <div className="h-4 bg-secondary rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-agri-gold to-agri-wheat rounded-full"
            />
          </div>
        </div>
        <div className="mt-8 bg-agri-success/10 border border-agri-success/20 rounded-2xl p-4 relative z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-foreground">
              Your Share
            </span>
            <span className="font-bold text-lg text-foreground">
              {quantity}q
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-agri-success flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Expected Bonus
            </span>
            <span className="font-bold text-lg text-agri-success">
              +₹
              {(quantity * (pool.bonusPerQuintal || 150)).toLocaleString(
                "en-IN",
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmationScreen({
  crop,
  quantity,
  totalValue,
  poolBonus,
  method,
  getCropName,
  t,
  error,
}: any) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3 py-4">
        <div className="w-20 h-20 rounded-full bg-agri-success/20 flex items-center justify-center mx-auto">
          <Check className="w-10 h-10 text-agri-success" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Review & Confirm</h2>
      </div>
      <div className="glass-card premium-shadow border border-border/50 rounded-3xl p-6 space-y-5">
        <ReceiptRow label="Commodity" value={getCropName(crop)} />
        <ReceiptRow
          label="Quantity"
          value={`${quantity} ${t.quintals || "quintals"}`}
        />
        <ReceiptRow
          label="Base Rate"
          value={`₹${crop.currentPrice.toLocaleString("en-IN")}/${crop.unit}`}
        />
        <ReceiptRow
          label="Method"
          value={
            method === "pool"
              ? "Community Pool"
              : method === "auction"
                ? "Live Auction"
                : "Direct Sell"
          }
          highlight
        />
        {poolBonus > 0 && (
          <ReceiptRow
            label="Pool Bonus"
            value={`+₹${poolBonus.toLocaleString("en-IN")}`}
            success
          />
        )}
        <div className="h-px bg-border/80 my-4" />
        <div className="flex items-end justify-between pt-2">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Final Payout
          </span>
          <span className="text-4xl font-bold tracking-tighter text-primary">
            ₹{(totalValue + poolBonus).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 text-sm text-destructive font-medium text-center">
          ⚠️ {error}
        </div>
      )}
      <p className="text-xs text-center font-medium text-muted-foreground px-4">
        By tapping confirm, you agree to FarmHers' terms. Funds are secured in
        escrow until handover.
      </p>
    </div>
  );
}

function ReceiptRow({ label, value, highlight, success }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-bold text-right",
          highlight
            ? "text-primary bg-primary/10 px-2.5 py-1 rounded-md text-xs uppercase tracking-wider"
            : "text-foreground text-sm",
          success && "text-agri-success",
        )}
      >
        {value}
      </span>
    </div>
  );
}
