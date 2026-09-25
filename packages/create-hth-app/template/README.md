# Hack the Hill · Idea board

**Next.js → Cloudflare Worker → D1.** A complete starter you can read, run and extend with AI.

## Run locally

Use **Node.js 22+** (Node 24 LTS recommended).

```sh
npm install
npm run db:migrate
npm run dev
```

Open **http://localhost:3000**. The API runs at **http://localhost:8787/ideas**. Add an idea and refresh: it stays in local D1. Ctrl+C stops both servers. No Cloudflare account or API key is needed for this local workflow.

The UI defaults to the local API. To use another API, copy `.env.example` to `.env.local`, edit `NEXT_PUBLIC_API_URL`, then restart Next.js. `NEXT_PUBLIC_` values are public browser configuration, never secrets.

## Find your way

```text
app/page.tsx                           Home page
app/idea-board.tsx                     Interactive React UI
app/about/page.tsx                     A second route
app/globals.css                        Styling
worker/src/index.ts                    GET /ideas and POST /ideas
worker/migrations/0001_create_ideas.sql Table and seed data
worker/wrangler.jsonc                  Worker and D1 binding configuration
AGENTS.md                             Codex project context
.github/copilot-instructions.md        Copilot project context
```

Both packages share the root npm install through workspaces. Worker commands run from its directory automatically, so local D1 storage stays in `worker/.wrangler/`.

## Build with AI

Open this folder in your coding tool. Keep each change small: **plan → diff → run → verify**.

Start with either prompt:

> Read AGENTS.md and the app. Explain the journey from submitting an idea to saving it in D1. Point to the exact files. Do not edit anything yet.

> Add a live character counter below the idea input: “42 / 120”. Reuse existing styles and keep the current validation. First list the files you will change. Then implement it and tell me how to verify it in the browser.

Then pick one exercise:

1. **Search:** add a client-side filter of the loaded ideas. Check mixed-case and no matches.
2. **Delete:** add a Worker `DELETE /ideas/:id` route using a bound SQL parameter; add a UI button. Verify refresh removes the same idea and unknown IDs return 404.
3. **Tags:** add a new D1 migration, API validation and a small UI field. Apply it locally without editing the original migration. Check existing ideas still work.

Review prompt:

> Review the diff. Trace user input, SQL parameters, error states and loading states. Suggest the smallest fix for each real bug, then run npm run check. Do not add dependencies unless needed.

Debug prompt:

> Here is the exact error and the action that triggered it: [paste]. Read the relevant code, propose one likely cause and one check. Apply the smallest fix and verify it. Do not replace working code to hide the error.

## Verify

```sh
npm run check
```

With `npm run dev` running:

- Open the UI; both seed ideas appear.
- Add a title, refresh, and confirm it remains.
- Empty titles should be rejected. Titles are capped at 120 characters.
- To check the API error state, use separate terminals with `npm run dev:web` and `npm run dev:worker`. Stop only the Worker, then reload the UI. Restart the Worker and reload to recover.
- Ctrl+C should stop both servers and free ports 3000 and 8787.

## Deploy later

The workshop starts locally. Public deployment needs a real Cloudflare account and D1 database.

```sh
cd worker
npx wrangler login
npx wrangler d1 create hack-ideas
```

Replace the all-zero `database_id` in `worker/wrangler.jsonc` with the returned database ID. The checked-in ID is only a local placeholder. Then run:

```sh
npm run db:migrate:remote
npm run deploy
```

Set `NEXT_PUBLIC_API_URL` to your deployed Worker URL before building and hosting the Next.js app. Use a Next.js-capable host; deploying this Worker does not deploy the frontend. See [Next.js deployment](https://nextjs.org/docs/app/getting-started/deploying) or [Cloudflare's Next.js guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/).

The demo API accepts public writes and uses open CORS. Add authentication and abuse controls for a real public app. Store any future model API key on the server using secrets; never place it in `NEXT_PUBLIC_` configuration or commit it.

## Useful references

- [Workshop slides](https://hth.byaditya.com/slides/) and [prompts + resources](https://hth.byaditya.com/resources/)
- [React: learn the basics](https://react.dev/learn)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/get-started/guide/)
- [D1 local development](https://developers.cloudflare.com/d1/best-practices/local-development/)
- [D1 prepared statements](https://developers.cloudflare.com/d1/worker-api/prepared-statements/)
- [Codex CLI](https://learn.chatgpt.com/docs/cli)
- [GitHub Copilot](https://docs.github.com/en/copilot/get-started/quickstart)

AI can help with the edits. You decide what to keep by reading the diff and checking the app.
