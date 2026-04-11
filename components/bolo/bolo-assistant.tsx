"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Mic, 
  MicOff, 
  X, 
  Volume2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Home,
  TrendingUp,
  Package,
  Settings,
  Loader2
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

interface SuggestedCommand {
  icon: React.ReactNode
  text: { en: string; hi: string; pa: string }
  action: () => void
}

export function BoloAssistant() {
  const language = useAppStore((state) => state.language)
  const router = useRouter()     
  const setLanguage = useAppStore((state) => state.setLanguage)
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  const pulseRef = useRef<HTMLDivElement>(null)

  const t = {
    en: {
      bolo: "Bolo",
      tapToSpeak: "Tap to speak",
      listening: "Listening...",
      processing: "Processing...",
      suggestions: "Try saying:",
      close: "Close",
      speakNow: "Speak now",
      howCanIHelp: "How can I help you today?",
    },
    hi: {
      bolo: "बोलो",
      tapToSpeak: "बोलने के लिए टैप करें",
      listening: "सुन रहा हूं...",
      processing: "प्रोसेसिंग...",
      suggestions: "यह कहें:",
      close: "बंद करें",
      speakNow: "अभी बोलें",
      howCanIHelp: "आज मैं आपकी कैसे मदद कर सकता हूं?",
    },
    pa: {
      bolo: "ਬੋਲੋ",
      tapToSpeak: "ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ",
      listening: "ਸੁਣ ਰਿਹਾ ਹਾਂ...",
      processing: "ਪ੍ਰੋਸੈਸਿੰਗ...",
      suggestions: "ਇਹ ਕਹੋ:",
      close: "ਬੰਦ ਕਰੋ",
      speakNow: "ਹੁਣੇ ਬੋਲੋ",
      howCanIHelp: "ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    },
  }

  const text = t[language]

  // Command patterns for voice recognition
  const commandPatterns: Array<{
    patterns: RegExp[]
    action: () => void
    response: { en: string; hi: string; pa: string }
  }> = [
    {
      patterns: [
        /mera order|my order|order status|ਮੇਰਾ ਆਰਡਰ|मेरा ऑर्डर/i,
        /order kahan|where.*order|tracking/i,
      ],
      action: () => router.push("/farmer/tracking"),
      response: {
        en: "Opening your order tracking...",
        hi: "आपका ऑर्डर ट्रैकिंग खोल रहा हूं...",
        pa: "ਤੁਹਾਡੀ ਆਰਡਰ ਟ੍ਰੈਕਿੰਗ ਖੋਲ ਰਿਹਾ ਹਾਂ...",
      },
    },
    {
      patterns: [
        /mandi|market|bhav|price|rate|मंडी|ਮੰਡੀ/i,
        /mandi dikhao|show market/i,
      ],
      action: () => router.push("/farmer/market"),
      response: {
        en: "Here are today's market prices...",
        hi: "यहां आज की मंडी भाव हैं...",
        pa: "ਇੱਥੇ ਅੱਜ ਦੇ ਮੰਡੀ ਭਾਅ ਹਨ...",
      },
    },
    {
      patterns: [
        /becho|sell|bech|फसल बेचो|ਫ਼ਸਲ ਵੇਚੋ/i,
        /gehu becho|sell wheat|गेहूं बेचो/i,
      ],
      action: () => router.push("/farmer/sell"),
      response: {
        en: "Opening sell screen. What would you like to sell?",
        hi: "बेचने की स्क्रीन खोल रहा हूं। आप क्या बेचना चाहते हैं?",
        pa: "ਵੇਚਣ ਦੀ ਸਕ੍ਰੀਨ ਖੋਲ ਰਿਹਾ ਹਾਂ। ਤੁਸੀਂ ਕੀ ਵੇਚਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
      },
    },
    {
      patterns: [
        /punjabi|ਪੰਜਾਬੀ/i,
        /punjabi mein|in punjabi/i,
      ],
      action: () => setLanguage("pa"),
      response: {
        en: "Changed to Punjabi",
        hi: "पंजाबी में बदल गया",
        pa: "ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲ ਗਿਆ",
      },
    },
    {
      patterns: [
        /hindi|हिंदी/i,
        /hindi mein|in hindi/i,
      ],
      action: () => setLanguage("hi"),
      response: {
        en: "Changed to Hindi",
        hi: "हिंदी में बदल गया",
        pa: "ਹਿੰਦੀ ਵਿੱਚ ਬਦਲ ਗਿਆ",
      },
    },
    {
      patterns: [
        /english|इंग्लिश|ਅੰਗਰੇਜ਼ੀ/i,
        /english mein|in english/i,
      ],
      action: () => setLanguage("en"),
      response: {
        en: "Changed to English",
        hi: "English में बदल गया",
        pa: "English ਵਿੱਚ ਬਦਲ ਗਿਆ",
      },
    },
    {
      patterns: [
        /home|ghar|घर|ਘਰ/i,
        /dashboard|होम/i,
      ],
      action: () => router.push("/farmer"),
      response: {
        en: "Going to home screen...",
        hi: "होम स्क्रीन पर जा रहा हूं...",
        pa: "ਹੋਮ ਸਕ੍ਰੀਨ ਤੇ ਜਾ ਰਿਹਾ ਹਾਂ...",
      },
    },
    {
      patterns: [
        /auction|nilami|नीलामी|ਨਿਲਾਮੀ/i,
        /bid|bidding/i,
      ],
      action: () => router.push("/farmer/auction"),
      response: {
        en: "Opening live auctions...",
        hi: "लाइव नीलामी खोल रहा हूं...",
        pa: "ਲਾਈਵ ਨਿਲਾਮੀ ਖੋਲ ਰਿਹਾ ਹਾਂ...",
      },
    },
  ]

  const suggestedCommands: SuggestedCommand[] = [
    {
      icon: <TrendingUp className="h-4 w-4" />,
      text: { en: "Show market prices", hi: "मंडी भाव दिखाओ", pa: "ਮੰਡੀ ਭਾਅ ਦਿਖਾਓ" },
      action: () => {
        router.push("/farmer/market")
        setResponse(t[language].howCanIHelp)
        handleClose()
      },
    },
    {
      icon: <Package className="h-4 w-4" />,
      text: { en: "Track my order", hi: "मेरा ऑर्डर ट्रैक करो", pa: "ਮੇਰਾ ਆਰਡਰ ਟ੍ਰੈਕ ਕਰੋ" },
      action: () => {
        router.push("/farmer/tracking")
        handleClose()
      },
    },
    {
      icon: <Home className="h-4 w-4" />,
      text: { en: "Go home", hi: "घर जाओ", pa: "ਘਰ ਜਾਓ" },
      action: () => {
        router.push("/farmer")
        handleClose()
      },
    },
    {
      icon: <Settings className="h-4 w-4" />,
      text: { en: "Change to Punjabi", hi: "पंजाबी में बदलो", pa: "ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲੋ" },
      action: () => {
        setLanguage("pa")
        setResponse("ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲ ਗਿਆ")
        setShowResponse(true)
        setTimeout(() => setShowResponse(false), 2000)
      },
    },
  ]

  const processCommand = (input: string) => {
    setIsProcessing(true)
    
    // Simulate processing delay
    setTimeout(() => {
      let matched = false
      
      for (const command of commandPatterns) {
        for (const pattern of command.patterns) {
          if (pattern.test(input)) {
            setResponse(command.response[language])
            setShowResponse(true)
            command.action()
            matched = true
            break
          }
        }
        if (matched) break
      }
      
      if (!matched) {
        setResponse(
          language === "en" 
            ? "I didn't understand that. Please try again."
            : language === "hi"
            ? "मुझे समझ नहीं आया। कृपया फिर से कोशिश करें।"
            : "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"
        )
        setShowResponse(true)
      }
      
      setIsProcessing(false)
      setIsListening(false)
      
      // Hide response after delay
      setTimeout(() => {
        setShowResponse(false)
        handleClose()
      }, 2500)
    }, 1000)
  }

  const handleMicClick = () => {
    if (isListening) {
      setIsListening(false)
      if (transcript) {
        processCommand(transcript)
      }
    } else {
      setIsListening(true)
      setTranscript("")
      setResponse("")
      setShowResponse(false)
      
      // Simulate voice recognition (in production, use Web Speech API)
      // For demo, we'll use simulated input
      const demoCommands = [
        "mandi dikhao",
        "mera order kahan hai",
        "punjabi mein karo",
        "gehu becho",
      ]
      
      setTimeout(() => {
        const randomCommand = demoCommands[Math.floor(Math.random() * demoCommands.length)]
        setTranscript(randomCommand)
      }, 1500)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsListening(false)
    setTranscript("")
    setResponse("")
    setShowResponse(false)
  }

  return (
    <>
      {/* Floating Bolo Button */}
      <motion.div
        className="fixed bottom-24 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-agri-olive" />
          <div className="relative flex items-center justify-center">
            <Mic className="h-6 w-6 text-primary-foreground" />
          </div>
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full animate-ping bg-primary/30" style={{ animationDuration: '2s' }} />
        </Button>
        <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-agri-gold text-agri-earth text-xs font-bold rounded-full">
          {text.bolo}
        </span>
      </motion.div>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gradient-to-b from-primary/95 via-agri-olive/95 to-primary/95 backdrop-blur-xl"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="flex flex-col items-center justify-center min-h-screen p-6">
              {/* Title */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-8"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-agri-gold" />
                  <h1 className="text-2xl font-bold text-primary-foreground">{text.bolo}</h1>
                  <Sparkles className="h-5 w-5 text-agri-gold" />
                </div>
                <p className="text-primary-foreground/70">{text.howCanIHelp}</p>
              </motion.div>

              {/* Microphone Button */}
              <motion.div
                className="relative mb-8"
                animate={isListening ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {/* Animated rings */}
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                    <div className="absolute -inset-4 rounded-full bg-white/10 animate-pulse" />
                    <div className="absolute -inset-8 rounded-full bg-white/5 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </>
                )}
                
                <Button
                  onClick={handleMicClick}
                  disabled={isProcessing}
                  className={`w-32 h-32 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-destructive hover:bg-destructive/90' 
                      : 'bg-white hover:bg-white/90'
                  } shadow-2xl`}
                >
                  {isProcessing ? (
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  ) : isListening ? (
                    <MicOff className="h-12 w-12 text-white" />
                  ) : (
                    <Mic className="h-12 w-12 text-primary" />
                  )}
                </Button>
              </motion.div>

              {/* Status Text */}
              <motion.p
                key={isListening ? "listening" : "tap"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary-foreground/80 text-lg mb-4"
              >
                {isProcessing 
                  ? text.processing 
                  : isListening 
                  ? text.listening 
                  : text.tapToSpeak}
              </motion.p>

              {/* Transcript */}
              <AnimatePresence mode="wait">
                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 mb-6"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-agri-gold" />
                      <p className="text-primary-foreground font-medium">{transcript}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Response */}
              <AnimatePresence>
                {showResponse && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-agri-gold/20 backdrop-blur-sm rounded-2xl px-6 py-3 mb-6"
                  >
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-agri-gold" />
                      <p className="text-primary-foreground">{response}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggestions */}
              {!isListening && !isProcessing && !showResponse && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-sm"
                >
                  <p className="text-primary-foreground/60 text-sm text-center mb-4">{text.suggestions}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestedCommands.map((cmd, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        onClick={cmd.action}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 text-left transition-colors"
                      >
                        <span className="text-agri-gold">{cmd.icon}</span>
                        <span className="text-primary-foreground text-sm">{cmd.text[language]}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
