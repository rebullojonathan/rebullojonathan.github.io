import type { CSSProperties } from "react";
import { allTools, toolRows, type Tool } from "@/lib/tools";

/** Copies of each row inside the track. The track moves by exactly one copy per loop. */
const COPIES = 3;

function ToolChip({ tool }: { tool: Tool }) {
  return (
    <li className="lw-marquee-chip">
      <img
        src={tool.logo}
        alt=""
        width="22"
        height="22"
        // Eager so logos that scroll into view are already loaded (no pop-in).
        loading="eager"
        decoding="async"
        data-mono={tool.mono || undefined}
      />
      {tool.name}
    </li>
  );
}

function MarqueeRow({ tools, reverse }: { tools: Tool[]; reverse?: boolean }) {
  return (
    <div className="lw-marquee-row" data-reverse={reverse || undefined}>
      <div
        className="lw-marquee-track"
        style={{ "--marquee-copies": COPIES } as CSSProperties}
      >
        {Array.from({ length: COPIES }, (_, copy) => (
          // Only the first copy is read by screen readers; the others exist for the seamless loop.
          <ul key={copy} className="lw-marquee-set" aria-hidden={copy > 0 || undefined}>
            {tools.map((tool) => (
              <ToolChip key={tool.name} tool={tool} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/**
 * Two rows of tool logos scrolling slowly in opposite directions (70 s per loop).
 * Pauses on hover with a mouse, and stays still for reduced-motion users.
 */
export function ToolsMarquee() {
  return (
    <div className="lw-marquee" role="region" aria-label={`Tools I work with (${allTools.length})`}>
      <MarqueeRow tools={toolRows[0]} />
      <MarqueeRow tools={toolRows[1]} reverse />
    </div>
  );
}
