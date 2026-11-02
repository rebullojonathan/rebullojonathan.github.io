import { DotGridSpotlight } from "./dot-grid-spotlight";

/** Hero background: interactive 16px dot grid with a spotlight (Design A). */
export function HeroBackground({ host }: { host: HTMLElement | null }) {
  return <DotGridSpotlight host={host} />;
}
