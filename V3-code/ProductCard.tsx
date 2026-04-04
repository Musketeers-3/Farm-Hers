import type { Product } from "@/data/mockData";
import { SafetyBadge } from "./SafetyBadge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "compact";
}

export function ProductCard({ product, className, onClick, variant = "default" }: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass rounded-2xl overflow-hidden hover-lift cursor-pointer group relative",
        className
      )}
    >
      <div className={cn("relative overflow-hidden", variant === "compact" ? "h-40" : "h-52 md:h-60")}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute top-3 right-3">
          <SafetyBadge status={product.safety} size="sm" showLabel={false} />
        </div>
        {/* Overlay text on image */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5">
          <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-[0.15em]">{product.brand}</p>
          <h3 className="font-display font-semibold text-foreground leading-snug text-sm mt-0.5">{product.name}</h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {product.ingredients.slice(0, 2).map((ing) => (
              <span
                key={ing.name}
                className="text-[8px] px-1.5 py-0.5 rounded-full bg-background/50 backdrop-blur-sm text-foreground font-medium"
              >
                {ing.name}
              </span>
            ))}
            {product.ingredients.length > 2 && (
              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-background/50 backdrop-blur-sm text-muted-foreground">
                +{product.ingredients.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
