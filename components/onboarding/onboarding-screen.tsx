"use client";

import { useState } from "react";
import { useAppStore, useTranslation } from "@/lib/store";
import { AgriLinkLogo } from "@/components/agrilink-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sprout, Users, TrendingUp, Shield ,ArrowLeft} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  const language = useAppStore((state) => state.language);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const t = useTranslation();

  const handleRoleSelect = (role: "farmer" | "buyer") => {
    setUserRole(role);
    onComplete(role);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-wheat.jpg"
          alt="Golden wheat fields"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4">
          <AgriLinkLogo size="md" />
          <LanguageSwitcher />
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col justify-end px-6 pb-8 pt-20">
          {step === 0 ? (
            <HeroStep language={language} t={t} onNext={() => setStep(1)} />
          ) : (
            <RoleSelectStep
              language={language}
              onSelect={handleRoleSelect}
              onBack={() => setStep(0)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

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
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sprout className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium text-primary">
            {language === "hi"
              ? "भारत के किसानों के लिए"
              : language === "pa"
                ? "ਭਾਰਤ ਦੇ ਕਿਸਾਨਾਂ ਲਈ"
                : "For Bharat's Farmers"}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight text-balance">
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

        <p className="text-lg text-muted-foreground max-w-sm text-pretty">
          {language === "hi"
            ? "बेहतर उपज और फैसलों के लिए स्मार्ट टूल्स के साथ किसानों को सशक्त बनाना"
            : language === "pa"
              ? "ਬਿਹਤਰ ਉਪਜ ਅਤੇ ਫੈਸਲਿਆਂ ਲਈ ਸਮਾਰਟ ਟੂਲਜ਼ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਸ਼ਕਤੀਸ਼ਾਲੀ ਬਣਾਉਣਾ"
              : "Empowering farmers with smart tools for better yields and decisions"}
        </p>
      </div>

      {/* Features */}
      <div className="space-y-3">
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl glass-card animate-in fade-in slide-in-from-left-4"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">
                {language === "hi"
                  ? feature.titleHi
                  : language === "pa"
                    ? feature.titlePa
                    : feature.title}
              </h3>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Button
        onClick={onNext}
        size="lg"
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-agri-olive text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
      >
        {t.getStarted}
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>

      {/* Floating indicators */}
      <div className="absolute top-1/4 left-4 glass-card px-3 py-2 rounded-full animate-float">
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4 text-agri-success" />
          <span className="text-xs font-medium text-foreground">
            Growth: 12 cm
          </span>
        </div>
      </div>

      <div
        className="absolute top-1/3 right-4 glass-card px-3 py-2 rounded-full animate-float"
        style={{ animationDelay: "1s" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-agri-sage flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">H2O</span>
          </div>
          <span className="text-xs font-medium text-foreground">
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
  onBack
}: {
  language: string;
  onSelect: (role: "farmer" | "buyer") => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          {language === "hi"
            ? "आप कौन हैं?"
            : language === "pa"
              ? "ਤੁਸੀਂ ਕੌਣ ਹੋ?"
              : "Who are you?"}
        </h2>
        <p className="text-muted-foreground">
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
        "group relative overflow-hidden rounded-3xl aspect-[3/4]",
        "hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
      )}
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-white/70">{desc}</p>
      </div>
    </button>
  );
}
