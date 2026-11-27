interface Env {
  GEMINI_API_KEY?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

export const onRequestGet = async (_context: PagesContext): Promise<Response> => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'kotobatuah.com',
      hub: 'Tangerang Raya',
      runtime: 'cloudflare-pages-functions',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
};
