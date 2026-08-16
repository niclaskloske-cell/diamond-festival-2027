import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Lineup } from "@/components/sections/Lineup";
import { Tickets } from "@/components/sections/Tickets";
import { Festival } from "@/components/sections/Festival";
import { Experience } from "@/components/sections/Experience";
import { SocialWall } from "@/components/sections/SocialWall";
import { Partners } from "@/components/sections/Partners";
import { Faq } from "@/components/sections/Faq";
import { Kontakt } from "@/components/sections/Kontakt";

/** Mirrors /tickets: keeps the Early-Bird deadline fresh on the home grid. */
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Lineup />
        <Tickets />
        <Festival />
        <Experience />
        <SocialWall />
        <Partners />
        <Faq />
        <Kontakt />
      </main>
      <Footer />
    </>
  );
}
