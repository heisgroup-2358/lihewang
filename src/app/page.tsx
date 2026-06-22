import { HeroSection } from "@/components/shared/hero-section";
import { CategoryStrip } from "@/components/shared/category-strip";
import { FeaturedProducts } from "@/components/shared/featured-products";
import { BrandStory } from "@/components/shared/brand-story";
import { InstagramFeed } from "@/components/shared/instagram-feed";
import { Newsletter } from "@/components/shared/newsletter";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoryStrip />
      <FeaturedProducts />
      <BrandStory />
      <InstagramFeed />
      <Newsletter />
    </>
  );
}
