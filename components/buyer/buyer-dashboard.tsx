"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  BarChart3
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { AgriLinkLogo } from "@/components/agrilink-logo"

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
  const setActiveScreen = useAppStore((state) => state.setActiveScreen)
  const setUserRole = useAppStore((state) => state.setUserRole)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("pools")

  const farmerPools: FarmerPool[] = [
    {
      id: "1",
      crop: "Wheat",
      quantity: 500,
      pricePerQuintal: 2350,
      location: "Ludhiana, Punjab",
      farmersCount: 24,
      quality: "Premium",
      rating: 4.8,
      isHot: true,
      expiresIn: "2h 30m",
    },
    {
      id: "2",
      crop: "Mustard",
      quantity: 320,
      pricePerQuintal: 5200,
      location: "Alwar, Rajasthan",
      farmersCount: 18,
      quality: "Standard",
      rating: 4.5,
      isHot: false,
      expiresIn: "5h 15m",
    },
    {
      id: "3",
      crop: "Rice (Basmati)",
      quantity: 750,
      pricePerQuintal: 3800,
      location: "Karnal, Haryana",
      farmersCount: 32,
      quality: "Premium",
      rating: 4.9,
      isHot: true,
      expiresIn: "1h 45m",
    },
    {
      id: "4",
      crop: "Corn",
      quantity: 420,
      pricePerQuintal: 1950,
      location: "Indore, MP",
      farmersCount: 15,
      quality: "Economy",
      rating: 4.2,
      isHot: false,
      expiresIn: "8h 00m",
    },
  ]

  const liveAuctions: LiveAuction[] = [
    {
      id: "1",
      crop: "Organic Wheat",
      quantity: 50,
      currentBid: 2650,
      basePrice: 2400,
      timeLeft: "12:45",
      participants: 8,
      farmer: "Gurpreet Singh",
    },
    {
      id: "2",
      crop: "Premium Basmati",
      quantity: 30,
      currentBid: 4200,
      basePrice: 3800,
      timeLeft: "08:22",
      participants: 12,
      farmer: "Ramesh Kumar",
    },
    {
      id: "3",
      crop: "Yellow Mustard",
      quantity: 25,
      currentBid: 5450,
      basePrice: 5100,
      timeLeft: "25:10",
      participants: 5,
      farmer: "Harjinder Kaur",
    },
  ]

  const t = {
    en: {
      welcome: "Welcome back",
      companyName: "Punjab Agro Mills",
      search: "Search crops, locations...",
      farmerPools: "Farmer Pools",
      liveAuctions: "Live Auctions",
      myOrders: "My Orders",
      analytics: "Analytics",
      available: "Available",
      quintal: "Quintal",
      farmers: "farmers",
      buyNow: "Buy Now",
      joinBid: "Join Bid",
      hot: "Hot",
      premium: "Premium",
      expiresIn: "Expires in",
      currentBid: "Current Bid",
      participants: "participants",
      basePrice: "Base",
      totalValue: "Total Value",
      switchToFarmer: "Switch to Farmer View",
      notifications: "Notifications",
      perQuintal: "per quintal",
    },
    hi: {
      welcome: "वापसी पर स्वागत है",
      companyName: "पंजाब एग्रो मिल्स",
      search: "फसल, स्थान खोजें...",
      farmerPools: "किसान पूल",
      liveAuctions: "लाइव नीलामी",
      myOrders: "मेरे ऑर्डर",
      analytics: "विश्लेषण",
      available: "उपलब्ध",
      quintal: "क्विंटल",
      farmers: "किसान",
      buyNow: "अभी खरीदें",
      joinBid: "बोली में शामिल हों",
      hot: "हॉट",
      premium: "प्रीमियम",
      expiresIn: "समाप्त होता है",
      currentBid: "वर्तमान बोली",
      participants: "प्रतिभागी",
      basePrice: "आधार",
      totalValue: "कुल मूल्य",
      switchToFarmer: "किसान व्यू पर जाएं",
      notifications: "सूचनाएं",
      perQuintal: "प्रति क्विंटल",
    },
    pa: {
      welcome: "ਵਾਪਸੀ ਤੇ ਸੁਆਗਤ ਹੈ",
      companyName: "ਪੰਜਾਬ ਐਗਰੋ ਮਿੱਲਜ਼",
      search: "ਫ਼ਸਲ, ਥਾਂ ਖੋਜੋ...",
      farmerPools: "ਕਿਸਾਨ ਪੂਲ",
      liveAuctions: "ਲਾਈਵ ਨਿਲਾਮੀ",
      myOrders: "ਮੇਰੇ ਆਰਡਰ",
      analytics: "ਵਿਸ਼ਲੇਸ਼ਣ",
      available: "ਉਪਲਬਧ",
      quintal: "ਕੁਇੰਟਲ",
      farmers: "ਕਿਸਾਨ",
      buyNow: "ਹੁਣੇ ਖਰੀਦੋ",
      joinBid: "ਬੋਲੀ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ",
      hot: "ਹੌਟ",
      premium: "ਪ੍ਰੀਮੀਅਮ",
      expiresIn: "ਖਤਮ ਹੁੰਦਾ",
      currentBid: "ਮੌਜੂਦਾ ਬੋਲੀ",
      participants: "ਭਾਗੀਦਾਰ",
      basePrice: "ਮੂਲ",
      totalValue: "ਕੁੱਲ ਮੁੱਲ",
      switchToFarmer: "ਕਿਸਾਨ ਵਿਊ ਤੇ ਜਾਓ",
      notifications: "ਸੂਚਨਾਵਾਂ",
      perQuintal: "ਪ੍ਰਤੀ ਕੁਇੰਟਲ",
    },
  }

  const text = t[language]

  const getCropEmoji = (crop: string) => {
    const emojis: Record<string, string> = {
      "Wheat": "🌾",
      "Mustard": "🌻",
      "Rice (Basmati)": "🍚",
      "Corn": "🌽",
      "Organic Wheat": "🌾",
      "Premium Basmati": "🍚",
      "Yellow Mustard": "🌻",
    }
    return emojis[crop] || "🌱"
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "Premium": return "bg-agri-gold/20 text-agri-earth border-agri-gold/30"
      case "Standard": return "bg-primary/10 text-primary border-primary/20"
      case "Economy": return "bg-muted text-muted-foreground border-border"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-sidebar/95 backdrop-blur-lg border-b border-sidebar-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AgriLinkLogo className="h-8 w-8" />
              <div>
                <p className="text-xs text-sidebar-foreground/60">{text.welcome}</p>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-sidebar-primary" />
                  <h1 className="font-semibold text-sidebar-foreground">{text.companyName}</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUserRole("farmer")
                  setActiveScreen("home")
                }}
                className="text-xs border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                {text.switchToFarmer}
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={text.search}
              className="pl-10 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-sidebar-foreground/50 hover:text-sidebar-foreground"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none bg-transparent border-b border-sidebar-border p-0 h-auto">
            <TabsTrigger
              value="pools"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-sidebar-primary data-[state=active]:bg-transparent data-[state=active]:text-sidebar-foreground text-sidebar-foreground/60 py-3 px-4"
            >
              <Package className="h-4 w-4 mr-2" />
              {text.farmerPools}
            </TabsTrigger>
            <TabsTrigger
              value="auctions"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-sidebar-primary data-[state=active]:bg-transparent data-[state=active]:text-sidebar-foreground text-sidebar-foreground/60 py-3 px-4"
            >
              <Gavel className="h-4 w-4 mr-2" />
              {text.liveAuctions}
              <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                {liveAuctions.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-sidebar-primary data-[state=active]:bg-transparent data-[state=active]:text-sidebar-foreground text-sidebar-foreground/60 py-3 px-4"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {text.myOrders}
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-sidebar-primary data-[state=active]:bg-transparent data-[state=active]:text-sidebar-foreground text-sidebar-foreground/60 py-3 px-4"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {text.analytics}
            </TabsTrigger>
          </TabsList>

          {/* Farmer Pools Content */}
          <TabsContent value="pools" className="p-4 mt-0 space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-sidebar-accent border-sidebar-border">
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-sidebar-foreground">{farmerPools.length}</p>
                  <p className="text-xs text-sidebar-foreground/60">{text.available}</p>
                </CardContent>
              </Card>
              <Card className="bg-sidebar-accent border-sidebar-border">
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-sidebar-primary">
                    {farmerPools.reduce((acc, p) => acc + p.quantity, 0)}q
                  </p>
                  <p className="text-xs text-sidebar-foreground/60">Total Qty</p>
                </CardContent>
              </Card>
              <Card className="bg-sidebar-accent border-sidebar-border">
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-agri-gold">
                    ₹{(farmerPools.reduce((acc, p) => acc + p.quantity * p.pricePerQuintal, 0) / 100000).toFixed(1)}L
                  </p>
                  <p className="text-xs text-sidebar-foreground/60">{text.totalValue}</p>
                </CardContent>
              </Card>
            </div>

            {/* Pool Cards */}
            <div className="space-y-3">
              {farmerPools.map((pool) => (
                <Card 
                  key={pool.id} 
                  className="bg-sidebar-accent border-sidebar-border overflow-hidden hover:border-sidebar-primary/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Crop Icon */}
                      <div className="w-16 h-16 rounded-xl bg-sidebar flex items-center justify-center text-3xl shrink-0">
                        {getCropEmoji(pool.crop)}
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sidebar-foreground">{pool.crop}</h3>
                              {pool.isHot && (
                                <Badge className="bg-destructive/20 text-destructive border-0 text-xs">
                                  <Flame className="h-3 w-3 mr-1" />
                                  {text.hot}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-sidebar-foreground/60 mt-1">
                              <MapPin className="h-3 w-3" />
                              <span>{pool.location}</span>
                            </div>
                          </div>
                          <Badge className={`${getQualityColor(pool.quality)} border`}>
                            {pool.quality}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-sidebar-foreground/50">Quantity</p>
                            <p className="font-semibold text-sidebar-foreground">{pool.quantity}q</p>
                          </div>
                          <div>
                            <p className="text-xs text-sidebar-foreground/50">Price</p>
                            <p className="font-semibold text-sidebar-primary">₹{pool.pricePerQuintal}/q</p>
                          </div>
                          <div>
                            <p className="text-xs text-sidebar-foreground/50">{text.farmers}</p>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-sidebar-foreground/50" />
                              <span className="font-semibold text-sidebar-foreground">{pool.farmersCount}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-agri-gold fill-agri-gold" />
                              <span className="text-sm font-medium text-sidebar-foreground">{pool.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-sidebar-foreground/50">
                              <Clock className="h-3 w-3" />
                              <span>{text.expiresIn} {pool.expiresIn}</span>
                            </div>
                          </div>
                          <Button size="sm" className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                            {text.buyNow}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Live Auctions Content */}
          <TabsContent value="auctions" className="p-4 mt-0 space-y-4">
            <div className="space-y-3">
              {liveAuctions.map((auction) => (
                <Card 
                  key={auction.id}
                  className="bg-sidebar-accent border-sidebar-border overflow-hidden"
                >
                  <div className="h-1 bg-gradient-to-r from-destructive via-agri-gold to-primary" />
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-sidebar flex items-center justify-center text-2xl">
                          {getCropEmoji(auction.crop)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sidebar-foreground">{auction.crop}</h3>
                          <p className="text-sm text-sidebar-foreground/60">{auction.farmer}</p>
                        </div>
                      </div>
                      <Badge variant="destructive" className="animate-pulse gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        LIVE
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="bg-sidebar rounded-lg p-2 text-center">
                        <p className="text-xs text-sidebar-foreground/50">Qty</p>
                        <p className="font-semibold text-sidebar-foreground">{auction.quantity}q</p>
                      </div>
                      <div className="bg-sidebar rounded-lg p-2 text-center">
                        <p className="text-xs text-sidebar-foreground/50">{text.basePrice}</p>
                        <p className="font-semibold text-sidebar-foreground/70">₹{auction.basePrice}</p>
                      </div>
                      <div className="bg-primary/20 rounded-lg p-2 text-center">
                        <p className="text-xs text-sidebar-foreground/50">{text.currentBid}</p>
                        <p className="font-semibold text-sidebar-primary">₹{auction.currentBid}</p>
                      </div>
                      <div className="bg-destructive/20 rounded-lg p-2 text-center">
                        <p className="text-xs text-sidebar-foreground/50">Time</p>
                        <p className="font-semibold text-destructive font-mono">{auction.timeLeft}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-sidebar-foreground/60">
                        <Users className="h-4 w-4" />
                        <span>{auction.participants} {text.participants}</span>
                      </div>
                      <Button className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                        <Gavel className="h-4 w-4 mr-2" />
                        {text.joinBid}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Orders Content */}
          <TabsContent value="orders" className="p-4 mt-0">
            <div className="space-y-3">
              {[
                { id: "ORD001", crop: "Wheat", qty: 200, status: "Delivered", date: "28 Mar 2024" },
                { id: "ORD002", crop: "Basmati Rice", qty: 150, status: "In Transit", date: "30 Mar 2024" },
                { id: "ORD003", crop: "Mustard", qty: 100, status: "Processing", date: "02 Apr 2024" },
              ].map((order) => (
                <Card key={order.id} className="bg-sidebar-accent border-sidebar-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sidebar flex items-center justify-center">
                          <CheckCircle2 className={`h-5 w-5 ${
                            order.status === "Delivered" ? "text-agri-success" :
                            order.status === "In Transit" ? "text-primary" : "text-agri-gold"
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-sidebar-foreground">{order.crop} - {order.qty}q</p>
                          <p className="text-xs text-sidebar-foreground/50">#{order.id} • {order.date}</p>
                        </div>
                      </div>
                      <Badge className={`${
                        order.status === "Delivered" ? "bg-agri-success/20 text-agri-success" :
                        order.status === "In Transit" ? "bg-primary/20 text-primary" : "bg-agri-gold/20 text-agri-earth"
                      } border-0`}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Content */}
          <TabsContent value="analytics" className="p-4 mt-0">
            <Card className="bg-sidebar-accent border-sidebar-border">
              <CardHeader>
                <CardTitle className="text-sidebar-foreground">{text.analytics}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-sidebar rounded-xl p-4">
                    <TrendingUp className="h-8 w-8 text-agri-success mb-2" />
                    <p className="text-2xl font-bold text-sidebar-foreground">₹24.5L</p>
                    <p className="text-sm text-sidebar-foreground/60">Total Purchases</p>
                  </div>
                  <div className="bg-sidebar rounded-xl p-4">
                    <Package className="h-8 w-8 text-primary mb-2" />
                    <p className="text-2xl font-bold text-sidebar-foreground">1,250q</p>
                    <p className="text-sm text-sidebar-foreground/60">Qty Procured</p>
                  </div>
                  <div className="bg-sidebar rounded-xl p-4">
                    <Users className="h-8 w-8 text-agri-gold mb-2" />
                    <p className="text-2xl font-bold text-sidebar-foreground">87</p>
                    <p className="text-sm text-sidebar-foreground/60">Farmers Connected</p>
                  </div>
                  <div className="bg-sidebar rounded-xl p-4">
                    <Gavel className="h-8 w-8 text-destructive mb-2" />
                    <p className="text-2xl font-bold text-sidebar-foreground">12</p>
                    <p className="text-sm text-sidebar-foreground/60">Auctions Won</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
