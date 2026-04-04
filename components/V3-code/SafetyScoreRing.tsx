import { useEffect, useState } from "react";
import type { SafetyStatus } from "@/data/mockData";

interface SafetyScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

function getStatus(score: number): SafetyStatus {
  if (score >= 75) return "safe";
  if (score >= 45) return "caution";
  return "conflict";
}

const statusColors = {
  safe: "hsl(145, 30%, 62%)",
  caution: "hsl(38, 65%, 68%)",
  conflict: "hsl(0, 50%, 65%)",
};

const statusGlow = {
  safe: "hsl(145, 30%, 62%)",
  caution: "hsl(38, 65%, 68%)",
  conflict: "hsl(0, 50%, 65%)",
};

export function SafetyScoreRing({ score, size = 130, strokeWidth = 8 }: SafetyScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const status = getStatus(score);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={statusColors[status]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-[1.5s] ease-out"
          style={{ filter: `drop-shadow(0 0 12px ${statusGlow[status]}50)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold font-display text-foreground tracking-tight">{Math.round(animatedScore)}</span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.15em]">Safety</span>
      </div>
    </div>
  );
}
