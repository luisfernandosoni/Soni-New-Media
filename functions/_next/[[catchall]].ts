/**
 * Next.js Static Assets Proxy Function
 * 
 * Proxies requests from /_next/* to the Payload CMS at https://soni-cms.soniglf.workers.dev/_next/*
 * This is required because the CMS uses Next.js, which serves its static assets (JS, CSS) 
 * from the /_next/ path.
 */

export const onRequest: PagesFunction = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    const cmsUrl = env.CMS_URL || 'https://soni-cms.soniglf.workers.dev';

    // Target: CMS_URL/_next/...
    const targetUrl = new URL(url.pathname, cmsUrl);
    targetUrl.search = url.search;

    const newRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'follow',
    });

    try {
        const response = await fetch(newRequest);
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    } catch (err) {
        return new Response(`Error proxing _next assets: ${err}`, { status: 502 });
    }
};
