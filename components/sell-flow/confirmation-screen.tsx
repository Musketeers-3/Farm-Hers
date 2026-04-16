import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Crop } from "@/lib/store";

interface ConfirmationScreenProps {
  crop: Crop;
  quantity: number;
  totalValue: number;
  poolBonus: number;
  method: "direct" | "pool" | "auction" | null;
  getCropName: (crop: Crop) => string;
  t: any;
  error: string | null;
}

export function ConfirmationScreen({
  crop,
  quantity,
  totalValue,
  poolBonus,
  method,
  getCropName,
  t,
  error,
}: ConfirmationScreenProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3 py-4">
        <div className="w-20 h-20 rounded-full bg-agri-success/20 flex items-center justify-center mx-auto">
          <Check className="w-10 h-10 text-agri-success" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Review & Confirm</h2>
      </div>
      <div className="glass-card premium-shadow border border-border/50 rounded-3xl p-6 space-y-5">
        <ReceiptRow label="Commodity" value={getCropName(crop)} />
        <ReceiptRow
          label="Quantity"
          value={`${quantity} ${t.quintals || "quintals"}`}
        />
        <ReceiptRow
          label="Base Rate"
          value={`₹${crop.currentPrice.toLocaleString("en-IN")}/${crop.unit}`}
        />
        <ReceiptRow
          label="Method"
          value={
            method === "pool"
              ? "Community Pool"
              : method === "auction"
                ? "Live Auction"
                : "Direct Sell"
          }
          highlight
        />
        {poolBonus > 0 && (
          <ReceiptRow
            label="Pool Bonus"
            value={`+₹${poolBonus.toLocaleString("en-IN")}`}
            success
          />
        )}
        <div className="h-px bg-border/80 my-4" />
        <div className="flex items-end justify-between pt-2">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Final Payout
          </span>
          <span className="text-4xl font-bold tracking-tighter text-primary">
            ₹{(totalValue + poolBonus).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 text-sm text-destructive font-medium text-center">
          ⚠️ {error}
        </div>
      )}
      <p className="text-xs text-center font-medium text-muted-foreground px-4">
        By tapping confirm, you agree to FarmHers' terms. Funds are secured in
        escrow until handover.
      </p>
    </div>
  );
}

function ReceiptRow({ label, value, highlight, success }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-bold text-right",
          highlight
            ? "text-primary bg-primary/10 px-2.5 py-1 rounded-md text-xs uppercase tracking-wider"
            : "text-foreground text-sm",
          success && "text-agri-success",
        )}
      >
        {value}
      </span>
    </div>
  );
}
