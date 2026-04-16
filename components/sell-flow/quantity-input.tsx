import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { type Crop } from "@/lib/store";
import { cropImages } from "./constants";

interface QuantityInputProps {
  crop: Crop;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  getCropName: (crop: Crop) => string;
  t: any;
}

export function QuantityInput({
  crop,
  quantity,
  onQuantityChange,
  getCropName,
  t,
}: QuantityInputProps) {
  const totalValue = quantity * crop.currentPrice;
  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="inline-flex items-center gap-3 bg-secondary/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50">
        <Image
          src={cropImages[crop.id] || cropImages.wheat}
          alt={crop.name}
          width={24}
          height={24}
          priority
          className="rounded-full object-cover w-6 h-6"
        />
        <span className="text-sm font-semibold text-foreground">
          {getCropName(crop)}
        </span>
        <span className="text-muted-foreground">|</span>
        <span className="text-sm font-medium text-muted-foreground">
          ₹{crop.currentPrice}/q
        </span>
      </div>
      <div className="flex flex-col items-center w-full mt-4">
        <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
          Enter Quantity
        </label>
        <input
          type="number"
          value={quantity || ""}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          autoFocus
          className="w-2/3 bg-transparent text-6xl sm:text-8xl font-mono font-medium text-center text-foreground placeholder:text-muted-foreground/30 outline-none p-0 focus:ring-0"
          placeholder="0"
        />
        <span className="text-xl font-bold text-primary mt-2">
          {t.quintals || "Quintals"}
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {[10, 25, 50, 100].map((q) => (
          <button
            key={q}
            onClick={() => onQuantityChange(q)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-all duration-200",
              quantity === q
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary",
            )}
          >
            +{q}q
          </button>
        ))}
      </div>
      <AnimatePresence>
        {quantity > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full glass-card premium-shadow rounded-3xl p-5 sm:p-6 mt-4 border border-border/50"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Estimated Value
              </span>
              <span className="text-[10px] bg-agri-success/15 text-agri-success px-2 py-1 rounded-md font-bold uppercase">
                Live Rate
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-3xl text-foreground font-light mr-1">
                ₹
              </span>
              <span className="text-5xl font-bold tracking-tighter text-foreground">
                {totalValue.toLocaleString("en-IN")}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
