"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  TrendingUp,
  Package,
  Gavel,
  ShoppingCart,
  Bell,
  Building2,
  ChevronRight,
  Clock,
  Users,
  Flame,
  CheckCircle2,
  Star,
  BarChart3,
  Moon,
  Sun,
  IndianRupee,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { AgriLinkLogo } from "@/components/agrilink-logo"
import { useRouter } from "next/navigation"

interface FarmerPool {
  id: string
  crop: string
  quantity: number
  pricePerQuintal: number
  location: string
  farmersCount: number
  quality: "Premium" | "Standard" | "Economy"
  rating: number
  isHot: boolean
  expiresIn: string
}

interface LiveAuction {
  id: string
  crop: string
  quantity: number
  currentBid: number
  basePrice: number
  timeLeft: string
  participants: number
  farmer: string
}

export function BuyerDashboard() {
  const language = useAppStore((state) => state.language)
  const router = useRouter() 
  const setUserRole = useAppStore((state) => state.setUserRole)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("pools")
  const [isDark, setIsDark] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))

  const toggleDarkMode = () => {
    const html = document.documentElement
    if (isDark) { html.classList.remove('dark') } else { html.classList.add('dark') }
    setIsDark(!isDark)
  }

  const farmerPools: FarmerPool[] = [
    { id: "1", crop: "Wheat", quantity: 500, pricePerQuintal: 2350, location: "Ludhiana, Punjab", farmersCount: 24, quality: "Premium", rating: 4.8, isHot: true, expiresIn: "2h 30m" },
    { id: "2", crop: "Mustard", quantity: 320, pricePerQuintal: 5200, location: "Alwar, Rajasthan", farmersCount: 18, quality: "Standard", rating: 4.5, isHot: false, expiresIn: "5h 15m" },
    { id: "3", crop: "Rice (Basmati)", quantity: 750, pricePerQuintal: 3800, location: "Karnal, Haryana", farmersCount: 32, quality: "Premium", rating: 4.9, isHot: true, expiresIn: "1h 45m" },
    { id: "4", crop: "Corn", quantity: 420, pricePerQuintal: 1950, location: "Indore, MP", farmersCount: 15, quality: "Economy", rating: 4.2, isHot: false, expiresIn: "8h 00m" },
  ]

  const liveAuctions: LiveAuction[] = [
    { id: "1", crop: "Organic Wheat", quantity: 50, currentBid: 2650, basePrice: 2400, timeLeft: "12:45", participants: 8, farmer: "Gurpreet Singh" },
    { id: "2", crop: "Premium Basmati", quantity: 30, currentBid: 4200, basePrice: 3800, timeLeft: "08:22", participants: 12, farmer: "Ramesh Kumar" },
    { id: "3", crop: "Yellow Mustard", quantity: 25, currentBid: 5450, basePrice: 5100, timeLeft: "25:10", participants: 5, farmer: "Harjinder Kaur" },
  ]

  const orders = [
    { id: "ORD001", crop: "Wheat", qty: 200, status: "Delivered", date: "28 Mar 2024", amount: "₹4.70L" },
    { id: "ORD002", crop: "Basmati Rice", qty: 150, status: "In Transit", date: "30 Mar 2024", amount: "₹5.70L" },
    { id: "ORD003", crop: "Mustard", qty: 100, status: "Processing", date: "02 Apr 2024", amount: "₹5.20L" },
  ]

  const t = {
    en: { welcome: "Welcome back", companyName: "Punjab Agro Mills", search: "Search crops, locations...", farmerPools: "Pools", liveAuctions: "Auctions", myOrders: "Orders", analytics: "Analytics", buyNow: "Buy Now", joinBid: "Place Bid", hot: "Hot", expiresIn: "Expires in", currentBid: "Current Bid", participants: "bidders", basePrice: "Base", totalValue: "Total Value", switchToFarmer: "Farmer View", farmers: "farmers" },
    hi: { welcome: "वापसी पर स्वागत है", companyName: "पंजाब एग्रो मिल्स", search: "फसल, स्थान खोजें...", farmerPools: "पूल", liveAuctions: "नीलामी", myOrders: "ऑर्डर", analytics: "विश्लेषण", buyNow: "अभी खरीदें", joinBid: "बोली लगाएं", hot: "हॉट", expiresIn: "समाप्त", currentBid: "वर्तमान बोली", participants: "प्रतिभागी", basePrice: "आधार", totalValue: "कुल मूल्य", switchToFarmer: "किसान व्यू", farmers: "किसान" },
    pa: { welcome: "ਵਾਪਸੀ ਤੇ ਸੁਆਗਤ ਹੈ", companyName: "ਪੰਜਾਬ ਐਗਰੋ ਮਿੱਲਜ਼", search: "ਫ਼ਸਲ, ਥਾਂ ਖੋਜੋ...", farmerPools: "ਪੂਲ", liveAuctions: "ਨਿਲਾਮੀ", myOrders: "ਆਰਡਰ", analytics: "ਵਿਸ਼ਲੇਸ਼ਣ", buyNow: "ਹੁਣੇ ਖਰੀਦੋ", joinBid: "ਬੋਲੀ ਲਗਾਓ", hot: "ਹੌਟ", expiresIn: "ਖਤਮ", currentBid: "ਮੌਜੂਦਾ ਬੋਲੀ", participants: "ਭਾਗੀਦਾਰ", basePrice: "ਮੂਲ", totalValue: "ਕੁੱਲ ਮੁੱਲ", switchToFarmer: "ਕਿਸਾਨ ਵਿਊ", farmers: "ਕਿਸਾਨ" },
  }
  const text = t[language]

  const getCropEmoji = (crop: string) => {
    const emojis: Record<string, string> = { "Wheat": "🌾", "Mustard": "🌻", "Rice (Basmati)": "🍚", "Corn": "🌽", "Organic Wheat": "🌾", "Premium Basmati": "🍚", "Yellow Mustard": "🌻" }
    return emojis[crop] || "🌱"
  }

  const getQualityStyle = (quality: string) => {
    switch (quality) {
      case "Premium": return "bg-agri-gold/15 text-agri-earth border-agri-gold/30"
      case "Standard": return "bg-primary/10 text-primary border-primary/20"
      default: return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Delivered": return { bg: "bg-agri-success/10", text: "text-agri-success", border: "border-l-agri-success" }
      case "In Transit": return { bg: "bg-primary/10", text: "text-primary", border: "border-l-primary" }
      default: return { bg: "bg-agri-gold/10", text: "text-agri-earth", border: "border-l-agri-gold" }
    }
  }

  const tabs = [
    { key: "pools", label: text.farmerPools, icon: Package },
    { key: "auctions", label: text.liveAuctions, icon: Gavel, badge: liveAuctions.length },
    { key: "orders", label: text.myOrders, icon: ShoppingCart },
    { key: "analytics", label: text.analytics, icon: BarChart3 },
  ]

  const totalQty = farmerPools.reduce((a, p) => a + p.quantity, 0)
  const totalValue = farmerPools.reduce((a, p) => a + p.quantity * p.pricePerQuintal, 0)

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/40">
        <div className="max-w-5xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AgriLinkLogo size="sm" />
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{text.companyName}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleDarkMode} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent transition-all duration-200">
                {isDark ? <Sun className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} /> : <Moon className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />}
              </button>
              <button className="relative w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent transition-all duration-200">
                <Bell className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
              </button>
              <button
                onClick={() => { setUserRole("farmer"); router.push("/farmer") }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary hover:bg-accent text-sm font-medium text-foreground transition-all duration-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{text.switchToFarmer}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6 space-y-6">
        {/* Welcome + Search */}
        <div className="animate-fade-in-up">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{text.welcome}</p>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight mt-0.5">{text.companyName}</h1>

          <div className="relative mt-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={text.search}
              className="pl-10 pr-10 h-11 rounded-xl bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-accent flex items-center justify-center hover:bg-primary/10 transition-colors">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up stagger-1">
          {[
            { label: "Active Pools", value: String(farmerPools.length), icon: Package, color: "text-primary" },
            { label: "Total Qty", value: `${totalQty}q`, icon: TrendingUp, color: "text-primary" },
            { label: text.totalValue, value: `₹${(totalValue / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-agri-gold" },
            { label: "Live Auctions", value: String(liveAuctions.length), icon: Gavel, color: "text-destructive" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-4 hover-lift">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="animate-fade-in-up stagger-2">
          <div className="flex gap-1.5 p-1 rounded-xl bg-secondary/70 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedTab === tab.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold leading-none">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-up stagger-3">
          {/* Pools */}
          {selectedTab === "pools" && (
            <div className="space-y-3">
              {farmerPools.map((pool, i) => (
                <div key={pool.id} className={`glass-card rounded-2xl p-4 sm:p-5 hover-lift animate-fade-in-up stagger-${i + 1}`}>
                  <div className="flex gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-secondary flex items-center justify-center text-2xl sm:text-3xl shrink-0">
                      {getCropEmoji(pool.crop)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">{pool.crop}</h3>
                            {pool.isHot && (
                              <Badge className="bg-destructive/10 text-destructive border-0 text-[10px] gap-0.5 px-1.5 py-0.5">
                                <Flame className="w-3 h-3" />
                                {text.hot}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{pool.location}</span>
                          </div>
                        </div>
                        <Badge className={`${getQualityStyle(pool.quality)} border text-[10px]`}>
                          {pool.quality}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
                        <div className="bg-secondary/60 rounded-lg p-2">
                          <p className="text-[10px] text-muted-foreground">Quantity</p>
                          <p className="text-sm font-semibold text-foreground">{pool.quantity}q</p>
                        </div>
                        <div className="bg-secondary/60 rounded-lg p-2">
                          <p className="text-[10px] text-muted-foreground">Price</p>
                          <p className="text-sm font-semibold text-primary">₹{pool.pricePerQuintal}/q</p>
                        </div>
                        <div className="bg-secondary/60 rounded-lg p-2">
                          <p className="text-[10px] text-muted-foreground">{text.farmers}</p>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-semibold text-foreground">{pool.farmersCount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-agri-gold fill-agri-gold" />
                            <span className="text-xs font-medium text-foreground">{pool.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{text.expiresIn} {pool.expiresIn}</span>
                          </div>
                        </div>
                        <Button size="sm" className="rounded-lg text-xs h-8">
                          {text.buyNow}
                          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Auctions */}
          {selectedTab === "auctions" && (
            <div className="space-y-3">
              {liveAuctions.map((auction, i) => (
                <div key={auction.id} className={`glass-card rounded-2xl overflow-hidden hover-lift animate-fade-in-up stagger-${i + 1}`}>
                  <div className="h-1 bg-gradient-to-r from-destructive via-agri-gold to-primary" />
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                          {getCropEmoji(auction.crop)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{auction.crop}</h3>
                          <p className="text-xs text-muted-foreground">{auction.farmer}</p>
                        </div>
                      </div>
                      <Badge variant="destructive" className="gap-1 animate-pulse text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground" />
                        LIVE
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                      <div className="bg-secondary/60 rounded-lg p-2.5 text-center">
                        <p className="text-[10px] text-muted-foreground">Qty</p>
                        <p className="text-sm font-semibold text-foreground">{auction.quantity}q</p>
                      </div>
                      <div className="bg-secondary/60 rounded-lg p-2.5 text-center">
                        <p className="text-[10px] text-muted-foreground">{text.basePrice}</p>
                        <p className="text-sm font-semibold text-muted-foreground line-through">₹{auction.basePrice}</p>
                      </div>
                      <div className="bg-primary/10 rounded-lg p-2.5 text-center">
                        <p className="text-[10px] text-muted-foreground">{text.currentBid}</p>
                        <p className="text-sm font-bold text-primary">₹{auction.currentBid}</p>
                      </div>
                      <div className="bg-destructive/10 rounded-lg p-2.5 text-center">
                        <p className="text-[10px] text-muted-foreground">Time</p>
                        <p className="text-sm font-bold text-destructive font-mono">{auction.timeLeft}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        <span>{auction.participants} {text.participants}</span>
                      </div>
                      <Button size="sm" className="rounded-lg text-xs h-8">
                        <Gavel className="w-3.5 h-3.5 mr-1" />
                        {text.joinBid}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Orders */}
          {selectedTab === "orders" && (
            <div className="space-y-3">
              {orders.map((order, i) => {
                const style = getStatusStyle(order.status)
                return (
                  <div key={order.id} className={`glass-card rounded-2xl p-4 border-l-4 ${style.border} hover-lift animate-fade-in-up stagger-${i + 1}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center`}>
                          <CheckCircle2 className={`w-5 h-5 ${style.text}`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{order.crop} — {order.qty}q</p>
                          <p className="text-[11px] text-muted-foreground">#{order.id} · {order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{order.amount}</p>
                        <Badge className={`${style.bg} ${style.text} border-0 text-[10px] mt-1`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Analytics */}
          {selectedTab === "analytics" && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: TrendingUp, value: "₹24.5L", label: "Total Purchases", color: "text-agri-success", bg: "bg-agri-success/10" },
                { icon: Package, value: "1,250q", label: "Qty Procured", color: "text-primary", bg: "bg-primary/10" },
                { icon: Users, value: "87", label: "Farmers Connected", color: "text-agri-gold", bg: "bg-agri-gold/10" },
                { icon: Gavel, value: "12", label: "Auctions Won", color: "text-destructive", bg: "bg-destructive/10" },
              ].map((item, i) => (
                <div key={item.label} className={`glass-card rounded-2xl p-5 hover-lift animate-fade-in-up stagger-${i + 1}`}>
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
