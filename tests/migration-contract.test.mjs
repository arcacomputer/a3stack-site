import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), 'utf8');
const routes = ['', 'accounts', 'cli', 'core', 'data', 'examples', 'getting-started', 'identity', 'payments'];

test('uses Astro static output without a server adapter', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.ok(pkg.dependencies?.astro, 'astro dependency is required');
  assert.ok(pkg.dependencies?.['@astrojs/react'], 'React integration is required during the canary');
  assert.ok(pkg.dependencies?.['@astrojs/sitemap'], 'sitemap integration is required');
  assert.equal(pkg.dependencies?.next, undefined, 'Next.js must be removed');
  assert.equal(pkg.dependencies?.['@astrojs/cloudflare'], undefined, 'static output must not install the Cloudflare server adapter');

  const config = read('astro.config.mjs');
  assert.match(config, /output:\s*['"]static['"]/);
  assert.match(config, /site:\s*['"]https:\/\/a3stack\.arcabot\.ai['"]/);
  assert.match(config, /sitemap\(\)/);
});

test('defines every published route and migration metadata', () => {
  for (const route of routes) {
    const file = route ? `src/pages/${route}.astro` : 'src/pages/index.astro';
    assert.ok(existsSync(join(root, file)), `missing Astro route ${file}`);
  }

  const layout = read('src/layouts/BaseLayout.astro');
  assert.match(layout, /A3Stack — Identity × Payments × Data for AI Agents/);
  assert.match(layout, /Identity × Payments × Data for AI agents\./);
  assert.match(layout, /rel="canonical"/);
  assert.match(layout, /property="og:title"/);
  assert.match(layout, /name="twitter:card"/);
  assert.match(layout, /href="\/favicon\.ico"/);
  assert.match(layout, /rel="sitemap"/);
});

test('configures current Workers Static Assets production behavior', () => {
  const config = JSON.parse(read('wrangler.jsonc'));
  assert.equal(config.name, 'a3stack-site');
  assert.equal(config.workers_dev, false);
  assert.equal(config.preview_urls, false);
  assert.equal(config.assets?.directory, './dist');
  assert.equal(config.assets?.binding, 'ASSETS');
  assert.equal(config.assets?.run_worker_first, true);
  assert.equal(config.assets?.not_found_handling, '404-page');
  assert.equal(config.assets?.html_handling, 'auto-trailing-slash');
  assert.equal(config.main, 'src/worker.ts');
  const worker = read('src/worker.ts');
  assert.match(worker, /status:\s*308/);
  assert.match(worker, /env\.ASSETS\.fetch\(request\)/);
  assert.equal(config.compatibility_date, '2026-08-20');
  assert.equal(config.routes, undefined, 'canary must not attach custom domains');
});

test('ships discovery, security, 404, favicon, and copy assets', () => {
  for (const path of ['src/pages/404.astro', 'public/robots.txt', 'public/_headers', 'public/favicon.ico', 'public/scripts/site.js']) {
    assert.ok(existsSync(join(root, path)), `missing ${path}`);
  }

  assert.match(read('public/robots.txt'), /Sitemap: https:\/\/a3stack\.arcabot\.ai\/sitemap-index\.xml/);
  const headers = read('public/_headers');
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /X-Frame-Options: DENY/);
  assert.match(headers, /Referrer-Policy: strict-origin-when-cross-origin/);
  assert.match(headers, /Permissions-Policy:/);
  assert.match(headers, /Strict-Transport-Security:/);
  assert.match(headers, /Content-Security-Policy:/);
  assert.match(headers, /\/_astro\/\*/);
  assert.match(headers, /immutable/);

  const script = read('public/scripts/site.js');
  assert.match(script, /navigator\.clipboard\.writeText/);
  assert.match(script, /data-copy-code/);
  assert.match(script, /classList\.toggle\('scrolled'/, 'scroll styling must be driven by scroll position');

  const smoke = read('scripts/smoke.mjs');
  assert.match(smoke, /\/accounts\//, 'runtime smoke must request canonical slash routes');
  assert.match(smoke, /response\.status, 308/, 'runtime smoke must preserve Vercel redirect status');
});

test('accessibility and responsive improvements are explicit', () => {
  const nav = read('src/components/Nav.tsx');
  assert.match(nav, /<details className="mobile-nav"/);
  assert.match(nav, /data-mobile-nav-toggle/);

  const code = read('src/components/CodeBlock.tsx');
  assert.match(code, /<pre tabIndex=\{0\} aria-label="Scrollable code example"/);
  assert.match(code, /aria-live="polite"/);

  const layout = read('src/layouts/BaseLayout.astro');
  assert.match(layout, /class="skip-link"/);
  assert.match(layout, /initial-scale=1/);

  const footer = read('src/components/Footer.tsx');
  assert.match(footer, /aria-label="A3Stack on GitHub"/);

  const css = read('src/styles/global.css');
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.mobile-nav/);
});
