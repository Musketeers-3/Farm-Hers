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
//           pa: "ਹੁਣ ਮੈਂ ਹਿੰਦੀ ਵਿੱਚ ਗੱਲ ਕਰਾਂगा।",
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
import { Mic, X, Sparkles, Loader2, Volume2, Send } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const GLASS_CLASSES =
  "bg-white/[0.55] dark:bg-slate-900/[0.55] backdrop-blur-[24px] border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]";

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
  const [textInput, setTextInput] = useState("");
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const lastCropRef = useRef<string | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionInitializedRef = useRef(false);

  // 🚀 NATIVE OFFLINE SPEECH SYNTHESIS (The Hinglish Hack)
  const speak = useCallback((textToSpeak: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop any current speech

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // 🚀 THE HACK: Force the Indian-English voice to read Hinglish/Punglish
    // It sounds 10x more natural than the robotic native Hindi voice.
    utterance.lang = "en-IN";
    utterance.rate = 0.95; // Slightly slower for a warmer tone
    utterance.pitch = 1.0;

    // Attempt to find a high-quality native voice
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(
      (v) =>
        v.lang === "en-IN" &&
        (v.name.includes("Natural") ||
          v.name.includes("Premium") ||
          v.name.includes("Google")),
    );

    if (premiumVoice) utterance.voice = premiumVoice;

    window.speechSynthesis.speak(utterance);
  }, []); // Removed language dependency since we strictly use en-IN

  // ─── INTENT RESOLVER (BRAIN) ───
  const handleIntent = useCallback(
    async (input: string) => {
      if (!input.trim()) return;
      setIsProcessing(true);
      setTranscript(input);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await fetch("/api/parse-bid", {
          method: "POST",
          headers: { "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcript: input,
            language,
            context: { lastCrop: lastCropRef.current },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const result = await res.json();

        if (result.success && result.data) {
          const ai = result.data;

          setResponse(ai.reply);
          if (ai.reply) speak(ai.reply);
          setShowResponse(true);

          if (ai.crop) lastCropRef.current = ai.crop;

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
              // Try to match crop by ID first, then by name
              const targetCrop =
                crops.find((c) => c.id === ai.crop) ||
                crops.find(
                  (c) =>
                    c.name.toLowerCase() === ai.crop?.toLowerCase() ||
                    c.nameHi.includes(ai.crop || "") ||
                    c.namePa.includes(ai.crop || ""),
                );

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
                const successMsg =
                  language === "hi"
                    ? `${targetCrop.nameHi} की नीलामी शुरू की।`
                    : `Listing ${targetCrop.name} for auction.`;
                setResponse(successMsg);
                speak(successMsg);
                setTimeout(() => router.push("/farmer"), 3500);
              } else {
                const noCropMsg =
                  language === "hi"
                    ? "फसल नहीं मिली।"
                    : "Crop not found.";
                setResponse(noCropMsg);
                speak(noCropMsg);
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
              // Try to match crop by ID first, then by name
              const targetCrop =
                crops.find((c) => c.id === ai.crop) ||
                crops.find(
                  (c) =>
                    c.name.toLowerCase() === ai.crop?.toLowerCase() ||
                    c.nameHi.includes(ai.crop || "") ||
                    c.namePa.includes(ai.crop || ""),
                );

              if (!targetCrop) {
                const noCropMsg =
                  language === "hi"
                    ? "फसल नहीं मिली।"
                    : "Crop not found.";
                setResponse(noCropMsg);
                speak(noCropMsg);
                return;
              }

              const targetAuction = auctions.find(
                (a) => a.cropId === targetCrop.id,
              );

              if (!targetAuction) {
                const noAuctionMsg =
                  language === "hi"
                    ? `${targetCrop.nameHi} की कोई नीलामी नहीं है।`
                    : `No active auction for ${targetCrop.name}.`;
                setResponse(noAuctionMsg);
                speak(noAuctionMsg);
              } else if (ai.amount > targetAuction.currentBid) {
                placeBid(
                  targetAuction.id,
                  ai.amount,
                  userProfile?.uid || "buyer-1",
                );
                const bidMsg =
                  language === "hi"
                    ? `₹${ai.amount} की बोली लगा दी।`
                    : `Bid of ₹${ai.amount} placed.`;
                setResponse(bidMsg);
                speak(bidMsg);
                setTimeout(
                  () => router.push(`/buyer/auctions/${targetAuction.id}`),
                  3000,
                );
              } else {
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
            // Validate the target screen exists
            const validScreens = [
              "sell",
              "auction",
              "tracking",
              "market",
              "profile",
              "notifications",
              "earnings",
              "demands",
              "pools",
            ];
            if (validScreens.includes(ai.target)) {
              const basePath = userRole === "farmer" ? "/farmer" : "/buyer";
              const navMsg =
                language === "hi"
                  ? `${ai.target} खोल रहा हूँ।`
                  : `Opening ${ai.target}.`;
              setResponse(navMsg);
              speak(navMsg);
              setTimeout(() => router.push(`${basePath}/${ai.target}`), 2000);
            } else {
              const invalidMsg =
                language === "hi"
                  ? "वह स्क्रीन नहीं मिली।"
                  : "Screen not found.";
              setResponse(invalidMsg);
              speak(invalidMsg);
            }
          }
          // SOCIAL/GREETING INTENT
          else if (ai.intent === "social") {
            // Already handled by ai.reply above
          }
          // UNKNOWN INTENT - suggest text input
          else if (ai.intent === "unknown" || !ai.intent) {
            const helpMsg =
              language === "hi"
                ? "मदद के लिए टाइप करें। जैसे - गेहूं 100 क्विंटल 2500 में बेचो"
                : "Type a command. Like - sell 100 quintals wheat at 2500";
            setResponse(helpMsg);
            speak(helpMsg);
          }
        } else {
          const errorMsg =
            language === "hi" ? "मैं समझ नहीं पाया।" : "I didn't catch that.";
          setResponse(errorMsg);
          speak(errorMsg);
          setShowResponse(true);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log("[Bolo] API Error:", error);
        }
        const netError =
          language === "hi"
            ? "नेटवर्क एरर। फिर से कोशिश करें।"
            : "Network error. Try again.";
        setResponse(netError);
        speak(netError);
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

  // ─── PUSH-TO-TALK ENGINE (MIC LOGIC) ───
  const recognitionRef = useRef<any>(null);
  const handleIntentRef = useRef(handleIntent);
  const languageRef = useRef(language);

  useEffect(() => {
    handleIntentRef.current = handleIntent;
  }, [handleIntent]);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError(
        language === "hi"
          ? "आपका ब्राउज़र वॉयस सपोर्ट नहीं करता। टाइप करके कमांड दें।"
          : "Voice not supported in this browser. Use text input instead.",
      );
    }
  }, [language]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognition || recognitionInitializedRef.current) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Clear any existing silence timer
    const clearSilenceTimer = () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };

    // Add onstart to debug
    recognition.onstart = () => console.log("[Bolo] Recognition onstart");

    // Keep track of listening state in a ref for onend handler
    const shouldKeepListening = () => {
      // This will be updated by the effect below
      return true;
    };

    recognition.onresult = (event: any) => {
      clearSilenceTimer();
      const result = event.results[event.results.length - 1];
      const current = result[0].transcript;
      setTranscript(current);

      if (result.isFinal) {
        setBoloListening(false);
        if (current.trim()) {
          handleIntentRef.current(current);
        } else {
          const emptyMsg =
            languageRef.current === "hi"
              ? "कोई आवाज़ नहीं मिली।"
              : "No speech detected.";
          setError(emptyMsg);
          setTimeout(() => setError(null), 3000);
        }
      } else {
        // Reset silence timer when user is speaking
        silenceTimerRef.current = setTimeout(() => {
          // If no final result after 3 seconds of interim results, stop listening
          setBoloListening(false);
          const timeoutMsg =
            languageRef.current === "hi"
              ? "बहुत देर तक बोला नहीं।"
              : "You stopped speaking.";
          setError(timeoutMsg);
          setTimeout(() => setError(null), 3000);
        }, 3000);
      }
    };

    recognition.onerror = (event: any) => {
      clearSilenceTimer();

      // "aborted" is not an error - it happens when user stops listening manually
      if (event.error === "aborted") {
        setBoloListening(false);
        return;
      }

      if (event.error === "not-allowed") {
        setPermissionDenied(true);
        setError(
          languageRef.current === "hi"
            ? "माइक की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग में जाएं।"
            : "Microphone permission denied. Please enable in browser settings.",
        );
        setTimeout(() => setError(null), 5000);
      } else if (event.error === "no-speech") {
        const noSpeechMsg =
          languageRef.current === "hi"
            ? "कोई आवाज़ नहीं सुनाई दी।"
            : "No speech detected. Try again.";
        setError(noSpeechMsg);
        setTimeout(() => setError(null), 3000);
      } else if (event.error !== "aborted") {
        // Don't show error for aborted (when we manually stop)
        setError(
          languageRef.current === "hi"
            ? "आवाज़ पहचान में समस्या है।"
            : "Voice recognition error.",
        );
        setTimeout(() => setError(null), 3000);
      }
      setBoloListening(false);
    };

    recognition.onend = () => {
      console.log("[Bolo] Recognition onend");
      clearSilenceTimer();
      setBoloListening(false);
      recognitionInitializedRef.current = false;
    };

    recognitionRef.current = recognition;
    recognitionInitializedRef.current = true;

    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      recognitionInitializedRef.current = false;
    };
    // Only run once on mount - remove setBoloListening from deps to prevent re-init
  }, []);

  // Track if recognition is active to prevent loops
  const isRecognizingRef = useRef(false);

  // Simple handler to start listening
  const startListening = useCallback(() => {
    if (isRecognizingRef.current) return;

    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported");
      return;
    }

    const lang = language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";

    isRecognizingRef.current = true;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => console.log("[Bolo] Recognition onstart - ready to hear");
    recognition.onend = () => console.log("[Bolo] Recognition onend");

    recognition.onresult = (event: any) => {
      console.log("[Bolo] onresult fired, results:", event.results.length, "transcript:", event.results[0][0].transcript);
      const result = event.results[event.results.length - 1];
      setTranscript(result[0].transcript);
      if (result.isFinal && result[0].transcript.trim()) {
        console.log("[Bolo] Final transcript:", result[0].transcript);
        setBoloListening(false);
        handleIntent(result[0].transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.log("[Bolo] Error:", event.error);
      isRecognizingRef.current = false;
      // Only handle actual errors, not "aborted" which is normal
      if (event.error === "not-allowed") {
        setPermissionDenied(true);
        setBoloListening(false);
      } else if (event.error !== "aborted" && event.error !== "no-speech") {
        // For other errors, show and reset
        setBoloListening(false);
      }
      // For no-speech or aborted, let it naturally end
    };

    recognition.onend = () => {
      console.log("[Bolo] Ended");
      isRecognizingRef.current = false;
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.log("[Bolo] Start failed:", e);
      isRecognizingRef.current = false;
    }
  }, [language, handleIntent]);

  // Handle stopping
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    isRecognizingRef.current = false;
  }, []);

  // Removed automatic effect - will start directly from button

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
            className="fixed inset-0 z-90 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-24 right-6 sm:bottom-6 sm:right-6 z-100 flex flex-col items-end gap-4">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "w-85 rounded-4xl p-6 pointer-events-auto flex flex-col shadow-2xl",
                GLASS_CLASSES,
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold text-slate-900 dark:text-slate-50 tracking-wide text-xs uppercase">
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
                  className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors bg-white/40 dark:bg-white/10 p-1.5 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="min-h-25 flex flex-col justify-center text-center mb-6">
                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl"
                    >
                      <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {isBoloListening && !isProcessing && (
                    <motion.div
                      key="listen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-5"
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
                            className="w-1.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                          />
                        ))}
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 font-serif italic text-lg leading-tight">
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
                      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 tracking-widest uppercase font-bold">
                        Processing Context
                      </p>
                    </motion.div>
                  )}

                  {showResponse && (
                    <motion.div
                      key="resp"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="p-3 rounded-full bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <Volume2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-slate-900 dark:text-slate-50 font-bold px-2 leading-relaxed text-lg">
                        {response}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
                    className="w-full bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all backdrop-blur-md"
                  />
                  <button
                    type="submit"
                    disabled={!textInput.trim() || isProcessing}
                    className="absolute right-2 p-2 bg-emerald-500 rounded-xl text-white disabled:opacity-50 hover:bg-emerald-600 transition-colors shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🎙️ THE FLOATING MIC BUTTON */}
        <motion.button
          onClick={() => {
            if (!isSupported || permissionDenied) {
              setError(
                language === "hi"
                  ? "वॉयस फीचर उपलब्ध नहीं है।"
                  : "Voice feature not available.",
              );
              setTimeout(() => setError(null), 3000);
              return;
            }
            // Directly toggle listening instead of using state
            if (isBoloListening) {
              stopListening();
              setBoloListening(false);
            } else {
              setBoloListening(true);
              startListening();
            }
            setTranscript("");
          }}
          whileTap={{ scale: 0.9 }}
          disabled={!isSupported || permissionDenied}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-2 transition-all duration-500 relative",
            !isSupported || permissionDenied
              ? "bg-slate-400 border-slate-300 cursor-not-allowed"
              : isBoloListening
                ? "bg-red-500 border-red-400"
                : "bg-emerald-600 border-emerald-500 hover:bg-emerald-500",
          )}
        >
          {!isSupported || permissionDenied ? (
            <Mic className="w-7 h-7 text-slate-200" />
          ) : isBoloListening ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <Mic className="w-7 h-7 text-white" />
          )}
        </motion.button>
      </div>
    </>
  );
}
