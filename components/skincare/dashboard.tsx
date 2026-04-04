"use client"

import { useState } from "react"
import Image from "next/image"
import { Sun, Moon, Sparkles, Droplets, FlaskConical, Heart, Zap, TrendingUp, ChevronRight, Plus, Star, Shield } from "lucide-react"
import { SafetyScoreRing } from "./safety-score-ring"
import { ProductCard } from "./product-card"
import { mockProducts, mockRoutines, trendingProducts, categories } from "@/lib/skincare-data"
import { cn } from "@/lib/utils"
import Link from "next/link"

const categoryIcons: Record<string, React.ElementType> = {
  Sparkles,
  Droplets,
  FlaskConical,
  Heart,
  Sun,
  Zap,
  Layers: Sparkles,
}

export function Dashboard() {
  const [activeTime, setActiveTime] = useState<"am" | "pm">("am")
  const currentRoutine = mockRoutines.find((r) => r.type === activeTime)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Section with Large Image */}
      <section className="relative rounded-3xl overflow-hidden h-[400px] md:h-[450px]">
        <Image
          src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&h=800&fit=crop"
          alt="Skincare model"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/90 via-cream/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10">
          <p className="text-taupe text-sm uppercase tracking-widest mb-2">Your Daily Skincare</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brown-dark mb-4 leading-tight">
            Protect Your<br />
            <span className="text-rose-dark">Beautiful Skin</span>
          </h1>
          <p className="text-taupe max-w-md mb-6 text-sm md:text-base">
            Discover the perfect routine for your skin type with our personalized recommendations.
          </p>
          <div className="flex gap-3">
            <Link 
              href="/routine"
              className="btn-primary px-6 py-3 rounded-full text-sm font-semibold"
            >
              Start Routine
            </Link>
            <Link 
              href="/shop"
              className="btn-secondary px-6 py-3 rounded-full text-sm font-semibold"
            >
              Explore Products
            </Link>
          </div>
        </div>

        {/* Floating Safety Score */}
        <div className="absolute top-6 right-6 glass-warm rounded-2xl p-4 flex items-center gap-3">
          <SafetyScoreRing score={87} size="md" />
          <div className="hidden md:block">
            <p className="text-xs text-taupe">Your Routine</p>
            <p className="font-semibold text-brown-dark">Safety Score</p>
          </div>
        </div>
      </section>

      {/* Categories - Circular Icons */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl font-bold text-brown-dark">Categories</h2>
          <Link href="/shelf" className="text-sm text-rose-dark hover:text-coral flex items-center gap-1 font-medium">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.icon] || Sparkles
            return (
              <Link
                key={cat.name}
                href={`/shelf?category=${cat.name}`}
                className="flex-shrink-0 flex flex-col items-center gap-2"
              >
                <div className="category-circle w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center">
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-rose-dark" />
                </div>
                <span className="text-xs md:text-sm text-taupe font-medium">{cat.name}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Today's Routine */}
      <section className="glass-warm rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-bold text-brown-dark">Today&apos;s Routine</h2>
          <div className="flex items-center gap-1 p-1 rounded-full bg-blush/50 border border-rose/20">
            <button
              onClick={() => setActiveTime("am")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                activeTime === "am"
                  ? "bg-white text-rose-dark shadow-sm"
                  : "text-taupe hover:text-rose-dark"
              )}
            >
              <Sun className="w-4 h-4" />
              Morning
            </button>
            <button
              onClick={() => setActiveTime("pm")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                activeTime === "pm"
                  ? "bg-white text-rose-dark shadow-sm"
                  : "text-taupe hover:text-rose-dark"
              )}
            >
              <Moon className="w-4 h-4" />
              Evening
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {currentRoutine?.products.map((product, index) => (
            <div key={product.id} className="flex-shrink-0 w-28 md:w-32">
              <div className="product-card rounded-2xl p-3 text-center">
                <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-peach-light to-rose-light mb-3">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FlaskConical className="w-8 h-8 text-rose-dark/60" />
                  </div>
                  <span className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-rose text-white flex items-center justify-center text-xs font-bold shadow-md">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm text-brown-dark font-medium truncate">{product.name}</p>
                <p className="text-xs text-taupe">{product.brand}</p>
              </div>
            </div>
          ))}
          <Link 
            href="/routine"
            className="flex-shrink-0 w-28 md:w-32 product-card rounded-2xl p-3 flex flex-col items-center justify-center text-taupe hover:text-rose-dark transition-all duration-200"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-dashed border-rose/30 flex items-center justify-center mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">Add Step</span>
          </Link>
        </div>
      </section>

      {/* Trending Products */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl font-bold text-brown-dark">Trending Now</h2>
          <Link href="/shop" className="text-sm text-rose-dark hover:text-coral flex items-center gap-1 font-medium">
            See More <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {trendingProducts.map((product, index) => (
            <div
              key={index}
              className="trending-card rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-rose-dark" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-brown-dark truncate">{product.name}</h3>
                  <p className="text-sm text-taupe">{product.brand}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="text-sm font-bold text-brown-dark">{product.score}</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">
                      {product.trend}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl font-bold text-brown-dark">Your Products</h2>
          <Link href="/shelf" className="text-sm text-rose-dark hover:text-coral flex items-center gap-1 font-medium">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features Banner */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="glass-rose rounded-2xl p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-rose-dark" />
          </div>
          <h3 className="font-serif font-bold text-brown-dark mb-2">Ingredient Safety</h3>
          <p className="text-sm text-taupe">Check for conflicts and ensure product compatibility</p>
        </div>
        <div className="glass-peach rounded-2xl p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7 text-coral" />
          </div>
          <h3 className="font-serif font-bold text-brown-dark mb-2">Smart Routines</h3>
          <p className="text-sm text-taupe">Build personalized AM/PM routines for your skin</p>
        </div>
        <div className="glass-warm rounded-2xl p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-rose/20 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-7 h-7 text-rose-dark" />
          </div>
          <h3 className="font-serif font-bold text-brown-dark mb-2">Track Progress</h3>
          <p className="text-sm text-taupe">Monitor your skin journey with photo tracking</p>
        </div>
      </section>
    </div>
  )
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
