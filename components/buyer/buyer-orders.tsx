"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Truck,
  PackageCheck,
  MapPin,
  ChevronDown,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockOrders = [
  {
    id: "ORD001",
    crop: "Premium Wheat",
    qty: 200,
    status: "Delivered",
    date: "28 Mar 2026",
    amount: "₹4.70L",
    step: 4,
  },
  {
    id: "ORD002",
    crop: "Basmati Rice",
    qty: 150,
    status: "In Transit",
    date: "10 Apr 2026",
    amount: "₹5.70L",
    step: 3,
  },
  {
    id: "ORD003",
    crop: "Yellow Mustard",
    qty: 100,
    status: "Processing",
    date: "12 Apr 2026",
    amount: "₹5.20L",
    step: 1,
  },
];

const trackingSteps = [
  { label: "Contract Signed", desc: "Escrow funded securely" },
  { label: "Processing", desc: "Farmer preparing dispatch" },
  { label: "In Transit", desc: "Logistics partner assigned" },
  { label: "Quality Verified", desc: "Cleared at weighing bridge" },
];

export function BuyerOrders() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Delivered":
        return {
          bg: "bg-agri-success/10",
          text: "text-agri-success",
          border: "border-l-agri-success",
          icon: PackageCheck,
        };
      case "In Transit":
        return {
          bg: "bg-primary/10",
          text: "text-primary",
          border: "border-l-primary",
          icon: Truck,
        };
      default:
        return {
          bg: "bg-agri-gold/10",
          text: "text-agri-earth",
          border: "border-l-agri-gold",
          icon: CheckCircle2,
        };
    }
  };

  return (
    <div className="space-y-4">
      {mockOrders.map((order) => {
        const style = getStatusStyle(order.status);
        const isExpanded = expandedId === order.id;
        const Icon = style.icon;

        return (
          <motion.div
            layout
            key={order.id}
            className={`glass-card rounded-2xl overflow-hidden border-l-4 ${style.border} premium-shadow`}
          >
            {/* Summary Row */}
            <div
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-secondary/20 transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-6 h-6 ${style.text}`} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base sm:text-lg">
                    {order.crop}
                  </h3>
                  <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">
                    {order.id} • {order.qty}q
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="text-lg font-serif font-bold text-foreground">
                  {order.amount}
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${style.bg} ${style.text} border-0 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5`}
                  >
                    {order.status}
                  </Badge>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Expanded Tracking Timeline */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-secondary/30 border-t border-border/50"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                        Live Tracking
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5" /> Invoice
                      </Button>
                    </div>

                    <div className="relative pl-6 space-y-6">
                      {/* Vertical Line */}
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border rounded-full" />

                      {trackingSteps.map((step, index) => {
                        const isCompleted = index < order.step;
                        const isCurrent = index === order.step - 1;

                        return (
                          <div
                            key={index}
                            className="relative flex items-start gap-4"
                          >
                            {/* Node */}
                            <div
                              className={`absolute -left-[30px] w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center transition-colors
                              ${isCompleted ? "border-primary" : "border-border"}
                              ${isCurrent ? "shadow-[0_0_10px_rgba(30,77,43,0.5)] bg-primary border-primary" : ""}
                            `}
                            >
                              {isCompleted && !isCurrent && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>

                            <div>
                              <p
                                className={`text-sm font-bold ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {step.label}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
