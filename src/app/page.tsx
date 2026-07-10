import { Hero } from "@/components/Hero";
import { StorySection } from "@/components/StorySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { HowItWorks } from "@/components/HowItWorks";
import { ImpactSection } from "@/components/ImpactSection";
import { GallerySection } from "@/components/GallerySection";
import { FaqSection } from "@/components/FaqSection";
import { FinalCta } from "@/components/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <StorySection />
      <TestimonialsSection />
      <HowItWorks />
      <ImpactSection />
      <GallerySection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
