"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, useTranslation } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import { SellStep, stepOrder } from "./constants";
import { CropSelection } from "./crop-selection";
import { QuantityInput } from "./quantity-input";
import { MethodSelection } from "./method-selection";
import { PoolDetails } from "./pool-details";
import { ConfirmationScreen } from "./confirmation-screen";

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

  const {
    crops,
    selectedCrop,
    setSelectedCrop,
    sellQuantity,
    setSellQuantity,
    pools,
    language,
    userProfile,
    setActiveScreen,
  } = useAppStore();
  const t = useTranslation();

  useEffect(() => setIsMounted(true), []);

  const getCropName = (crop: any) => {
    if (language === "hi") return crop.nameHi;
    if (language === "pa") return crop.namePa;
    return crop.name;
  };

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

  const handleConfirmSale = async () => {
    if (!selectedCrop) return;

    const farmerId = userProfile?.uid || "demo-farmer-123";
    const farmerName = userProfile?.fullName || "Arshvir Kaur";
    const farmerRole = userProfile?.role || "farmer";

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (sellMethod === "pool") {
        const poolPayload = {
          creatorId: farmerId,
          creatorRole: farmerRole,
          creatorName: farmerName,
          commodity: selectedCrop.id,
          pricePerUnit: selectedCrop.currentPrice,
          unit: "quintal",
          targetQuantity: sellQuantity * 3,
          requestedQuantity: sellQuantity * 3,
          location: "Punjab, India",
        };

        if (matchingPool) {
          const res = await fetch("/api/pools", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(poolPayload),
          });
          if (!res.ok)
            throw new Error((await res.json()).error || "Failed to join pool");
        } else {
          const res = await fetch("/api/pools", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(poolPayload),
          });
          if (!res.ok)
            throw new Error(
              (await res.json()).error || "Failed to create pool",
            );
        }
      }

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
      {/* ── HEADER ── */}
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
              {t.sell || "Sell"}
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

      {/* ── MAIN CONTENT ──
          pb-56: clears the Continue button bar (~90px) + the floating BottomNav (~80px) + breathing room
      */}
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
            className="w-full p-4 sm:p-6 pb-56 absolute top-0 left-0"
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

      {/* ── CONTINUE BUTTON BAR ──
          Positioned above the floating BottomNav (which is at bottom-4 ~16px, height ~80px).
          bottom-24 = 96px keeps us safely above the nav on mobile.
          z-40 keeps it below the nav's z-50 so the nav always renders on top.
      -->*/}
      <div className="fixed bottom-24 sm:bottom-28 left-0 right-0 z-40 pointer-events-none">
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
