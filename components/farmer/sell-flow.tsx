"use client"

import { useState } from "react"
import { useAppStore, useTranslation, type Crop } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, Package, Users, Gavel, Check, Wheat } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Crop images for selection
const cropImages: Record<string, string> = {
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop",
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop",
  corn: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&h=300&fit=crop",
  mustard: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82ber95?w=300&h=300&fit=crop",
  onion: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&h=300&fit=crop",
}

type SellStep = "select-crop" | "enter-quantity" | "choose-method" | "pool-details" | "confirm"

export function SellFlow() {
  const [step, setStep] = useState<SellStep>("select-crop")
  const [sellMethod, setSellMethod] = useState<"direct" | "pool" | "auction" | null>(null)
  
  const crops = useAppStore((state) => state.crops)
  const selectedCrop = useAppStore((state) => state.selectedCrop)
  const setSelectedCrop = useAppStore((state) => state.setSelectedCrop)
  const sellQuantity = useAppStore((state) => state.sellQuantity)
  const setSellQuantity = useAppStore((state) => state.setSellQuantity)
  const setActiveScreen = useAppStore((state) => state.setActiveScreen)
  const pools = useAppStore((state) => state.pools)
  const language = useAppStore((state) => state.language)
  const t = useTranslation()

  const getCropName = (crop: Crop) => {
    if (language === "hi") return crop.nameHi
    if (language === "pa") return crop.namePa
    return crop.name
  }

  const matchingPool = selectedCrop 
    ? pools.find(p => p.cropId === selectedCrop.id && p.status === "open")
    : null

  const totalValue = selectedCrop ? sellQuantity * selectedCrop.currentPrice : 0
  const poolBonus = matchingPool ? sellQuantity * matchingPool.bonusPerQuintal : 0

  const handleBack = () => {
    switch (step) {
      case "enter-quantity":
        setStep("select-crop")
        break
      case "choose-method":
        setStep("enter-quantity")
        break
      case "pool-details":
        setStep("choose-method")
        break
      case "confirm":
        setStep(sellMethod === "pool" ? "pool-details" : "choose-method")
        break
      default:
        setActiveScreen("home")
    }
  }

  const handleNext = () => {
    switch (step) {
      case "select-crop":
        if (selectedCrop) setStep("enter-quantity")
        break
      case "enter-quantity":
        if (sellQuantity > 0) setStep("choose-method")
        break
      case "choose-method":
        if (sellMethod === "pool") {
          setStep("pool-details")
        } else if (sellMethod === "auction") {
          setActiveScreen("auction")
        } else {
          setStep("confirm")
        }
        break
      case "pool-details":
        setStep("confirm")
        break
      case "confirm":
        // Complete transaction
        setActiveScreen("tracking")
        break
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t.sell}</h1>
            <p className="text-sm text-muted-foreground">
              {step === "select-crop" && "Select your crop"}
              {step === "enter-quantity" && "Enter quantity"}
              {step === "choose-method" && "Choose selling method"}
              {step === "pool-details" && "Join a pool"}
              {step === "confirm" && "Confirm details"}
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-1 mt-4">
          {["select-crop", "enter-quantity", "choose-method", "confirm"].map((s, i) => (
            <div
              key={s}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                ["select-crop", "enter-quantity", "choose-method", "pool-details", "confirm"].indexOf(step) >= i
                  ? "bg-primary"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 pb-24">
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
            onMethodSelect={setSellMethod}
            hasPool={!!matchingPool}
            poolBonus={matchingPool?.bonusPerQuintal || 0}
            t={t}
          />
        )}

        {step === "pool-details" && matchingPool && selectedCrop && (
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
          />
        )}
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50">
        <Button
          onClick={handleNext}
          disabled={
            (step === "select-crop" && !selectedCrop) ||
            (step === "enter-quantity" && sellQuantity <= 0) ||
            (step === "choose-method" && !sellMethod)
          }
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-agri-olive text-lg font-semibold"
        >
          {step === "confirm" ? "Confirm Sale" : "Continue"}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}

function CropSelection({
  crops,
  selectedCrop,
  onSelect,
  getCropName,
}: {
  crops: Crop[]
  selectedCrop: Crop | null
  onSelect: (crop: Crop) => void
  getCropName: (crop: Crop) => string
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {crops.map((crop) => (
        <button
          key={crop.id}
          onClick={() => onSelect(crop)}
          className={cn(
            "relative overflow-hidden rounded-2xl aspect-square",
            "hover:scale-[1.02] active:scale-[0.98] transition-all",
            selectedCrop?.id === crop.id && "ring-4 ring-primary"
          )}
        >
          <Image
            src={cropImages[crop.id] || cropImages.wheat}
            alt={crop.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          {selectedCrop?.id === crop.id && (
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-lg font-semibold text-white">{getCropName(crop)}</h3>
            <p className="text-sm text-white/80">
              {crop.currentPrice.toLocaleString("en-IN")}/{crop.unit}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}

function QuantityInput({
  crop,
  quantity,
  onQuantityChange,
  getCropName,
  t,
}: {
  crop: Crop
  quantity: number
  onQuantityChange: (qty: number) => void
  getCropName: (crop: Crop) => string
  t: ReturnType<typeof useTranslation>
}) {
  const totalValue = quantity * crop.currentPrice

  return (
    <div className="space-y-6">
      {/* Selected Crop Card */}
      <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden">
          <Image
            src={cropImages[crop.id] || cropImages.wheat}
            alt={crop.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{getCropName(crop)}</h3>
          <p className="text-sm text-muted-foreground">
            Current rate: {crop.currentPrice.toLocaleString("en-IN")}/{crop.unit}
          </p>
        </div>
      </div>

      {/* Quantity Input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">{t.quantity} ({t.quintals})</label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onQuantityChange(Math.max(0, quantity - 10))}
            className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl font-bold hover:bg-muted/80 transition-colors"
          >
            -
          </button>
          <Input
            type="number"
            value={quantity || ""}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            className="flex-1 h-14 text-center text-2xl font-bold rounded-xl"
            placeholder="0"
          />
          <button
            onClick={() => onQuantityChange(quantity + 10)}
            className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl font-bold hover:bg-muted/80 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Quick Select */}
      <div className="flex gap-2 flex-wrap">
        {[10, 25, 50, 100].map((q) => (
          <button
            key={q}
            onClick={() => onQuantityChange(q)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              quantity === q
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {q} {t.quintals}
          </button>
        ))}
      </div>

      {/* Value Calculation */}
      {quantity > 0 && (
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t.quantity}</span>
            <span className="font-semibold text-foreground">{quantity} {t.quintals}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Rate</span>
            <span className="font-semibold text-foreground">{crop.currentPrice.toLocaleString("en-IN")}/{crop.unit}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">{t.totalValue}</span>
            <span className="text-2xl font-bold text-primary">
              {totalValue.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function MethodSelection({
  sellMethod,
  onMethodSelect,
  hasPool,
  poolBonus,
  t,
}: {
  sellMethod: "direct" | "pool" | "auction" | null
  onMethodSelect: (method: "direct" | "pool" | "auction") => void
  hasPool: boolean
  poolBonus: number
  t: ReturnType<typeof useTranslation>
}) {
  const methods = [
    {
      id: "direct" as const,
      icon: Package,
      title: "Direct Sell",
      desc: "Sell immediately at current market rate",
      badge: null,
    },
    {
      id: "pool" as const,
      icon: Users,
      title: t.joinPool,
      desc: "Combine with neighbors for better rates",
      badge: hasPool ? `+${poolBonus}/q bonus` : null,
      highlight: hasPool,
    },
    {
      id: "auction" as const,
      icon: Gavel,
      title: t.startAuction,
      desc: "Let buyers compete for your produce",
      badge: "Premium",
    },
  ]

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Choose how you want to sell your crop</p>
      
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => onMethodSelect(method.id)}
          className={cn(
            "w-full p-5 rounded-2xl text-left transition-all",
            "border-2",
            sellMethod === method.id
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/30",
            method.highlight && sellMethod !== method.id && "border-agri-gold/50 bg-agri-gold/5"
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              sellMethod === method.id ? "bg-primary" : "bg-muted"
            )}>
              <method.icon className={cn(
                "w-6 h-6",
                sellMethod === method.id ? "text-primary-foreground" : "text-foreground"
              )} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{method.title}</h3>
                {method.badge && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    method.highlight
                      ? "bg-agri-gold/20 text-agri-earth"
                      : "bg-primary/10 text-primary"
                  )}>
                    {method.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{method.desc}</p>
            </div>
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center",
              sellMethod === method.id
                ? "border-primary bg-primary"
                : "border-muted-foreground"
            )}>
              {sellMethod === method.id && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

function PoolDetails({
  pool,
  crop,
  quantity,
  getCropName,
  t,
}: {
  pool: NonNullable<ReturnType<typeof useAppStore.getState>["pools"][0]>
  crop: Crop
  quantity: number
  getCropName: (crop: Crop) => string
  t: ReturnType<typeof useTranslation>
}) {
  const progressPercent = (pool.totalQuantity / pool.targetQuantity) * 100

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-agri-gold/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-agri-earth" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{getCropName(crop)} Pool</h3>
            <p className="text-sm text-muted-foreground">{pool.contributors} farmers joined</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pool Progress</span>
            <span className="font-semibold text-foreground">
              {pool.totalQuantity}q / {pool.targetQuantity}q
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-agri-gold to-agri-wheat rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Your contribution */}
        <div className="bg-agri-success/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Your contribution</span>
            <span className="font-bold text-agri-olive">{quantity} {t.quintals}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-foreground">Pool bonus</span>
            <span className="font-bold text-agri-success">
              +{(quantity * pool.bonusPerQuintal).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground">How Pooling Works</h4>
        <div className="space-y-2">
          {[
            "Your crop is combined with other farmers",
            "Larger volume attracts enterprise buyers",
            "You get a bonus per quintal when pool fills",
            "Payment is released after buyer confirms"
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {i + 1}
              </div>
              <span className="text-sm text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ConfirmationScreen({
  crop,
  quantity,
  totalValue,
  poolBonus,
  method,
  getCropName,
  t,
}: {
  crop: Crop
  quantity: number
  totalValue: number
  poolBonus: number
  method: "direct" | "pool" | "auction" | null
  getCropName: (crop: Crop) => string
  t: ReturnType<typeof useTranslation>
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-agri-success/20 flex items-center justify-center mx-auto">
          <Wheat className="w-8 h-8 text-agri-success" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Confirm Your Sale</h2>
        <p className="text-muted-foreground">Review the details below</p>
      </div>

      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between py-2">
          <span className="text-muted-foreground">Crop</span>
          <span className="font-semibold text-foreground">{getCropName(crop)}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between py-2">
          <span className="text-muted-foreground">{t.quantity}</span>
          <span className="font-semibold text-foreground">{quantity} {t.quintals}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between py-2">
          <span className="text-muted-foreground">Rate</span>
          <span className="font-semibold text-foreground">
            {crop.currentPrice.toLocaleString("en-IN")}/{crop.unit}
          </span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between py-2">
          <span className="text-muted-foreground">Method</span>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            method === "pool" ? "bg-agri-gold/20 text-agri-earth" : "bg-primary/10 text-primary"
          )}>
            {method === "pool" ? "Pool" : method === "auction" ? "Auction" : "Direct"}
          </span>
        </div>
        {poolBonus > 0 && (
          <>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Pool Bonus</span>
              <span className="font-semibold text-agri-success">
                +{poolBonus.toLocaleString("en-IN")}
              </span>
            </div>
          </>
        )}
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between py-3">
          <span className="font-semibold text-foreground text-lg">{t.totalValue}</span>
          <span className="text-2xl font-bold text-primary">
            {(totalValue + poolBonus).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        By confirming, you agree to our terms of service. Payment will be held in escrow until delivery is verified.
      </p>
    </div>
  )
}
