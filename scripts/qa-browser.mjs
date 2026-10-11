import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const baseURL = 'http://127.0.0.1:4173';
const server = spawn('pnpm', ['start', '--', '--hostname', '127.0.0.1', '--port', '4173'], {
  stdio: 'ignore',
  env: { ...process.env, BROWSER: 'none' },
});

const routes = [
  '/', '/explore', '/catalogue', '/how-it-works', '/about', '/rewards',
  '/impact', '/faq', '/blog', '/community', '/methodology',
  '/privacy', '/terms', '/cookies', '/login',
  '/dashboard', '/dashboard/explore', '/dashboard/catalogue',
  '/dashboard/activity', '/dashboard/account', '/dashboard/settings',
];

const viewports = [
  { name: 'iPhone SE', width: 320, height: 568, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: 'iPhone 15 Pro', width: 393, height: 852, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
  { name: 'iPad', width: 768, height: 1024, isMobile: false, hasTouch: true, deviceScaleFactor: 2 },
  { name: 'Desktop', width: 1440, height: 900, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
];

const problems = [];

async function waitForPreview() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch { /* server is still starting */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Next.js production server did not start on port 4173.');
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
      page.setDefaultTimeout(12_000);
      await page.goto(baseURL + '/login', { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: /enter demo workspace/i }).click();
      await page.waitForURL('**/dashboard/explore');

      for (const route of routes) {
        const runtimeErrors = [];
        const onPageError = (error) => runtimeErrors.push(error.message);
        page.on('pageerror', onPageError);

        try {
          const response = await page.goto(baseURL + route, { waitUntil: 'domcontentloaded' });
          if (!response || response.status() >= 400) problems.push('[' + viewport.name + '] ' + route + ': HTTP ' + (response?.status() ?? 'no response'));
          await page.locator('h1').first().waitFor();
          await page.waitForTimeout(100);

          const layout = await page.evaluate(() => {
            const width = window.innerWidth;
            const offenders = [...document.querySelectorAll('body *')].map((element) => {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return {
                tag: element.tagName.toLowerCase(),
                id: element.id || '',
                className: typeof element.className === 'string' ? element.className.slice(0, 60) : '',
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                position: style.position,
                overflowX: style.overflowX,
              };
            }).filter((item) => (item.right > width + 1 || item.left < -1) && item.position !== 'fixed' && item.overflowX !== 'clip' && item.overflowX !== 'hidden').slice(0, 5);
            return {
              viewportWidth: width,
              documentWidth: document.documentElement.scrollWidth,
              bodyWidth: document.body.scrollWidth,
              offenders,
              images: [...document.images].map((img) => ({ src: img.getAttribute('src'), complete: img.complete, naturalWidth: img.naturalWidth })),
              h1: document.querySelector('h1')?.textContent?.trim() ?? '',
            };
          });

          if (layout.documentWidth > viewport.width + 1 || layout.bodyWidth > viewport.width + 1) {
            problems.push('[' + viewport.name + '] ' + route + ': horizontal overflow (viewport=' + viewport.width + ', document=' + layout.documentWidth + ', body=' + layout.bodyWidth + '); offenders=' + JSON.stringify(layout.offenders));
          }
          const brokenImages = layout.images.filter((img) => img.complete && img.naturalWidth === 0);
          if (brokenImages.length) problems.push('[' + viewport.name + '] ' + route + ': broken images ' + JSON.stringify(brokenImages));
          if (route === '/' && (!layout.h1.includes('Make a lighter footprint.') || !layout.h1.includes('Keep the good life.'))) problems.push('[' + viewport.name + '] home headline is missing or incorrect: ' + layout.h1);
          if (route === '/faq') {
            const faqCount = await page.locator('details').count();
            if (faqCount !== 10) problems.push('[' + viewport.name + '] /faq: expected 10 FAQ answers, found ' + faqCount);
          }
          if (route === '/dashboard/activity') {
            const heading = await page.locator('h1').innerText();
            if (!heading.includes('My Activity')) problems.push('[' + viewport.name + '] activity route heading mismatch: ' + heading);
          }
          if (runtimeErrors.length) problems.push('[' + viewport.name + '] ' + route + ': runtime errors: ' + runtimeErrors.join(' | '));
        } catch (error) {
          problems.push('[' + viewport.name + '] ' + route + ': ' + (error instanceof Error ? error.message : String(error)));
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
  console.error('Browser QA failed with ' + problems.length + ' issue(s):');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('Browser QA passed: ' + routes.length + ' direct routes across ' + viewports.length + ' viewport profiles (' + routes.length * viewports.length + ' page loads).');
