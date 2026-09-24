import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const routes = [
  ["/slides.html", "slides.html", "text/html; charset=utf-8"],
  ["/assets/slides.css", "assets/slides.css", "text/css; charset=utf-8"],
  ["/assets/slides.js", "assets/slides.js", "text/javascript; charset=utf-8"],
  ["/assets/geist-latin.woff2", "assets/geist-latin.woff2", "font/woff2"],
  ["/assets/geist-mono-latin.woff2", "assets/geist-mono-latin.woff2", "font/woff2"],
  ["/assets/og.png", "assets/og.png", "image/png"],
];

const html = await fs.readFile(path.join(project, "slides.html"), "utf8");
const slideCount = (html.match(/<section class="slide\b/g) || []).length;
const noteCount = (html.match(/<aside class="speaker-note"/g) || []).length;
if (slideCount !== 12 || noteCount !== slideCount) {
  throw new Error(`Expected 12 slides and notes; found ${slideCount} slides and ${noteCount} notes`);
}

const entries = [];
for (const [url, filename, type] of routes) {
  const bytes = await fs.readFile(path.join(project, filename));
  entries.push([url, [bytes.toString("base64"), type]]);
}

const source = `const files = new Map(${JSON.stringify(entries)});
function decode(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
export default {
  fetch(request) {
    const pathname = new URL(request.url).pathname;
    const route = pathname === "/" || pathname === "/index.html" ? "/slides.html" : pathname;
    const file = files.get(route);
    if (!file) return new Response("Not found", { status: 404 });
    const body = route === "/slides.html"
      ? new TextDecoder().decode(decode(file[0])).replaceAll("__SITE_ORIGIN__", new URL(request.url).origin)
      : decode(file[0]);
    return new Response(body, {
      headers: {
        "content-type": file[1],
        "cache-control": route.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "public, max-age=300",
        "x-content-type-options": "nosniff"
      }
    });
  }
};
`;

const output = path.join(project, "dist/server");
await fs.mkdir(output, { recursive: true });
await fs.writeFile(path.join(output, "index.js"), source);
console.log(`Built ${slideCount} slides for hosting.`);
