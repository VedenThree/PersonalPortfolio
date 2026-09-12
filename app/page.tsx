import Hero from "@/components/layouts/hero";
import Projects from "@/components/sections/projects";
import Profile from "@/components/sections/profile";
import Contact from "@/components/sections/contact";
import Footer from "@/components/layouts/footer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Projects />
      <Profile />
      <Contact />
      <Footer />
    </main>
  );
}