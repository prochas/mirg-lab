import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Philosophy from "@/components/Philosophy";
import Footer from "@/components/Footer";

// Fully static, server-rendered. No client JavaScript anywhere.
export default function Home() {
  return (
    <>
      <div className="noise" />
      <div
        className="text-0 pointer-events-none fixed -top-1/2 h-full w-[120%] text-transparent"
        id="noise-logo"
      >
        <svg
          viewBox="0 0 45 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative top-0 left-0 w-full transition-colors duration-500"
          strokeWidth="0.025"
        >
          <path
            d="M0,0 L22.5,32 L45,0 L39,0 L22.5,26 L6,0 Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <Navbar />
      <main className="relative min-h-screen">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <Philosophy />
      </main>
      <Footer />
    </>
  );
}
