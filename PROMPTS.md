# AI prompt pack: Next.js + Worker + D1

Use these one at a time. Give the assistant the relevant file or error output. Ask it to cite current official documentation when it makes a platform claim. Review the diff and run the app after every change.

## Start with the generated app

Use [Codex](https://learn.chatgpt.com/docs/cli) or [GitHub Copilot](https://docs.github.com/en/copilot/get-started/quickstart-for-using-github-copilot-in-your-ide) in the app folder. The package includes `AGENTS.md` and `.github/copilot-instructions.md` with the project context.

> Read the project instructions. Explain how an idea travels from app/idea-board.tsx through worker/src/index.ts into D1. Name the files involved and the command that starts each layer. Do not change code yet.

### First change: character counter

> Read app/idea-board.tsx. Add a live character counter beside the idea input, using the existing 120-character limit. Keep the design minimal and leave the API unchanged. Explain the diff, run the relevant checks, and give me a browser check for typing, clearing, and submitting the form.

## 1. Plan the smallest app

> You are my pair programmer for a beginner workshop. We have a Next.js App Router UI, a Cloudflare Worker API, and a D1 database. Plan the smallest hackathon idea board with GET /ideas and POST /ideas. Give me the file list, request flow, and one test for each step. Do not write code yet. Avoid extra services.

## 2. Review the D1 schema

> Review this D1 migration for an `ideas` table with integer `id`, required `title` limited to 120 characters, and a creation timestamp. Explain each constraint in beginner language. Point out any change needed for SQLite/D1. Keep it to one migration file.

## 3. Draft the Worker API

> Using the current Cloudflare Workers and D1 docs, write a TypeScript Worker for GET /ideas and POST /ideas. The D1 binding is `env.DB`. Validate a trimmed title of 1–120 characters, use a prepared statement with `.bind(title)`, return JSON status codes, and support browser CORS for this public demo. List assumptions and a curl check for each route. Do not add an ORM or authentication.

## 4. Draft the Next.js component

> Using the Next.js App Router, write a small Client Component that GETs ideas from `NEXT_PUBLIC_API_URL`, renders them, and POSTs a new title. Show loading, saving, and error states. Do not place secrets in `NEXT_PUBLIC_` variables. Give me one browser test that proves the data survives refresh.

## 5. Review before trusting AI code

> Review this diff as a careful teammate. Check input validation, parameterized SQL, CORS behavior, loading and error states, accessibility, local-versus-remote D1 commands, and accidental secrets. Report specific problems with file and line references. Do not rewrite unrelated code.

## 6. Debug one failure

> The expected behavior is: [expected]. The actual behavior is: [actual]. The exact command and error are: [paste]. Relevant files: [paste]. Give the most likely cause, the smallest test to confirm it, and then the smallest fix. Do not guess from the symptom alone.

## 7. Extend with runtime AI (optional)

> Plan an optional “suggest an idea” feature using Cloudflare Workers AI. Keep the existing Next.js → Worker → D1 architecture. Explain where the AI binding belongs, how to validate the model response, and how to prevent unlimited public usage. Start with the design and current official docs; do not write code yet.

## Working rule

**Prompt → inspect → run → verify.** Keep credentials and private data out of prompts and public client code.
