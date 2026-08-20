import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const routes = ['', 'accounts', 'cli', 'core', 'data', 'examples', 'getting-started', 'identity', 'payments'];

for (const route of routes) {
  const file = route ? join(dist, route, 'index.html') : join(dist, 'index.html');
  assert.ok(existsSync(file), `missing built route: /${route}`);
  const html = readFileSync(file, 'utf8');
  assert.match(html, /<title>.+A3Stack/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /data-copy-code/);
}

for (const file of ['404.html', 'favicon.ico', 'robots.txt', '_headers', 'scripts/site.js', 'sitemap-index.xml', 'sitemap-0.xml']) {
  assert.ok(existsSync(join(dist, file)), `missing built asset: ${file}`);
}

const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
for (const route of routes) {
  const suffix = route ? `/${route}/` : '/';
  assert.ok(sitemap.includes(`https://a3stack.arcabot.ai${suffix}`), `sitemap missing ${suffix}`);
}
assert.ok(!sitemap.includes('/404/'), '404 must not be indexed');
console.log(`Built-site contract passed: ${routes.length} routes and required static assets.`);
