/**
 * API Proxy Function
 * 
 * Proxies all requests from /api/* to the Payload CMS at https://soninewmedia.com/api/*
 * This enables the frontend to access the CMS API without CORS issues and
 * maintains a clean URL structure.
 */

export const onRequest: PagesFunction = async (context) => {
  const { request, params, env } = context;
  const url = new URL(request.url);

  // Construct the target URL
  // We want to forward the path after /api/ to the backend
  const targetPath = url.pathname;

  const cmsUrl = env.CMS_URL || 'https://soni-cms.soniglf.workers.dev';

  const targetUrl = new URL(targetPath, cmsUrl);
  targetUrl.search = url.search;

  // Create a new request to the target
  const newRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow',
  });

  try {
    const response = await fetch(newRequest);

    // Create a new response with the backend's response
    // We might need to adjust headers (e.g. CORS) if not handled by the backend
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (err) {
    console.error(`API Proxy Error: ${err}`);
    return new Response(JSON.stringify({ error: 'Failed to fetch from CMS' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
