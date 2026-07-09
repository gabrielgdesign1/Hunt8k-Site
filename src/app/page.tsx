import Hero from "@/components/hero/Hero";
import Work from "@/components/work/Work";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <div className="relative z-10 bg-[var(--color-ink)]">
        <Stats />
        <Work />
        <About />
        <Process />
        <Testimonials />
        <Faq />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
