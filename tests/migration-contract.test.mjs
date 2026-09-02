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
  assert.equal(pkg.dependencies?.['@astrojs/sitemap'], undefined, 'migration must not add unapproved sitemap behavior');
  assert.equal(pkg.dependencies?.next, undefined, 'Next.js must be removed');
  assert.equal(pkg.dependencies?.['@astrojs/cloudflare'], undefined, 'static output must not install the Cloudflare server adapter');
  assert.equal(pkg.devDependencies?.['@astrojs/cloudflare'], undefined, 'static output must not install the Cloudflare server adapter as a devDependency');
  assert.equal(pkg.dependencies?.['@opennextjs/cloudflare'], undefined, 'OpenNext must not be introduced');

  const config = read('astro.config.mjs');
  assert.match(config, /output:\s*['"]static['"]/);
  assert.match(config, /site:\s*['"]https:\/\/a3stack\.arcabot\.ai['"]/);
  assert.doesNotMatch(config, /@astrojs\/sitemap|sitemap\(\)/);
  assert.doesNotMatch(config, /@astrojs\/cloudflare|adapter:\s*cloudflare/, 'static site must not enable the Cloudflare SSR adapter');
});

test('defines every published route and migration metadata', () => {
  for (const route of routes) {
    const file = route ? `src/pages/${route}.astro` : 'src/pages/index.astro';
    assert.ok(existsSync(join(root, file)), `missing Astro route ${file}`);
  }

  const layout = read('src/layouts/BaseLayout.astro');
  assert.match(layout, /A3Stack — Identity × Payments × Data for AI Agents/);
  assert.match(layout, /Identity × Payments × Data for AI agents\./);
  assert.doesNotMatch(layout, /rel="canonical"/, 'migration must preserve the existing metadata surface');
  assert.match(layout, /property="og:title"/);
  assert.match(layout, /name="twitter:card"/);
  assert.match(layout, /href="\/favicon\.ico"/);
  assert.match(layout, /property="og:url" content="https:\/\/a3stack\.arcabot\.ai"/);
  assert.doesNotMatch(layout, /rel="sitemap"/);
});

test('configures current Workers Static Assets production behavior', () => {
  const config = JSON.parse(read('wrangler.jsonc'));
  assert.equal(config.name, 'a3stack-site-canary');
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

test('ships security, 404, favicon, and copy assets without discovery drift', () => {
  for (const path of ['src/pages/404.astro', 'public/_headers', 'public/favicon.ico', 'public/scripts/site.js']) {
    assert.ok(existsSync(join(root, path)), `missing ${path}`);
  }

  assert.equal(existsSync(join(root, 'public/robots.txt')), false, 'migration must not invent robots policy');
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

test('preserves the compact Next-style 404 inside the shared site layout', () => {
  const page = read('src/pages/404.astro');
  const css = read('src/styles/global.css');

  assert.match(page, /<BaseLayout[^>]*noindex>/);
  assert.match(page, /class="not-found-message"/);
  assert.match(page, /<h1>404<\/h1>/);
  assert.match(page, /<p>This page could not be found\.<\/p>/);
  assert.match(css, /\.not-found-message\s*\{[^}]*display:\s*flex[^}]*align-items:\s*center/s);
  assert.match(css, /\.not-found-message h1\s*\{[^}]*font-size:\s*24px[^}]*border-right:/s);
  assert.match(css, /\.not-found-message p\s*\{[^}]*font-size:\s*14px/s);
  assert.doesNotMatch(css, /\.not-found h1[^}]*clamp\(/s, '404 must not use the oversized redesign');
});

test('provides keyboard-safe responsive layouts without document overflow', () => {
  const nav = read('src/components/Nav.tsx');
  const footer = read('src/components/Footer.tsx');
  const docs = read('src/components/DocLayout.tsx');
  const home = read('src/react-pages/Home.tsx');
  const script = read('public/scripts/site.js');
  const css = read('src/styles/global.css');

  assert.match(nav, /<details className="mobile-nav">/);
  assert.match(nav, /<summary[^>]*data-mobile-nav-toggle/);
  assert.match(nav, /aria-controls="mobile-nav-panel"/);
  assert.match(nav, /id="mobile-nav-panel"/);
  assert.match(script, /event\.key !== 'Escape'/);
  assert.match(script, /mobileNavToggle\?\.focus\(\)/);
  assert.match(footer, /className="footer-grid"/);
  assert.match(footer, /className="footer-bottom"/);
  assert.match(docs, /className="doc-layout"/);
  assert.match(home, /className="home-page"/);
  assert.match(home, /className="responsive-grid problem-grid"/);
  assert.match(home, /className="responsive-grid pillar-grid"/);
  assert.match(home, /className="responsive-grid timeline-grid"/);
  assert.match(home, /className="responsive-grid package-grid"/);
  assert.match(css, /@media \(max-width: 900px\)/);
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.match(css, /\.doc-sidebar\s*\{[^}]*display:\s*none\s*!important/s);
  assert.match(css, /\.doc-content table\s*\{[^}]*overflow-x:\s*auto/s);
  assert.match(css, /\.code-block\s*\{[^}]*max-width:\s*100%/s);
  assert.match(css, /overflow-wrap:\s*anywhere/);
});

test('documents the approved migration parity baseline', () => {
  const readme = read('README.md');
  assert.match(readme, /## Migration parity baseline/);
  assert.match(readme, /constant root `og:url`/);
  assert.match(readme, /does not add canonical links, sitemap output, or a robots policy/);
  assert.match(readme, /320–390px/);
  assert.match(readme, /compact Next-style 404/);
  assert.match(readme, /a3stack-site-canary/);
  assert.match(readme, /No `@astrojs\/cloudflare` adapter/);
});

test('preserves the observed live visual behavior without redesigning the site', () => {
  const nav = read('src/components/Nav.tsx');
  const code = read('src/components/CodeBlock.tsx');
  const layout = read('src/layouts/BaseLayout.astro');
  const footer = read('src/components/Footer.tsx');
  const css = read('src/styles/global.css');

  assert.match(code, /<pre tabIndex=\{0\} aria-label="Scrollable code example"/);
  assert.match(code, /aria-live="polite"/);
  assert.match(layout, /class="skip-link"/);
  assert.match(layout, /initial-scale=1/);
  assert.match(footer, /aria-label="A3Stack on GitHub"/);
  assert.doesNotMatch(css, /fonts\.googleapis\.com/, 'live production does not load the declared Google fonts');
  assert.match(css, /--text-muted:\s*#4b5f73/);
  assert.match(css, /\.copy-code[^}]*opacity:\s*0/s);
  assert.match(css, /\.site-nav\.scrolled\s*\{[^}]*rgba\(6,\s*9,\s*15,\s*0\.92\)/s);
  assert.match(css, /\.site-nav\s*\{[^}]*border-bottom:\s*none/s);
  assert.match(nav, /mobile-nav/, 'approved mobile repair must keep the full navigation usable');
  assert.match(css, /@media \(max-width:/, 'approved mobile repair must add responsive layout rules');
  assert.doesNotMatch(footer, /textDecoration:\s*"underline"/);
  assert.match(code, /terminalPrompt\s*\?\s*\(/);
  assert.match(code, /<pre className="!py-4"/);
  assert.match(code, /normalized\.split\(['"]\\n['"]\)\.map/);
  assert.match(code, /className="flex gap-3"/);
  assert.match(code, /<span[^>]*color:\s*"#fbbf24"[^>]*>\$<\/span>/s);
  assert.match(code, /<CodeBlock code=\{code\} lang="bash" filename="terminal" terminalPrompt/);

  for (const page of ['Home', 'accounts', 'cli', 'getting-started', 'identity', 'payments']) {
    assert.doesNotMatch(read(`src/react-pages/${page}.tsx`), /#8291a5/, `${page} must retain the production text color`);
  }
});
