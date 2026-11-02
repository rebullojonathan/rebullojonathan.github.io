const outerTools = [
  { name: "n8n", url: "https://n8n.io", mark: "n8n" },
  { name: "Zapier", url: "https://zapier.com", mark: "zapier" },
  { name: "Make.com", url: "https://www.make.com", mark: "make" },
  { name: "GoHighLevel", url: "https://www.gohighlevel.com", mark: "highlevel" },
];
const innerTools = [
  { name: "Google Drive", url: "https://drive.google.com", mark: "drive" },
  { name: "Gmail", url: "https://mail.google.com", mark: "gmail" },
  { name: "Asana", url: "https://asana.com", mark: "asana" },
];

function ToolMark({ mark }: { mark: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={`orbit-mark orbit-mark-${mark}`}>
      {mark === "n8n" && (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M8 24h10l9-14h6M18 24l9 6h6" />
          <circle cx="7" cy="24" r="4" />
          <circle cx="18" cy="24" r="4" />
          <circle cx="32" cy="10" r="4" />
          <circle cx="32" cy="30" r="4" />
        </g>
      )}
      {mark === "zapier" && (
        <path
          fill="currentColor"
          d="M17 4h6v9l6-6 4 4-6 6h9v6h-9l6 6-4 4-6-6v9h-6v-9l-6 6-4-4 6-6H4v-6h9l-6-6 4-4 6 6z"
        />
      )}
      {mark === "make" && (
        <g fill="currentColor">
          <path d="m8 8 7 3-8 22-7-3zM20 8l7 3-8 22-7-3zM30 9h8v24h-8z" />
        </g>
      )}
      {mark === "highlevel" && (
        <g fill="none" stroke="currentColor" strokeWidth="4">
          <path d="M5 31V18m9 13V11m9 20V5M28 23l7-7m-7 0h7v7" />
        </g>
      )}
      {mark === "drive" && (
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinejoin="round"
          d="m15 5 11 0 12 23-6 10H8L2 28 15 5Zm0 0 17 33M26 5 8 38M2 28h36"
        />
      )}
      {mark === "gmail" && (
        <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round">
          <path d="M5 31V9l15 12L35 9v22M5 9l15 12L35 9" />
        </g>
      )}
      {mark === "asana" && (
        <g fill="currentColor">
          <circle cx="20" cy="11" r="7" />
          <circle cx="10" cy="29" r="7" />
          <circle cx="30" cy="29" r="7" />
        </g>
      )}
    </svg>
  );
}

function OrbitRing({ inner = false }: { inner?: boolean }) {
  const tools = inner ? innerTools : outerTools;
  return (
    <div className={`tool-orbit-ring${inner ? " tool-orbit-ring-inner" : ""}`}>
      {tools.map((tool) => (
        <div className="tool-orbit-layer" key={tool.name}>
          <div className="tool-orbit-socket">
            <a
              className="tool-orbit-tile"
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${tool.name} (opens in new tab)`}
            >
              <ToolMark mark={tool.mark} />
              <span className="tool-orbit-tooltip">{tool.name}</span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ToolOrbit() {
  return (
    <div className="tool-orbit-wrap">
      <div className="tool-orbit" role="group" aria-label="Jonathan Rebullo’s automation tools">
        <div className="tool-orbit-pulse" aria-hidden="true" />
        <div className="tool-orbit-logo" aria-label="Jonathan Rebullo">
          JR<span aria-hidden="true">.</span>
        </div>
        <OrbitRing />
        <OrbitRing inner />
      </div>
    </div>
  );
}
