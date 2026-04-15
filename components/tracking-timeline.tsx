"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Truck,
  ShieldCheck,
  IndianRupee,
  ChevronRight,
} from "lucide-react";

// Syncing with your lib/store.ts type
export type OrderStatus =
  | "pending"
  | "in-transit"
  | "quality-verified"
  | "payment-released";

interface TrackingProps {
  initialStatus?: OrderStatus;
  orderId?: string;
}

const TRACKING_STEPS = [
  {
    id: "pending",
    title: "Order Confirmed",
    desc: "Awaiting logistics pickup from the farm.",
    icon: CheckCircle2,
  },
  {
    id: "in-transit",
    title: "In Transit",
    desc: "Crop is on the way to the buyer's facility.",
    icon: Truck,
  },
  {
    id: "quality-verified",
    title: "Quality Verified",
    desc: "Grade checks passed at destination.",
    icon: ShieldCheck,
  },
  {
    id: "payment-released",
    title: "Payment Released",
    desc: "Funds successfully transferred to your account.",
    icon: IndianRupee,
  },
];

export function TrackingTimeline({
  initialStatus = "pending",
  orderId = "ORD-8829",
}: TrackingProps) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);

  // Helper to find numerical index of the current status
  const currentIndex = TRACKING_STEPS.findIndex((step) => step.id === status);

  // 🚀 DEV MODE SIMULATOR: Cycles through the statuses for your demo
  const simulateNextStep = () => {
    if (currentIndex < TRACKING_STEPS.length - 1) {
      setStatus(TRACKING_STEPS[currentIndex + 1].id as OrderStatus);
    } else {
      setStatus("pending"); // Reset for loop
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-[#1a2419]">Track Order</h2>
          <p className="text-sm text-[#1a2419]/60 font-medium">#{orderId}</p>
        </div>
        <div className="px-3 py-1 bg-[#1e4d2b]/10 rounded-full border border-[#1e4d2b]/20 text-[#1e4d2b] text-xs font-bold uppercase tracking-wider">
          Live
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {TRACKING_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={step.id} className="relative flex gap-5 pb-8 last:pb-0">
              {/* Connecting Line (Only draw if not the last item) */}
              {index !== TRACKING_STEPS.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-gray-200 rounded-full">
                  <motion.div
                    className="absolute top-0 w-full bg-[#1e4d2b] rounded-full"
                    initial={{ height: "0%" }}
                    animate={{ height: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              )}

              {/* Icon Indicator */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor:
                      isCompleted || isActive ? "#1e4d2b" : "#e5e7eb",
                    borderColor: isActive ? "#bbf7d0" : "transparent",
                    scale: isActive ? 1.1 : 1,
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                    isCompleted || isActive
                      ? "text-white shadow-lg"
                      : "text-gray-400"
                  }`}
                >
                  <step.icon
                    className="w-4 h-4"
                    strokeWidth={isActive ? 3 : 2}
                  />

                  {/* Pulsing ring for the active state */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#1e4d2b]"
                      initial={{ opacity: 0.8, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.5 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </motion.div>
              </div>

              {/* Text Content */}
              <div
                className={`pt-2 transition-opacity duration-300 ${isPending ? "opacity-40" : "opacity-100"}`}
              >
                <h3
                  className={`text-base font-bold ${isActive ? "text-[#1e4d2b]" : "text-[#1a2419]"}`}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-[#1a2419]/70 mt-1 leading-snug">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Demo Simulator Button (Remove or hide before final deployment!) */}
      <div className="mt-8 pt-6 border-t border-black/5">
        <button
          onClick={simulateNextStep}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-[#1a2419] rounded-xl text-sm font-bold transition-colors"
        >
          <span>Simulate Next Stage</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
