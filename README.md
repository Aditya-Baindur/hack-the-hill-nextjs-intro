# Build with AI: Next.js + Cloudflare Worker + D1

A one-hour beginner workshop for Hack the Hill. The projected slides are intentionally sparse; the speaker notes, [resource page](https://hth.byaditya.com/resources/), [AI prompt pack](PROMPTS.md), and working demo carry the detail.

**Home:** <https://hth.byaditya.com/>

**Slides:** <https://hth.byaditya.com/slides/>

**Resources:** <https://hth.byaditya.com/resources/>

## Present

Use **← / →** to change slides, **N** for presenter notes, **R** for the current slide's resource, **F** for fullscreen, and **P** to print. The small arrow at the top right of every slide opens its linked resource. Touchscreens support swiping. The notes include timing, speaking cues, AI prompts, and source links. If projecting your screen, open notes in a second window.

| Time | Segment | Slides |
| --- | --- | --- |
| 0–17 min | What we are building; Next.js, Workers, D1 | 1–6 |
| 17–30 min | AI-assisted planning, review, debugging | 7–11 |
| 30–58 min | Live build: local D1, Worker API, Next.js UI, verify | 12–21 |
| 58–60 min | Path to deployment and further resources | 22–23 |

AI remains part of the build after slide 11: ask for a schema review, draft the API, review the SQL, explain the client component, and diagnose an actual error. Each prompt is in [PROMPTS.md](PROMPTS.md) and on the resource page.

Slide 2 includes a hands-on preview: add an idea, refresh, or reset the board. This preview saves only in your browser; the full Next.js + Worker demo below uses D1. If browser storage is unavailable, the preview keeps ideas for the current page session and says so.

## Before the talk

1. Have Node.js 20.9 or newer, a code editor, two terminals, and an AI coding assistant ready. A Cloudflare account is optional for the **local** demo.
2. Run the commands below before the lecture. Keep the complete demo available as a fallback if installation or Wi-Fi is slow.
3. Open the [slides](https://hth.byaditya.com/slides/), [resources](https://hth.byaditya.com/resources/), `http://localhost:3000`, and `http://localhost:8787/ideas` in browser tabs.
4. Keep the D1 database local during the timed build. Remote D1 needs a separate database and migration.

## Run the demo locally

From this repository's root, use two terminals:

```sh
cd demo/worker
npm install
npm run db:migrate
npm run dev
```

```sh
cd demo
npm install
npm run dev
```

Open <http://localhost:3000>. The Next.js client defaults to the Worker at `http://localhost:8787`. For a different Worker URL, set `NEXT_PUBLIC_API_URL` before building or running Next.js; see `demo/.env.example`. This is a public browser URL, **never a secret**.

The local Worker uses the D1 database configured in `demo/worker/wrangler.jsonc`. Its all-zero `database_id` is a placeholder for local development only. The first migration seeds two ideas. New ideas survive a page refresh because the Worker writes them to local D1.

## Live build checkpoints

| Minute | Show | AI involvement |
| --- | --- | --- |
| 30–34 | Run Worker and Next.js in two terminals | Ask for a file map if attendees are lost |
| 34–39 | Inspect and apply the D1 migration | Ask AI to explain constraints; verify against SQL |
| 39–47 | Read the binding, GET, POST, and `.bind(title)` | Ask AI to draft/review one handler |
| 47–55 | Connect the Next.js form with fetch and state | Ask AI to explain client code and review errors |
| 55–58 | Add, refresh, and query the Worker directly | Give AI exact failure output if anything breaks |

Check the API independently with `curl http://localhost:8787/ideas`. A blank title should produce a 400 response. The Worker source is in `demo/worker/src/index.ts`; the React client is in `demo/app/idea-board.tsx`.

## Optional remote deployment

Remote deployment is a separate follow-up after the one-hour lesson:

1. In `demo/worker`, authenticate with Wrangler and create a real D1 database named `hack-ideas`.
2. Replace the placeholder `database_id` in `wrangler.jsonc` with the ID returned by Cloudflare. Review the config if Wrangler offers to add a binding automatically.
3. Run `npm run db:migrate:remote`, then `npm run deploy`.
4. Build the Next.js frontend with `NEXT_PUBLIC_API_URL` set to the deployed Worker URL, and deploy it with a supported [Next.js hosting guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/).

The local database and remote database have separate data. The demo API is public and has no authentication or abuse controls; add those before using it for real submissions.

## Sources

- [Next.js App Router](https://nextjs.org/docs/app) and [Server/Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Cloudflare Workers guide](https://developers.cloudflare.com/workers/get-started/guide/)
- [D1 getting started](https://developers.cloudflare.com/d1/get-started/), [migrations](https://developers.cloudflare.com/d1/reference/migrations/), [local development](https://developers.cloudflare.com/d1/best-practices/local-development/), and [prepared statements](https://developers.cloudflare.com/d1/worker-api/prepared-statements/)
- [Cloudflare's AI prompting guide](https://developers.cloudflare.com/workers/get-started/prompting/) and [GitHub Copilot prompt engineering](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

The bundled Geist fonts retain their license in [`assets/geist-LICENSE.txt`](assets/geist-LICENSE.txt).
