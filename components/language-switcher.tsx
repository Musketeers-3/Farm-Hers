"use client"

import { useAppStore, type Language } from "@/lib/store"
import { cn } from "@/lib/utils"

const languages: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "EN" },
  { code: "hi", label: "Hindi", native: "अ" },
  { code: "pa", label: "Punjabi", native: "ਅ" },
]

export function LanguageSwitcher() {
  const language = useAppStore((state) => state.language)
  const setLanguage = useAppStore((state) => state.setLanguage)

  return (
    <div className="flex items-center gap-0.5 p-1 rounded-lg bg-secondary">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={cn(
            "w-8 h-8 rounded-md flex items-center justify-center text-[13px] font-medium transition-all duration-200",
            language === lang.code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
          title={lang.label}
        >
          {lang.native}
        </button>
      ))}
    </div>
  )
}
