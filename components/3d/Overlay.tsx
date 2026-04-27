"use client";

import { useLayoutEffect, useRef } from "react";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import EditorialIntro from "@/components/sections/EditorialIntro";
import CinematicBreak from "@/components/sections/CinematicBreak";
import FeaturesSection from "@/components/sections/FeaturesSection";
import BoloSpotlight from "@/components/sections/BoloSpotlight";
import SDGStrip from "@/components/sections/SDGStrip";
import AuctionScene from "@/components/sections/AuctionScene";
import ImpactSection from "@/components/sections/ImpactSection";
import FinalCTA from "@/components/sections/FinalCTA";
import { getGsap } from "./gsapClient";

export default function Overlay() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-overlay-block]").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0.45 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "bottom 30%",
              scrub: true,
            },
          }
        );
      });
    }, rootRef);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} style={{ width: "100vw", pointerEvents: "none" }}>
      <div data-overlay-block style={{ pointerEvents: "auto" }}>
        <Hero />
      </div>
      <div data-overlay-block style={{ pointerEvents: "auto" }}>
        <Marquee />
      </div>
      <div data-overlay-block style={{ pointerEvents: "auto" }}>
        <EditorialIntro />
      </div>
      <div data-overlay-block style={{ pointerEvents: "auto" }}>
        <CinematicBreak />
      </div>
      <div data-overlay-block style={{ pointerEvents: "auto" }}>
        <FeaturesSection />
      </div>
      <div data-overlay-block style={{ pointerEvents: "auto" }}>
        <BoloSpotlight />
      </div>
      <div data-overlay-block style={{ pointerEvents: "auto" }}>
        <SDGStrip />
      </div>
      <div data-overlay-block style={{ pointerEvents: "auto" }}>
        <AuctionScene />
      </div>
      <div data-overlay-block style={{ pointerEvents: "auto" }}>
        <ImpactSection />
      </div>
      <div data-overlay-block style={{ pointerEvents: "auto" }}>
        <FinalCTA />
      </div>
    </div>
  );
}