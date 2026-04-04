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
    <div className="flex items-center gap-1 p-1 rounded-full bg-muted/50">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all",
            language === lang.code
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          title={lang.label}
        >
          {lang.native}
        </button>
      ))}
    </div>
  )
}
