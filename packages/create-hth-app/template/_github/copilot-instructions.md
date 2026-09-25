# Project context

This beginner Hack the Hill starter is Next.js App Router + a separate Cloudflare Worker + D1. Follow `AGENTS.md` for the full project map and workflow.

- Root npm workspaces include `worker`; install once with `npm install` (Node 22+).
- Run `npm run db:migrate`, then `npm run dev` for UI :3000 and API :8787.
- React UI: `app/idea-board.tsx`. Worker API: `worker/src/index.ts`. Schema: `worker/migrations/`.
- Explain a short plan, make small readable changes, review the diff, and run `npm run check`.
- Validate input, bind SQL parameters, keep error/loading states, and add new migrations for schema changes.
- Generate Worker types using Wrangler. Never commit secrets, `.env.local` or local D1 data.
- `NEXT_PUBLIC_` variables are public. Keep future model API keys server-side.
- Local work is the default. Run remote migrations or deployment only when requested.
- Report what was actually tested, and give one concrete browser check for the change.

Docs: https://nextjs.org/docs/app · https://developers.cloudflare.com/d1/ · https://hth.byaditya.com/resources/
