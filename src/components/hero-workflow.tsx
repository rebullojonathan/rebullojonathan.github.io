import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { prefersReducedMotion } from "@/hooks/use-reveal";
import { site } from "@/lib/site";
import { BookCallButton } from "@/components/booking-dialog";
import { HeroBackground } from "@/components/hero-backgrounds";
import { bookingEnabled } from "@/lib/booking";

/**
 * The Living Workflow hero. The diagram is an illustration of the kind of
 * system Neo builds — each project below carries its own real build status.
 */

type FlowNode = {
  key: string;
  label: string;
  role: string;
  tools: string[];
  href: string;
  linkLabel: string;
  x: number;
  y: number;
  icon: ReactNode;
};

const VIEW_W = 520;
const VIEW_H = 560;

const icons = {
  trigger: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  ),
  agent: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="7" width="16" height="12" rx="3" />
      <path d="M12 3v4M9 12h.01M15 12h.01M9 16h6" />
    </svg>
  ),
  crm: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16M4 12h10M4 18h6" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  appointment: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16M9 15l2 2 4-4" />
    </svg>
  ),
};

const nodes: FlowNode[] = [
  {
    key: "trigger",
    label: "Trigger",
    role: "A call, form or message arrives",
    tools: ["Vapi call", "n8n Form", "Messenger"],
    href: "#ai-voice-appointment-setter",
    linkLabel: "AI Voice Appointment Setter",
    x: 130,
    y: 92,
    icon: icons.trigger,
  },
  {
    key: "agent",
    label: "AI Agent",
    role: "Understands, qualifies, decides",
    tools: ["Vapi", "OpenAI", "Gemini"],
    href: "#work",
    linkLabel: "Selected work",
    x: 390,
    y: 210,
    icon: icons.agent,
  },
  {
    key: "crm",
    label: "CRM",
    role: "Lead and status recorded",
    tools: ["GoHighLevel", "Airtable"],
    href: "#ghl-pipeline-management",
    linkLabel: "GoHighLevel CRM projects",
    x: 130,
    y: 350,
    icon: icons.crm,
  },
  {
    key: "appointment",
    label: "Appointment",
    role: "Slot checked and booked",
    tools: ["Google Calendar"],
    href: "#ai-voice-appointment-setter",
    linkLabel: "AI Voice Appointment Setter",
    x: 390,
    y: 468,
    icon: icons.appointment,
  },
];

const segments = [
  "M130 92 C130 160 390 140 390 210",
  "M390 210 C390 285 130 275 130 350",
  "M130 350 C130 420 390 398 390 468",
];

const AUTO_TRAVEL = 4200;
const AUTO_HOLD = 1400;
const TRAIL = [0.022, 0.044];

export function HeroWorkflow() {
  const [reached, setReached] = useState(nodes.length - 1);
  const [openNode, setOpenNode] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // The hero element, passed to the background canvas once it exists.
  const [heroEl, setHeroEl] = useState<HTMLElement | null>(null);
  useEffect(() => setHeroEl(sectionRef.current), []);
  const canvasRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const packetRefs = useRef<(SVGCircleElement | null)[]>([]);
  const targetRef = useRef<number | null>(null);

  useEffect(() => {
    const paths = pathRefs.current.filter((p): p is SVGPathElement => p !== null);
    if (paths.length !== segments.length) return;
    // Older browsers and test environments without SVG geometry: keep the static diagram.
    if (typeof paths[0].getTotalLength !== "function") return;
    const lengths = paths.map((p) => p.getTotalLength());
    const total = lengths.reduce((sum, l) => sum + l, 0);
    // Progress (0–1) at which the packet arrives at each node.
    const stops = [0];
    lengths.reduce((acc, l) => {
      stops.push((acc + l) / total);
      return acc + l;
    }, 0);

    const pointAt = (progress: number) => {
      let distance = Math.max(0, Math.min(1, progress)) * total;
      for (let i = 0; i < paths.length; i++) {
        if (distance <= lengths[i] || i === paths.length - 1) {
          return paths[i].getPointAtLength(Math.min(distance, lengths[i]));
        }
        distance -= lengths[i];
      }
      return paths[0].getPointAtLength(0);
    };

    let current = 0;
    let lastReached = -1;
    const draw = () => {
      const points = [current, ...TRAIL.map((offset) => current - offset)];
      points.forEach((value, index) => {
        const packet = packetRefs.current[index];
        if (!packet) return;
        const visible = value >= 0;
        packet.style.opacity = visible ? "" : "0";
        if (!visible) return;
        const point = pointAt(value);
        packet.setAttribute("cx", point.x.toFixed(1));
        packet.setAttribute("cy", point.y.toFixed(1));
      });
      const hit = stops.filter((stop) => current >= stop - 0.001).length - 1;
      if (hit !== lastReached) {
        lastReached = hit;
        setReached(hit);
      }
    };

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      current = 1;
      draw();
      return;
    }

    let frame = 0;
    let running = false;
    let start = performance.now();
    let lastScroll = -Infinity;
    let scrollProgress = 0;

    const tick = (now: number) => {
      frame = 0;
      const target = targetRef.current;
      if (target !== null) {
        // Glide to the node the visitor is pointing at.
        current += (stops[target] - current) * 0.14;
        start = now - current * AUTO_TRAVEL;
      } else if (now - lastScroll < 900) {
        // Scrolling through the hero drives the data.
        current += (scrollProgress - current) * 0.2;
        start = now - current * AUTO_TRAVEL;
      } else {
        const t = (now - start) % (AUTO_TRAVEL + AUTO_HOLD);
        current = t < AUTO_TRAVEL ? t / AUTO_TRAVEL : 1;
      }
      draw();
      if (running) frame = requestAnimationFrame(tick);
    };

    const play = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const range = section.offsetHeight * 0.7;
      if (window.scrollY > range) return;
      scrollProgress = Math.min(1, window.scrollY / range);
      lastScroll = performance.now();
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) play();
      else pause();
    });
    if (canvasRef.current) observer.observe(canvasRef.current);
    const onVisibility = () => (document.hidden ? pause() : play());

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      pause();
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const focusNode = (index: number | null) => {
    targetRef.current = index;
    setOpenNode(index);
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="lw-hero"
      data-hero-bg
      aria-labelledby="hero-title"
    >
      <HeroBackground host={heroEl} />
      <div className="lw-hero-grid">
        <div className="lw-hero-copy">
          <p className="lw-availability lw-hero-pill">
            <span className="lw-live-dot" aria-hidden="true" />
            Available for Projects · {site.timezone}
          </p>
          {/* Short personal intro so visitors see who is behind the work on the first screen. */}
          <a href="#about" className="lw-hero-intro">
            <img
              src={site.photoUrl}
              alt=""
              width="44"
              height="44"
              decoding="async"
              className="lw-hero-intro-photo"
            />
            <span className="lw-hero-intro-text">
              <span className="lw-hero-intro-name">Hi, I&rsquo;m {site.name}</span>
              <span className="lw-hero-intro-note">
                6 years in real estate sales, now building automation
              </span>
            </span>
            <span className="lw-hero-intro-arrow" aria-hidden="true">
              →
            </span>
          </a>
          <h1 id="hero-title" className="lw-hero-title">
            <span className="lw-line">
              <span style={{ "--i": 0 } as CSSProperties}>AI</span>
            </span>{" "}
            <span className="lw-line">
              <span className="lw-coral" style={{ "--i": 1 } as CSSProperties}>
                Automation
              </span>
            </span>{" "}
            <span className="lw-line">
              <span style={{ "--i": 2 } as CSSProperties}>Specialist</span>
            </span>
          </h1>
          <p className="lw-hero-sub">{site.subtitle}</p>
          <div className="lw-hero-ctas">
            <BookCallButton />
            <a href="#work" className={bookingEnabled ? "lw-btn lw-btn-ghost" : "lw-btn lw-btn-primary"}>
              View Projects
            </a>
            <a href="#contact" className="lw-btn lw-btn-ghost">
              Contact Me
            </a>
          </div>
        </div>

        <div className="lw-flow" ref={canvasRef}>
          <div className="lw-flow-canvas" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
            <svg
              className="lw-flow-lines"
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              aria-hidden="true"
              focusable="false"
            >
              {segments.map((d, i) => (
                <g key={d}>
                  <path d={d} className="lw-flow-track" />
                  <path
                    d={d}
                    ref={(el) => {
                      pathRefs.current[i] = el;
                    }}
                    className="lw-flow-path"
                    data-lit={reached > i || undefined}
                    pathLength={1}
                  />
                </g>
              ))}
              {[0, 1, 2].map((i) => (
                <circle
                  key={i}
                  ref={(el) => {
                    packetRefs.current[i] = el;
                  }}
                  className="lw-packet"
                  data-trail={i > 0 || undefined}
                  cx={nodes[nodes.length - 1].x}
                  cy={nodes[nodes.length - 1].y}
                  r={i === 0 ? 6 : 4 - i}
                />
              ))}
            </svg>

            {nodes.map((node, index) => {
              const isOpen = openNode === index;
              return (
                <div
                  key={node.key}
                  className="lw-node-wrap"
                  style={{
                    left: `${(node.x / VIEW_W) * 100}%`,
                    top: `${(node.y / VIEW_H) * 100}%`,
                  }}
                  onPointerEnter={(event) => event.pointerType === "mouse" && focusNode(index)}
                  onPointerLeave={(event) => event.pointerType === "mouse" && focusNode(null)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      focusNode(null);
                    }
                  }}
                >
                  <button
                    type="button"
                    className="lw-node"
                    data-hit={reached >= index || undefined}
                    data-open={isOpen || undefined}
                    aria-expanded={isOpen}
                    aria-controls={`flow-panel-${node.key}`}
                    onFocus={() => focusNode(index)}
                    onClick={() => focusNode(isOpen ? null : index)}
                  >
                    <span className="lw-node-head">
                      <span className="lw-node-icon">{node.icon}</span>
                      <span className="lw-node-label">{node.label}</span>
                      <span className="lw-node-check" aria-hidden="true">
                        ✓
                      </span>
                    </span>
                    <span className="lw-node-role">{node.role}</span>
                  </button>
                  <div
                    id={`flow-panel-${node.key}`}
                    className="lw-node-panel"
                    hidden={!isOpen}
                    data-side={node.x > VIEW_W / 2 ? "left" : "right"}
                  >
                    <p className="lw-node-panel-title">Example tools</p>
                    <ul>
                      {node.tools.map((tool) => (
                        <li key={tool}>{tool}</li>
                      ))}
                    </ul>
                    <a href={node.href} className="lw-node-panel-link">
                      Used in: {node.linkLabel} →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="lw-flow-caption">
            How a typical system flows
          </p>
        </div>
      </div>
    </section>
  );
}
