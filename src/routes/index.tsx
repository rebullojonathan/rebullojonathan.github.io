import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { HeroWorkflow } from "@/components/hero-workflow";
import { AboutSection } from "@/components/about-section";
import { WorkSection } from "@/components/work-section";
import { Services } from "@/components/services";
import { HowIWork } from "@/components/how-i-work";
import { Credentials } from "@/components/credentials";
import { ContactSection } from "@/components/contact-section";
import { CurtainFooter } from "@/components/curtain-footer";
import { BookingProvider } from "@/components/booking-dialog";
import { FlameCursor } from "@/components/flame-cursor";
import { useEffect } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { enhanceAnchorLinks } from "@/lib/scroll";
import { site } from "@/lib/site";

const description =
  "AI Automation & GoHighLevel Specialist building AI voice agents, n8n workflows, CRM pipelines and automated appointment systems.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.brand} — ${site.title}` },
      { name: "description", content: description },
      { property: "og:title", content: `${site.brand} — ${site.title}` },
      { property: "og:description", content: site.subtitle },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
        <AboutSection />
        <WorkSection />
        <Services />
        <HowIWork />
        <Credentials />
        <ContactSection />
      </main>
      <CurtainFooter />
      <FlameCursor />
    </div>
    </BookingProvider>
  );
}
