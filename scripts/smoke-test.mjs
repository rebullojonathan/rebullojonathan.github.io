// Browser smoke test for the built static site. Run in CI after the build.
// Usage: node scripts/smoke-test.mjs <site-dir>
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright-core";

const root = process.argv[2] ?? ".output/public";
const types = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png",
  ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".pdf": "application/pdf",
  ".mp4": "video/mp4", ".ico": "image/x-icon", ".txt": "text/plain", ".json": "application/json",
};
const server = createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(req.url.split("?")[0]));
  if (path.endsWith("/")) path += "index.html";
  const file = join(root, path);
  try {
    if (!(await stat(file)).isFile()) throw new Error();
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
}).listen(4173);

const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome" });
for (const [label, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  console.log(`\n--- ${label} ${viewport.width}x${viewport.height} ---`);
  const page = await browser.newPage({ viewport });
  const errors = [];
  const missing = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => { if (r.url().startsWith("http://localhost") && r.status() >= 400) missing.push(r.url()); });
  await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  check("page title", (await page.title()).includes("NEO REBULLO"), await page.title());
  const html = await (await fetch("http://localhost:4173/")).text();
  check("prerendered HTML has the headline", html.includes("GoHighLevel"));

  // Search and AI-assistant readiness: data must be in the static HTML, not added later by JavaScript.
  const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  let ld = null;
  try { ld = ldMatch ? JSON.parse(ldMatch[1]) : null; } catch { ld = null; }
  const ldTypes = ld?.["@graph"]?.map((node) => node["@type"]) ?? [];
  check("structured data (Person, FAQPage) in HTML", ldTypes.includes("Person") && ldTypes.includes("FAQPage"), ldTypes.join(", ") || "missing");
  check("FAQ answers in prerendered HTML", html.includes("Common questions") && html.includes("Can you build an AI voice agent"));
  check("canonical link in HTML", /<link[^>]*rel="canonical"[^>]*>/.test(html) && /<link[^>]*rel="canonical"[^>]*href="https:\/\/rebullojonathan\.github\.io\/"|<link[^>]*href="https:\/\/rebullojonathan\.github\.io\/"[^>]*rel="canonical"/.test(html));
  for (const file of ["/sitemap.xml", "/llms.txt", "/robots.txt"]) {
    const status = (await fetch(`http://localhost:4173${file}`)).status;
    check(`file ${file}`, status === 200, String(status));
  }

  // Scroll through the page so lazy images load.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1500);
  const images = await page.evaluate(() => [...document.images].map((i) => ({ src: i.currentSrc.split("/").pop(), ok: i.complete && i.naturalWidth > 0 })));
  const broken = images.filter((i) => !i.ok).map((i) => i.src);
  check("all images load", broken.length === 0, `${images.length} images${broken.length ? `, broken: ${broken.join(", ")}` : ""}`);
  check("no horizontal overflow", await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));

  // Local files linked from the page (certificates, résumé, videos).
  const links = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.href).filter((h) => h.startsWith(location.origin) && !h.includes("#")));
  for (const link of [...new Set(links)]) {
    const status = (await fetch(link, { method: "HEAD" })).status;
    check(`link ${link.replace("http://localhost:4173", "")}`, status === 200, String(status));
  }

  // Interactivity (proves the JavaScript loaded and hydrated).
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click("#ai-voice-appointment-setter .lw-work-cta");
  await page.waitForTimeout(800);
  check("case study opens", await page.locator(".lw-case-modal").isVisible());
  const videos = await page.evaluate(() => [...document.querySelectorAll(".lw-case-videos source")].map((s) => s.src));
  for (const src of videos) {
    const status = (await fetch(src, { method: "HEAD" })).status;
    check(`video ${src.split("/").pop()}`, status === 200, String(status));
  }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  check("case study closes", !(await page.locator(".lw-case-modal").isVisible()));
  await page.locator("#contact-form").scrollIntoViewIfNeeded();
  check("contact form present", await page.locator("#contact-form").isVisible());

  check("no JavaScript errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  check("no missing local files", missing.length === 0, missing.slice(0, 5).join(", "));
  await page.close();
}
await browser.close();
server.close();
const failed = results.filter((ok) => !ok).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
