interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const lastSegment = url.pathname.split('/').at(-1) ?? '';
    const needsSlash =
      (request.method === 'GET' || request.method === 'HEAD') &&
      url.pathname !== '/' &&
      !url.pathname.endsWith('/') &&
      !lastSegment.includes('.');

    if (needsSlash) {
      url.pathname += '/';
      return new Response(null, {
        status: 308,
        headers: { Location: `${url.pathname}${url.search}` },
      });
    }

    return env.ASSETS.fetch(request);
  },
};