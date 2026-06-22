import { HeroSection } from "@/components/shared/hero-section";
import { CategoryStrip } from "@/components/shared/category-strip";
import { FeaturedProducts } from "@/components/shared/featured-products";
import { BrandStory } from "@/components/shared/brand-story";
import { InstagramFeed } from "@/components/shared/instagram-feed";
import { Newsletter } from "@/components/shared/newsletter";
import { AnimatedSection } from "@/components/shared/animated-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AnimatedSection>
        <CategoryStrip />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <FeaturedProducts />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <BrandStory />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <InstagramFeed />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <Newsletter />
      </AnimatedSection>
    </>
  );
}
