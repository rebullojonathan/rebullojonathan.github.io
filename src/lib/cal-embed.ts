/**
 * Minimal loader for Cal.com's official embed script.
 *
 * This mirrors the snippet Cal.com publishes for websites: `Cal(...)` calls are
 * queued until https://app.cal.com/embed/embed.js has loaded, then replayed.
 * The difference is that we create the <script> ourselves, so the booking window
 * can show a fallback link when the script is blocked or fails to load.
 */

type Queue = { q: unknown[][] };
export type CalNamespace = ((...args: unknown[]) => void) & Queue;
export type CalApi = ((...args: unknown[]) => void) &
  Queue & { ns: Record<string, CalNamespace>; loaded?: boolean };

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

type ScriptState = "idle" | "loading" | "ready" | "failed";
let scriptState: ScriptState = "idle";
const listeners = new Set<(state: ScriptState) => void>();

function setScriptState(state: ScriptState) {
  scriptState = state;
  listeners.forEach((listener) => listener(state));
}

/** Subscribe to the embed script's load state. Returns an unsubscribe function. */
export function onCalScript(listener: (state: ScriptState) => void) {
  listeners.add(listener);
  listener(scriptState);
  return () => listeners.delete(listener);
}

/** Create the global `Cal` queue (once) and start loading the embed script. */
export function loadCal(scriptUrl: string): CalApi {
  if (!window.Cal) {
    const push = (target: Queue, args: unknown[]) => target.q.push(args);
    const cal = function (...args: unknown[]) {
      if (args[0] === "init" && typeof args[1] === "string") {
        const namespace = args[1];
        const api = function (...nsArgs: unknown[]) {
          push(api, nsArgs);
        } as CalNamespace;
        api.q = [];
        cal.ns[namespace] = cal.ns[namespace] ?? api;
        push(cal.ns[namespace], args);
        push(cal, ["initNamespace", namespace]);
        return;
      }
      push(cal, args);
    } as CalApi;
    cal.q = [];
    cal.ns = {};
    window.Cal = cal;
  }

  if (scriptState === "idle" || scriptState === "failed") {
    setScriptState("loading");
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => setScriptState("ready");
    script.onerror = () => {
      script.remove();
      setScriptState("failed");
    };
    document.head.appendChild(script);
    window.Cal.loaded = true;
  }

  return window.Cal;
}
