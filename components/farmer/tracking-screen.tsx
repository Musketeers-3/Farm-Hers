"use client"

import { useAppStore, useTranslation } from "@/lib/store"
import { ArrowLeft, Truck, CheckCircle2, Shield, Package, MapPin, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const trackingSteps = [
  {
    id: "confirmed",
    icon: Package,
    title: "Order Confirmed",
    titleHi: "ऑर्डर कन्फर्म",
    titlePa: "ਆਰਡਰ ਕਨਫਰਮ",
    desc: "Your sale has been confirmed",
    time: "Today, 10:30 AM",
    completed: true,
  },
  {
    id: "pickup",
    icon: Truck,
    title: "Pickup Scheduled",
    titleHi: "पिकअप शेड्यूल",
    titlePa: "ਪਿਕਅੱਪ ਸ਼ੈਡਿਊਲ",
    desc: "Truck will arrive tomorrow",
    time: "Tomorrow, 8:00 AM",
    completed: true,
  },
  {
    id: "transit",
    icon: MapPin,
    title: "In Transit",
    titleHi: "रास्ते में",
    titlePa: "ਰਸਤੇ ਵਿੱਚ",
    desc: "Your crop is on the way to buyer",
    time: "Estimated: 2 hours",
    completed: false,
    current: true,
  },
  {
    id: "verified",
    icon: CheckCircle2,
    title: "Quality Verified",
    titleHi: "गुणवत्ता सत्यापित",
    titlePa: "ਗੁਣਵੱਤਾ ਪ੍ਰਮਾਣਿਤ",
    desc: "Buyer inspects and confirms quality",
    time: "Pending",
    completed: false,
  },
  {
    id: "payment",
    icon: Shield,
    title: "Payment Released",
    titleHi: "भुगतान जारी",
    titlePa: "ਭੁਗਤਾਨ ਜਾਰੀ",
    desc: "Money transferred to your account",
    time: "Pending",
    completed: false,
  },
]

export function TrackingScreen() {
  const router = useRouter()
  const language = useAppStore((state) => state.language)
  const t = useTranslation()

  const getTitle = (step: typeof trackingSteps[0]) => {
    if (language === "hi") return step.titleHi
    if (language === "pa") return step.titlePa
    return step.title
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/farmer")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t.tracking}</h1>
            <p className="text-sm text-muted-foreground">Order #AGR-2026-0412</p>
          </div>
        </div>
      </header>

      {/* Order Summary Card */}
      <div className="p-4">
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Wheat - 50 Quintals</h3>
              <p className="text-sm text-muted-foreground">Sold via Pool</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">1,21,250</p>
              <p className="text-xs text-agri-success">+7,500 bonus</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Estimated completion: Tomorrow, 6:00 PM</span>
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="px-4 py-6">
        <div className="space-y-0">
          {trackingSteps.map((step, index) => (
            <div key={step.id} className="flex gap-4">
              {/* Timeline line and icon */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center z-10",
                    step.completed
                      ? "bg-agri-success text-white"
                      : step.current
                      ? "bg-primary text-white animate-pulse"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                {index < trackingSteps.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 h-20 -mt-1",
                      step.completed ? "bg-agri-success" : "bg-border"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div
                  className={cn(
                    "p-4 rounded-xl transition-all",
                    step.current
                      ? "bg-primary/5 border border-primary/20"
                      : step.completed
                      ? "bg-agri-success/5"
                      : "bg-muted/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h4
                      className={cn(
                        "font-semibold",
                        step.completed || step.current
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {getTitle(step)}
                    </h4>
                    {step.completed && (
                      <CheckCircle2 className="w-5 h-5 text-agri-success" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                  <p
                    className={cn(
                      "text-xs mt-2",
                      step.current ? "text-primary font-medium" : "text-muted-foreground"
                    )}
                  >
                    {step.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="px-4 pb-8">
        <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">Escrow Protected</h4>
            <p className="text-sm text-muted-foreground">
              Your payment is safely held until delivery is confirmed
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
