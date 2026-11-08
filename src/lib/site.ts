import resumePdf from "@/assets/portfolio/jonathan-rebullo-resume.pdf";
import profilePhoto from "@/assets/portfolio/jonathan-rebullo-profile.webp";

/**
 * Site-wide details. Edit here, not inside components.
 */
export const site = {
  brand: "NEO REBULLO",
  name: "Jonathan Rebullo",
  title: "AI Automation Specialist",
  subtitle: "Building AI Voice Agents, CRM Workflows & Automated Appointment Systems",
  location: "Parañaque City, Philippines",
  timezone: "PHT (UTC+8)",
  email: "neo.rebullo@gmail.com",
  linkedin: "https://linkedin.com/in/jonathan-rebullo-559005375/",
  github: "https://github.com/rebullojonathan",
  /** Public address of the live site. Used for canonical links and structured data. */
  url: "https://rebullojonathan.github.io/",
  resumeUrl: resumePdf,
  photoUrl: profilePhoto,
  /** Formspree form that emails each contact-form message to the address above. Free plan: 50 messages a month. */
  contactFormEndpoint: "https://formspree.io/f/xzeekbzq",
};

export const navItems = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
] as const;
