# Hack the Hill: Intro to Next.js

A browser slide deck for a 30-minute beginner workshop, with a complete working demo. The visual system uses restrained typography, a white canvas, fine borders, and focused blue accents.

**Slides:** <https://aditya-baindur.github.io/hack-the-hill-nextjs-intro/>

## Present

Open `index.html` or `slides.html` in a browser. Use **← / →** or the on-slide buttons to change slides, **N** for speaker notes, **F** for fullscreen, and **P** to print or save as PDF. Touchscreens support swiping. The notes include timing and teaching prompts. Slides 1–6 cover the 15-minute introduction; slides 7–12 guide the 15-minute build. If you project your screen, use a second window for notes.

## Before the talk

1. Check `node -v` is at least 20.9.
2. Run `npm install` inside `demo/`, then `npm run dev` to confirm the backup app works at <http://localhost:3000>.
3. Open the slides and the demo in separate browser tabs.
4. If you want to code live from a fresh scaffold, run `npx create-next-app@latest hack-ideas --yes` ahead of time as a Wi-Fi fallback. The current default uses TypeScript and the App Router. Copy the files in `demo/app/` into the scaffold's `app/` directory as needed. If the scaffold uses `src/app/`, use that directory instead.

## Live build, 15 minutes

| Time | Do this | Show |
| --- | --- | --- |
| 0–2 min | Create/start the app | `app/` folder and `localhost:3000` |
| 2–4 min | Replace `app/page.tsx` | A route is a component |
| 4–7 min | Copy `demo/steps/idea-board-static.tsx` to `app/idea-board.tsx` | `.map()` and `key` |
| 7–11 min | Replace it with `demo/app/idea-board.tsx`, explaining the new lines | `"use client"` and a working button |
| 11–14 min | Add `app/about/page.tsx` and `Link` | File-based routing |
| 14–15 min | Recap; suggest a vote button | Next step for attendees |

The demo deliberately stores ideas only in React state; they reset on refresh. This leaves databases and server mutations for a follow-up workshop.

## Hosting

GitHub Pages publishes the static files from the repository's `main` branch root. `index.html` opens the slide deck, and the assets are self-contained.

The bundled Geist fonts retain their license in [`assets/geist-LICENSE.txt`](assets/geist-LICENSE.txt).

## Sources

The technical claims and commands were checked against the official Next.js documentation:

- [Installation](https://nextjs.org/docs/app/getting-started/installation)
- [Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js Learn](https://nextjs.org/learn)
- [React: Rendering Lists](https://react.dev/learn/rendering-lists)
- [React: useState](https://react.dev/reference/react/useState)
