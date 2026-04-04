"use client"

import { useState } from "react"
import { Search, Sparkles, Star, ExternalLink, Heart, ShoppingCart, FlaskConical } from "lucide-react"
import { cn } from "@/lib/utils"

const shopProducts = [
  {
    id: "1",
    name: "Advanced Snail Mucin",
    brand: "COSRX",
    price: "$25.00",
    rating: 4.8,
    reviews: 12500,
    compatibilityScore: 96,
    image: "/images/skincare/snail-mucin.jpg",
    tags: ["Hydrating", "Repair"],
  },
  {
    id: "2",
    name: "Peptide Complex Serum",
    brand: "The Inkey List",
    price: "$14.99",
    rating: 4.6,
    reviews: 8200,
    compatibilityScore: 91,
    image: "/images/skincare/peptide.jpg",
    tags: ["Anti-aging", "Firming"],
  },
  {
    id: "3",
    name: "Centella Asiatica Cream",
    brand: "SKIN1004",
    price: "$22.00",
    rating: 4.7,
    reviews: 6800,
    compatibilityScore: 94,
    image: "/images/skincare/centella.jpg",
    tags: ["Soothing", "Barrier"],
  },
  {
    id: "4",
    name: "Azelaic Acid Suspension",
    brand: "The Ordinary",
    price: "$9.80",
    rating: 4.5,
    reviews: 15300,
    compatibilityScore: 88,
    image: "/images/skincare/azelaic.jpg",
    tags: ["Brightening", "Acne"],
  },
  {
    id: "5",
    name: "Barrier Repair Cream",
    brand: "Krave Beauty",
    price: "$28.00",
    rating: 4.9,
    reviews: 4500,
    compatibilityScore: 97,
    image: "/images/skincare/barrier.jpg",
    tags: ["Moisturizing", "Repair"],
  },
  {
    id: "6",
    name: "Oil-Free Moisturizer",
    brand: "Paula's Choice",
    price: "$32.00",
    rating: 4.6,
    reviews: 7200,
    compatibilityScore: 93,
    image: "/images/skincare/oil-free.jpg",
    tags: ["Lightweight", "Hydrating"],
  },
]

export function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [savedProducts, setSavedProducts] = useState<string[]>([])

  const toggleSaved = (id: string) => {
    setSavedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const filteredProducts = shopProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <header>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown-dark">Shop</h1>
        <p className="text-taupe text-sm mt-1">AI-matched products for your routine</p>
      </header>

      {/* AI Match Banner */}
      <div className="glass-rose rounded-2xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose to-coral flex items-center justify-center flex-shrink-0 shadow-lg">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-serif font-semibold text-brown-dark">Personalized Recommendations</h3>
          <p className="text-sm text-taupe">
            Products are scored based on compatibility with your current routine
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-taupe/50" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-warm text-brown-dark placeholder:text-taupe/50 focus:outline-none focus:ring-2 focus:ring-rose/50 transition-all"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-card rounded-2xl p-4 group"
          >
            {/* Product Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-peach-light via-cream to-rose-light mb-4 flex items-center justify-center">
              <FlaskConical className="w-16 h-16 text-rose-dark/30 group-hover:scale-110 transition-transform duration-300" />
              
              {/* Compatibility Badge */}
              <div className="absolute top-3 left-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-rose/20 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-rose-dark" />
                  <span className="text-xs font-semibold text-brown-dark">{product.compatibilityScore}% Match</span>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={() => toggleSaved(product.id)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-rose/20 shadow-sm flex items-center justify-center transition-all hover:bg-white"
              >
                <Heart
                  className={cn(
                    "w-4 h-4 transition-all",
                    savedProducts.includes(product.id)
                      ? "fill-coral text-coral"
                      : "text-taupe"
                  )}
                />
              </button>
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium text-brown-dark leading-tight">{product.name}</h3>
                  <p className="text-sm text-taupe">{product.brand}</p>
                </div>
                <span className="text-lg font-bold text-rose-dark flex-shrink-0">{product.price}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="text-sm font-medium text-brown-dark">{product.rating}</span>
                </div>
                <span className="text-xs text-taupe">({product.reviews.toLocaleString()} reviews)</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-blush text-taupe"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button className="flex-1 btn-primary flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button className="w-10 h-10 rounded-xl glass-warm flex items-center justify-center text-taupe hover:text-rose-dark transition-all">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
