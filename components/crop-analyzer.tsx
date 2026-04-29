"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Leaf,
  Droplets,
  Bug,
  Award,
} from "lucide-react";

export interface QualityCheckResult {
  grade: "A" | "B" | "C";
  moisture: string;
  foreignMatter: string;
  passed: boolean;
  reason: string;
}

interface CropAnalyzerProps {
  onComplete?: (results: QualityCheckResult) => void;
}

const gradeColors = {
  A: { bg: "bg-emerald-500", text: "text-emerald-400", label: "Premium" },
  B: { bg: "bg-yellow-500", text: "text-yellow-400", label: "Standard" },
  C: { bg: "bg-red-500", text: "text-red-400", label: "Below Average" },
};

export function CropAnalyzer({ onComplete }: CropAnalyzerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<QualityCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a JPG or PNG image file.");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResults(null);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(",")[1];
      analyzeImage(base64String);
    };
  };

  const analyzeImage = async (base64Image: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/quality-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Image }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze image");
      }

      setResults(data.data);
    } catch (err: any) {
      console.error("Quality check error:", err);
      setError(err.message || "Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalyzer = () => {
    setFile(null);
    setPreviewUrl(null);
    setResults(null);
    setError(null);
  };

  const handleAttach = () => {
    if (onComplete && results) {
      onComplete(results);
    }
  };

  const gradeStyle = results ? gradeColors[results.grade] : null;

  return (
    <div className="w-full max-w-xl mx-auto rounded-[32px] p-6 sm:p-8 bg-[#030f06]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Crop Quality Check
          </h2>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-500/60 mt-1">
            AI-Powered Analysis
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!previewUrl ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`relative w-full h-64 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden
              ${isDragging ? "border-emerald-400 bg-emerald-500/10" : "border-white/20 hover:border-emerald-500/50 hover:bg-white/5"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
            />

            <div
              className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shadow-lg mb-4"
            >
              <UploadCloud className="w-8 h-8 text-emerald-400" />
            </motion.div>

            <p className="text-sm font-bold text-white mb-1">
              Upload crop photo
            </p>
            <p className="text-xs text-slate-500 font-medium">
              JPG or PNG, click or drag to upload
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full space-y-6"
          >
            <div className="relative w-full h-48 rounded-3xl overflow-hidden border border-white/10 shadow-inner bg-black">
              <img
                src={previewUrl}
                alt="Crop Preview"
                className={`w-full h-full object-cover transition-all duration-700 ${isAnalyzing ? "opacity-40 grayscale filter blur-sm" : "opacity-100"}`}
              />

              {isAnalyzing && (
                <>
                  <motion.div
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{
                      duration: 3,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                    className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_#34d399] z-20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-30">
                    <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                      <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400">
                        Analyzing Quality
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {!isAnalyzing && results && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center">
                  <div
                    className={`w-20 h-20 rounded-full ${gradeStyle?.bg} flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-3xl font-black text-black">
                      {results.grade}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className={`text-lg font-bold ${gradeStyle?.text}`}>
                    {gradeStyle?.label} Quality
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {results.reason}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        Moisture
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">
                      {results.moisture}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-1">
                      <Bug className="w-4 h-4 text-amber-400" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        Foreign Matter
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">
                      {results.foreignMatter}
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-2xl border flex items-center gap-3 ${
                    results.passed
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-red-500/10 border-red-500/20"
                  }`}
                >
                  {results.passed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <p
                      className={`font-bold ${
                        results.passed ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {results.passed ? "Quality Passed" : "Quality Check Failed"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {results.passed
                        ? "Your crop meets the quality standards"
                        : "Please ensure better quality produce"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={resetAnalyzer}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-sm transition-colors"
              >
                Upload Another
              </button>
              {!isAnalyzing && results && results.passed && (
                <button
                  onClick={handleAttach}
                  className="flex-[2] py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <Leaf className="w-4 h-4" /> Attach & Continue
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}