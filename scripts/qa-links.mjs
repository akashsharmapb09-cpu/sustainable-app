import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const appRoot = path.join(root, 'app');
const sourceRoots = [appRoot, path.join(root, 'components')];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (/\.(?:tsx|ts|jsx|js|html)$/.test(entry.name)) files.push(fullPath);
  }
  return files;
}

const files = (await Promise.all(sourceRoots.map(walk))).flat();
const content = new Map();
for (const file of files) content.set(file, await readFile(file, 'utf8'));

function fileRoute(file) {
  if (!file.startsWith(appRoot + path.sep)) return null;
  const relative = path.relative(appRoot, file).split(path.sep);
  const filename = relative.pop();
  if (!['page.tsx', 'route.ts', 'route.tsx'].includes(filename)) return null;
  const segments = relative.filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')));
  const route = '/' + segments.join('/');
  return route === '/' ? '/' : route.replace(/\/$/, '');
}

const routes = new Set(files.map(fileRoute).filter(Boolean));
const routeFiles = new Map(files.filter(fileRoute).map((file) => [fileRoute(file), file]));
const problems = [];
const staticExtensions = /\.(?:png|jpe?g|svg|webp|gif|ico|css|js|json|xml|woff2?|txt|pdf)$/i;

function routeExists(candidate) {
  const value = candidate === '/' ? '/' : candidate.replace(/\/$/, '');
  for (const route of routes) {
    if (route === value) return true;
    const pattern = '^' + route.split('/').map((segment) => {
      if (/^\[\.\.\..+\]$/.test(segment)) return '.+';
      if (/^\[.+\]$/.test(segment)) return '[^/]+';
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('/') + '$';
    if (new RegExp(pattern).test(value)) return true;
  }
  return false;
}

for (const [file, source] of content) {
  const relative = path.relative(root, file);
  const staticPaths = [
    ...[...source.matchAll(/(?:href|src)\s*=\s*["'](\/[^"']+)["']/g)].map((match) => match[1]),
    ...[...source.matchAll(/image:\s*["'](\/[^"']+\.(?:svg|png|webp|jpe?g))["']/g)].map((match) => match[1]),
  ];

  for (const destination of staticPaths) {
    const pathname = destination.split(/[?#]/)[0] || '/';
    if (staticExtensions.test(pathname)) {
      const relativeAsset = pathname.replace(/^\//, '');
      if (!existsSync(path.join(root, 'public', relativeAsset)) && !existsSync(path.join(root, relativeAsset))) {
        problems.push('Missing static asset ' + pathname + ' in ' + relative);
      }
    } else if (!routeExists(pathname)) {
      problems.push('Unregistered internal route ' + pathname + ' in ' + relative);
    }
  }

  const ids = new Set([...source.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
  for (const match of source.matchAll(/href=["']#([^"']+)["']/g)) {
    if (!ids.has(match[1])) problems.push('Missing in-page anchor #' + match[1] + ' in ' + relative);
  }
}

if (problems.length) {
  console.error('Next.js route and asset audit failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('Next.js route/asset audit passed: ' + routes.size + ' App Router routes and ' + files.length + ' component files inspected.');
