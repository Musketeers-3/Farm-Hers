"use client";

import { useState, useEffect } from "react";
import FontLoader from "@/components/ui/FontLoader";
import Grain from "@/components/ui/Grain";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";

// 3D Layers
import GlobalAtmosphere from "@/components/3d/GlobalAtmosphere";

// Sections
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import CinematicBreak from "@/components/sections/CinematicBreak";
import EditorialIntro from "@/components/sections/EditorialIntro";
import FeaturesSection from "@/components/sections/FeaturesSection";
import BoloSpotlight from "@/components/sections/BoloSpotlight";
import AuctionScene from "@/components/sections/AuctionScene";
import ImpactSection from "@/components/sections/ImpactSection";
import SDGStrip from "@/components/sections/SDGStrip";
import FinalCTA from "@/components/sections/FinalCTA";

export default function FarmHersLanding() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div style={{ background: "#020a04", color: "#e2e8f0", overflowX: "hidden" }}>
      <FontLoader />
      <GlobalAtmosphere />
      <Grain />
      
      <Nav />
      <Hero />
      <Marquee />
      <CinematicBreak />
      <EditorialIntro />
      <FeaturesSection />
      <BoloSpotlight />
      <AuctionScene />
      <ImpactSection />
      <SDGStrip />
      <FinalCTA />
      <Footer />
    </div>
  );
}