// components/onboarding/onboarding-screen.tsx
"use client";

import { useState } from "react";
import { useAppStore, useTranslation } from "@/lib/store";
import { AgriLinkLogo } from "@/components/agrilink-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { LoginComponent } from "@/components/auth/login-component";
import {
  ArrowRight,
  Sprout,
  Users,
  TrendingUp,
  Shield,
  ArrowLeft,
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
    desc: "Get real-time prices from mandis near you",
  },
  {
    icon: Users,
    title: "Micro-Pooling",
    titleHi: "माइक्रो-पूलिंग",
    titlePa: "ਮਾਈਕਰੋ-ਪੂਲਿੰਗ",
    desc: "Combine crops with neighbors for better rates",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    titleHi: "सुरक्षित भुगतान",
    titlePa: "ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ",
    desc: "Escrow protected transactions",
  },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<"farmer" | "buyer" | null>(
    null,
  );

  const language = useAppStore((state) => state.language);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const t = useTranslation();

  const handleRoleSelect = (role: "farmer" | "buyer") => {
    setSelectedRole(role);
    setUserRole(role);
    setStep(2); // Move to the integrated Login step
  };

  // STEP 2: Full Screen Login Mode
  // We return early here so the login component has total control over the screen and background
  if (step === 2 && selectedRole) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="login-flow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full min-h-screen"
        >
          <LoginComponent
            role={selectedRole}
            onBack={() => setStep(1)}
            onLogin={onComplete}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // STEPS 0 & 1: Hero and Role Selection Mode
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-wheat.jpg"
          alt="Golden wheat fields"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="flex items-center justify-between p-6">
          <AgriLinkLogo size="md" />
          <LanguageSwitcher />
        </header>

        <main className="flex-1 flex flex-col justify-end px-6 pb-12 pt-20 max-w-md mx-auto w-full">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <HeroStep language={language} t={t} onNext={() => setStep(1)} />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
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
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Text */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold text-primary tracking-wide uppercase">
            {language === "hi"
              ? "भारत के किसानों के लिए"
              : language === "pa"
                ? "ਭਾਰਤ ਦੇ ਕਿਸਾਨਾਂ ਲਈ"
                : "For Bharat's Farmers"}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground leading-tight text-balance">
          {language === "hi" ? (
            <>
              खेती का <span className="text-gradient-green">नया युग</span>
            </>
          ) : language === "pa" ? (
            <>
              ਖੇਤੀ ਦਾ <span className="text-gradient-green">ਨਵਾਂ ਯੁੱਗ</span>
            </>
          ) : (
            <>
              The New Era of{" "}
              <span className="text-gradient-green">Agriculture</span>
            </>
          )}
        </h1>

        <p className="text-base text-muted-foreground max-w-[280px] text-pretty leading-relaxed">
          {language === "hi"
            ? "बेहतर उपज और फैसलों के लिए स्मार्ट टूल्स के साथ किसानों को सशक्त बनाना।"
            : language === "pa"
              ? "ਬਿਹਤਰ ਉਪਜ ਅਤੇ ਫੈਸਲਿਆਂ ਲਈ ਸਮਾਰਟ ਟੂਲਜ਼ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਸ਼ਕਤੀਸ਼ਾਲੀ ਬਣਾਉਣਾ।"
              : "Empowering farmers with smart tools for better yields and decisions."}
        </p>
      </div>

      {/* Features */}
      <div className="space-y-3">
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3.5 rounded-2xl glass-card animate-in fade-in slide-in-from-left-4"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm tracking-tight">
                {language === "hi"
                  ? feature.titleHi
                  : language === "pa"
                    ? feature.titlePa
                    : feature.title}
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Button
        onClick={onNext}
        size="lg"
        className="w-full h-14 rounded-full bg-gradient-to-r from-primary to-agri-olive text-base font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover-lift"
      >
        {t.getStarted}
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>

      {/* Floating indicators - Hidden on tiny screens to prevent clutter */}
      <div className="hidden sm:flex absolute top-1/4 -left-4 glass-card px-4 py-2.5 rounded-full animate-float premium-shadow">
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4 text-agri-success" />
          <span className="text-xs font-bold text-foreground tracking-tight">
            Growth: 12 cm
          </span>
        </div>
      </div>

      <div
        className="hidden sm:flex absolute top-1/3 -right-4 glass-card px-4 py-2.5 rounded-full animate-float premium-shadow"
        style={{ animationDelay: "1s" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-agri-sage flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">H2O</span>
          </div>
          <span className="text-xs font-bold text-foreground tracking-tight">
            Moisture: 75%
          </span>
        </div>
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-semibold transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">
          {language === "hi"
            ? "आप कौन हैं?"
            : language === "pa"
              ? "ਤੁਸੀਂ ਕੌਣ ਹੋ?"
              : "Who are you?"}
        </h2>
        <p className="text-sm font-medium text-muted-foreground">
          {language === "hi"
            ? "अपनी भूमिका चुनें"
            : language === "pa"
              ? "ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ"
              : "Select your role to continue"}
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
                : "Purchase produce"
          }
          image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop"
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
  onClick,
}: {
  title: string;
  desc: string;
  image: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-3xl aspect-[4/5] w-full",
        "hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 premium-shadow",
      )}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
        <h3 className="text-lg font-bold tracking-tight text-white drop-shadow-sm">
          {title}
        </h3>
        <p className="text-xs font-medium text-white/80 mt-0.5">{desc}</p>
      </div>
    </button>
  );
}
