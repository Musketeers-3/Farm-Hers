"use client";

import { useState, useEffect } from "react";
import { useAppStore, useTranslation, type Crop } from "@/lib/store";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CropSelection }    from "./crop-selection";
import { QuantityInput }    from "./quantity-input";
import { MethodSelection }  from "./method-selection";
import { SelectPool }       from "./select-pool";
import { ConfirmationScreen } from "./confirmation-screen";
import { type SellStep, stepOrder } from "./constants";

export function SellFlow() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const [step,              setStep]              = useState<SellStep>("select-crop");
  const [direction,         setDirection]         = useState(1);
  const [sellMethod,        setMethod]            = useState<"direct" | "pool" | "auction" | null>(null);
  const [isMounted,         setIsMounted]         = useState(false);
  const [isSubmitting,      setIsSubmitting]      = useState(false);
  const [submitError,       setSubmitError]       = useState<string | null>(null);
  const [matchingBuyerPools, setMatchingBuyerPools] = useState<any[]>([]);
  const [matchingBuyerPool,  setMatchingBuyerPool]  = useState<any>(null);
  const [selectedPoolId,    setSelectedPoolId]    = useState<string | null>(null);
  const [poolSearchDone,    setPoolSearchDone]    = useState(false);

  const crops        = useAppStore((s) => s.crops);
  const selectedCrop = useAppStore((s) => s.selectedCrop);
  const setSelectedCrop = useAppStore((s) => s.setSelectedCrop);
  const sellQuantity = useAppStore((s) => s.sellQuantity);
  const setSellQuantity = useAppStore((s) => s.setSellQuantity);
  const language     = useAppStore((s) => s.language);
  const userProfile  = useAppStore((s) => s.userProfile);
  const t            = useTranslation();
  const setActiveScreen = useAppStore((s) => s.setActiveScreen);

  useEffect(() => setIsMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const getCropName = (crop: Crop) => {
    if (language === "hi") return crop.nameHi;
    if (language === "pa") return crop.namePa;
    return crop.name;
  };

  // Fetch matching buyer pools when crop changes
  useEffect(() => {
    if (!selectedCrop) return;
    setPoolSearchDone(false);
    fetch(`/api/pools?status=open`)
      .then((r) => r.json())
      .then((data) => {
        const available = (data.pools || []).filter(
          (p: any) =>
            p.status === "open" &&
            p.commodity?.toLowerCase() === selectedCrop.id?.toLowerCase() &&
            p.creatorId !== (userProfile?.uid || "demo-farmer-123"),
        );
        setMatchingBuyerPools(available);
        setPoolSearchDone(true);
      })
      .catch(() => setPoolSearchDone(true));
  }, [selectedCrop]);

  const totalValue = selectedCrop ? sellQuantity * selectedCrop.currentPrice : 0;
  const poolBonus  = matchingBuyerPool ? sellQuantity * (matchingBuyerPool.bonusPerQuintal || 150) : 0;

  const changeStep = (newStep: SellStep, dir: number) => {
    setDirection(dir);
    setStep(newStep);
  };

  const handleBack = () => {
    switch (step) {
      case "enter-quantity": return changeStep("select-crop", -1);
      case "choose-method":  return changeStep("enter-quantity", -1);
      case "select-pool":    return changeStep("choose-method", -1);
      case "confirm":        return changeStep(sellMethod === "pool" ? "select-pool" : "choose-method", -1);
      default: router.push("/farmer");
    }
  };

  const handleConfirmSale = async () => {
    if (!selectedCrop) return;
    const chosenPool = matchingBuyerPools.find((p) => p.id === selectedPoolId) || (sellMethod === "direct" ? matchingBuyerPool : null);
    const farmerId   = userProfile?.uid      || "demo-farmer-123";
    const farmerName = userProfile?.fullName || "Demo Farmer";
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (sellMethod === "pool" || sellMethod === "direct") {
        if (chosenPool) {
          const remaining = chosenPool.targetQuantity - (chosenPool.filledQuantity || 0);
          const joinQty   = Math.min(sellQuantity, remaining);
          const res = await fetch(`/api/pools/${chosenPool.id}/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ farmerId, farmerName, quantity: joinQty }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to join pool");
          const leftover = sellQuantity - joinQty;
          if (leftover > 0) {
            await fetch("/api/pools", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                commodity: selectedCrop.id, targetQuantity: leftover * 3, requestedQuantity: leftover * 3,
                pricePerUnit: selectedCrop.currentPrice, creatorId: farmerId, creatorName: farmerName,
                creatorRole: "farmer", filledQuantity: leftover,
                members: [{ farmerId, farmerName, quantity: leftover, joinedAt: new Date().toISOString() }],
                status: "open",
              }),
            });
          }
        } else {
          const res = await fetch("/api/pools", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              commodity: selectedCrop.id, targetQuantity: sellQuantity * 3, requestedQuantity: sellQuantity * 3,
              pricePerUnit: selectedCrop.currentPrice, creatorId: farmerId, creatorName: farmerName,
              creatorRole: "farmer", filledQuantity: sellQuantity,
              members: [{ farmerId, farmerName, quantity: sellQuantity, joinedAt: new Date().toISOString() }],
              status: "open",
            }),
          });
          if (!res.ok) throw new Error((await res.json()).error || "Failed to create pool");
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
      case "select-crop":    if (selectedCrop)  changeStep("enter-quantity", 1); break;
      case "enter-quantity": if (sellQuantity > 0) changeStep("choose-method", 1); break;
      case "choose-method":
        if (sellMethod === "pool") changeStep("select-pool", 1);
        else if (sellMethod === "auction") router.push("/farmer/auction");
        else changeStep("confirm", 1);
        break;
      case "select-pool": if (selectedPoolId || matchingBuyerPools.length === 0) changeStep("confirm", 1); break;
      case "confirm": handleConfirmSale(); break;
    }
  };

  const slideVariants = {
    enter:  (dir: number) => ({ x: dir > 0 ?  50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir: number) => ({ x: dir < 0 ?  50 : -50, opacity: 0 }),
  };

  if (!isMounted) return null;

  const currentStepIndex = stepOrder.indexOf(step);
  const progressPercent  = ((currentStepIndex + 1) / (sellMethod === "pool" ? 5 : 4)) * 100;
  const chosenPoolForConfirm = matchingBuyerPools.find((p) => p.id === selectedPoolId) || (sellMethod === "direct" ? matchingBuyerPool : null);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden relative">

      {/* ── FIXED BACKGROUND — same as farmer-dashboard ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-b from-[#f0fdf4] to-white transition-opacity duration-500 ${isDark ? "opacity-0" : "opacity-100"}`} />
        {isDark && (
          <>
            <Image src="/images/farmers_bg.jpg" alt="" fill priority
              className="object-cover object-center" style={{ opacity: 0.28 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020c04]/85 via-[#040f06]/75 to-[#020c04]/92" />
            <div className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,20,8,0.3) 0%, rgba(2,8,3,0.7) 100%)" }} />
          </>
        )}
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-white/75 dark:bg-[#020c04]/75 backdrop-blur-xl border-b border-white/50 dark:border-white/[0.06] pt-4 pb-0">
        <div className="flex items-center gap-4 px-4 pb-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-white/[0.07] backdrop-blur-md border border-white/60 dark:border-white/[0.08] flex items-center justify-center hover:scale-105 transition-transform shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-slate-800 dark:text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{t.sell}</h1>
            <p className="text-[13px] font-medium text-slate-500 dark:text-white/40 uppercase tracking-wider">
              {step.replace(/-/g, " ")}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-black/5 dark:bg-white/[0.08] relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="relative z-10 flex-1 w-full max-w-2xl mx-auto">
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
              <CropSelection crops={crops} selectedCrop={selectedCrop} onSelect={setSelectedCrop} getCropName={getCropName} />
            )}
            {step === "enter-quantity" && selectedCrop && (
              <QuantityInput crop={selectedCrop} quantity={sellQuantity} onQuantityChange={setSellQuantity} getCropName={getCropName} t={t} />
            )}
            {step === "choose-method" && (
              <MethodSelection
                sellMethod={sellMethod}
                onMethodSelect={setMethod}
                hasPool={!!matchingBuyerPool}
                poolBonus={matchingBuyerPool?.pricePerUnit ? matchingBuyerPool.pricePerUnit - (selectedCrop?.currentPrice || 0) + 150 : 150}
                t={t}
              />
            )}
            {step === "select-pool" && selectedCrop && (
              <SelectPool pools={matchingBuyerPools} selectedPoolId={selectedPoolId} onSelect={setSelectedPoolId} crop={selectedCrop} quantity={sellQuantity} getCropName={getCropName} />
            )}
            {step === "confirm" && selectedCrop && (
              <ConfirmationScreen
                crop={selectedCrop} quantity={sellQuantity} totalValue={totalValue}
                poolBonus={sellMethod === "pool" ? poolBonus : 0}
                method={sellMethod} getCropName={getCropName} t={t} error={submitError} chosenPool={chosenPoolForConfirm}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── BOTTOM CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
        <div className="h-12 w-full bg-gradient-to-t from-white/80 dark:from-[#020c04]/80 to-transparent" />
        <div className="p-4 sm:p-6
          bg-white/80 dark:bg-[#020c04]/80
          backdrop-blur-xl
          border-t border-white/50 dark:border-white/[0.06]
          pointer-events-auto">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleNext}
              disabled={
                isSubmitting ||
                (step === "select-crop"    && !selectedCrop)          ||
                (step === "enter-quantity" && sellQuantity <= 0)       ||
                (step === "choose-method"  && !sellMethod)             ||
                (step === "select-pool"    && matchingBuyerPools.length > 0 && !selectedPoolId)
              }
              className="w-full h-14 rounded-2xl sm:rounded-3xl text-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 group
                bg-emerald-600 hover:bg-emerald-500 text-white
                disabled:opacity-40
                shadow-[0_8px_24px_rgba(22,163,74,0.3)]"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
              ) : step === "confirm" ? (
                "Confirm Sale"
              ) : (
                "Continue"
              )}
              {!isSubmitting && <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
