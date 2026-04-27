"use client";
import { useRef } from "react";
import { motion, useInView, UseInViewOptions } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    margin: "-10%",
    amount: threshold,
    once,
  } as UseInViewOptions);

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 40, x: 0 };
      case "down":
        return { y: -40, x: 0 };
      case "left":
        return { x: 40, y: 0 };
      case "right":
        return { x: -40, y: 0 };
      default:
        return { y: 40, x: 0 };
    }
  };

  const initial = getInitialPosition();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...initial }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...initial }
      }
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom easing (similar to SILK)
      }}
      style={{
        willChange: "opacity, transform",
      }}
    >
      {children}
    </motion.div>
  );
}

// Motion blur text effect component
export function MotionBlurText({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.div
      ref={ref}
      initial={{ filter: "blur(12px)", opacity: 0, y: 20 }}
      animate={
        inView
          ? { filter: "blur(0px)", opacity: 1, y: 0 }
          : { filter: "blur(12px)", opacity: 0, y: 20 }
      }
      transition={{
        duration: 1.2,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Gradient text reveal
export function GradientReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.div
      ref={ref}
      initial={{
        backgroundPosition: "0% 50%",
      }}
      animate={
        inView
          ? {
              backgroundPosition: "100% 50%",
            }
          : {
              backgroundPosition: "0% 50%",
            }
      }
      transition={{
        duration: 1.5,
        delay,
        ease: "easeOut",
      }}
      style={{
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </motion.div>
  );
}