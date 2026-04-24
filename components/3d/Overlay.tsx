"use client";

import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import EditorialIntro from "@/components/sections/EditorialIntro";
import CinematicBreak from "@/components/sections/CinematicBreak";
import FeaturesSection from "@/components/sections/FeaturesSection";
import SDGStrip from "@/components/sections/SDGStrip";
import AuctionScene from "@/components/sections/AuctionScene";
import ImpactSection from "@/components/sections/ImpactSection";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Overlay() {
  return (
    <div style={{ width: "100vw", pointerEvents: "none" }}>
      <div style={{ pointerEvents: "auto" }}>
        <Hero />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <Marquee />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <EditorialIntro />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <CinematicBreak />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <FeaturesSection />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <SDGStrip />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <AuctionScene />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <ImpactSection />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <FinalCTA />
      </div>
    </div>
  );
}