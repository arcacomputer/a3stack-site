import assert from 'node:assert/strict';

const base = (process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:8787').replace(/\/$/, '');
const routes = ['/', '/accounts/', '/cli/', '/core/', '/data/', '/examples/', '/getting-started/', '/identity/', '/payments/'];

for (const route of routes) {
  const response = await fetch(`${base}${route}`, { redirect: 'manual' });
  assert.equal(response.status, 200, `${route} returned ${response.status}`);
  const html = await response.text();
  assert.match(html, /A3Stack/);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
}

for (const route of routes.slice(1)) {
  const slashless = route.slice(0, -1);
  const response = await fetch(`${base}${slashless}`, { redirect: 'manual' });
  assert.equal(response.status, 307, `${slashless} returned ${response.status}`);
  assert.equal(response.headers.get('location'), route);
}

for (const route of ['/definitely-missing-a3stack-page', '/definitely-missing-a3stack-page/']) {
  const missing = await fetch(`${base}${route}`, { redirect: 'manual' });
  assert.equal(missing.status, 404, `${route} returned ${missing.status}`);
  assert.match(await missing.text(), /Page not found/);
}

console.log(`Runtime smoke passed: ${routes.length} routes, ${routes.length - 1} slash redirects, and 2 custom 404 forms at ${base}.`);
