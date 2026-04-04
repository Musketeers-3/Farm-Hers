"use client"

import { useState } from "react"
import { Search, Grid, List, Plus, SlidersHorizontal, Sparkles } from "lucide-react"
import { ProductCard } from "./product-card"
import { mockProducts, categories } from "@/lib/skincare-data"
import { cn } from "@/lib/utils"

export function ShelfPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "score" | "brand">("score")

  const filteredProducts = mockProducts
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.safetyScore - a.safetyScore
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return a.brand.localeCompare(b.brand)
    })

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown-dark">Your Shelf</h1>
          <p className="text-taupe text-sm mt-1">{mockProducts.length} products in your collection</p>
        </div>
        <button className="btn-primary w-10 h-10 rounded-full flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-taupe/50" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-warm text-brown-dark placeholder:text-taupe/50 focus:outline-none focus:ring-2 focus:ring-rose/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl glass-warm text-taupe hover:text-rose-dark transition-all">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Sort</span>
          </button>
          <div className="flex items-center gap-1 p-1.5 rounded-2xl glass-warm">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                viewMode === "grid" ? "bg-rose/20 text-rose-dark" : "text-taupe hover:text-rose-dark"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                viewMode === "list" ? "bg-rose/20 text-rose-dark" : "text-taupe hover:text-rose-dark"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={cn(
              "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
              selectedCategory === cat.name
                ? "bg-gradient-to-r from-rose to-coral text-white shadow-md"
                : "glass-warm text-taupe hover:text-rose-dark"
            )}
          >
            {cat.name}
            <span className="ml-1.5 text-xs opacity-70">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full glass-warm flex items-center justify-center">
            <Search className="w-8 h-8 text-taupe/40" />
          </div>
          <h3 className="text-lg font-serif font-semibold text-brown-dark mb-2">No products found</h3>
          <p className="text-taupe">Try adjusting your search or filters</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="detailed" />
          ))}
        </div>
      )}
    </div>
  )
}
