"use client"
import HeroSection from "./components/sections/HeroSection";
import CardStrip from "./components/sections/CardStrip";
import FeaturesSection from "./components/sections/FeaturesSection";
import { TopicsSection, MarketplaceSection, TestimonialsSection, CTASection } from "./components/sections/OtherSections";
import HomeWrapper from "./components/wrapper";

export default function HomePage() {
  return (
    <HomeWrapper>
      <HeroSection />
      <CardStrip />
      <FeaturesSection />
      <TopicsSection />
      <MarketplaceSection />
      <TestimonialsSection />
      <CTASection />
    </HomeWrapper>
  );
}