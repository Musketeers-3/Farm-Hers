"use client";

import { useState, useEffect } from "react";
import { useAppStore, useTranslation } from "@/lib/store";
import { AgriLinkLogo } from "@/components/agrilink-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sprout,
  Users,
  TrendingUp,
  Shield,
  ArrowLeft,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingScreenProps {
  onComplete: (role: "farmer" | "buyer") => void;
}

const features = [
  {
    icon: TrendingUp,
    title: "Live Market Prices",
    titleHi: "लाइव मार्केट प्राइस",
    titlePa: "ਲਾਈਵ ਮਾਰਕੀਟ ਕੀਮਤਾਂ",
    desc: "Real-time mandi rates",
  },
  {
    icon: Users,
    title: "Micro-Pooling",
    titleHi: "माइक्रो-पूलिंग",
    titlePa: "ਮਾਈਕਰੋ-ਪੂਲਿੰਗ",
    desc: "Combine crops for better rates",
  },
  {
    icon: Shield,
    title: "Secure Escrow",
    titleHi: "सुरक्षित भुगतान",
    titlePa: "ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ",
    desc: "100% protected transactions",
  },
];

const bgImages = [
  "/images/hero-wheat.jpg",
  "/images/hero-tractor.jpg",
  "/images/market-bg.jpg",
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);

  const language = useAppStore((state) => state.language);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const t = useTranslation();

  // 🚀 Ultra-Smooth, Slower Background Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 8000); // 8 seconds per image
    return () => clearInterval(timer);
  }, []);

  const handleRoleSelect = (role: "farmer" | "buyer") => {
    setUserRole(role);
    onComplete(role);
  };

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden selection:bg-primary/30">
      {/* 🚀 CINEMATIC BACKGROUND SLIDER */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, scale: 1 }}
            // Scale duration is longer than the interval so it never stops moving
            animate={{ opacity: 0.65, scale: 1.15 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 2.5, ease: "easeInOut" },
              scale: { duration: 15, ease: "linear" },
            }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
            style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
          />
        </AnimatePresence>

        {/* Dynamic Vignette & Blur - Triggers when moving to Step 1 */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-in-out",
            step === 1
              ? "backdrop-blur-xl bg-black/40"
              : "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-[#050505]/90",
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="flex items-center justify-between p-6">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-2 border border-white/10 shadow-lg">
            <AgriLinkLogo size="md" />
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
            <LanguageSwitcher />
          </div>
        </header>

        <main className="flex-1 flex flex-col justify-end px-6 pb-12 pt-20 max-w-md mx-auto w-full">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
              >
                <HeroStep language={language} t={t} onNext={() => setStep(1)} />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="role"
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <RoleSelectStep
                  language={language}
                  onSelect={handleRoleSelect}
                  onBack={() => setStep(0)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------------------

function HeroStep({
  language,
  t,
  onNext,
}: {
  language: string;
  t: ReturnType<typeof useTranslation>;
  onNext: () => void;
}) {
  const [moisture, setMoisture] = useState(75);
  const [growth, setGrowth] = useState(12.4);

  useEffect(() => {
    const timer = setInterval(() => {
      setMoisture((prev) => (prev === 75 ? 76 : prev === 76 ? 74 : 75));
      setGrowth((prev) => +(prev + 0.1).toFixed(1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 relative">
      {/* Live Floating Widgets */}
      <div className="absolute -top-32 left-0 hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full shadow-2xl animate-float">
        <Activity className="w-4 h-4 text-green-400" />
        <span className="text-xs font-bold text-white tracking-[0.2em]">
          IOT SYNC: ACTIVE
        </span>
      </div>

      <div
        className="absolute -top-16 -right-8 hidden md:flex items-center gap-3 bg-black/50 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl shadow-2xl animate-float"
        style={{ animationDelay: "1s" }}
      >
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
          <span className="text-[10px] text-blue-400 font-bold">H2O</span>
        </div>
        <div>
          <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest">
            Soil Moisture
          </p>
          <p className="text-sm font-black text-white">
            {moisture}%{" "}
            <span className="text-green-400 text-[10px] font-medium ml-1">
              Optimal
            </span>
          </p>
        </div>
      </div>

      {/* Hero Text */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">
            {language === "hi"
              ? "भारत के किसानों के लिए"
              : language === "pa"
                ? "ਭਾਰਤ ਦੇ ਕਿਸਾਨਾਂ ਲਈ"
                : "For Bharat's Farmers"}
          </span>
        </div>

        <h1 className="text-5xl font-serif font-bold tracking-tight text-white leading-[1.1] text-balance drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          {language === "hi" ? (
            <>
              खेती का{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                नया युग
              </span>
            </>
          ) : language === "pa" ? (
            <>
              ਖੇਤੀ ਦਾ{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                ਨਵਾਂ ਯੁੱਗ
              </span>
            </>
          ) : (
            <>
              The New Era of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-primary drop-shadow-none">
                Agriculture
              </span>
            </>
          )}
        </h1>

        <p className="text-base text-white/80 max-w-[280px] text-pretty leading-relaxed drop-shadow-md font-medium">
          {language === "hi"
            ? "बेहतर उपज और फैसलों के लिए स्मार्ट टूल्स के साथ किसानों को सशक्त बनाना।"
            : language === "pa"
              ? "ਬਿਹਤਰ ਉਪਜ ਅਤੇ ਫੈਸਲਿਆਂ ਲਈ ਸਮਾਰਟ ਟੂਲਜ਼ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਸ਼ਕਤੀਸ਼ਾਲੀ ਬਣਾਉਣਾ।"
              : "Empowering farmers with smart tools for better yields and decisions."}
        </p>
      </div>

      {/* Features Mini-Bento */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-5 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center flex-shrink-0 shadow-inner">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-tight drop-shadow-sm">
                {language === "hi"
                  ? feature.titleHi
                  : language === "pa"
                    ? feature.titlePa
                    : feature.title}
              </h3>
              <p className="text-xs font-medium text-white/50">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 🚀 The Glowing CTA Button */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-primary rounded-[2rem] blur opacity-30 group-hover:opacity-60 transition duration-500" />
        <Button
          onClick={onNext}
          size="lg"
          className="relative w-full h-16 rounded-[2rem] bg-white text-black text-lg font-bold hover:scale-[1.02] transition-transform shadow-2xl"
        >
          {t.getStarted}
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}

function RoleSelectStep({
  language,
  onSelect,
  onBack,
}: {
  language: string;
  onSelect: (role: "farmer" | "buyer") => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6 w-full relative z-20">
      <button
        onClick={onBack}
        className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all mb-4 backdrop-blur-md border border-white/10 shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="space-y-2">
        <h2 className="text-4xl font-serif font-bold tracking-tight text-white drop-shadow-xl">
          {language === "hi"
            ? "आप कौन हैं?"
            : language === "pa"
              ? "ਤੁਸੀਂ ਕੌਣ ਹੋ?"
              : "Who are you?"}
        </h2>
        <p className="text-sm font-medium text-white/70 uppercase tracking-widest drop-shadow-md">
          {language === "hi"
            ? "अपनी भूमिका चुनें"
            : language === "pa"
              ? "ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ"
              : "Select your portal"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <RoleCard
          title={
            language === "hi" ? "किसान" : language === "pa" ? "ਕਿਸਾਨ" : "Farmer"
          }
          desc={
            language === "hi"
              ? "अपनी फसल बेचें"
              : language === "pa"
                ? "ਆਪਣੀ ਫਸਲ ਵੇਚੋ"
                : "Sell your crops"
          }
          image="/images/hero-farmer.jpg"
          icon="🚜"
          onClick={() => onSelect("farmer")}
        />
        <RoleCard
          title={
            language === "hi"
              ? "खरीदार"
              : language === "pa"
                ? "ਖਰੀਦਦਾਰ"
                : "Buyer"
          }
          desc={
            language === "hi"
              ? "उत्पाद खरीदें"
              : language === "pa"
                ? "ਉਤਪਾਦ ਖਰੀਦੋ"
                : "Enterprise Access"
          }
          image="/images/hero-tractor.jpg"
          icon="🏢"
          onClick={() => onSelect("buyer")}
        />
      </div>
    </div>
  );
}

function RoleCard({
  title,
  desc,
  image,
  icon,
  onClick,
}: {
  title: string;
  desc: string;
  image: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-[2rem] aspect-[4/5] w-full text-left",
        "hover:scale-[1.05] active:scale-[0.95] transition-all duration-500 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
      )}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out opacity-80"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blend-overlay" />

      <div className="absolute bottom-0 left-0 right-0 p-5 transform group-hover:-translate-y-2 transition-transform duration-500">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl mb-3 border border-white/20 shadow-inner">
          {icon}
        </div>
        <h3 className="text-xl font-black tracking-tight text-white drop-shadow-md">
          {title}
        </h3>
        <p className="text-[10px] font-bold text-white/70 mt-1 uppercase tracking-[0.15em]">
          {desc}
        </p>
      </div>
    </button>
  );
}
