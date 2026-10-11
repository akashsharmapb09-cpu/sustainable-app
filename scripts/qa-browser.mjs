import { spawn } from "node:child_process";
import { chromium } from "playwright";

const baseURL = "http://127.0.0.1:4173";
const server = spawn("npm", ["run", "start", "--", "--hostname", "127.0.0.1", "--port", "4173"], {
  stdio: "ignore",
  env: { ...process.env, BROWSER: "none" },
});

const publicRoutes = [
  "/", "/about", "/blog", "/community", "/faq", "/how-it-works", "/impact",
  "/methodology", "/privacy-policy", "/privacy", "/terms", "/cookies", "/sitemap",
  "/status", "/login",
];
const dashboardRoutes = [
  "/dashboard", "/dashboard/explore", "/dashboard/catalogue", "/dashboard/activity",
  "/dashboard/account", "/dashboard/settings", "/dashboard/rewards", "/dashboard/pro",
];
const viewports = [
  { name: "iPhone SE", width: 320, height: 568, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "iPhone 15 Pro", width: 393, height: 852, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
  { name: "iPad", width: 768, height: 1024, isMobile: false, hasTouch: true, deviceScaleFactor: 2 },
  { name: "Desktop", width: 1440, height: 900, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
];
const problems = [];

async function waitForApp() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {
      // Next server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Next.js server did not start on port 4173.");
}

try {
  await waitForApp();
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.isMobile,
        hasTouch: viewport.hasTouch,
        deviceScaleFactor: viewport.deviceScaleFactor,
      });
      const page = await context.newPage();
      page.setDefaultTimeout(12_000);

      const authResponse = await page.goto(baseURL + "/dashboard/explore", { waitUntil: "domcontentloaded" });
      if (new URL(page.url()).pathname !== "/login") {
        problems.push("[" + viewport.name + "] unauthenticated dashboard did not redirect to /login (landed on " + page.url() + ")");
      }
      if (!authResponse || authResponse.status() >= 400) {
        problems.push("[" + viewport.name + "] login redirect returned HTTP " + (authResponse?.status() ?? "no response"));
      }
      await context.addCookies([{
        name: "greenswap_demo",
        value: "1",
        domain: "127.0.0.1",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
      }]);

      const routes = [...publicRoutes, ...dashboardRoutes];
      for (const route of routes) {
        const runtimeErrors = [];
        const onPageError = (error) => runtimeErrors.push(error.message);
        page.on("pageerror", onPageError);

        try {
          const response = await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
          if (!response || response.status() >= 400) {
            problems.push("[" + viewport.name + "] " + route + ": HTTP " + (response?.status() ?? "no response"));
          }

          await page.locator("h1").first().waitFor();
          await page.waitForTimeout(200);

          const layout = await page.evaluate(() => {
            const width = window.innerWidth;
            const offenders = [...document.querySelectorAll("body *")].map((element) => {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return {
                tag: element.tagName.toLowerCase(),
                id: element.id || "",
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                position: style.position,
                overflowX: style.overflowX,
              };
            }).filter((element) =>
              (element.right > width + 1 || element.left < -1)
              && element.position !== "fixed"
              && element.overflowX !== "clip"
              && element.overflowX !== "hidden"
            ).slice(0, 5);

            return {
              viewportWidth: width,
              documentWidth: document.documentElement.scrollWidth,
              bodyWidth: document.body.scrollWidth,
              offenders,
              images: [...document.images].map((image) => ({
                src: image.getAttribute("src"),
                complete: image.complete,
                naturalWidth: image.naturalWidth,
              })),
              title: document.querySelector("h1")?.textContent?.trim() ?? "",
            };
          });

          if (layout.documentWidth > viewport.width + 1 || layout.bodyWidth > viewport.width + 1) {
            problems.push("[" + viewport.name + "] " + route + ": horizontal overflow; viewport=" + viewport.width + ", document=" + layout.documentWidth + ", body=" + layout.bodyWidth + "; offenders=" + JSON.stringify(layout.offenders));
          }

          const brokenImages = layout.images.filter((image) => image.complete && image.naturalWidth === 0);
          if (brokenImages.length) problems.push("[" + viewport.name + "] " + route + ": broken images " + JSON.stringify(brokenImages));

          if (route === "/" && (!layout.title.includes("Make a lighter footprint.") || !layout.title.includes("Keep the good life."))) {
            problems.push("[" + viewport.name + "] expected the exact GreenSwap headline, found: " + layout.title);
          }
          if (route === "/faq") {
            const count = await page.locator("main details").count();
            if (count !== 10) problems.push("[" + viewport.name + "] /faq expected 10 FAQ items, found " + count);
          }
          if (runtimeErrors.length) problems.push("[" + viewport.name + "] " + route + ": runtime errors: " + runtimeErrors.join(" | "));
        } catch (error) {
          problems.push("[" + viewport.name + "] " + route + ": " + (error instanceof Error ? error.message : String(error)));
        } finally {
          page.off("pageerror", onPageError);
        }
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
} finally {
  server.kill("SIGTERM");
}

if (problems.length) {
  console.error("Browser QA failed with " + problems.length + " issue(s):");
  for (const problem of problems) console.error("- " + problem);
  process.exit(1);
}

console.log("Browser QA passed: " + (publicRoutes.length + dashboardRoutes.length) + " direct routes across " + viewports.length + " viewport profiles, with an unauthenticated redirect check per viewport.");
