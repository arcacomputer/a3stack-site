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
  assert.match(html, /<title>.+A3Stack/);
  assert.ok(!html.includes('rel="canonical"'), `migration must not add a canonical for /${route}`);
  assert.ok(html.includes('property="og:url" content="https://a3stack.arcabot.ai"'), `wrong Open Graph URL for /${route}`);
  assert.ok(html.includes(marker), `missing route-specific marker on /${route}: ${marker}`);
  assert.match(html, /data-copy-code/);
  assert.match(html, /id="main-content"/);
}

for (const file of ['404.html', 'favicon.ico', '_headers', 'scripts/site.js']) {
  assert.ok(existsSync(join(dist, file)), `missing built asset: ${file}`);
}
for (const file of ['robots.txt', 'sitemap-index.xml', 'sitemap-0.xml']) {
  assert.ok(!existsSync(join(dist, file)), `migration must not add built discovery asset: ${file}`);
}

const notFound = readFileSync(join(dist, '404.html'), 'utf8');
assert.match(notFound, /<meta name="robots" content="noindex">/);
assert.match(notFound, /This page could not be found\./);
assert.ok(!notFound.includes('rel="canonical"'), '404 must not emit a canonical URL');
assert.ok(notFound.includes('property="og:url" content="https://a3stack.arcabot.ai"'), '404 must preserve the constant root Open Graph URL');
console.log(`Built-site contract passed: ${routes.size} route-specific pages, strict 404 metadata, and required static assets.`);
