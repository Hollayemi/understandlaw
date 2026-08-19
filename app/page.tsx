"use client"
import HeroSection from "./components/sections/HeroSection";
import { TopicsSection, MarketplaceSection, CTASection, ProductPreviewSection } from "./components/sections/OtherSections";
import HomeWrapper from "./components/wrapper";

export default function HomePage() {
  return (
    <HomeWrapper>
      <HeroSection />
      <ProductPreviewSection />
      <TopicsSection />
      <MarketplaceSection />
      <CTASection />
    </HomeWrapper>
  );
}