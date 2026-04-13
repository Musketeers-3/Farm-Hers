// const handleIntent = useCallback(
//   (input: string) => {
//     setIsProcessing(true);

//     // 🚀 UPDATED: Regex now contains actual Hindi and Punjabi characters
//     const socialCommands = [
//       {
//         // Matches Hi, Hello, Namaste (Hindi), Sat Shri Akal (Punjabi)
//         regex: /hello|hi|hey|नमस्ते|नमस्कार|सत श्री अकाल|ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ/i,
//         msg: {
//           en: "Hello! How can I help you today?",
//           hi: "नमस्ते! मैं आपकी क्या मदद कर सकता हूँ?",
//           pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
//         },
//       },
//       {
//         // Language Switching via Voice
//         regex: /hindi|हिंदी|हिन्दी/i,
//         action: () => setLanguage("hi"),
//         msg: {
//           en: "Switching to Hindi.",
//           hi: "अब मैं हिंदी में बात करूँगा।",
//           pa: "ਹੁਣ ਮੈਂ ਹਿੰਦੀ ਵਿੱਚ ਗੱਲ ਕਰਾਂਗਾ।",
//         },
//       },
//       {
//         regex: /punjabi|ਪੰਜਾਬੀ/i,
//         action: () => setLanguage("pa"),
//         msg: {
//           en: "Switching to Punjabi.",
//           hi: "अब मैं पंजाबी में बात करूँगा।",
//           pa: "ਹੁਣ ਮੈਂ ਪੰਜਾਬੀ ਵਿੱਚ ਗੱਲ ਕਰਾਂਗਾ।",
//         },
//       },
//     ];

//     // 🚀 UPDATED: Bidding Regex (Supports Devanagari and Gurmukhi script)
//     const bidMatch = input.match(
//       /(?:bid|bol|price|set|lagao|बोली|बोलो|ਭਾਅ|ਬੋਲੀ)\s*(\d+)\s*(?:on|par|for|पर|ਤੇ)?\s*([a-zA-Z\u0900-\u097F\u0A00-\u0A7F]+)/i,
//     );

//     const socialMatch = socialCommands.find((c) => c.regex.test(input));
//     if (socialMatch) {
//       const reply = socialMatch.msg[language as keyof typeof socialMatch.msg];
//       setResponse(reply);
//       speak(reply);
//       setShowResponse(true);
//       if (socialMatch.action) socialMatch.action();
//       setIsProcessing(false);
//       return;
//     }

//     if (bidMatch) {
//       const amount = parseInt(bidMatch[1]);
//       const cropQuery = bidMatch[2].toLowerCase();

//       // Match crop name (Standardized across scripts)
//       const targetCrop = crops.find(
//         (c) =>
//           c.name.toLowerCase().includes(cropQuery) ||
//           (cropQuery.includes("गेहूं") && c.id === "wheat") ||
//           (cropQuery.includes("ਕਣਕ") && c.id === "wheat") ||
//           (cropQuery.includes("चावल") && c.id === "rice"),
//       );

//       const targetAuction = auctions.find((a) => a.cropId === targetCrop?.id);

//       if (targetAuction) {
//         if (amount > targetAuction.currentBid) {
//           placeBid(targetAuction.id, amount, "buyer-pam-001");
//           const successMsg =
//             language === "en"
//               ? `Bid of ${amount} placed on ${targetCrop?.name}.`
//               : `${targetCrop?.name} पर ${amount} की बोली लगा दी गई है।`;
//           setResponse(successMsg);
//           speak(successMsg);
//           setShowResponse(true);
//           setIsProcessing(false);
//           router.push(`/buyer/auctions/${targetAuction.id}`);
//           return;
//         }
//       }
//     }

//     // 🚀 UPDATED: Navigation (Supports Devanagari and Gurmukhi characters)
//     const navCommands = [
//       {
//         regex: /mandi|price|bhav|market|ਭਾਅ|भाव|मंडी/i,
//         action: () => router.push("/buyer/analytics"),
//         msg: {
//           en: "Showing market rates",
//           hi: "मंडी भाव दिखा रहा हूँ",
//           pa: "ਮੰਡੀ ਭਾਅ ਦੇਖ ਰਿਹਾ ਹਾਂ",
//         },
//       },
//       {
//         regex: /auction|nilami|bid|ਬੋਲੀ|ਨੀਲਾਮੀ|नीलामी|बोली/i,
//         action: () => router.push("/buyer/auctions"),
//         msg: {
//           en: "Opening auctions",
//           hi: "नीलामी खोल रहा हूँ",
//           pa: "ਨਿਲਾਮੀ ਖੋਲ ਰਿਹਾ ਹਾਂ",
//         },
//       },
//     ];

//     const navMatch = navCommands.find((c) => c.regex.test(input));

//     setTimeout(() => {
//       setIsProcessing(false);
//       if (navMatch) {
//         const reply = navMatch.msg[language as keyof typeof navMatch.msg];
//         setResponse(reply);
//         speak(reply);
//         setShowResponse(true);
//         navMatch.action();
//       } else {
//         const errorMsg =
//           language === "en"
//             ? "I didn't catch that."
//             : "क्षमा करें, मैं समझ नहीं पाया।";
//         setResponse(errorMsg);
//         speak(errorMsg);
//         setShowResponse(true);
//       }
//       setTimeout(() => {
//         setShowResponse(false);
//         setTranscript("");
//       }, 3000);
//     }, 800);
//   },
//   [language, router, auctions, crops, placeBid, speak, setLanguage],
// );

// 3. 🎙️ SPEECH ENGINE - reactive to language

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Loader2,
  Volume2,
  Send,
  Ear,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function BoloAssistant() {
  const router = useRouter();
  const {
    language,
    userRole,
    userProfile,
    isBoloListening,
    setBoloListening,
    auctions,
    crops,
    placeBid,
    addAuction,
  } = useAppStore();

  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState(""); // 🚀 New: Text Chat State
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  // 🚀 New: Wake Word State
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
  const passiveRecRef = useRef<any>(null);

  // 1. 🔊 TEXT-TO-SPEECH (TTS)
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

  // 2. 🧠 HYBRID INTENT RESOLVER (Handles both Voice & Text)
  const handleIntent = useCallback(
    async (input: string) => {
      if (!input.trim()) return;
      setIsProcessing(true);
      setTranscript(input); // Show what was typed/spoken

      try {
        const res = await fetch("/api/parse-bid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: input, language }),
        });

        const result = await res.json();

        if (result.success && result.data) {
          const ai = result.data;

          setResponse(ai.reply);
          speak(ai.reply);
          setShowResponse(true);

          // Handle Farmer "Sell" Intent
          if (ai.intent === "sell" && ai.crop && ai.amount && ai.price) {
            if (userRole !== "farmer") {
              const errorMsg =
                language === "hi"
                  ? "केवल किसान ही फसल बेच सकते हैं।"
                  : "Only farmers can list crops.";
              setResponse(errorMsg);
              speak(errorMsg);
            } else {
              const targetCrop = crops.find((c) => c.id === ai.crop);
              if (targetCrop) {
                const newAuction = {
                  id: `auction-${Date.now()}`,
                  cropId: targetCrop.id,
                  farmerId: userProfile?.uid || "farmer-1",
                  quantity: ai.amount,
                  startingPrice: ai.price,
                  currentBid: ai.price,
                  highestBidderId: null,
                  endTime: new Date(Date.now() + 86400000).toISOString(),
                  status: "live" as const,
                };
                addAuction(newAuction);
                setTimeout(() => router.push("/farmer"), 3500);
              }
            }
          }
          // Handle Buyer "Bid" Intent
          else if (ai.intent === "bid" && ai.amount && ai.crop) {
            if (userRole !== "buyer") {
              const errorMsg =
                language === "hi"
                  ? "केवल खरीदार ही बोली लगा सकते हैं।"
                  : "Only buyers can place bids.";
              setResponse(errorMsg);
              speak(errorMsg);
            } else {
              const targetCrop = crops.find(
                (c) => c.name.toLowerCase() === ai.crop,
              );
              const targetAuction = auctions.find(
                (a) => a.cropId === targetCrop?.id,
              );

              if (targetAuction && ai.amount > targetAuction.currentBid) {
                placeBid(
                  targetAuction.id,
                  ai.amount,
                  userProfile?.uid || "buyer-1",
                );
                setTimeout(
                  () => router.push(`/buyer/auctions/${targetAuction.id}`),
                  3000,
                );
              } else if (targetAuction) {
                const failMsg =
                  language === "hi"
                    ? `बोली कम है। वर्तमान मूल्य ₹${targetAuction.currentBid} है।`
                    : `Bid too low. Current price is ₹${targetAuction.currentBid}.`;
                setResponse(failMsg);
                speak(failMsg);
              }
            }
          }
          // Handle Navigation
          else if (ai.intent === "navigation" && ai.target) {
            const basePath = userRole === "farmer" ? "/farmer" : "/buyer";
            setTimeout(() => router.push(`${basePath}/${ai.target}`), 2000);
          }
        } else {
          const errorMsg =
            language === "hi" ? "मैं समझ नहीं पाया।" : "I didn't catch that.";
          setResponse(errorMsg);
          speak(errorMsg);
          setShowResponse(true);
        }
      } catch (error) {
        console.error("Bolo AI Error:", error);
        const errorMsg = "Network error. Try again.";
        setResponse(errorMsg);
        speak(errorMsg);
        setShowResponse(true);
      } finally {
        setIsProcessing(false);
        setTextInput(""); // Clear text input after processing
        setTimeout(() => {
          setShowResponse(false);
          setTranscript("");
        }, 5000);
      }
    },
    [
      language,
      userRole,
      userProfile,
      router,
      auctions,
      crops,
      placeBid,
      addAuction,
      speak,
    ],
  );

  // 3. 🎙️ ACTIVE SPEECH ENGINE (Main Dictation)
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
        handleIntent(current);
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

  // 4. 🚀 WAKE WORD ENGINE ("Hey Bolo")
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !wakeWordEnabled || isBoloListening) {
      if (passiveRecRef.current) passiveRecRef.current.stop();
      return;
    }

    const passiveRec = new SpeechRecognition();
    passiveRec.lang = "en-IN"; // Wake word usually works best triggered in English baseline
    passiveRec.continuous = true;
    passiveRec.interimResults = true;

    passiveRec.onresult = (event: any) => {
      const current =
        event.results[event.results.length - 1][0].transcript.toLowerCase();
      // If it hears "bolo" or "hey bolo", activate the main assistant!
      if (current.includes("bolo") || current.includes("hey bolo")) {
        passiveRec.stop();
        speak(language === "hi" ? "हाँ जी?" : "Yes?");
        setBoloListening(true);
      }
    };

    passiveRec.onend = () => {
      // Auto-restart passive listening if it dies (Hackathon trick to keep it alive)
      if (wakeWordEnabled && !isBoloListening) {
        try {
          passiveRec.start();
        } catch (e) {}
      }
    };

    try {
      passiveRec.start();
    } catch (e) {}
    passiveRecRef.current = passiveRec;

    return () => passiveRec.stop();
  }, [wakeWordEnabled, isBoloListening, speak, language, setBoloListening]);

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
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-24 md:bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-[340px] rounded-[2.5rem] p-6 shadow-2xl border border-white/20 bg-black/85 backdrop-blur-3xl pointer-events-auto flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
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
                    setTextInput("");
                  }}
                  className="text-white/40 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Area (Listening/Processing/Response) */}
              <div className="min-h-[100px] flex flex-col justify-center text-center mb-4">
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
                      <p className="text-white/80 font-serif italic text-lg leading-tight">
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
                      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                      <p className="text-xs text-white/50 mt-2 tracking-widest uppercase">
                        Processing
                      </p>
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

              {/* 🚀 NEW: Text Chat Input */}
              <div className="mt-auto relative">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (isBoloListening) setBoloListening(false);
                    handleIntent(textInput);
                  }}
                  className="flex items-center"
                >
                  <input
                    type="text"
                    placeholder={
                      language === "hi"
                        ? "यहाँ टाइप करें..."
                        : "Or type your command..."
                    }
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder-white/30 outline-none focus:border-primary/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!textInput.trim() || isProcessing}
                    className="absolute right-2 p-1.5 bg-primary rounded-xl text-white disabled:opacity-50 hover:bg-green-600 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🚀 Wake Word Toggle + Main Mic Button */}
        <div className="flex items-center gap-3">
          {/* Wake Word Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setWakeWordEnabled(!wakeWordEnabled)}
            className={cn(
              "px-4 py-2 rounded-full backdrop-blur-md border text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl transition-all",
              wakeWordEnabled
                ? "bg-green-500/20 border-green-500/50 text-green-400"
                : "bg-black/50 border-white/10 text-white/50",
            )}
          >
            <Ear
              className={cn("w-4 h-4", wakeWordEnabled && "animate-pulse")}
            />
            {wakeWordEnabled ? "'Hey Bolo' ON" : "Wake Word"}
          </motion.button>

          {/* Main Mic Button */}
          <motion.button
            onClick={() => {
              if (!isBoloListening) {
                // Stop wake word temporarily if manually clicking mic
                if (passiveRecRef.current) passiveRecRef.current.stop();
              }
              setBoloListening(!isBoloListening);
              setTranscript("");
            }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] border-2 transition-all duration-500 relative",
              isBoloListening
                ? "bg-red-500 border-red-400"
                : "bg-[#1e4d2b] border-[#1e4d2b]/50 hover:bg-[#2a6b3d]",
            )}
          >
            {isBoloListening ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <Mic className="w-7 h-7 text-white" />
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
}
