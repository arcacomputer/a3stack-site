import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const routes = new Map([
  ['', 'Give your AI agent an identity'],
  ['accounts', '>Accounts<'],
  ['cli', '>CLI<'],
  ['core', '>Core<'],
  ['data', 'Data / MCP'],
  ['examples', '>Examples<'],
  ['getting-started', 'Getting Started'],
  ['identity', '>Identity<'],
  ['payments', '>Payments<'],
]);

for (const [route, marker] of routes) {
  const file = route ? join(dist, route, 'index.html') : join(dist, 'index.html');
  assert.ok(existsSync(file), `missing built route: /${route}`);
  const html = readFileSync(file, 'utf8');
  const canonical = route ? `https://a3stack.arcabot.ai/${route}/` : 'https://a3stack.arcabot.ai/';
  assert.match(html, /<title>.+A3Stack/);
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `wrong canonical for /${route}`);
  assert.ok(html.includes(marker), `missing route-specific marker on /${route}: ${marker}`);
  assert.match(html, /data-copy-code/);
  assert.match(html, /id="main-content"/);
}

for (const file of ['404.html', 'favicon.ico', 'robots.txt', '_headers', 'scripts/site.js', 'sitemap-index.xml', 'sitemap-0.xml']) {
  assert.ok(existsSync(join(dist, file)), `missing built asset: ${file}`);
}

const notFound = readFileSync(join(dist, '404.html'), 'utf8');
assert.match(notFound, /<meta name="robots" content="noindex">/);
assert.match(notFound, /This page could not be found\./);
assert.ok(!notFound.includes('rel="canonical"'), '404 must not emit a canonical URL');
assert.ok(!notFound.includes('property="og:url"'), '404 must not emit an Open Graph URL');

const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
for (const route of routes.keys()) {
  const suffix = route ? `/${route}/` : '/';
  assert.ok(sitemap.includes(`https://a3stack.arcabot.ai${suffix}`), `sitemap missing ${suffix}`);
}
assert.ok(!sitemap.includes('/404/'), '404 must not be indexed');
console.log(`Built-site contract passed: ${routes.size} route-specific pages, strict 404 metadata, and required static assets.`);
