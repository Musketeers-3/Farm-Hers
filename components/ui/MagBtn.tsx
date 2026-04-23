"use client";
import { ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";

interface MagBtnProps {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  dataCursor?: string;
}

export default function MagBtn({ children, style = {}, onClick, dataCursor = "" }: MagBtnProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      data-cursor={dataCursor}
      onClick={onClick}
      style={{ ...style, cursor: "pointer" } as CSSProperties}
    >
      {children}
    </motion.button>
  );
}