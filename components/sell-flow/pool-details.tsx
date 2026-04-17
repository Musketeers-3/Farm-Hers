import { motion } from "framer-motion";
import { Users, TrendingUp } from "lucide-react";

export function PoolDetails({ pool, crop, quantity, getCropName, t }: any) {
  const isNew = !pool;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground tracking-tight">{isNew ? "Creating New Pool" : "Pool Insights"}</h2>
      <div className="bg-secondary/20 dark:bg-[#1a2e1e]/80 border border-border/40 dark:border-emerald-700/25 rounded-[2.5rem] p-8 relative overflow-hidden">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{isNew ? `${getCropName(crop)} Pool` : "Community Pool"}</h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              {isNew ? "First Member" : `${pool.members?.length || 1} local farmers`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 dark:bg-[#0e1f12]/70 rounded-2xl p-4 border border-white/10 dark:border-emerald-700/20">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Your Share</p>
            <p className="text-xl font-black">{quantity}q</p>
          </div>
          <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Bonus</p>
            <p className="text-xl font-black text-primary">+₹150/q</p>
          </div>
        </div>
      </div>
    </div>
  );
}