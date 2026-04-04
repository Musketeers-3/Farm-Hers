import { Shield, AlertTriangle, XCircle } from "lucide-react";
import type { SafetyStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface SafetyBadgeProps {
  status: SafetyStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const config = {
  safe: { label: "Safe", icon: Shield, bg: "bg-safe/15", text: "text-safe-foreground", border: "border-safe/25", glow: "safety-glow-safe" },
  caution: { label: "Caution", icon: AlertTriangle, bg: "bg-caution/15", text: "text-caution-foreground", border: "border-caution/25", glow: "safety-glow-caution" },
  conflict: { label: "Conflict", icon: XCircle, bg: "bg-conflict/15", text: "text-conflict-foreground", border: "border-conflict/25", glow: "safety-glow-conflict" },
};

const sizes = {
  sm: "px-2.5 py-0.5 text-[10px] gap-1",
  md: "px-3 py-1 text-xs gap-1.5",
  lg: "px-4 py-1.5 text-sm gap-2",
};

const iconSizes = { sm: 11, md: 13, lg: 15 };

export function SafetyBadge({ status, size = "md", showLabel = true }: SafetyBadgeProps) {
  const c = config[status];
  const Icon = c.icon;

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border font-medium tracking-wide",
      c.bg, c.text, c.border, sizes[size],
      status === "safe" && "animate-breathe",
      status === "caution" && "animate-pulse-warning",
    )}>
      <Icon size={iconSizes[size]} />
      {showLabel && c.label}
    </span>
  );
}
