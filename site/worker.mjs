const ORIGIN = "https://aditya-baindur.github.io";
const PREFIX = "/hack-the-hill-nextjs-intro";

export default {
  async fetch(request) {
    const publicUrl = new URL(request.url);
    if (publicUrl.protocol === "http:" || publicUrl.hostname === "hth.byaditya.com") {
      publicUrl.protocol = "https:";
      if (publicUrl.hostname === "hth.byaditya.com") publicUrl.hostname = "hth.adityabaindur.dev";
      return Response.redirect(publicUrl.href, 308);
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const originUrl = new URL(ORIGIN);
    originUrl.pathname = PREFIX + publicUrl.pathname;
    originUrl.search = publicUrl.search;
    const headers = new Headers();
    for (const name of ["Accept", "Accept-Encoding", "If-None-Match", "If-Modified-Since", "Range"]) {
      if (request.headers.has(name)) headers.set(name, request.headers.get(name));
    }
    const origin = await fetch(originUrl, {
      method: request.method,
      headers,
      redirect: "manual",
    });
    const response = new Response(origin.body, origin);
    const location = response.headers.get("Location");
    if (location) {
      const redirect = new URL(location, originUrl);
      if (redirect.origin === ORIGIN &&
          (redirect.pathname === PREFIX || redirect.pathname.startsWith(PREFIX + "/"))) {
        publicUrl.pathname = redirect.pathname.slice(PREFIX.length) || "/";
        publicUrl.search = redirect.search;
        publicUrl.hash = redirect.hash;
        response.headers.set("Location", publicUrl.href);
      }
    }
    response.headers.set("Strict-Transport-Security", "max-age=86400");
    return response;
  },
};
