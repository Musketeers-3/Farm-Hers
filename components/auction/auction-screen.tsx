"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Gavel, 
  Clock, 
  Users, 
  TrendingUp,
  Trophy,
  Flame,
  AlertCircle,
  CheckCircle2,
  User
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"

interface Bid {
  id: string
  bidder: string
  amount: number
  timestamp: Date
  isLeading: boolean
}

export function AuctionScreen() {
  const language = useAppStore((state) => state.language)
  const setActiveScreen = useAppStore((state) => state.setActiveScreen)
  const auctions = useAppStore((state) => state.auctions)
  const currentAuction = auctions[0] // Use first auction for demo
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const [bids, setBids] = useState<Bid[]>([
    { id: "1", bidder: "Punjab Agro Mills", amount: 2450, timestamp: new Date(), isLeading: false },
    { id: "2", bidder: "Haryana Foods Ltd", amount: 2480, timestamp: new Date(), isLeading: false },
    { id: "3", bidder: "Green Valley Exports", amount: 2520, timestamp: new Date(), isLeading: true },
  ])
  const [bidAmount, setBidAmount] = useState("")
  const [showBidPlaced, setShowBidPlaced] = useState(false)

  const t = {
    en: {
      liveAuction: "Live Auction",
      back: "Back",
      wheat: "Wheat",
      quintal: "Quintal",
      basePrice: "Base Price",
      currentBid: "Current Bid",
      timeRemaining: "Time Remaining",
      participants: "Participants",
      yourBid: "Your Bid",
      placeBid: "Place Bid",
      bidHistory: "Bid History",
      leading: "Leading",
      outbid: "Outbid",
      auctionEnds: "Auction ends in",
      minBid: "Min. next bid",
      bidPlaced: "Bid Placed!",
      watchingLive: "watching live",
      hotAuction: "Hot Auction",
      premium: "Premium Grade",
    },
    hi: {
      liveAuction: "लाइव नीलामी",
      back: "वापस",
      wheat: "गेहूं",
      quintal: "क्विंटल",
      basePrice: "आधार मूल्य",
      currentBid: "वर्तमान बोली",
      timeRemaining: "शेष समय",
      participants: "प्रतिभागी",
      yourBid: "आपकी बोली",
      placeBid: "बोली लगाएं",
      bidHistory: "बोली इतिहास",
      leading: "अग्रणी",
      outbid: "बाहर",
      auctionEnds: "नीलामी समाप्त",
      minBid: "न्यूनतम अगली बोली",
      bidPlaced: "बोली लगाई!",
      watchingLive: "लाइव देख रहे हैं",
      hotAuction: "हॉट नीलामी",
      premium: "प्रीमियम ग्रेड",
    },
    pa: {
      liveAuction: "ਲਾਈਵ ਨਿਲਾਮੀ",
      back: "ਵਾਪਸ",
      wheat: "ਕਣਕ",
      quintal: "ਕੁਇੰਟਲ",
      basePrice: "ਮੂਲ ਮੁੱਲ",
      currentBid: "ਮੌਜੂਦਾ ਬੋਲੀ",
      timeRemaining: "ਬਾਕੀ ਸਮਾਂ",
      participants: "ਭਾਗੀਦਾਰ",
      yourBid: "ਤੁਹਾਡੀ ਬੋਲੀ",
      placeBid: "ਬੋਲੀ ਲਗਾਓ",
      bidHistory: "ਬੋਲੀ ਇਤਿਹਾਸ",
      leading: "ਅੱਗੇ",
      outbid: "ਬਾਹਰ",
      auctionEnds: "ਨਿਲਾਮੀ ਖਤਮ",
      minBid: "ਘੱਟੋ-ਘੱਟ ਅਗਲੀ ਬੋਲੀ",
      bidPlaced: "ਬੋਲੀ ਲਗਾਈ!",
      watchingLive: "ਲਾਈਵ ਦੇਖ ਰਹੇ ਹਨ",
      hotAuction: "ਹੌਟ ਨਿਲਾਮੀ",
      premium: "ਪ੍ਰੀਮੀਅਮ ਗ੍ਰੇਡ",
    },
  }

  const text = t[language]
  const currentLeadingBid = Math.max(...bids.map(b => b.amount))
  const minNextBid = currentLeadingBid + 20

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate incoming bids
  useEffect(() => {
    const bidInterval = setInterval(() => {
      if (Math.random() > 0.7 && timeLeft > 0) {
        const newBid: Bid = {
          id: Date.now().toString(),
          bidder: ["Delhi Grain Corp", "Rajasthan Mills", "MP Foods Ltd", "Gujarat Agro"][Math.floor(Math.random() * 4)],
          amount: currentLeadingBid + Math.floor(Math.random() * 50) + 20,
          timestamp: new Date(),
          isLeading: true,
        }
        setBids(prev => {
          const updated = prev.map(b => ({ ...b, isLeading: false }))
          return [newBid, ...updated].slice(0, 10)
        })
      }
    }, 5000)
    return () => clearInterval(bidInterval)
  }, [currentLeadingBid, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlaceBid = () => {
    const amount = parseInt(bidAmount)
    if (amount >= minNextBid) {
      const newBid: Bid = {
        id: Date.now().toString(),
        bidder: "You",
        amount,
        timestamp: new Date(),
        isLeading: true,
      }
      setBids(prev => {
        const updated = prev.map(b => ({ ...b, isLeading: false }))
        return [newBid, ...updated]
      })
      setBidAmount("")
      setShowBidPlaced(true)
      setTimeout(() => setShowBidPlaced(false), 2000)
    }
  }

  const isUrgent = timeLeft < 60

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveScreen("home")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Gavel className="h-5 w-5 text-primary" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
            </div>
            <span className="font-semibold">{text.liveAuction}</span>
          </div>
          <Badge variant="destructive" className="animate-pulse gap-1">
            <Flame className="h-3 w-3" />
            LIVE
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Auction Item Card */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="relative h-40 bg-gradient-to-br from-agri-gold/20 to-agri-wheat/30">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl">🌾</span>
            </div>
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              {text.premium}
            </Badge>
            <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground gap-1">
              <Flame className="h-3 w-3" />
              {text.hotAuction}
            </Badge>
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{text.wheat}</h2>
                <p className="text-muted-foreground">{currentAuction?.quantity || 50} {text.quintal}</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>47 {text.watchingLive}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">{text.basePrice}</p>
                <p className="text-lg font-bold text-foreground">₹{currentAuction?.startingPrice || 2300}</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">{text.currentBid}</p>
                <p className="text-lg font-bold text-primary">₹{currentLeadingBid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timer Card */}
        <Card className={`border-2 ${isUrgent ? 'border-destructive bg-destructive/5' : 'border-primary/20'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={`h-5 w-5 ${isUrgent ? 'text-destructive animate-pulse' : 'text-primary'}`} />
                <span className="text-sm text-muted-foreground">{text.auctionEnds}</span>
              </div>
              <motion.span
                key={timeLeft}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-2xl font-mono font-bold ${isUrgent ? 'text-destructive' : 'text-foreground'}`}
              >
                {formatTime(timeLeft)}
              </motion.span>
            </div>
            {isUrgent && (
              <div className="mt-2 flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Hurry! Auction ending soon</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bid Input */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">{text.yourBid}</span>
              <span className="text-xs text-muted-foreground">{text.minBid}: ₹{minNextBid}</span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                <Input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={minNextBid.toString()}
                  className="pl-8 text-lg font-semibold h-12"
                />
              </div>
              <Button
                onClick={handlePlaceBid}
                disabled={!bidAmount || parseInt(bidAmount) < minNextBid}
                className="h-12 px-6 bg-primary hover:bg-primary/90"
              >
                <Gavel className="h-4 w-4 mr-2" />
                {text.placeBid}
              </Button>
            </div>
            
            {/* Quick Bid Buttons */}
            <div className="flex gap-2 mt-3">
              {[20, 50, 100].map((increment) => (
                <Button
                  key={increment}
                  variant="outline"
                  size="sm"
                  onClick={() => setBidAmount((minNextBid + increment).toString())}
                  className="flex-1"
                >
                  +₹{increment}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bid Placed Toast */}
        <AnimatePresence>
          {showBidPlaced && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-28 left-4 right-4 z-50"
            >
              <Card className="bg-primary text-primary-foreground border-0">
                <CardContent className="p-4 flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6" />
                  <span className="font-semibold">{text.bidPlaced}</span>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bid History */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {text.bidHistory}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {bids.map((bid, index) => (
                  <motion.div
                    key={bid.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      bid.isLeading
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        bid.isLeading ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        {bid.isLeading ? <Trophy className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${bid.bidder === "You" ? 'text-primary' : ''}`}>
                          {bid.bidder}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {bid.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">₹{bid.amount}</p>
                      {bid.isLeading && (
                        <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                          {text.leading}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
