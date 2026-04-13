"use client";
 
import { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp, MapPin, Wheat, Mic } from "lucide-react";
import { useAppStore, useTranslation } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
 
const suggestions = [
  { type: "crop",     label: "Wheat",                icon: Wheat },
  { type: "crop",     label: "Rice",                 icon: Wheat },
  { type: "crop",     label: "Mustard",              icon: Wheat },
  { type: "mandi",    label: "Ludhiana Mandi",       icon: MapPin },
  { type: "mandi",    label: "Amritsar Mandi",       icon: MapPin },
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
      {/* Cinematic overlay from file 10 */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40"
            onClick={() => setIsFocused(false)}
          />
        )}
      </AnimatePresence>
 
      <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-50">
        {/* Search Pill — UI from file 9 (pure white, no border) */}
        <motion.div
          layout
          className={cn(
            "flex items-center gap-3 px-4 py-2 sm:py-3 rounded-2xl sm:rounded-full transition-all duration-300 border-none",
            isFocused
              ? "bg-white shadow-2xl ring-2 ring-green-600/10"
              : "bg-white shadow-md hover:shadow-lg cursor-pointer",
          )}
          onClick={() => {
            setIsFocused(true);
            inputRef.current?.focus();
          }}
        >
          <Search
            className={cn(
              "w-5 h-5 shrink-0 transition-colors duration-300 ml-1",
              isFocused ? "text-green-700" : "text-slate-400",
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
              "flex-1 bg-transparent text-base sm:text-lg outline-none truncate font-bold text-slate-950 placeholder:text-slate-400",
              isBoloListening && "text-green-700 font-black",
            )}
          />
 
          <AnimatePresence mode="wait">
            {isFocused && query.length > 0 ? (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 shrink-0"
              >
                <X className="w-4 h-4 text-slate-950" />
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={toggleBolo}
                // Mic UI from file 9 — mint bg, no border, bright shadow
                className={cn(
                  "relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border-none shadow-[0_0_15px_rgba(240,253,244,1)]",
                  isBoloListening
                    ? "bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.5)] scale-110"
                    : "bg-[#f0fdf4] text-green-800 hover:bg-[#dcfce7]",
                )}
              >
                {isBoloListening && (
                  <span className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-30" />
                )}
                <Mic
                  className="relative z-10 w-5 h-5"
                  strokeWidth={2.5}
                />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
 
        {/* Dropdown — UI from file 9 (white, no border) + stagger motion from file 10 */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-3 rounded-3xl shadow-2xl overflow-hidden bg-white border-none"
            >
              <div className="max-h-[320px] overflow-y-auto p-2 sm:p-3">
                {filtered.length === 0 ? (
                  <div className="p-6 text-center text-sm font-black text-slate-400">
                    No results for "{query}"
                  </div>
                ) : (
                  <>
                    <div className="px-4 pt-2 pb-3 text-[10px] font-black tracking-widest uppercase text-slate-400">
                      {query ? "Top Results" : "Trending"}
                    </div>
 
                    <div className="space-y-1">
                      {filtered.slice(0, 5).map((item, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => handleSelect(item)}
                          className="w-full flex items-center gap-4 px-3 py-2.5 sm:py-3 rounded-2xl hover:bg-[#f0fdf4] text-left transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 group-hover:bg-white transition-colors">
                            <item.icon
                              className="w-5 h-5 text-green-800"
                              strokeWidth={3}
                            />
                          </div>
 
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm sm:text-base font-black truncate text-slate-950 group-hover:text-green-800 transition-colors">
                              {item.label}
                            </span>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-green-700">
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