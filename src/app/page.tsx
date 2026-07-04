import {
  BentoSection,
  CompanyShowcase,
  CTASection,
  FAQSection,
  FeatureSection,
  FooterSection,
  // GrowthSection,
  HeroSection,
  PricingSection,
  QuoteSection,
  TestimonialSection,
} from "@/components/sections";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center divide-y divide-border min-h-screen w-full">
      <HeroSection />
      <CompanyShowcase />
      <BentoSection />
      <QuoteSection />
      <FeatureSection />
      {/* <GrowthSection /> */}
      <PricingSection />
      <TestimonialSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
