"use client";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "rgba(1,7,2,0.9)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(34,197,94,0.07)", padding: "60px", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#22c55e,#15803d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={14} color="#fff" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#334155", fontFamily: "'Cormorant Garamond',serif", letterSpacing: "0.04em" }}>FarmHers</span>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: "#1e293b", fontFamily: "'Space Mono',monospace" }}>© 2026 FarmHers Team — Google Solution Challenge</p>
        <div style={{ display: "flex", gap: 28 }}>
          {["Privacy", "Terms", "Investors", "Contact"].map((l) => (
            <a key={l} href="#" style={{ fontSize: 13, color: "#1e293b", textDecoration: "none", fontFamily: "'Barlow',sans-serif" }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}