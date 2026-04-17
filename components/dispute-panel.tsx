"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  FileText,
  ShieldAlert,
  Phone,
  X,
  UploadCloud,
  CheckCircle2,
  Loader2,
  Mic,
  Volume2,
} from "lucide-react";

export function DisputePanel() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "success"
  >("idle");
  const [boloState, setBoloState] = useState<"idle" | "speaking" | "listening">(
    "idle",
  );

  // Ref for the hidden native camera input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🚀 Triggers the phone's actual native camera
  const triggerNativeCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 🚀 Handles the actual file once taken
  const handleFileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // A photo was taken! Start the upload animation
      setUploadState("uploading");
      setTimeout(() => {
        setUploadState("success");
        setTimeout(() => {
          setIsCameraOpen(false);
          setUploadState("idle");
        }, 1500);
      }, 2000);
    }
  };

  // 🤖 The "Bolo" Voice Engine (Zero Credits Required)
  const activateBolo = () => {
    if (
      !("speechSynthesis" in window) ||
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert(
        "Your browser does not support the Web Speech API. Please use Chrome.",
      );
      return;
    }

    setBoloState("speaking");
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(
      "Payment is frozen. The buyer reported a quality issue. Do you want to open the camera to upload your evidence?",
    );

    // Optional: Tune the voice
    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    utterance.onend = () => {
      setBoloState("listening");

      // @ts-ignore - Vendor prefixes
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = "en-IN"; // Set to Indian English, can be "hi-IN" for Hindi
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("Farmer said:", transcript);

        if (
          transcript.includes("yes") ||
          transcript.includes("yeah") ||
          transcript.includes("yep") ||
          transcript.includes("haan")
        ) {
          setBoloState("idle");
          setIsCameraOpen(true); // Open the UI overlay

          // Slight delay to let the UI animation finish before hijacking the screen with the native camera
          setTimeout(() => {
            triggerNativeCamera();
          }, 600);
        } else {
          setBoloState("idle");
        }
      };

      recognition.onerror = () => setBoloState("idle");
      recognition.onend = () => setBoloState("idle");

      recognition.start();
    };

    synth.speak(utterance);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-6 p-1 rounded-3xl bg-gradient-to-br from-destructive/40 to-destructive/10 premium-shadow"
      >
        <div className="bg-background/90 backdrop-blur-2xl rounded-[22px] p-5 border border-destructive/20">
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <ShieldAlert
                className="w-6 h-6 text-destructive"
                strokeWidth={2.5}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                Payment Frozen
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                Escrow funds locked. The buyer reported high moisture content
                (15%).
              </p>
            </div>
          </div>

          {/* 🤖 Bolo Voice Assistant Banner */}
          <div className="bg-primary/10 rounded-xl p-1 mb-5 border border-primary/20">
            <button
              onClick={activateBolo}
              disabled={boloState !== "idle"}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${boloState === "listening" ? "bg-red-500 animate-pulse text-white" : "bg-primary text-primary-foreground"}`}
                >
                  {boloState === "speaking" ? (
                    <Volume2 className="w-4 h-4 animate-bounce" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </div>
                <span className="text-sm font-bold text-primary">
                  {boloState === "speaking"
                    ? "Bolo is speaking..."
                    : boloState === "listening"
                      ? "Listening (Say 'Yes')..."
                      : "Ask Bolo what to do"}
                </span>
              </div>
            </button>
          </div>

          {/* Action Required Section */}
          <h4 className="text-sm font-bold text-foreground mb-3">
            Manual Actions
          </h4>
          <div className="space-y-3 mb-4">
            <button
              onClick={() => setIsCameraOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Camera className="w-4 h-4 text-primary group-hover:text-white" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  Upload Photos
                </span>
              </div>
              <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">
                Required
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ⚡ Glassmorphic Camera Modal Overlay */}
      <AnimatePresence>
        {isCameraOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                uploadState !== "uploading" && setIsCameraOpen(false)
              }
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-[32px] p-6 pb-12 shadow-2xl border-t border-border/50"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground">
                  Secure Evidence
                </h3>
                <button
                  onClick={() => setIsCameraOpen(false)}
                  disabled={uploadState === "uploading"}
                  className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Hidden Native Camera Input */}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleFileCapture}
                className="hidden"
              />

              <div className="w-full aspect-video bg-muted/30 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center mb-6 relative overflow-hidden">
                {uploadState === "idle" && (
                  <div className="text-center">
                    <Camera className="w-10 h-10 text-muted-foreground mb-3 mx-auto" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Awaiting Native Camera...
                    </p>
                  </div>
                )}

                {uploadState === "uploading" && (
                  <div className="flex flex-col items-center z-10">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                    <p className="text-sm font-bold text-foreground">
                      Encrypting & Uploading...
                    </p>
                  </div>
                )}

                {uploadState === "success" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center z-10"
                  >
                    <CheckCircle2 className="w-12 h-12 text-agri-success mb-3" />
                    <p className="text-sm font-bold text-foreground">
                      Evidence Sent to Escrow
                    </p>
                  </motion.div>
                )}

                {uploadState === "uploading" && (
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 h-1.5 bg-primary"
                  />
                )}
              </div>

              <button
                onClick={triggerNativeCamera}
                disabled={uploadState !== "idle"}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 transition-colors flex justify-center items-center"
              >
                Launch Device Camera
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
