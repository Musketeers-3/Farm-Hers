"use client";
import { useEffect } from "react";

export default function FontLoader() {
  useEffect(() => {
    if (document.getElementById("ag-f")) return;
    const l = document.createElement("link");
    l.id = "ag-f";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,600;1,700&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
}