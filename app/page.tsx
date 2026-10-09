import type { Metadata } from "next";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";
import TedIntroSection from "@/components/TedIntroSection";
import GalleryArchive from "@/components/GalleryArchive";
import SpeakersPreview from "@/components/SpeakersPreview";
import SponsorsPreview from "@/components/SponsorsPreview";
import LeadershipSection from "@/components/LeadershipSection";
import CampusExperience from "@/components/CampusExperience";
import Stats from "@/components/Stats";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { constructMetadata } from "@/lib/seo";
import { getEventSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "TEDxSMIU | Ideas Worth Spreading",
  description:
    "Official website for TEDxSMIU. Discover live talks, inspiring speakers, and transformative ideas at Sindh Madressatul Islam University, Karachi.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={getEventSchema()} />
      <ScrollProgress />
      <Navbar />
      
      <main className="bg-ink text-paper antialiased selection:bg-primary selection:text-white">
        
        {/* 1. Minimal Hero Section with Talpur House Background */}
        <Hero />

        {/* 2. Flagship Event Spotlight & Next Edition Status */}
        {/* <section id="event" className="relative z-10 border-b border-white/10 px-6 lg:px-12 py-20 sm:py-24">
          <div className="max-w-7xl mx-auto">
            <EventCard />
          </div>
        </section> */}

       

        {/* 4. What is TED & TEDx Section */}
        <TedIntroSection />

        {/* 5. Institutional Leadership & Patrons (VC, Patron, Licensee, Lead) */}
        <LeadershipSection />

        {/* 6. SMIU 1885 Campus Heritage & Karachi Experience */}
        <CampusExperience />

        {/* 7. Real Curated Speakers Lineup */}
        <SpeakersPreview />

        {/* 3. Past Event Gallery */}
        <GalleryArchive preview />

        {/* 8. Confirmed partner logos */}
        <SponsorsPreview />

        {/* 9. Telemetry, Reach & Institutional Impact */}
        {/* <Stats /> */}

        {/* 10. Final Community Participation & Announcement Hub */}
        {/* <CallToAction /> */}

      </main>

      <Footer />
    </>
  );
}