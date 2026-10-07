import type { Metadata } from "next";
import Hero from "@/components/layouts/hero";
import Projects from "@/components/sections/projects";
import Profile from "@/components/sections/profile";
import Contact from "@/components/sections/contact";
import Footer from "@/components/layouts/footer";
import SectionFlow from "@/components/animations/section-flow";
import HtmlLang from "@/components/ui/html-lang";
import { DICTS } from "@/lib/i18n";

// Versione inglese: stessa composizione della home italiana, dizionario `en`.
// Con `trailingSlash: true` la build emette `/en/index.html`, che un host
// statico serve senza rewrite.
export const metadata: Metadata = {
  title: "SYS / 01 — Junior Web & Mobile App Developer",
  description:
    "Portfolio of a Junior Web & Mobile App Developer focused on modern frontend: React, Next.js, TypeScript, Tailwind CSS and the ability to turn Figma designs into working web interfaces.",
  robots: { index: false, follow: false },
};

export default function HomeEn() {
  const dict = DICTS.en;
  return (
    <main className="flex flex-1 flex-col">
      <HtmlLang lang="en" />
      <Hero dict={dict.hero} />
      <Projects dict={dict.projects} locale="en" />
      <SectionFlow
        a={<Profile dict={dict.profile} />}
        b={<Contact dict={dict.contact} />}
      />
      <Footer dict={dict.footer} locale="en" />
    </main>
  );
}
