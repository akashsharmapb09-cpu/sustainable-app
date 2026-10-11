import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import { constants } from "node:fs";

const root = process.cwd();
const appRoot = path.join(root, "app");
const sourceRoots = ["app", "components", "lib"];
const problems = [];

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (/\.(?:tsx?|jsx?|mdx)$/.test(entry.name)) files.push(absolute);
  }
  return files;
}

const allFiles = (await Promise.all(sourceRoots.map((dir) => walk(path.join(root, dir))))).flat();
const sourceByFile = new Map();
for (const file of allFiles) sourceByFile.set(file, await readFile(file, "utf8"));

const routeFiles = allFiles.filter((file) => path.relative(appRoot, file).split(path.sep).at(-1) === "page.tsx");
const routes = new Set(["/sitemap.xml"]);
function routeFromPage(file) {
  const relative = path.relative(appRoot, file).split(path.sep).slice(0, -1);
  const segments = relative.filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")));
  if (segments.length === 0) return "/";
  return "/" + segments.join("/");
}
for (const file of routeFiles) routes.add(routeFromPage(file));

const legalSource = sourceByFile.get(path.join(root, "lib", "legal.ts")) ?? "";
for (const match of legalSource.matchAll(/(?:^|[,{\s])(?:["']([^"']+)["']|([A-Za-z][A-Za-z0-9-]*))\s*:\s*\{/gm)) {
  const slug = match[1] ?? match[2];
  if (slug) routes.add("/" + slug);
}

// App Router dynamic legal pages and the explicit legacy redirect.
routes.add("/privacy");
routes.add("/privacy-policy");

const assetExtensions = /\.(?:svg|png|jpg|jpeg|webp|avif|ico|woff2?|json|xml|txt|webmanifest)$/i;
async function existsPublicAsset(pathname) {
  const local = pathname.replace(/^\//, "").split(/[?#]/)[0];
  for (const candidate of [path.join(root, "public", local), path.join(root, local)]) {
    try {
      await access(candidate, constants.R_OK);
      return true;
    } catch {
      // Try the next allowed asset root.
    }
  }
  return false;
}
const normalizePath = (href) => {
  const pathOnly = href.split(/[?#]/)[0] || "/";
  return pathOnly === "/" ? "/" : pathOnly.replace(/\/$/, "");
};

for (const [file, source] of sourceByFile) {
  const relative = path.relative(root, file);

  if (/<a\s+[^>]*\bhref\s*=/.test(source)) {
    problems.push(relative + ": use next/link rather than a raw <a href> element.");
  }

  const destinations = new Set();
  const patterns = [
    /\bhref\s*=\s*["'](\/[^"'\s]*)["']/g,
    /\bhref\s*:\s*["'](\/[^"'\s]*)["']/g,
    /\bsource\s*:\s*["'](\/[^"'\s]*)["']/g,
    /\bdestination\s*:\s*["'](\/[^"'\s]*)["']/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) destinations.add(match[1]);
  }

  for (const destination of destinations) {
    const pathname = normalizePath(destination);
    if (pathname === "/privacy") continue; // Permanent alias is configured in next.config.ts.
    if (assetExtensions.test(pathname)) {
      if (!(await existsPublicAsset(pathname)) && !routes.has(pathname)) {
        problems.push(relative + ": missing internal asset " + pathname);
      }
      continue;
    }
    if (pathname.startsWith("/_next/")) continue;
    if (!routes.has(pathname)) {
      const segments = pathname.split("/").filter(Boolean);
      const matchesDynamicLegal = segments.length === 1 && routes.has("/[slug]") && /^(privacy|privacy-policy|terms|cookies)$/.test(segments[0]);
      if (!matchesDynamicLegal) problems.push(relative + ": internal link has no matching app route: " + pathname);
    }
  }
}

for (const mustExist of ["/", "/login", "/about", "/how-it-works", "/impact", "/blog", "/community", "/faq", "/methodology", "/privacy-policy", "/terms", "/cookies", "/sitemap", "/status", "/dashboard", "/dashboard/explore", "/dashboard/catalogue", "/dashboard/activity", "/dashboard/account", "/dashboard/settings", "/dashboard/rewards", "/dashboard/pro"]) {
  if (!routes.has(mustExist)) problems.push("Required route is missing: " + mustExist);
}
try {
  await access(path.join(root, "app", "sitemap.ts"), constants.R_OK);
  await access(path.join(root, "public", "sitemap.xml"), constants.R_OK).then(() => {
    problems.push("Remove public/sitemap.xml because app/sitemap.ts owns /sitemap.xml.");
  }).catch(() => {});
} catch {
  problems.push("Missing app/sitemap.ts.");
}

if (problems.length) {
  console.error("Route and asset audit failed:");
  for (const problem of problems) console.error("- " + problem);
  process.exit(1);
}

console.log("Route/link audit passed: " + routes.size + " routes recognized, " + allFiles.length + " source files scanned.");
