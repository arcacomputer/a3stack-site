# A3Stack Site

Documentation and marketing site for **A3Stack** — identity, payments, and data infrastructure for AI agents.

- Canonical site: https://a3stack.arcabot.ai
- SDK repo: https://github.com/arcabotai/a3stack

## Architecture

The site is an Astro 7 static build. React is retained only as a build-time renderer for the existing page components; the generated pages ship no React runtime. Cloudflare Workers Static Assets serves `dist/` with a custom 404 and `_headers`. No `@astrojs/cloudflare` adapter or Worker server runtime is required.

`wrangler.jsonc` is production-safe and custom-domain-ready (`workers_dev` and preview URLs are disabled), but intentionally defines no `routes`. A domain must be attached separately only after an approved cutover from the current Vercel baseline.

## Requirements

- Node.js 22.12 or newer
- npm 10 or newer

## Local development

```bash
npm ci
npm run dev
```

Astro starts on http://localhost:4321 by default.

## Checks and production build

```bash
npm test                 # migration source contract
npm run typecheck        # Astro diagnostics + TypeScript
npm run check            # diagnostics + tests
npm run build            # static build + generated-site contract
npm run cf:dry-run       # validate/package Workers assets without upload
```

## Local Cloudflare runtime

Build first, then run Wrangler's local Static Assets runtime:

```bash
npm run build
npm run cf:dev
```

In another shell:

```bash
npm run smoke
```

`smoke` checks every published route, security headers, slash redirects, and the custom 404 against `http://127.0.0.1:8787`. Override with `SMOKE_BASE_URL` if Wrangler uses another address.

A tiny stateless Worker runs before Static Assets to preserve the previous Vercel transport contract: extensionless slashless paths receive **308** to their slash form, including unknown paths, which then receive the branded **404**. The query string is preserved.

## Deployment boundary

This canary repository configuration does not attach a domain, deploy, or mutate Cloudflare. After account, zone, and cutover approval, add the exact custom-domain route through the reviewed Cloudflare workflow and deploy the already-verified commit. Do not run `wrangler deploy` against an unverified account.
