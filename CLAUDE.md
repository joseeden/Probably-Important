# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Keep the replies extremely concise and focused on the code. Avoid unnecessary explanations or commentary. Only provide information that is directly relevant to the code. Avoid long explanations, background information, or unrelated details. Focus on the code itself and its functionality.

When checking documentation, ALWAYS use the `docs-researcher` agent to perform the lookup. Return only the relevant summary and implementation guidance. Avoid pasting large documentation pages into the main conversation.

## Critical: Next.js version

This project pins **Next.js 16.2.9** and **React 19.2**, which have breaking changes vs. older releases. Before writing any Next.js/React code, read the relevant guide under `node_modules/next/dist/docs/` (e.g. `01-app/`, `03-architecture/`). Do not rely on training-data conventions for routing, Route Handlers, `params`, server/client component boundaries, or config.

## Runtime & commands

Bun is the runtime and package manager (the lockfile is `bun.lock`; `@types/bun` is a dependency). Use `bun`, not `npm`/`yarn`/`pnpm`.

- `bun install` — install dependencies
- `bun dev` — start the dev server (http://localhost:3000)
- `bun run build` — production build
- `bun run start` — run the production server
- `bun run lint` — ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next`)

There is **no test runner configured yet**. If you add tests, prefer `bun test` and wire up a `test` script.

Prisma 7 is a dependency but `prisma/schema.prisma` and a `prisma`/`db` script do not exist yet — create them when implementing persistence (`bunx prisma generate`, `bunx prisma migrate dev`).

## Project state

This is a near-empty `create-next-app` scaffold. `app/page.tsx` and `app/layout.tsx` are still the default starter; **none of the actual application has been built**. `SPEC.md` is the authoritative build target — read it before implementing features.

## Architecture (per SPEC.md)

"Probably Important" is a per-user note-taking app: authenticated users create/edit/delete/search rich-text notes, with optional public sharing via an unguessable `shareToken` URL.

- **Auth** — `better-auth` with the Prisma adapter (email + password). It mounts its own handler at `/api/auth/[...all]` and owns the `User`/`Session`/`Account`/`Verification` tables. App code reads the session server-side on every request.
- **Authorization** — the core invariant: every note operation verifies `note.userId === session.user.id` server-side. The only public path is viewing a shared note, looked up by `shareToken` and gated on `isPublic === true`.
- **Data** — Prisma 7 against Neon PostgreSQL (`@neondatabase/serverless`). The one app-owned model is `Note` (id, title, content, userId, isPublic, shareToken, timestamps); indexed on `userId` and `shareToken`. Search is `contains` (case-insensitive) on title/content — kept deliberately simple.
- **Editor** — TipTap v3 (`@tiptap/react` + `starter-kit`, plus `link` and `underline` extensions). Note `content` is stored as the editor's HTML/JSON.
- **Validation** — Zod v4 for API input validation; write endpoints return `400`/`401`/`403`/`404` as appropriate.

See SPEC.md §5 (schema), §7 (API endpoints), §8 (pages/components) for the full contract.

## Conventions

- **Import alias**: `@/*` maps to the **repo root** (`./*`), not `src/`. The App Router lives at the root-level `app/` directory — SPEC.md's `src/`-prefixed folder layout is illustrative; match the actual root-level structure.
- **TypeScript**: `strict` mode is on; SPEC mandates no `any` in domain code.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss` (configured in `postcss.config.mjs`; no `tailwind.config.js`). Global styles in `app/globals.css`.
- **Secrets**: env-based config; `.env*` is gitignored. `DATABASE_URL` (Neon) and better-auth secrets go there.
