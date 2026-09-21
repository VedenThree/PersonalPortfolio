import Hero from "@/components/layouts/hero";
import Projects from "@/components/sections/projects";
import Profile from "@/components/sections/profile";
import Contact from "@/components/sections/contact";
import Footer from "@/components/layouts/footer";
import SectionFlow from "@/components/animations/section-flow";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Projects />
      <SectionFlow>
        <Profile />
        <Contact />
      </SectionFlow>
      <Footer />
    </main>
  );
}