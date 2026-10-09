import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const srcRoot = path.join(root, 'src');
const appPath = path.join(srcRoot, 'App.tsx');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(fullPath));
    else if (/\.(?:tsx|ts|html)$/.test(entry.name)) result.push(fullPath);
  }
  return result;
}

const files = [...await walk(srcRoot), path.join(root, 'index.html')];
const contents = new Map();
for (const file of files) contents.set(file, await readFile(file, 'utf8'));

const appSource = contents.get(appPath) ?? await readFile(appPath, 'utf8');
const routePaths = new Set(
  [...appSource.matchAll(/<Route\s+path=["']([^"']+)["']/g)].map(match => match[1]),
);
const componentImports = new Map(
  [...appSource.matchAll(/const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(["']\.\/([^"']+)["']\)/g)]
    .map(match => [match[1], path.join(srcRoot, match[2] + (match[2].endsWith('.tsx') ? '' : '.tsx'))]),
);
const routeComponents = new Map();
for (const match of appSource.matchAll(/<Route\s+path=["']([^"']+)["']\s+element=\{<RouteMotion><(\w+)/g)) {
  const componentFile = componentImports.get(match[2]);
  if (componentFile) routeComponents.set(match[1], componentFile);
}

const problems = [];
const normalized = value => value === '/' ? '/' : value.replace(/\/$/, '');
const explicitRoutes = [...routePaths].filter(route => route !== '*');

function routeExists(candidate) {
  const value = normalized(candidate);
  if (routePaths.has(value)) return true;
  return explicitRoutes.some(route => {
    const pattern = '^' + route.split('/').map(segment =>
      segment.startsWith(':') ? '[^/]+' : segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    ).join('/') + '$';
    return new RegExp(pattern).test(value);
  });
}

for (const [file, source] of contents) {
  const relative = path.relative(root, file);
  const ids = new Set([...source.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]));

  for (const match of source.matchAll(/(?:to|href)\s*=\s*["'](\/[^"']*)["']/g)) {
    const destination = match[1];
    const pathname = normalized(destination.split(/[?#]/)[0] || '/');
    const fragment = destination.includes('#') ? destination.split('#').slice(1).join('#').split('?')[0] : '';

    if (/\.[a-z0-9]{2,8}$/i.test(pathname)) {
      const relativeAsset = pathname.replace(/^\//, '');
      const assetExists = existsSync(path.join(root, 'public', relativeAsset))
        || existsSync(path.join(root, relativeAsset));
      if (!assetExists) problems.push(`Missing static asset ${pathname} in ${relative}`);
      continue;
    }

    if (!routeExists(pathname)) {
      problems.push(`Unregistered internal route ${pathname} in ${relative}`);
      continue;
    }

    if (fragment) {
      const routeFile = routeComponents.get(pathname);
      if (routeFile && contents.has(routeFile)) {
        const target = contents.get(routeFile);
        const targetIds = new Set([...target.matchAll(/\bid=["']([^"']+)["']/g)].map(item => item[1]));
        if (!targetIds.has(fragment)) problems.push(`Missing anchor #${fragment} in route ${pathname} linked from ${relative}`);
      } else if (fragment && !routeFile) {
        // Routes rendered by shared/legal layouts may not need deep-link anchors.
      }
    }
  }

  for (const match of source.matchAll(/href=["']#([^"']+)["']/g)) {
    if (!ids.has(match[1])) problems.push(`Missing in-page anchor #${match[1]} in ${relative}`);
  }
}

if (problems.length) {
  console.error('Internal route and asset audit failed:');
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(`Route/asset audit passed: ${routePaths.size} registered routes, ${files.length} source files inspected.`);
