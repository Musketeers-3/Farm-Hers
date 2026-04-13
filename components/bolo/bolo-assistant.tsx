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
import { Mic, X, Sparkles, Loader2, Volume2, Send, Moon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function BoloAssistant() {
  const router = useRouter();

  // --- GLOBAL STORE ---
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

  // --- LOCAL STATE ---
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  // --- WATCHDOG STATE (Battery Saver) ---
  const [isBoloSleeping, setIsBoloSleeping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const passiveRecRef = useRef<any>(null);

  // --- 1. TEXT-TO-SPEECH ---
  const speak = useCallback(
    (textToSpeak: string) => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang =
          language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    },
    [language],
  );

  // --- 2. INACTIVITY WATCHDOG ---
  const resetInactivityTimer = useCallback(() => {
    if (isBoloSleeping) {
      setIsBoloSleeping(false);
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Sleep after 2 minutes of zero mouse/keyboard/scroll movement
    timeoutRef.current = setTimeout(() => {
      setIsBoloSleeping(true);
      if (passiveRecRef.current) passiveRecRef.current.stop();
    }, 120000);
  }, [isBoloSleeping]);

  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    const handleActivity = () => resetInactivityTimer();
    events.forEach((event) => window.addEventListener(event, handleActivity));
    resetInactivityTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      );
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetInactivityTimer]);

  // --- 3. INTENT RESOLVER (BRAIN) ---
  const handleIntent = useCallback(
    async (input: string) => {
      if (!input.trim()) return;
      setIsProcessing(true);
      setTranscript(input);

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

          // FARMER SELL INTENT
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
          // BUYER BID INTENT
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
          // NAVIGATION INTENT
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
        setResponse("Network error. Try again.");
        speak("Network error. Try again.");
        setShowResponse(true);
      } finally {
        setIsProcessing(false);
        setTextInput("");
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

  // --- 4. THE UNIFIED AUDIO ENGINE (Bulletproof Hackathon Fix) ---
  // We use refs so React state changes don't assassinate the microphone loop
  const isListeningRef = useRef(isBoloListening);
  const languageRef = useRef(language);
  const handleIntentRef = useRef(handleIntent);

  // Sync state to refs instantly
  useEffect(() => {
    isListeningRef.current = isBoloListening;
  }, [isBoloListening]);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);
  useEffect(() => {
    handleIntentRef.current = handleIntent;
  }, [handleIntent]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Always continuous to stop the ping-pong effect
    recognition.interimResults = true;

    const startMic = () => {
      if (isBoloSleeping) return;
      try {
        recognition.lang =
          languageRef.current === "hi"
            ? "hi-IN"
            : languageRef.current === "pa"
              ? "pa-IN"
              : "en-IN";
        recognition.start();
      } catch (e) {}
    };

    recognition.onstart = () => {
      if (isListeningRef.current)
        console.log("🟢 Bolo is actively listening...");
    };

    recognition.onresult = (event: any) => {
      const current = event.results[event.results.length - 1][0].transcript;
      const lower = current.toLowerCase();

      // MODE 1: PASSIVE (Waiting for "Hey Bolo")
      if (!isListeningRef.current) {
        if (lower.includes("bolo") || lower.includes("hey bolo")) {
          recognition.stop(); // Pause mic so we don't hear our own TTS reply
          speak(languageRef.current === "hi" ? "हाँ जी?" : "Yes?");
          setBoloListening(true);
          resetInactivityTimer();
        }
      }
      // MODE 2: ACTIVE (Dictating command)
      else {
        setTranscript(current);

        if (event.results[event.results.length - 1].isFinal) {
          console.log("✅ Final Command:", current);
          recognition.stop(); // Pause mic to process AI
          handleIntentRef.current(current);
        }
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error !== "no-speech") console.warn("🚨 Mic Error:", e.error);
    };

    recognition.onend = () => {
      // The absolute failsafe: If it dies, force it back to life instantly
      if (!isBoloSleeping) {
        setTimeout(startMic, 100);
      }
    };

    // Ignite the engine
    startMic();

    return () => {
      recognition.onend = null;
      recognition.stop();
    };
    // Notice how isBoloListening is NOT in the array. This prevents the infinite restart loop!
  }, [isBoloSleeping, speak, setBoloListening, resetInactivityTimer]);

  const isVisible =
    isBoloListening || isProcessing || showResponse || transcript !== "";

  // --- UI RENDER ---
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

      {/* Sleeping Toast */}
      <AnimatePresence>
        {isBoloSleeping && !isBoloListening && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => {
              resetInactivityTimer();
              setBoloListening(true);
            }}
            className="fixed bottom-24 right-6 bg-amber-500/10 backdrop-blur-md border border-amber-500/30 px-4 py-2 rounded-2xl flex items-center gap-3 hover:bg-amber-500/20 transition-all z-[100] shadow-lg shadow-amber-900/20"
          >
            <Moon className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-amber-500 uppercase tracking-tighter">
              Bolo Sleep Mode{" "}
              <span className="underline ml-1 opacity-70">Tap to wake</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
        {/* Main Bolo Modal */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-[340px] rounded-[2.5rem] p-6 shadow-2xl border border-white/20 bg-black/85 backdrop-blur-3xl pointer-events-auto flex flex-col"
            >
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

              {/* Text Chat Input */}
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

        {/* Floating Mic Button */}
        <motion.button
          onClick={() => {
            if (!isBoloListening) resetInactivityTimer();
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

          {/* Subtle ring to show wake-word is active */}
          {!isBoloSleeping && !isBoloListening && (
            <span className="absolute -inset-2 border-2 border-primary/30 rounded-full animate-ping" />
          )}
        </motion.button>
      </div>
    </>
  );
}
