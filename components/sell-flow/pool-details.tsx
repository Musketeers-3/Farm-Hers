import { motion } from "framer-motion";
import { Users, TrendingUp } from "lucide-react";
import { type Crop } from "@/lib/store";

interface PoolDetailsProps {
  pool: any;
  crop: Crop;
  quantity: number;
  getCropName: (crop: Crop) => string;
  t: any;
}

export function PoolDetails({
  pool,
  crop,
  quantity,
  getCropName,
  t,
}: PoolDetailsProps) {
  if (!pool) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Creating New Pool
        </h2>
        <div className="glass-card premium-shadow border border-border/50 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-agri-gold to-agri-earth flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {getCropName(crop)} Pool
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                You'll be the first member
              </p>
            </div>
          </div>
          <div className="bg-agri-success/10 border border-agri-success/20 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-foreground">
                Your Contribution
              </span>
              <span className="font-bold text-lg text-foreground">
                {quantity}q
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-agri-success flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> Default Bonus
              </span>
              <span className="font-bold text-lg text-agri-success">
                +₹150/q
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent =
    ((pool.filledQuantity || pool.totalQuantity || 0) / pool.targetQuantity) *
    100;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground tracking-tight">
        Pool Insights
      </h2>
      <div className="glass-card premium-shadow border border-border/50 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-agri-gold/20 blur-3xl rounded-full" />
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-agri-gold to-agri-earth flex items-center justify-center shadow-lg shadow-agri-gold/20">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {getCropName(crop)} Community Pool
            </h3>
            <p className="text-sm font-medium text-muted-foreground">
              {pool.members?.length || pool.contributors || 1} local farmers
              joined
            </p>
          </div>
        </div>
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between text-sm font-bold uppercase tracking-wider">
            <span className="text-muted-foreground">Volume Target</span>
            <span className="text-foreground">
              {pool.filledQuantity || pool.totalQuantity || 0}q /{" "}
              {pool.targetQuantity}q
            </span>
          </div>
          <div className="h-4 bg-secondary rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-agri-gold to-agri-wheat rounded-full"
            />
          </div>
        </div>
        <div className="mt-8 bg-agri-success/10 border border-agri-success/20 rounded-2xl p-4 relative z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-foreground">
              Your Share
            </span>
            <span className="font-bold text-lg text-foreground">
              {quantity}q
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-agri-success flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Expected Bonus
            </span>
            <span className="font-bold text-lg text-agri-success">
              +₹
              {(quantity * (pool.bonusPerQuintal || 150)).toLocaleString(
                "en-IN",
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
