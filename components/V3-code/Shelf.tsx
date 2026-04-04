import { products } from "@/data/mockData";
import { ProductCard } from "@/components/ProductCard";
import { AddProductModal } from "@/components/AddProductModal";
import { Search, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

const filters = ["All", "Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen"];

export default function Shelf() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "All" || p.category === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden md:rounded-b-3xl">
        <img
          src="https://images.unsplash.com/photo-1570194065650-d99fb4a38c5f?w=1200&h=600&fit=crop"
          alt=""
          className="w-full h-full object-cover animate-gentle-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 md:px-10 flex items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Your Collection</h1>
            <p className="text-xs text-muted-foreground mt-1">{products.length} products in your digital shelf</p>
          </div>
          <AddProductModal />
        </div>

        {/* Floating filter pills over hero bottom edge */}
        <div className="absolute -bottom-5 left-0 right-0 px-6 md:px-10 z-10">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 shadow-md",
                  activeFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "glass-strong text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 md:px-10 space-y-5 mt-10">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products or ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm h-11 text-sm"
          />
        </div>

        {/* Staggered Masonry Grid */}
        {filtered.length > 0 ? (
          <div className="columns-2 md:columns-3 gap-3.5 space-y-3.5">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="break-inside-avoid animate-slide-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <ProductCard
                  product={product}
                  variant={i % 3 === 0 ? "default" : "compact"}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-20 h-20 rounded-full bg-skin-pink/40 flex items-center justify-center">
              <Package size={30} className="text-primary/40" />
            </div>
            <h3 className="font-display font-semibold text-foreground text-lg">No products found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-[220px]">
              Start building your shelf by adding your first product
            </p>
            <AddProductModal />
          </div>
        )}
      </div>
    </div>
  );
}
