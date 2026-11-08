import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { HeroWorkflow } from "@/components/hero-workflow";
import { AboutSection } from "@/components/about-section";
import { WorkSection } from "@/components/work-section";
import { Services } from "@/components/services";
import { HowIWork } from "@/components/how-i-work";
import { Credentials } from "@/components/credentials";
import { FaqSection } from "@/components/faq-section";
import { ContactSection } from "@/components/contact-section";
import { CurtainFooter } from "@/components/curtain-footer";
import { BookingProvider } from "@/components/booking-dialog";
import { FlameCursor } from "@/components/flame-cursor";
import { TileBackground } from "@/components/tile-background";
import { useEffect } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { enhanceAnchorLinks } from "@/lib/scroll";
import { site } from "@/lib/site";
import { homeStructuredData } from "@/lib/structured-data";

const description =
  "Jonathan Rebullo, AI Automation Specialist: AI voice agents, RAG chatbots, n8n workflows and GoHighLevel CRM automation that reduce repetitive work.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.brand} — ${site.title}` },
      { name: "description", content: description },
      { property: "og:title", content: `${site.brand} — ${site.title}` },
      { property: "og:description", content: site.subtitle },
      { property: "og:type", content: "website" },
      { property: "og:url", content: site.url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: site.url }],
    scripts: [
      // Schema.org data for search engines and AI assistants.
      { type: "application/ld+json", children: JSON.stringify(homeStructuredData()) },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  useEffect(() => enhanceAnchorLinks(), []);

  return (
    <BookingProvider>
    <div className="portfolio-shell lw-shell min-h-screen">
      <a href="#work" className="lw-skip">
        Skip to projects
      </a>
      <main className="page-curtain">
        <SiteHeader />
        <HeroWorkflow />
        <div className="lw-tiles-zone">
          <TileBackground />
          <AboutSection />
          <WorkSection />
          <Services />
          <HowIWork />
          <Credentials />
          <FaqSection />
          <ContactSection />
        </div>
      </main>
      <CurtainFooter />
      <FlameCursor />
    </div>
    </BookingProvider>
  );
}
