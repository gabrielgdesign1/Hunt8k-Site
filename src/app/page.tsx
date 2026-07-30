import Hero from "@/components/hero/Hero";
import Work from "@/components/work/Work";
import About from "@/components/About";
import Stats from "@/components/Stats";
import CreatorGrid from "@/components/CreatorGrid";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      {/* No background of its own — the body carries the ink colour so the
          particle field behind (z-0) stays visible through the sections. */}
      <div className="relative z-10">
        <Stats />
        <CreatorGrid />
        <Work />
        <Testimonials />
        <About />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
