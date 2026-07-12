# Tech Stack

Every item below has a permanently free tier (not a trial). No paid service is used
anywhere in this project.

## Core

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Full-stack in one project, free hosting on Vercel |
| Language | TypeScript (strict mode) | Catches mistakes before runtime |
| Styling | Tailwind CSS | Already chosen, pairs with shadcn/ui |
| Component library | shadcn/ui | Copy-paste components built on Tailwind + Radix, not an npm dependency lock-in, fully free |
| Backend / DB / Auth | Supabase (free tier) | Postgres DB + Auth + Row Level Security, no separate backend server needed |
| Hosting | Vercel (Hobby plan, free) | Deploys directly from GitHub, free custom subdomain (`your-project.vercel.app`) |
| Icons | lucide-react | Free, matches shadcn/ui's default icon set |
| Charts | recharts | Free, used for dashboard sparklines and analytics |
| Forms | react-hook-form + zod | Form state + schema validation |
| Short code generation | nanoid | Generates the random short codes (e.g. `v8x9a`) |
| QR code generation | qrcode (npm package) | Generates QR codes locally — no external API call, no rate limit |
| Favicon fetching | Google's public favicon endpoint | `https://www.google.com/s2/favicons?sz=64&domain=<domain>` — free, no API key |

## Supabase client packages

Use `@supabase/ssr` (the current recommended package for Next.js App Router — NOT the
deprecated `@supabase/auth-helpers-nextjs`). This handles cookie-based session syncing
between Server Components, Server Actions, and Route Handlers correctly.

```
npm install @supabase/supabase-js @supabase/ssr
```

## Auth providers

- Email + password (built into Supabase Auth, free, unlimited on the free tier)
- Google OAuth (free — you create a free OAuth client in Google Cloud Console)
- GitHub OAuth (free — you create a free OAuth App in GitHub Developer Settings)

Both OAuth providers are configured inside the Supabase Dashboard under
Authentication → Providers. No code changes needed beyond calling
`supabase.auth.signInWithOAuth({ provider: 'google' })` /`'github'`.

## What we are deliberately NOT using (and why)

- **No Redis / Upstash** — rate limiting is done with a plain Postgres table instead (see `DATABASE-SCHEMA.md`). Avoids adding another service/account to manage.
- **No paid geolocation API** — if click-location analytics are added in Phase 2, use `ip-api.com`'s free non-commercial tier (no key required, 45 requests/min limit) instead of a paid geo-IP service. This is optional and can be skipped entirely if it's not core to the portfolio story.
- **No custom domain** — a real short domain (e.g. `snp.co`) costs money. Ship on the free `your-project.vercel.app` subdomain. Mention in the portfolio write-up that custom domain support is architecture-ready (the code already reads the base URL from an env variable) but not purchased.
- **No SWR / TanStack Query** — Next.js Server Components + Server Actions handle data fetching and mutation without needing a client-side caching library for this app's scope.

## Design system (already locked in from approved Stitch mockups — do not deviate)

**Colors**
```
--background: #FAFAFA
--surface: #FFFFFF
--text-primary: #171717
--text-secondary: #6B7280 (gray-500)
--border: #E5E5E5
--accent: #3B82F6 (blue-500)
--accent-hover: #2563EB (blue-600)
```

**Typography**
- UI text, headings, body: `Inter` or `Geist Sans`
- Short URLs, short codes, all numeric stats (click counts, totals): `JetBrains Mono` or `Geist Mono` — this is a deliberate, consistent rule, not a one-off style

**Shape & elevation**
- Border radius: 10–12px on cards and inputs, 8px on small pills/badges
- Cards use a soft box-shadow (e.g. `shadow-sm` / `shadow-md` in Tailwind), not a flat 1px gray border, except the result-state "receipt" card which intentionally uses a dashed border with a perforation-dot row along the top edge

**Recurring visual elements**
- Dot-grid background pattern on marketing pages only (landing, result state) — not on the dashboard
- The result-state card is a "receipt" motif: dashed border, small circle row along the top, monospace short URL, QR code square
- Tag pills on the dashboard use full background color, not just a colored dot (e.g. `bg-blue-50 text-blue-700` for "Social", `bg-gray-100 text-gray-600` for "Archived")
