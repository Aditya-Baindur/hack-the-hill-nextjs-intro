# Workshop HTTPS hosting

The public site is **https://hth.adityabaindur.dev/**. Cloudflare Worker
`hack-the-hill-site` handles its certificate and redirects HTTP to HTTPS.
`hth.byaditya.com` redirects to the new address, preserving paths and queries.

GitHub Pages remains the content origin at
`https://aditya-baindur.github.io/hack-the-hill-nextjs-intro/`. Push content changes
to `main` as before; GitHub Pages builds them and the Worker serves them. No
Worker deployment is needed for HTML, CSS, JavaScript, or asset changes. GitHub
Pages may cache responses for up to ten minutes.

Keep GitHub Pages' custom domain empty and do not add a root `CNAME` file:
Cloudflare owns the public hostname, and a Pages custom domain would redirect
origin requests back to the Worker. The Worker uses HTTPS to GitHub's normal
`github.io` hostname, verifies its certificate, and rewrites origin redirects to
the public hostname. It forwards only the headers needed for static files.

To deploy changes to the HTTPS proxy, use the existing pinned Wrangler:

```sh
cd demo/worker
npm ci
npx wrangler deploy --config ../../site/wrangler.jsonc
```

The configuration explicitly targets the account and both custom domains. The
separate demo API and D1 database are not involved in this deployment.
