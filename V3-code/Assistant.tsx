import { SafetyBadge } from "@/components/SafetyBadge";
import { Bot, Send, Sparkles, Shield, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  from: "user" | "assistant";
}

const suggestions = [
  "Is retinol safe with AHA?",
  "Review my routine",
  "Best for dry skin?",
  "Vitamin C + Niacinamide?",
];

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hello Sarah! I'm your Skin Guardian 🧬 I've analyzed your routine — safety score is 65. I detected a conflict between your AHA toner and Vitamin C serum. Would you like me to suggest an adjustment?",
    from: "assistant",
  },
];

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text, from: "user" };
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: getResponse(text),
      from: "assistant",
    };
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className="min-h-screen pb-24 flex flex-col">
      {/* Header */}
      <div className="relative h-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-skin-peach/30 to-champagne" />
        <div className="relative px-6 pt-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-clay flex items-center justify-center shadow-lg">
            <Bot size={22} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">Skin Guardian</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">Molecular AI Assistant</p>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4 flex-1 flex flex-col">
        {/* Status Insight Card */}
        <div className="glass-strong rounded-2xl p-4 flex items-center justify-between -mt-4 relative z-10 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-caution/12 flex items-center justify-center">
              <AlertTriangle size={16} className="text-caution-foreground" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.12em]">Active Alert</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">1 conflict in routine</p>
            </div>
          </div>
          <SafetyBadge status="caution" size="sm" />
        </div>

        {/* Suggestion Pills */}
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-medium bg-champagne text-foreground hover:bg-skin-peach transition-colors duration-300 border border-border/20"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto py-2">
          {messages.map((msg, i) => (
            <div
              key={msg.id}
              className={cn(
                "max-w-[85%] animate-slide-up",
                msg.from === "user" ? "ml-auto" : "mr-auto"
              )}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={cn(
                "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.from === "user"
                  ? "bg-primary text-primary-foreground rounded-br-lg"
                  : "glass-strong rounded-bl-lg"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="sticky bottom-20 flex gap-2 pb-2">
          <Input
            placeholder="Ask about your skincare..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            className="rounded-2xl border-border/30 bg-card/70 backdrop-blur-sm h-12 flex-1 text-sm"
          />
          <button
            onClick={() => sendMessage(input)}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-clay flex items-center justify-center text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 shrink-0"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function getResponse(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("retinol") && lower.includes("aha"))
    return "⚠️ High Risk — Retinol and AHAs (glycolic acid) are Level 1 conflicts. Using them together can severely compromise your skin barrier. I recommend alternating: AHA on mornings, retinol at night. Your safety score would increase by ~20 points.";
  if (lower.includes("routine"))
    return "🔬 Routine Analysis: Your Cleanser → Toner step is safe ✅ but the Toner → Serum connection has a Level 1 conflict (Glycolic Acid × Vitamin C). I've auto-sorted your routine by viscosity (thin → thick). Swap your AHA toner for a hydrating toner on Vitamin C days to optimize safety.";
  if (lower.includes("vitamin c") && lower.includes("niacinamide"))
    return "📊 Updated research shows Vitamin C and Niacinamide can coexist! This is a Level 2 (efficacy) concern, not a contraindication. Apply Vitamin C first, wait 1-2 min, then Niacinamide. Your score impact: -5 points (minimal).";
  if (lower.includes("dry"))
    return "💧 For dry skin, your Hydra Boost Gel Cream (viscosity 3/5) is ideal. Layer: Hyaluronic Acid serum → Gel cream → Squalane emollient. Apply HA to damp skin for maximum absorption. Your current routine has 3 hydrators — well balanced!";
  return "🧬 Based on your molecular profile: safety score is 65/100. Your routine has 4 unique active salts with 1 direct conflict. Would you like me to suggest a conflict-free alternative, or show your full ingredient interaction map?";
}
