"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Loader2,
  Volume2,
  TrendingUp,
  Gavel,
  Package,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function BoloAssistant() {
  const router = useRouter();
  const {
    language,
    setLanguage,
    isBoloListening,
    setBoloListening,
    auctions,
    crops,
    placeBid,
  } = useAppStore();

  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  // 1. 🔊 TEXT-TO-SPEECH (TTS) - Native Voice Output
  const speak = useCallback(
    (textToSpeak: string) => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        if (language === "hi") utterance.lang = "hi-IN";
        else if (language === "pa") utterance.lang = "pa-IN";
        else utterance.lang = "en-IN";

        utterance.pitch = 1.0;
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    },
    [language],
  );

  // 2. 🧠 MULTILINGUAL INTENT RESOLVER
  const handleIntent = useCallback(
    (input: string) => {
      setIsProcessing(true);

      // 🚀 UPDATED: Regex now contains actual Hindi and Punjabi characters
      const socialCommands = [
        {
          // Matches Hi, Hello, Namaste (Hindi), Sat Shri Akal (Punjabi)
          regex: /hello|hi|hey|नमस्ते|नमस्कार|सत श्री अकाल|ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ/i,
          msg: {
            en: "Hello! How can I help you today?",
            hi: "नमस्ते! मैं आपकी क्या मदद कर सकता हूँ?",
            pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
          },
        },
        {
          // Language Switching via Voice
          regex: /hindi|हिंदी|हिन्दी/i,
          action: () => setLanguage("hi"),
          msg: {
            en: "Switching to Hindi.",
            hi: "अब मैं हिंदी में बात करूँगा।",
            pa: "ਹੁਣ ਮੈਂ ਹਿੰਦੀ ਵਿੱਚ ਗੱਲ ਕਰਾਂਗਾ।",
          },
        },
        {
          regex: /punjabi|ਪੰਜਾਬੀ/i,
          action: () => setLanguage("pa"),
          msg: {
            en: "Switching to Punjabi.",
            hi: "अब मैं पंजाबी में बात करूँगा।",
            pa: "ਹੁਣ ਮੈਂ ਪੰਜਾਬੀ ਵਿੱਚ ਗੱਲ ਕਰਾਂਗਾ।",
          },
        },
      ];

      // 🚀 UPDATED: Bidding Regex (Supports Devanagari and Gurmukhi script)
      const bidMatch = input.match(
        /(?:bid|bol|price|set|lagao|बोली|बोलो|ਭਾਅ|ਬੋਲੀ)\s*(\d+)\s*(?:on|par|for|पर|ਤੇ)?\s*([a-zA-Z\u0900-\u097F\u0A00-\u0A7F]+)/i,
      );

      const socialMatch = socialCommands.find((c) => c.regex.test(input));
      if (socialMatch) {
        const reply = socialMatch.msg[language as keyof typeof socialMatch.msg];
        setResponse(reply);
        speak(reply);
        setShowResponse(true);
        if (socialMatch.action) socialMatch.action();
        setIsProcessing(false);
        return;
      }

      if (bidMatch) {
        const amount = parseInt(bidMatch[1]);
        const cropQuery = bidMatch[2].toLowerCase();

        // Match crop name (Standardized across scripts)
        const targetCrop = crops.find(
          (c) =>
            c.name.toLowerCase().includes(cropQuery) ||
            (cropQuery.includes("गेहूं") && c.id === "wheat") ||
            (cropQuery.includes("ਕਣਕ") && c.id === "wheat") ||
            (cropQuery.includes("चावल") && c.id === "rice"),
        );

        const targetAuction = auctions.find((a) => a.cropId === targetCrop?.id);

        if (targetAuction) {
          if (amount > targetAuction.currentBid) {
            placeBid(targetAuction.id, amount, "buyer-pam-001");
            const successMsg =
              language === "en"
                ? `Bid of ${amount} placed on ${targetCrop?.name}.`
                : `${targetCrop?.name} पर ${amount} की बोली लगा दी गई है।`;
            setResponse(successMsg);
            speak(successMsg);
            setShowResponse(true);
            setIsProcessing(false);
            router.push(`/buyer/auctions/${targetAuction.id}`);
            return;
          }
        }
      }

      // 🚀 UPDATED: Navigation (Supports Devanagari and Gurmukhi characters)
      const navCommands = [
        {
          regex: /mandi|price|bhav|market|ਭਾਅ|भाव|मंडी/i,
          action: () => router.push("/buyer/analytics"),
          msg: {
            en: "Showing market rates",
            hi: "मंडी भाव दिखा रहा हूँ",
            pa: "ਮੰਡੀ ਭਾਅ ਦੇਖ ਰਿਹਾ ਹਾਂ",
          },
        },
        {
          regex: /auction|nilami|bid|ਬੋਲੀ|ਨੀਲਾਮੀ|नीलामी|बोली/i,
          action: () => router.push("/buyer/auctions"),
          msg: {
            en: "Opening auctions",
            hi: "नीलामी खोल रहा हूँ",
            pa: "ਨਿਲਾਮੀ ਖੋਲ ਰਿਹਾ ਹਾਂ",
          },
        },
      ];

      const navMatch = navCommands.find((c) => c.regex.test(input));

      setTimeout(() => {
        setIsProcessing(false);
        if (navMatch) {
          const reply = navMatch.msg[language as keyof typeof navMatch.msg];
          setResponse(reply);
          speak(reply);
          setShowResponse(true);
          navMatch.action();
        } else {
          const errorMsg =
            language === "en"
              ? "I didn't catch that."
              : "क्षमा करें, मैं समझ नहीं पाया।";
          setResponse(errorMsg);
          speak(errorMsg);
          setShowResponse(true);
        }
        setTimeout(() => {
          setShowResponse(false);
          setTranscript("");
        }, 3000);
      }, 800);
    },
    [language, router, auctions, crops, placeBid, speak, setLanguage],
  );

  // 3. 🎙️ SPEECH ENGINE - reactive to language
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang =
      language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const current = event.results[event.results.length - 1][0].transcript;
      setTranscript(current);
      if (event.results[0].isFinal) {
        handleIntent(current); // Pass raw transcript directly
      }
    };

    recognition.onend = () => {
      if (isBoloListening) setBoloListening(false);
    };

    if (isBoloListening) {
      try {
        recognition.start();
      } catch (e) {}
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [isBoloListening, language, handleIntent, setBoloListening]);

  const isVisible =
    isBoloListening || isProcessing || showResponse || transcript !== "";

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-80 rounded-[2.5rem] p-6 shadow-2xl border border-white/20 bg-black/80 backdrop-blur-3xl pointer-events-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold text-white tracking-wide text-xs uppercase">
                    Bolo Assistant
                  </span>
                </div>
                <button
                  onClick={() => {
                    setBoloListening(false);
                    setTranscript("");
                    setShowResponse(false);
                  }}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="min-h-[120px] flex flex-col justify-center text-center">
                <AnimatePresence mode="wait">
                  {isBoloListening && !isProcessing && (
                    <motion.div
                      key="listen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="flex gap-1.5 items-center h-10">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [8, 36, 8] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              delay: i * 0.1,
                            }}
                            className="w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(30,77,43,0.6)]"
                          />
                        ))}
                      </div>
                      <p className="text-white font-serif italic text-lg leading-tight">
                        "{transcript || "Listening..."}"
                      </p>
                    </motion.div>
                  )}

                  {isProcessing && (
                    <motion.div
                      key="proc"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                    </motion.div>
                  )}

                  {showResponse && (
                    <motion.div
                      key="resp"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="p-3 rounded-full bg-primary/20 shadow-[0_0_20px_rgba(30,77,43,0.2)]">
                        <Volume2 className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-white font-medium px-2 leading-relaxed">
                        {response}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => {
            setBoloListening(!isBoloListening);
            setTranscript("");
          }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-2 transition-all duration-500 relative",
            isBoloListening
              ? "bg-red-500 border-red-400"
              : "bg-primary border-primary/50",
          )}
        >
          {isBoloListening ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <Mic className="w-7 h-7 text-white" />
          )}
        </motion.button>
      </div>
    </>
  );
}
