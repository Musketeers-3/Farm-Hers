// components/farmer/sell-flow/index.tsx
"use client";
import { useState, useEffect } from "react";
import { useAppStore, useTranslation, type Crop } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CropSelection } from "./crop-selection";
import { QuantityInput } from "./quantity-input";
import { MethodSelection } from "./method-selection";
import { SelectPool } from "./select-pool";
import { ConfirmationScreen } from "./confirmation-screen";
import { type SellStep, stepOrder } from "./constants";

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

  const getCropName = (crop: Crop) => {
    if (language === "hi") return crop.nameHi;
    if (language === "pa") return crop.namePa;
    return crop.name;
  };

  useEffect(() => {
    if (!selectedCrop) return;
    console.log("🌾 Fetching pools for crop:", selectedCrop.id);
    setPoolSearchDone(false);
    fetch(`/api/pools?status=open`)
      .then((r) => r.json())
      .then((data) => {
        console.log(
          "📦 ALL pools:",
          data.pools?.map((p: any) => ({
            id: p.id,
            commodity: p.commodity,
            creatorRole: p.creatorRole,
            status: p.status,
          })),
        );

        const available = (data.pools || []).filter(
          (p: any) =>
            p.status === "open" &&
            p.commodity?.toLowerCase() === selectedCrop.id?.toLowerCase() &&
            p.creatorId !== (userProfile?.uid || "demo-farmer-123"),
        );

        console.log(
          "📦 Filtered buyer pools for",
          selectedCrop.id,
          ":",
          available,
        );
        setMatchingBuyerPools(available);
        setPoolSearchDone(true);
      })
      .catch(() => setPoolSearchDone(true));
  }, [selectedCrop]);

  const totalValue = selectedCrop
    ? sellQuantity * selectedCrop.currentPrice
    : 0;
  const poolBonus = matchingBuyerPool
    ? sellQuantity * (matchingBuyerPool.bonusPerQuintal || 150)
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
      case "select-pool":
        return changeStep("choose-method", -1);
      case "confirm":
        return changeStep(
          sellMethod === "pool" ? "select-pool" : "choose-method",
          -1,
        );
      default:
        router.push("/farmer");
    }
  };

  const handleConfirmSale = async () => {
    if (!selectedCrop) return;

    const chosenPool =
      matchingBuyerPools.find((p) => p.id === selectedPoolId) ||
      (sellMethod === "direct" ? matchingBuyerPool : null);

    const farmerId = userProfile?.uid || "demo-farmer-123";
    const farmerName = userProfile?.fullName || "Demo Farmer";

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (sellMethod === "pool" || sellMethod === "direct") {
        if (chosenPool) {
          const remaining =
            chosenPool.targetQuantity - (chosenPool.filledQuantity || 0);
          const joinQty = Math.min(sellQuantity, remaining);

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
                commodity: selectedCrop.id,
                targetQuantity: leftover * 3,
                requestedQuantity: leftover * 3,
                pricePerUnit: selectedCrop.currentPrice,
                creatorId: farmerId,
                creatorName: farmerName,
                creatorRole: "farmer",
                filledQuantity: leftover,
                members: [
                  {
                    farmerId,
                    farmerName,
                    quantity: leftover,
                    joinedAt: new Date().toISOString(),
                  },
                ],
                status: "open",
              }),
            });
          }
        } else {
          const res = await fetch("/api/pools", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              commodity: selectedCrop.id,
              targetQuantity: sellQuantity * 3,
              requestedQuantity: sellQuantity * 3,
              pricePerUnit: selectedCrop.currentPrice,
              creatorId: farmerId,
              creatorName: farmerName,
              creatorRole: "farmer",
              filledQuantity: sellQuantity,
              members: [
                {
                  farmerId,
                  farmerName,
                  quantity: sellQuantity,
                  joinedAt: new Date().toISOString(),
                },
              ],
              status: "open",
            }),
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
        if (sellMethod === "pool") changeStep("select-pool", 1);
        else if (sellMethod === "auction") router.push("/farmer/auction");
        else changeStep("confirm", 1);
        break;
      case "select-pool":
        if (selectedPoolId || matchingBuyerPools.length === 0)
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

  const chosenPoolForConfirm =
    matchingBuyerPools.find((p) => p.id === selectedPoolId) ||
    (sellMethod === "direct" ? matchingBuyerPool : null);

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
              {step.replace(/-/g, " ")}
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
                hasPool={!!matchingBuyerPool}
                poolBonus={
                  matchingBuyerPool?.pricePerUnit
                    ? matchingBuyerPool.pricePerUnit -
                      (selectedCrop?.currentPrice || 0) +
                      150
                    : 150
                }
                t={t}
              />
            )}
            {step === "select-pool" && selectedCrop && (
              <SelectPool
                pools={matchingBuyerPools}
                selectedPoolId={selectedPoolId}
                onSelect={setSelectedPoolId}
                crop={selectedCrop}
                quantity={sellQuantity}
                getCropName={getCropName}
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
                chosenPool={chosenPoolForConfirm}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
        <div className="h-12 w-full bg-gradient-to-t from-background to-transparent" />
        <div className="p-4 sm:p-6 bg-background/90 backdrop-blur-xl border-t border-border/50 pointer-events-auto">
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={handleNext}
              disabled={
                isSubmitting ||
                (step === "select-crop" && !selectedCrop) ||
                (step === "enter-quantity" && sellQuantity <= 0) ||
                (step === "choose-method" && !sellMethod) ||
                (step === "select-pool" &&
                  matchingBuyerPools.length > 0 &&
                  !selectedPoolId)
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
