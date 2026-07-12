# Architecture

## High-level shape

One Next.js project. No separate backend server. Supabase acts as the entire backend
(Postgres database, authentication, and Row Level Security acting as the authorization
layer). Next.js Server Components read data directly from Supabase on the server.
Server Actions handle every write (create link, delete link, edit link, claim link).
One Route Handler exists solely for the short-code redirect, because only a Route
Handler can return an HTTP redirect.

## Folder structure

```
/app
  /(marketing)
    page.tsx                  → Landing page (hero, shorten form, result state)
    layout.tsx                → Marketing layout (nav + footer, dot-grid background)
  /(auth)
    sign-in/page.tsx
    sign-up/page.tsx
    layout.tsx                → Centered auth card layout, no nav/footer
  /(dashboard)
    layout.tsx                → Sidebar + protected route check
    dashboard/
      page.tsx                → "Links" tab (default) — table, stats, search
      analytics/page.tsx       → Phase 2
      settings/page.tsx        → Phase 2
  /[shortCode]
    route.ts                  → GET handler: look up code, log click, redirect
  /auth/callback
    route.ts                  → OAuth callback handler (Supabase requires this)

/components
  /ui                          → shadcn/ui components (button, input, dialog, table, etc)
  /landing
    shorten-form.tsx
    result-card.tsx
    live-counter.tsx
  /dashboard
    sidebar.tsx
    links-table.tsx
    stat-card.tsx
    create-link-modal.tsx
    empty-state.tsx
    sparkline.tsx
  /shared
    logo.tsx
    copy-button.tsx
    qr-code.tsx

/lib
  supabase/
    client.ts                 → browser Supabase client
    server.ts                 → server Supabase client (reads cookies)
    admin.ts                  → service-role client, server-only, used only by redirect route
  actions/
    links.ts                  → createLink, updateLink, deleteLink, claimLink Server Actions
    auth.ts                   → signIn, signUp, signOut Server Actions (or use Supabase client directly in client components — see note below)
  utils/
    shortcode.ts              → nanoid-based short code generator + collision check
    rate-limit.ts             → Postgres-based rate limit check for anonymous shortening
    favicon.ts                → builds the Google favicon URL from a domain string

/types
  database.ts                 → Supabase-generated types (run `supabase gen types typescript`)

/docs                          → this documentation set
middleware.ts                 → refreshes Supabase session cookie, protects /dashboard/*
```

## Data flow: anonymous user shortens a URL

1. User pastes a URL into the hero input on `/` and clicks "Shorten."
2. Client component calls the `createLink` Server Action with the raw URL.
3. Server Action:
   a. Validates the URL with zod (must be a well-formed `http(s)://` URL).
   b. Checks the rate limit table for the requester's IP (see `DATABASE-SCHEMA.md` → `rate_limits`). If over the limit, return an error.
   c. Generates a short code with `nanoid(7)`, checks it doesn't already exist in `links`, retries once on collision.
   d. Inserts a row into `links` with `user_id = null`.
   e. Returns the short code to the client.
4. Client swaps the form for the "receipt" result card, showing the short URL, QR code (generated client-side via the `qrcode` package), and a "Sign in to Save" prompt.
5. The short code is also stored in a browser cookie (`snipp_pending_claim`, 24hr expiry) so it can be claimed later if the user signs up in this session — see "Claiming a link" below.

## Data flow: redirect handling

1. Visitor goes to `your-project.vercel.app/abc123`.
2. `app/[shortCode]/route.ts` runs on the server:
   a. Looks up `abc123` in the `links` table.
   b. If not found → render a branded 404 page ("This link doesn't exist or has expired").
   c. If found → insert a row into `clicks` (link_id, timestamp, referrer header, user-agent header) using the service-role client (bypasses RLS since this is a system action, not a user action), then issue a 307 redirect to `original_url`.
3. Click logging must not block the redirect noticeably — insert the click row, then redirect; do not wait on any non-essential work.

## Data flow: sign up / sign in

1. User submits the sign-in or sign-up form (client component, since Supabase Auth's
   client-side methods handle session cookies most reliably via `@supabase/ssr`'s
   browser client).
2. On success, Supabase sets session cookies automatically.
3. Redirect to `/dashboard`.
4. If a `snipp_pending_claim` cookie exists, trigger the `claimLink` Server Action (see below) before redirecting.

## Data flow: claiming an anonymously-created link

This is the mechanism for "paste and shorten with no login, but offer to save it if
you sign in right after."

1. On successful sign-in/sign-up, check for the `snipp_pending_claim` cookie.
2. If present, call the `claimLink` Server Action with the short code inside it.
3. Server Action verifies the link's `user_id` is currently `null` (prevents claiming someone else's already-owned link), then updates `user_id` to the newly authenticated user's ID.
4. Clear the `snipp_pending_claim` cookie.
5. The link now appears in that user's dashboard.

## Data flow: dashboard — creating a link while logged in

1. User clicks "+ Create New Link," modal opens (`create-link-modal.tsx`).
2. Form fields: Destination URL (required), Custom Short Link (optional, validated for allowed characters and uniqueness), Link Title (optional).
3. Submits to `createLink` Server Action — same action as the anonymous flow, but this time `user_id` is populated from the authenticated session, and if `custom_alias` is provided, that string is used as the short code instead of a generated one (after checking it's not already taken).
4. On success, close modal, revalidate the dashboard page data (`revalidatePath('/dashboard')`), new row appears in the table without a full page reload.

## Route protection

`middleware.ts` checks for a valid Supabase session on any request to `/dashboard/*`.
If no valid session, redirect to `/sign-in`. This is the only route protection needed —
RLS policies in the database are the real security boundary, middleware is just the
user-experience layer (redirecting before they see a broken page).
