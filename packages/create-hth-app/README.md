# create-hth-app

A small starter for the Hack the Hill workshop: **Next.js → Cloudflare Worker → D1**.

The generated app is a working idea board. Add an idea, refresh, and see it persist in local D1. Codex and GitHub Copilot context files are included so you can start changing it with AI.

## Start

Install [Node.js 22 or newer](https://nodejs.org/en/download) (Node 24 LTS recommended). No Cloudflare account is needed for local development.

This release is available as an npm package tarball on GitHub:

```sh
npm exec --yes --package=https://github.com/Aditya-Baindur/hack-the-hill-nextjs-intro/releases/download/starter-v0.1.0/create-hth-app-0.1.0.tgz -- create-hth-app my-idea-board
cd my-idea-board
npm install
npm run db:migrate
npm run dev
```

Open **http://localhost:3000**. The Worker is at **http://localhost:8787**. Ctrl+C stops both.

After publication to the npm registry, the shorter command will be:

```sh
npm create hth-app@latest my-idea-board
```

## Included

- Next.js App Router, React, TypeScript, minimal CSS.
- Worker with `GET /ideas`, `POST /ideas`, validation and parameterized SQL.
- Local D1 migration and two sample ideas.
- One npm workspace install; one command starts both servers.
- `AGENTS.md` for Codex and `.github/copilot-instructions.md` for Copilot.
- A README with small AI exercises and official documentation.

The CLI has no runtime dependencies. It copies a checked-in template into a new or empty directory. It never installs packages, deploys infrastructure or overwrites existing files. This is a teaching app with a public API; the generated README covers the next steps before public deployment.

## Commands

```sh
create-hth-app --help
create-hth-app --version
```

In the generated app:

| Command | Action |
| --- | --- |
| `npm install` | Install Next.js and Worker dependencies |
| `npm run db:migrate` | Apply migrations to local D1 |
| `npm run dev` | Start the UI and API together |
| `npm run check` | Worker typecheck and Next.js production build |

## Package development

```sh
npm test
npm pack --dry-run
npm pack
```

The template is committed, so `npm pack` requires no code generation. `npm run sync-template` deliberately copies only the listed source files from the workshop's `demo/` folder; it preserves the starter's workspace scripts, README and AI instructions. Review the template diff and run tests after syncing.

`template/_gitignore`, `_env.example` and `_github/` are renamed during scaffolding so npm reliably includes them in the packed template. Local databases, credentials and installed dependencies are never part of the package.

## Publishing

For the maintainer, from this package directory with an npm account authorized to publish the package:

```sh
npm login
npm test
npm pack --dry-run
npm publish --access public
```

After a successful registry publication, switch the workshop setup command to `npm create hth-app@latest my-idea-board`. Bump the package version before publishing any later release; npm versions cannot be overwritten.

[Workshop](https://hth.byaditya.com) · [Resources](https://hth.byaditya.com/resources/) · [Source](https://github.com/Aditya-Baindur/hack-the-hill-nextjs-intro)
