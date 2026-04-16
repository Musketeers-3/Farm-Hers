"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Camera,
  FileText,
  ShieldAlert,
  Phone,
  X,
  UploadCloud,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export function DisputePanel() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "success"
  >("idle");

  // 🚀 Demo Simulator: Fakes a realistic 2-second upload progress
  const handleSimulateUpload = () => {
    setUploadState("uploading");
    setTimeout(() => {
      setUploadState("success");
      setTimeout(() => {
        setIsCameraOpen(false);
        setUploadState("idle"); // Reset for the next demo
      }, 1500);
    }, 2000);
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
                Payment Frozen: Quality Flag
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                The buyer reported an issue during the quality check. Escrow
                funds are temporarily locked.
              </p>
            </div>
          </div>

          {/* Dispute Details Card */}
          <div className="bg-destructive/5 rounded-xl p-4 border border-destructive/10 mb-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-destructive uppercase tracking-wider">
                Buyer Claim
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                Today, 2:15 PM
              </span>
            </div>
            <p className="text-sm font-medium text-foreground">
              "Moisture content exceeds the 12% maximum threshold agreed upon in
              the pool listing. Measured at 15%."
            </p>
          </div>

          {/* Action Required Section */}
          <h4 className="text-sm font-bold text-foreground mb-3">
            Your Required Actions
          </h4>
          <div className="space-y-3 mb-6">
            <button
              onClick={() => setIsCameraOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Camera className="w-4 h-4 text-primary group-hover:text-white" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  Upload Pre-Dispatch Photos
                </span>
              </div>
              {uploadState === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-agri-success" />
              ) : (
                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">
                  Required
                </span>
              )}
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Upload Mandi Receipt
                </span>
              </div>
              <span className="text-xs font-bold text-muted-foreground">
                Optional
              </span>
            </button>
          </div>

          {/* Support Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground font-medium max-w-[200px]">
              FarmHers Support will review within 24 hours.
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-xs font-bold text-foreground hover:bg-secondary/80 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              Call Support
            </button>
          </div>
        </div>
      </motion.div>

      {/* ⚡ Glassmorphic Camera / Upload Modal Overlay */}
      <AnimatePresence>
        {isCameraOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                uploadState !== "uploading" && setIsCameraOpen(false)
              }
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Bottom Sheet Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-[32px] p-6 pb-12 shadow-2xl border-t border-border/50"
            >
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground">
                  Evidence Upload
                </h3>
                <button
                  onClick={() => setIsCameraOpen(false)}
                  disabled={uploadState === "uploading"}
                  className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mock Viewfinder / Dropzone */}
              <div className="w-full aspect-video bg-muted/30 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center mb-6 relative overflow-hidden">
                {uploadState === "idle" && (
                  <>
                    <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Tap to open camera or gallery
                    </p>
                  </>
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
                      Evidence Secured
                    </p>
                  </motion.div>
                )}

                {/* Progress bar animation */}
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
                onClick={handleSimulateUpload}
                disabled={uploadState !== "idle"}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {uploadState === "uploading"
                  ? "Processing..."
                  : uploadState === "success"
                    ? "Uploaded Successfully"
                    : "Take Photo"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
