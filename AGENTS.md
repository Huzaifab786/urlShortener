# AGENTS.md — Build Instructions for Cursor

This file is the entry point. Read it fully before writing any code. It links out to
four other files in `/docs` and a folder named /design-ref which should also be checked which have design file and codes for screens for reference only and also there are pngs — read those too, in order, before starting implementation.

## Project summary

**Snipp** is a free URL shortener web app.

- Anyone can paste a long URL and get a short one instantly — no login required.
- If a user creates an account, they can save links, name them, edit them, delete them,
and see click counts on a dashboard.
- There are no paid tiers. Every feature in this app is free for every user.

## Read these files in this exact order before coding

1. `docs/TECH-STACK.md` — exact libraries, versions, and the design system (colors, fonts, spacing) already locked in from approved Stitch mockups.
2. `docs/ARCHITECTURE.md` — folder structure, routing, data flow for every user action (shortening, redirecting, saving, claiming).
3. `docs/DATABASE-SCHEMA.md` — the exact SQL to run in Supabase, every table, every column, every RLS policy. Do not deviate from this schema without updating this file first.
4. `docs/FEATURES.md` — the exact feature list, broken into phases, each with acceptance criteria. Build in phase order. Do not start Phase 2 before Phase 1 works end-to-end.



## Hard rules (do not break these)

1. **Free tier only.** Never install an SDK, call an API, or suggest a service that requires payment or a credit card, even for a "generous free trial." If a free-tier limit could realistically be hit by portfolio-level traffic, that's fine — flag it in a comment, don't avoid the feature.
2. **TypeScript strict mode.** No `any` without a comment explaining why it's unavoidable.
3. **Next.js App Router only.** No Pages Router, no mixing.
4. **Server Components by default.** Add `"use client"` only when the component needs state, event handlers, or browser-only APIs (clipboard, localStorage, etc).
5. **Mutations go through Server Actions** in `/lib/actions/*.ts`, not custom API routes — with one required exception: the short-code redirect handler at `app/[shortCode]/route.ts` must be a Route Handler, because it needs to return an HTTP redirect response, which Server Actions cannot do.
6. **Styling is Tailwind + shadcn/ui only.** If shadcn/ui has a component for it (button, input, dialog, dropdown, tabs, table), use that as the base and restyle with Tailwind classes — don't hand-roll a component from scratch.
7. **Never invent a new database column or table on the fly.** If a feature needs a schema change, stop, update `docs/DATABASE-SCHEMA.md` first, then write the code.
8. **Match the established design system exactly** (see `docs/TECH-STACK.md` → Design System section): dot-grid background on marketing pages, monospace font for short URLs/codes/numbers, sans-serif for everything else, `#3B82F6` as the only accent color, soft shadows instead of flat gray borders on cards.
9. **Every list/table view needs three states handled, not just the happy path**: loading state, empty state (with the illustration described in `docs/FEATURES.md`), and populated state.
10. **Every form needs both client-side validation (zod) and a server-side check** in the Server Action — never trust client validation alone.



## Environment variables

Create a `.env.local` file (never commit this) with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- The first two come from your Supabase project settings (Project Settings → API).
- `SUPABASE_SERVICE_ROLE_KEY` is only ever used in server-side code (the redirect route handler, to log clicks without hitting RLS restrictions). It must never appear in any file that ships to the browser. Never prefix it with `NEXT_PUBLIC_`.
- `NEXT_PUBLIC_SITE_URL` becomes your real Vercel URL after deploying (e.g. `https://snipp.vercel.app`).



## Definition of "done" for any feature you build

Before considering a feature complete, confirm:

- [ ] Works correctly for a signed-out (anonymous) user, where applicable
- [ ] Works correctly for a signed-in user
- [ ] Mobile responsive — check at 375px width
- [ ] Loading state and error state both exist, not just the success path
- [ ] If it touches the database: the RLS policy in `docs/DATABASE-SCHEMA.md` actually prevents a user from reading/writing another user's rows — verify this, don't assume it
- [ ] No console errors or warnings in the browser dev tools



## Build order

Follow the phases in `docs/FEATURES.md` in order. Within each phase, build and manually
test one feature fully before moving to the next — don't scaffold all features
simultaneously half-finished.