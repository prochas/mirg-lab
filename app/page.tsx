import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FeaturedRings from "@/components/FeaturedRings";
import BrandStory from "@/components/BrandStory";
import Collections from "@/components/Collections";
import Testimonial from "@/components/Testimonial";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

// Server Component. Each section is its own component; interactivity is pushed
// to small "use client" leaves (Nav, HeroVideo, AddToBagButton, NewsletterForm,
// Reveal) so the page stays server-rendered for fast first paint.
export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <Nav />
      <Hero />
      <FeaturedRings />
      <BrandStory />
      <Collections />
      <Testimonial />
      <Newsletter />
      <Footer />
    </div>
  );
}
