import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const baseURL = 'http://127.0.0.1:4173';
const server = spawn('pnpm', ['preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
  stdio: 'ignore',
  env: { ...process.env, BROWSER: 'none' },
});

const routes = [
  '/', '/launch', '/about', '/methodology', '/explore', '/styleguide',
  '/onboarding', '/dashboard', '/profile', '/pro', '/recommendations',
  '/log', '/progress', '/settings', '/login', '/reset-password', '/verify',
  '/terms', '/privacy', '/cookies', '/faq',
];

const viewports = [
  { name: 'iPhone SE', width: 320, height: 568, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: 'iPhone 15 Pro', width: 393, height: 852, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
  { name: 'iPad', width: 768, height: 1024, isMobile: false, hasTouch: true, deviceScaleFactor: 2 },
  { name: 'Desktop', width: 1440, height: 900, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
];

const problems = [];

async function waitForPreview() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {
      // The preview server is still starting.
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error('Vite preview did not start on port 4173.');
}

try {
  await waitForPreview();
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
      page.setDefaultTimeout(10_000);

      for (const route of routes) {
        const runtimeErrors = [];
        const onPageError = error => runtimeErrors.push(error.message);
        page.on('pageerror', onPageError);

        let response;
        try {
          response = await page.goto(baseURL + route, { waitUntil: 'domcontentloaded' });
          if (!response || response.status() >= 400) {
            problems.push(`[${viewport.name}] ${route}: HTTP ${response?.status() ?? 'no response'}`);
          }

          await page.locator('h1').first().waitFor();
          await page.waitForTimeout(100);

          const layout = await page.evaluate(() => {
            const width = window.innerWidth;
            const overflowing = [...document.querySelectorAll('body *')]
              .map(element => {
                const rect = element.getBoundingClientRect();
                const style = getComputedStyle(element);
                return {
                  tag: element.tagName.toLowerCase(),
                  id: element.id || '',
                  className: typeof element.className === 'string' ? element.className.slice(0, 70) : '',
                  left: Math.round(rect.left),
                  right: Math.round(rect.right),
                  position: style.position,
                  overflowX: style.overflowX,
                };
              })
              .filter(element =>
                (element.right > width + 1 || element.left < -1)
                && element.position !== 'fixed'
                && element.overflowX !== 'clip'
                && element.overflowX !== 'hidden'
              )
              .slice(0, 5);
            return {
              viewportWidth: width,
              documentWidth: document.documentElement.scrollWidth,
              bodyWidth: document.body.scrollWidth,
              overflowing,
              images: [...document.images].map(img => ({
                src: img.getAttribute('src'),
                complete: img.complete,
                naturalWidth: img.naturalWidth,
              })),
              h1: document.querySelector('h1')?.textContent?.trim() ?? '',
            };
          });

          if (layout.documentWidth > viewport.width + 1 || layout.bodyWidth > viewport.width + 1) {
            problems.push(
              `[${viewport.name}] ${route}: horizontal overflow (viewport=${viewport.width}, document=${layout.documentWidth}, body=${layout.bodyWidth}); offenders=${JSON.stringify(layout.overflowing)}`,
            );
          }

          const brokenImages = layout.images.filter(img => img.complete && img.naturalWidth === 0);
          if (brokenImages.length) {
            problems.push(`[${viewport.name}] ${route}: broken images ${JSON.stringify(brokenImages)}`);
          }

          if (route === '/' && !layout.h1.includes('Make a lighter footprint.') && !layout.h1.includes('Keep the good life.')) {
            problems.push(`[${viewport.name}] home page headline is missing: ${layout.h1}`);
          }

          if (route === '/faq') {
            const faqCount = await page.locator('main details').count();
            if (faqCount !== 10) problems.push(`[${viewport.name}] /faq: expected 10 FAQ answers, found ${faqCount}`);
          }

          if (runtimeErrors.length) {
            problems.push(`[${viewport.name}] ${route}: runtime errors: ${runtimeErrors.join(' | ')}`);
          }
        } catch (error) {
          problems.push(`[${viewport.name}] ${route}: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
          page.off('pageerror', onPageError);
        }
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
} finally {
  server.kill('SIGTERM');
}

if (problems.length) {
  console.error(`Browser QA failed with ${problems.length} issue(s):`);
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(`Browser QA passed: ${routes.length} direct routes across ${viewports.length} viewport profiles (${routes.length * viewports.length} page loads).`);
