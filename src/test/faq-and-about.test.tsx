import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { AboutSection } from "@/components/about-section";
import { FaqSection } from "@/components/faq-section";
import { faqs } from "@/lib/faq";
import { site } from "@/lib/site";
import { homeStructuredData } from "@/lib/structured-data";

describe("About section", () => {
  it("leads with the automation focus and does not name a former employer", () => {
    const { container } = render(<AboutSection />);
    const text = container.textContent ?? "";
    expect(text).toContain("Six years in sales");
    expect(text).toContain("AI Automation Specialist");
    expect(text).toContain("automate repetitive work so people can focus on what matters most");
    expect(text).not.toMatch(/SMDC|SM Development/);
  });
});

describe("FAQ section", () => {
  it("renders every question with its answer in the HTML", () => {
    const { container } = render(<FaqSection />);
    const items = container.querySelectorAll("details.lw-faq-item");
    expect(items).toHaveLength(faqs.length);
    faqs.forEach((item, index) => {
      expect(items[index].querySelector("summary")?.textContent).toContain(item.question);
      expect(items[index].querySelector("p")?.textContent).toBe(item.answer);
    });
  });
});

describe("Structured data", () => {
  const graph = homeStructuredData()["@graph"] as Record<string, unknown>[];
  const byType = (type: string) => graph.find((node) => node["@type"] === type);

  it("describes the person with links to their profiles", () => {
    const person = byType("Person");
    expect(person?.name).toBe(site.name);
    expect(person?.url).toBe(site.url);
    expect(person?.sameAs).toEqual([site.linkedin, site.github]);
  });

  it("publishes the same questions and answers that the page shows", () => {
    const faqPage = byType("FAQPage") as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(faqPage.mainEntity.map((q) => q.name)).toEqual(faqs.map((f) => f.question));
    expect(faqPage.mainEntity.map((q) => q.acceptedAnswer.text)).toEqual(faqs.map((f) => f.answer));
  });

  it("serialises to valid JSON", () => {
    expect(() => JSON.parse(JSON.stringify(homeStructuredData()))).not.toThrow();
  });
});
