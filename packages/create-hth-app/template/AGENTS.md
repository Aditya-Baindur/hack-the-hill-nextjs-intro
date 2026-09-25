# Hack the Hill starter

## Context

Beginner workshop app: Next.js App Router UI → Cloudflare Worker HTTP API → D1 SQLite. It already loads, adds and persists ideas locally. Prefer small, readable changes that can be explained during a lecture.

## Files

- UI: `app/idea-board.tsx`; styles: `app/globals.css`.
- Routes: `app/page.tsx`, `app/about/page.tsx`.
- API: `worker/src/index.ts` (`GET /ideas`, `POST /ideas`).
- Schema: `worker/migrations/`; D1 binding: `DB` in `worker/wrangler.jsonc`.

## Commands from the root

- `npm install` — installs both npm workspaces. Requires Node 22+.
- `npm run db:migrate` — local D1 migrations.
- `npm run dev` — Next.js :3000 and Worker :8787; Ctrl+C stops both.
- `npm run check` — Worker types/typecheck and Next.js production build.

## Working style

Read the affected files first. For a new feature, explain a short plan, make the smallest useful change, then check it. Summarize the diff and what you actually verified. Preserve the simple design and avoid extra dependencies without a clear need.

Validate request input in the Worker. Bind SQL parameters. Use new migrations for schema changes. Keep useful loading and error states in the UI. Generate Worker `Env` types with `wrangler types` instead of hand-writing them. Do not commit secrets or local database state. `NEXT_PUBLIC_` variables are visible to the browser.

Work locally by default. Remote migration or deployment changes cloud resources; only run those commands when the user asks. The all-zero D1 ID is a local placeholder, not a deployed database. Do not claim a build or runtime test passed unless you ran it.

## References

- https://nextjs.org/docs/app
- https://developers.cloudflare.com/workers/
- https://developers.cloudflare.com/d1/
- https://hth.byaditya.com/resources/
