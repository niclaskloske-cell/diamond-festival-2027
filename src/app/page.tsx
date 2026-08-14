import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Lineup } from "@/components/sections/Lineup";
import { Tickets } from "@/components/sections/Tickets";
import { Festival } from "@/components/sections/Festival";
import { FestivalMap } from "@/components/sections/FestivalMap";
import { CreatorLounge } from "@/components/sections/CreatorLounge";
import { Experience } from "@/components/sections/Experience";
import { SocialWall } from "@/components/sections/SocialWall";
import { Partners } from "@/components/sections/Partners";
import { Faq } from "@/components/sections/Faq";
import { Kontakt } from "@/components/sections/Kontakt";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Lineup />
        <Tickets />
        <Festival />
        <FestivalMap />
        <CreatorLounge />
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
