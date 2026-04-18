"use client";

import { useState, useEffect } from "react";
import { useAppStore, useTranslation, type Crop } from "@/lib/store";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CropSelection } from "./crop-selection";
import { QuantityInput } from "./quantity-input";
import { MethodSelection } from "./method-selection";
import { SelectPool } from "./select-pool";
import { ConfirmationScreen } from "./confirmation-screen";
import { type SellStep, stepOrder } from "./constants";
import { cn } from "@/lib/utils";

export function SellFlow() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const [step, setStep] = useState<SellStep>("select-crop");
  const [direction, setDirection] = useState(1);
  const [sellMethod, setMethod] = useState<"direct" | "pool" | "auction" | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [matchingBuyerPools, setMatchingBuyerPools] = useState<any[]>([]);
  const [matchingBuyerPool, setMatchingBuyerPool] = useState<any>(null);
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [poolSearchDone, setPoolSearchDone] = useState(false);

  const crops = useAppStore((s) => s.crops);
  const selectedCrop = useAppStore((s) => s.selectedCrop);
  const setSelectedCrop = useAppStore((s) => s.setSelectedCrop);
  const sellQuantity = useAppStore((s) => s.sellQuantity);
  const setSellQuantity = useAppStore((s) => s.setSellQuantity);
  const language = useAppStore((s) => s.language);
  const userProfile = useAppStore((s) => s.userProfile);
  const t = useTranslation();
  const setActiveScreen = useAppStore((s) => s.setActiveScreen);

  useEffect(() => setIsMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const getCropName = (crop: Crop) => {
    if (language === "hi") return crop.nameHi;
    if (language === "pa") return crop.namePa;
    return crop.name;
  };

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
  }, [selectedCrop, userProfile?.uid]);

  const totalValue = selectedCrop ? sellQuantity * selectedCrop.currentPrice : 0;
  const poolBonus = matchingBuyerPool ? sellQuantity * (matchingBuyerPool.bonusPerQuintal || 150) : 0;

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

  const handleConfirmSale = async () => {
    if (!selectedCrop) return;
    const chosenPool = matchingBuyerPools.find((p) => p.id === selectedPoolId);
    const farmerId = userProfile?.uid || "demo-farmer-123";
    const farmerName = userProfile?.fullName || "Demo Farmer";
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (sellMethod === "pool" || sellMethod === "direct") {
        if (chosenPool) {
          const remaining = chosenPool.targetQuantity - (chosenPool.filledQuantity || 0);
          const joinQty = Math.min(sellQuantity, remaining);
          const res = await fetch(`/api/pools/${chosenPool.id}/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ farmerId, farmerName, quantity: joinQty }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to join pool");
        } else {
            // Pool creation logic...
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

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0, scale: 0.98 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 30 : -30, opacity: 0, scale: 0.98 }),
  };

  if (!isMounted) return null;

  const currentStepIndex = stepOrder.indexOf(step);
  const totalSteps = sellMethod === "pool" ? 5 : 4;
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;
  const chosenPoolForConfirm = matchingBuyerPools.find((p) => p.id === selectedPoolId);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden relative selection:bg-emerald-200">
      
      {/* ── IMMERSIVE GLASS BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={cn(
          "absolute inset-0 transition-all duration-700",
          isDark 
            ? "bg-[#020c04]" 
            : "bg-gradient-to-br from-emerald-50 via-white to-blue-50"
        )} />
        {isDark && (
          <>
            <Image src="/images/farmers_bg.jpg" alt="" fill priority className="object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020c04]/95 via-transparent to-[#020c04]" />
          </>
        )}
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* ── HIGH-GLOSS HEADER ── */}
      <header className="sticky top-0 z-50 transition-all duration-300">
        <div className="bg-white/40 dark:bg-[#020c04]/60 backdrop-blur-2xl border-b border-white/60 dark:border-white/10 shadow-sm">
          <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBack}
                className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-md border border-white dark:border-white/20 flex items-center justify-center shadow-glass-sm"
              >
                <ArrowLeft className="w-5 h-5 text-slate-900 dark:text-white" strokeWidth={2.5} />
              </motion.button>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  {t.sell} <Sparkles size={16} className="text-emerald-500" />
                </h1>
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">
                  Step {currentStepIndex + 1} of {totalSteps}
                </p>
              </div>
            </div>

            {selectedCrop && step !== "select-crop" && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/40">
                <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase">{getCropName(selectedCrop)}</span>
              </div>
            )}
          </div>

          {/* Liquid Progress Bar */}
          <div className="w-full h-[3px] bg-slate-200 dark:bg-white/5 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-blue-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: "circOut", duration: 0.8 }}
            />
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="relative z-10 flex-1 w-full max-w-2xl mx-auto pt-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full p-4 sm:p-6 pb-40"
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

      {/* ── FLOATING GLASS NAVIGATION DOCK ── */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] p-6 pb-8">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative rounded-[2rem] p-4 backdrop-blur-3xl border-[1.5px] border-white/80 dark:border-white/10 bg-white/40 dark:bg-black/20 shadow-2xl overflow-hidden"
            style={{ boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.8), 0 20px 50px rgba(0,0,0,0.1)' }}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />

            <button
              onClick={handleNext}
              disabled={
                isSubmitting ||
                (step === "select-crop"    && !selectedCrop)          ||
                (step === "enter-quantity" && sellQuantity <= 0)       ||
                (step === "choose-method"  && !sellMethod)             ||
                (step === "select-pool"    && matchingBuyerPools.length > 0 && !selectedPoolId)
              }
              className={cn(
                "relative w-full h-16 rounded-[1.5rem] text-xl font-black transition-all duration-500",
                "flex items-center justify-center gap-3 overflow-hidden group",
                "bg-emerald-600 dark:bg-emerald-500 text-white",
                "shadow-[0_10px_30px_rgba(16,185,129,0.4)] disabled:opacity-20 disabled:grayscale"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="tracking-tight">SECURELY PROCESSING...</span>
                </>
              ) : (
                <>
                  <span className="tracking-tight italic uppercase">
                    {step === "confirm" ? "Finalize Sale" : "Continue"}
                  </span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}