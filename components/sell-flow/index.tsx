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
  const [sellMethod, setMethod] = useState<"direct" | "pool" | "auction" | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ORIGINAL BACKEND HOOKS
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
    addTransaction,
  } = useAppStore();
  const t = useTranslation();

  useEffect(() => setIsMounted(true), []);

  const getCropName = (crop: any) => {
    if (language === "hi") return crop.nameHi;
    if (language === "pa") return crop.namePa;
    return crop.name;
  };

  const matchingPool = selectedCrop
    ? pools.find((p) => (p.commodity === selectedCrop.id || p.cropId === selectedCrop.id) && p.status === "open")
    : null;

  const totalValue = selectedCrop ? sellQuantity * selectedCrop.currentPrice : 0;
  const poolBonus = matchingPool ? sellQuantity * (matchingPool.bonusPerQuintal || 150) : 0;

  const changeStep = (newStep: SellStep, dir: number) => {
    setDirection(dir);
    setStep(newStep);
  };

  const handleBack = () => {
    switch (step) {
      case "enter-quantity": return changeStep("select-crop", -1);
      case "choose-method": return changeStep("enter-quantity", -1);
      case "pool-details": return changeStep("choose-method", -1);
      case "confirm": return changeStep(sellMethod === "pool" ? "pool-details" : "choose-method", -1);
      default: router.push("/farmer");
    }
  };

  // ORIGINAL BACKEND LOGIC (UNCHANGED)
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

        const res = await fetch("/api/pools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(poolPayload),
        });
        if (!res.ok) throw new Error("Failed to process pool request");
      }

      addTransaction({
        id: `AGR-${Math.floor(Math.random() * 10000)}`,
        crop: selectedCrop.name,
        qty: `${sellQuantity}q`,
        amount: totalValue + (sellMethod === "pool" ? poolBonus : 0),
        date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
        status: "pending",
      });

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
      case "select-crop": if (selectedCrop) changeStep("enter-quantity", 1); break;
      case "enter-quantity": if (sellQuantity > 0) changeStep("choose-method", 1); break;
      case "choose-method":
        if (sellMethod === "pool") changeStep("pool-details", 1);
        else if (sellMethod === "auction") router.push("/farmer/auction");
        else changeStep("confirm", 1);
        break;
      case "pool-details": changeStep("confirm", 1); break;
      case "confirm": handleConfirmSale(); break;
    }
  };

  if (!isMounted) return null;
  const progressPercent = ((stepOrder.indexOf(step) + 1) / (sellMethod === "pool" ? 5 : 4)) * 100;

  return (
    <div className="min-h-screen bg-background dark:bg-[#111a13] flex flex-col transition-colors duration-300">
      <header className="sticky top-0 z-40 bg-background/80 dark:bg-[#111a13]/90 backdrop-blur-xl border-b border-border/40 pt-4">
        <div className="flex items-center gap-4 px-6 pb-4 max-w-2xl mx-auto w-full">
          <button onClick={handleBack} className="w-10 h-10 rounded-full bg-secondary dark:bg-white/10 flex items-center justify-center transition-transform active:scale-90">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t.sell || "Sell"}</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-70">{step.replace("-", " ")}</p>
          </div>
        </div>
        <div className="w-full h-1 bg-secondary dark:bg-white/5 relative">
          <motion.div className="absolute top-0 left-0 h-full bg-primary" animate={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full relative">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6 pb-40">
            {step === "select-crop" && <CropSelection crops={crops} selectedCrop={selectedCrop} onSelect={setSelectedCrop} getCropName={getCropName} />}
            {step === "enter-quantity" && selectedCrop && <QuantityInput crop={selectedCrop} quantity={sellQuantity} onQuantityChange={setSellQuantity} getCropName={getCropName} t={t} />}
            {step === "choose-method" && <MethodSelection sellMethod={sellMethod} onMethodSelect={setMethod} hasPool={!!matchingPool} poolBonus={matchingPool?.bonusPerQuintal || 150} t={t} />}
            {step === "pool-details" && selectedCrop && <PoolDetails pool={matchingPool} crop={selectedCrop} quantity={sellQuantity} getCropName={getCropName} t={t} />}
            {step === "confirm" && selectedCrop && <ConfirmationScreen crop={selectedCrop} quantity={sellQuantity} totalValue={totalValue} poolBonus={sellMethod === "pool" ? poolBonus : 0} method={sellMethod} getCropName={getCropName} t={t} error={submitError} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed bottom-24 left-0 right-0 z-40 p-6 bg-background/90 dark:bg-[#111a13]/90 backdrop-blur-xl border-t border-border/40">
        <div className="max-w-2xl mx-auto">
          <Button onClick={handleNext} disabled={isSubmitting || (step === "select-crop" && !selectedCrop) || (step === "enter-quantity" && sellQuantity <= 0) || (step === "choose-method" && !sellMethod)} className="w-full h-14 rounded-3xl bg-primary text-primary-foreground font-bold shadow-lg">
            {isSubmitting ? <Loader2 className="animate-spin" /> : step === "confirm" ? "Confirm Sale" : "Continue"}
            {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}