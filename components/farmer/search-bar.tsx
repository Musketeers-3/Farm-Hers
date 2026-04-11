"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp, MapPin, Wheat, Mic } from "lucide-react";
import { useAppStore, useTranslation } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const suggestions = [
  { type: "crop", label: "Wheat", icon: Wheat },
  { type: "crop", label: "Rice", icon: Wheat },
  { type: "crop", label: "Mustard", icon: Wheat },
  { type: "mandi", label: "Ludhiana Mandi", icon: MapPin },
  { type: "mandi", label: "Amritsar Mandi", icon: MapPin },
  { type: "trending", label: "Mustard prices rising", icon: TrendingUp },
];

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isBoloListening = useAppStore((state) => state.isBoloListening);
  const setBoloListening = useAppStore((state) => state.setBoloListening);
  const t = useTranslation();

  const filtered = query
    ? suggestions.filter((s) =>
        s.label.toLowerCase().includes(query.toLowerCase()),
      )
    : suggestions;

  // Handle clicking outside to close the search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: (typeof suggestions)[0]) => {
    if (item.type === "mandi" || item.type === "trending") {
      router.push("/farmer/market");
    }
    setQuery("");
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery("");
    inputRef.current?.focus();
  };

  const toggleBolo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBoloListening(!isBoloListening);
  };

  return (
    <>
      {/* 1. CINEMATIC OVERLAY (Dims the dashboard when searching) */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={() => setIsFocused(false)}
          />
        )}
      </AnimatePresence>

      {/* SEARCH CONTAINER */}
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl mx-auto z-50"
      >
        {/* 2. THE SEARCH PILL */}
        <motion.div
          layout
          className={cn(
            "flex items-center gap-3 px-4 py-3 sm:py-4 rounded-2xl sm:rounded-3xl transition-all duration-300",
            isFocused
              ? "bg-card shadow-2xl ring-2 ring-primary/30 border border-primary/20"
              : "bg-card/60 backdrop-blur-xl premium-shadow border border-border/50 hover:border-primary/30 cursor-pointer",
          )}
          onClick={() => {
            setIsFocused(true);
            inputRef.current?.focus();
          }}
        >
          <Search
            className={cn(
              "w-5 h-5 shrink-0 transition-colors duration-300",
              isFocused ? "text-primary" : "text-muted-foreground",
            )}
          />

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={
              isBoloListening ? t.listening : "Search crops, mandis, buyers..."
            }
            className={cn(
              "flex-1 bg-transparent text-base sm:text-lg outline-none truncate placeholder:text-muted-foreground/70",
              isBoloListening &&
                "text-primary font-bold placeholder:text-primary/70",
            )}
          />

          {/* Right Side Buttons (Clear or Mic) */}
          <AnimatePresence mode="wait">
            {isFocused && query.length > 0 ? (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 shrink-0 transition-colors"
              >
                <X className="w-4 h-4 text-foreground" />
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={toggleBolo}
                className={cn(
                  "relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                  isBoloListening
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary-rgb),0.6)] scale-105"
                    : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary",
                )}
              >
                {isBoloListening && (
                  <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-60" />
                )}
                <Mic
                  className={cn(
                    "relative z-10",
                    isBoloListening ? "w-5 h-5" : "w-4 h-4 sm:w-5 sm:h-5",
                  )}
                />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 3. GLASSMORPHIC DROPDOWN */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-3 rounded-3xl shadow-2xl border border-border/40 overflow-hidden bg-card/95 backdrop-blur-2xl"
            >
              <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-2 sm:p-3">
                {filtered.length === 0 ? (
                  <div className="p-6 text-center text-sm font-medium text-muted-foreground">
                    No results found for "{query}"
                  </div>
                ) : (
                  <>
                    <div className="px-4 pt-2 pb-3 text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                      {query ? "Top Results" : "Suggested"}
                    </div>

                    <div className="space-y-1">
                      {filtered.slice(0, 5).map((item, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => handleSelect(item)}
                          className="w-full flex items-center gap-4 px-3 py-2.5 sm:py-3 rounded-2xl hover:bg-secondary/80 text-left transition-colors group"
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                              "bg-background border border-border/50 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary",
                            )}
                          >
                            <item.icon className="w-5 h-5" strokeWidth={2} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="block text-sm sm:text-base font-bold truncate text-foreground group-hover:text-primary transition-colors">
                              {item.label}
                            </span>
                            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                              {item.type}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
