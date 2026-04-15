"use client"

import { useState } from "react"
import { useAppStore, useTranslation } from "@/lib/store"
import { ArrowLeft, Truck, CheckCircle2, Shield, Package, Clock, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

// Syncs perfectly with your Zustand Store OrderStatus
type OrderStatus = "pending" | "in-transit" | "quality-verified" | "payment-released";

const trackingSteps = [
  {
    id: "pending",
    icon: Package,
    title: "Order Confirmed",
    titleHi: "ऑर्डर कन्फर्म",
    titlePa: "ਆਰਡਰ ਕਨਫਰਮ",
    desc: "Your sale has been confirmed. Awaiting pickup.",
    time: "Today, 10:30 AM",
  },
  {
    id: "in-transit",
    icon: Truck,
    title: "In Transit",
    titleHi: "रास्ते में",
    titlePa: "ਰਸਤੇ ਵਿੱਚ",
    desc: "Your crop is on the way to the buyer.",
    time: "Estimated: 2 hours",
  },
  {
    id: "quality-verified",
    icon: CheckCircle2,
    title: "Quality Verified",
    titleHi: "गुणवत्ता सत्यापित",
    titlePa: "ਗੁਣਵੱਤਾ ਪ੍ਰਮਾਣਿਤ",
    desc: "Buyer inspects and confirms quality.",
    time: "Pending",
  },
  {
    id: "payment-released",
    icon: Shield,
    title: "Payment Released",
    titleHi: "भुगतान जारी",
    titlePa: "ਭੁਗਤਾਨ ਜਾਰੀ",
    desc: "Escrow funds transferred to your account.",
    time: "Pending",
  },
]

export function TrackingScreen() {
  const router = useRouter()
  const language = useAppStore((state) => state.language)
  const t = useTranslation()

  // Dynamic State Engine
  const [status, setStatus] = useState<OrderStatus>("pending")
  const currentIndex = trackingSteps.findIndex((step) => step.id === status)

  // Language Mapper
  const getTitle = (step: typeof trackingSteps[0]) => {
    if (language === "hi") return step.titleHi
    if (language === "pa") return step.titlePa
    return step.title
  }

  // 🚀 DEV MODE SIMULATOR: Cycles through the statuses for your demo
  const simulateNextStep = () => {
    if (currentIndex < trackingSteps.length - 1) {
      setStatus(trackingSteps[currentIndex + 1].id as OrderStatus)
    } else {
      setStatus("pending") // Reset for loop
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
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
            <h1 className="text-xl font-semibold text-foreground">{t.tracking || "Tracking"}</h1>
            <p className="text-sm text-muted-foreground">Order #AGR-2026-0412</p>
          </div>
        </div>
      </header>

      {/* Order Summary Card */}
      <div className="p-4">
        <div className="bg-white/40 backdrop-blur-2xl border border-white/50 shadow-xl rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Wheat - 50 Quintals</h3>
              <p className="text-sm text-muted-foreground">Sold via FarmHers Pool</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">₹1,21,250</p>
              <p className="text-xs text-[#1e4d2b] font-semibold">+₹7,500 bonus</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/50 p-2.5 rounded-lg">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-medium">Estimated completion: Tomorrow, 6:00 PM</span>
          </div>
        </div>
      </div>

      {/* Framer Motion Tracking Timeline */}
      <div className="px-6 py-4">
        <div className="relative">
          {trackingSteps.map((step, index) => {
            const isCompleted = index < currentIndex
            const isActive = index === currentIndex
            const isPending = index > currentIndex

            return (
              <div key={step.id} className="relative flex gap-5 pb-8 last:pb-0">
                {/* Connecting Line (Only draw if not the last item) */}
                {index !== trackingSteps.length - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-border rounded-full">
                    <motion.div
                      className="absolute top-0 w-full bg-primary rounded-full"
                      initial={{ height: "0%" }}
                      animate={{ height: isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                )}

                {/* Animated Icon Indicator */}
                <div className="relative z-10 flex-shrink-0">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isCompleted || isActive ? "hsl(var(--primary))" : "hsl(var(--muted))",
                      color: isCompleted || isActive ? "#ffffff" : "hsl(var(--muted-foreground))",
                      scale: isActive ? 1.15 : 1,
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm relative"
                  >
                    <step.icon className="w-4 h-4" strokeWidth={isActive ? 3 : 2} />

                    {/* Pulsing ring for the active state */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        initial={{ opacity: 0.8, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.6 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                      />
                    )}
                  </motion.div>
                </div>

                {/* Text Content */}
                <div className={`pt-2 transition-opacity duration-300 ${isPending ? "opacity-40" : "opacity-100"}`}>
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold ${isActive ? "text-primary" : "text-foreground"}`}>
                      {getTitle(step)}
                    </h4>
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-[#1e4d2b]" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                  <p className={cn("text-xs mt-1.5", isActive ? "text-primary font-bold" : "text-muted-foreground font-medium")}>
                    {step.time}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Help Section & Escrow Trust Badge */}
      <div className="px-4 pb-4">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-foreground">Escrow Protected</h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              Your payment is securely held in an RBI-compliant nodal account until delivery is confirmed.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Simulator Button */}
      <div className="px-4 mt-2">
        <button
          onClick={simulateNextStep}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          <span>Simulate Logistics Update</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}