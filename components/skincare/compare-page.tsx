"use client"

import { useState } from "react"
import { Plus, X, Check, ArrowLeftRight, FlaskConical } from "lucide-react"
import { mockProducts } from "@/lib/skincare-data"
import { cn } from "@/lib/utils"
import { SafetyScoreRing } from "./safety-score-ring"
import type { Product } from "@/lib/skincare-data"

export function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState<(Product | null)[]>([
    mockProducts[0],
    mockProducts[1],
  ])
  const [showSelector, setShowSelector] = useState<number | null>(null)

  const addProduct = (index: number, product: Product) => {
    const newSelected = [...selectedProducts]
    newSelected[index] = product
    setSelectedProducts(newSelected)
    setShowSelector(null)
  }

  const removeProduct = (index: number) => {
    const newSelected = [...selectedProducts]
    newSelected[index] = null
    setSelectedProducts(newSelected)
  }

  const swapProducts = () => {
    setSelectedProducts([selectedProducts[1], selectedProducts[0]])
  }

  const getCommonIngredients = () => {
    if (!selectedProducts[0] || !selectedProducts[1]) return []
    return selectedProducts[0].ingredients.filter((ing) =>
      selectedProducts[1]?.ingredients.includes(ing)
    )
  }

  const getUniqueIngredients = (index: number) => {
    const product = selectedProducts[index]
    const other = selectedProducts[index === 0 ? 1 : 0]
    if (!product || !other) return product?.ingredients || []
    return product.ingredients.filter((ing) => !other.ingredients.includes(ing))
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <header>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown-dark">Compare Products</h1>
        <p className="text-taupe text-sm mt-1">Side-by-side ingredient analysis</p>
      </header>

      {/* Product Comparison Cards */}
      <div className="grid grid-cols-2 gap-4 relative">
        {/* Swap Button */}
        <button
          onClick={swapProducts}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-rose/20 flex items-center justify-center text-rose-dark hover:bg-rose/10 transition-all"
        >
          <ArrowLeftRight className="w-5 h-5" />
        </button>

        {selectedProducts.map((product, index) => (
          <div key={index} className="glass-card rounded-2xl p-4 md:p-6">
            {product ? (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-peach-light to-rose-light flex items-center justify-center">
                    <FlaskConical className="w-10 h-10 text-rose-dark/50" />
                  </div>
                  <button
                    onClick={() => removeProduct(index)}
                    className="p-1.5 rounded-lg text-taupe/50 hover:text-coral hover:bg-coral/10 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-serif font-semibold text-brown-dark mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-taupe mb-3">{product.brand}</p>
                <div className="flex items-center gap-3">
                  <SafetyScoreRing score={product.safetyScore} size="sm" />
                  <div className="text-sm">
                    <div className="text-brown-dark font-medium">{product.safetyScore}%</div>
                    <div className="text-taupe text-xs">Safety Score</div>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowSelector(index)}
                className="w-full h-full min-h-[180px] flex flex-col items-center justify-center text-taupe hover:text-rose-dark transition-all border-2 border-dashed border-rose/30 rounded-xl hover:border-rose/50 hover:bg-rose/5"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Select Product</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Product Selector Modal */}
      {showSelector !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-dark/30 backdrop-blur-sm">
          <div className="glass-warm-solid rounded-2xl p-6 w-full max-w-md max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-semibold text-brown-dark">Select Product</h3>
              <button
                onClick={() => setShowSelector(null)}
                className="p-2 rounded-lg text-taupe hover:text-brown-dark hover:bg-rose/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {mockProducts
                .filter((p) => !selectedProducts.includes(p))
                .map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addProduct(showSelector, product)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl glass-card text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-peach-light to-rose-light flex items-center justify-center">
                      <FlaskConical className="w-6 h-6 text-rose-dark/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-brown-dark truncate">{product.name}</h4>
                      <p className="text-sm text-taupe">{product.brand}</p>
                    </div>
                    <SafetyScoreRing score={product.safetyScore} size="sm" showLabel={false} />
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Ingredient Analysis */}
      {selectedProducts[0] && selectedProducts[1] && (
        <>
          {/* Common Ingredients */}
          <section className="glass-peach rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-brown-dark mb-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              Common Ingredients ({getCommonIngredients().length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {getCommonIngredients().map((ing) => (
                <span
                  key={ing}
                  className="badge-safe px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  {ing}
                </span>
              ))}
              {getCommonIngredients().length === 0 && (
                <p className="text-taupe text-sm">No common ingredients</p>
              )}
            </div>
          </section>

          {/* Unique Ingredients */}
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((index) => (
              <section key={index} className="glass-card rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-brown-dark mb-3">
                  Only in {selectedProducts[index]?.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getUniqueIngredients(index).map((ing) => (
                    <span
                      key={ing}
                      className="px-3 py-1.5 rounded-full text-sm bg-rose/20 text-rose-dark border border-rose/30 font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
