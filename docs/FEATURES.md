# Features

Build in this exact phase order. Each feature lists acceptance criteria — a feature
isn't done until every box is true, not just when it "looks right."

There are no paid plans or pricing tiers anywhere in this app. Every feature listed
below is free for every user, always.

---

## Phase 1 — MVP (core loop must work end-to-end before touching Phase 2)

### 1.1 Landing page shorten (anonymous, no login)
- [x] Visiting `/` shows the hero, input field, and shorten button matching the approved Stitch design (dot-grid background, typing-effect headline, monospace live counter).
- [x] Pasting a valid URL and clicking "Shorten" creates a row in `links` with `user_id = null` and shows the result-state receipt card in place of the form (no page navigation).
- [x] Pasting an invalid string (not a URL) shows an inline validation error and does not hit the database.
- [x] Rate limit: after 5 anonymous shortens from the same IP in one day, show an error asking the user to sign in instead of creating another link.
- [x] The result card shows: the short URL (monospace), a working "Copy Link" button (uses the Clipboard API, shows a brief "Copied!" confirmation), the QR code (generated with the `qrcode` package, no external API call), the truncated original URL, and a "Sign in to Save" button.
- [x] "Shorten another link" resets back to the empty form state.

### 1.2 Authentication
- [x] `/sign-in` and `/sign-up` pages match the approved design (centered card, email/password fields, Google + GitHub buttons).
- [x] Email/password sign-up creates a Supabase Auth user and redirects to `/dashboard`.
- [x] Email/password sign-in works and redirects to `/dashboard`.
- [ ] Google OAuth and GitHub OAuth both work end-to-end (requires creating free OAuth apps in Google Cloud Console and GitHub Developer Settings, and adding the credentials in the Supabase Dashboard → Authentication → Providers).
- [x] Signing out clears the session and redirects to `/`.
- [x] Visiting `/dashboard` while signed out redirects to `/sign-in` (enforced in `middleware.ts`).

### 1.3 Claiming an anonymous link
- [x] If a user shortens a link anonymously, then signs up or signs in within the same browser session, that link is automatically attached to their new account (via the `snipp_pending_claim` cookie flow described in `ARCHITECTURE.md`).
- [x] A link that already belongs to another user can never be claimed by a different user (enforced by the RLS "claim" policy, not just app logic).

### 1.4 Dashboard — viewing links
- [x] `/dashboard` shows a sidebar (logo, "+ Create New Link" button, nav: Links/Analytics/Settings, user profile row at the bottom) matching the approved design.
- [x] The Links tab shows three stat cards: Total Links, Total Clicks (30 days), Top Performing link.
- [x] The links table shows: Name + tag pill, Short URL (monospace, clickable — copies to clipboard), Original URL (truncated), Clicks, Created date, Action icons (copy/edit/delete).
- [x] If the user has zero links, show the empty state (custom illustration + "No links yet" + "Create your first shortened link" + button) instead of an empty table.
- [x] Table is paginated (matches the approved design's pagination control) once a user has more than a set page size (suggested: 10 per page).

### 1.5 Dashboard — creating a link
- [x] "+ Create New Link" opens the modal matching the approved design: Destination URL (required), Custom Short Link (optional, prefixed with the site's domain), Link Title (optional).
- [x] If Custom Short Link is left blank, a random short code is generated.
- [x] If a Custom Short Link is entered and it's already taken, show an inline error before submission completes.
- [x] On success, the modal closes and the new link appears in the table immediately without a full page reload.

### 1.6 Dashboard — editing and deleting a link
- [x] Edit action reopens the create-link modal pre-filled with the link's current values; saving updates the existing row (does not create a duplicate).
- [x] Delete action shows a confirmation before deleting (a simple confirm dialog is sufficient — doesn't need to match a specific mockup).
- [x] A user can only ever edit or delete their own links — verified against the RLS policy, not just hidden in the UI.

### 1.7 Redirect handling
- [ ] Visiting `<site>/<shortCode>` for a valid code redirects (HTTP 307) to the original URL.
- [ ] Each successful redirect inserts one row into `clicks`.
- [ ] Visiting `<site>/<shortCode>` for a code that doesn't exist shows a branded "Link not found" page, not a raw Next.js 404.

---

## Phase 2 — Enhancements (only start after all of Phase 1 is verified working)

### 2.1 Search and filtering on the dashboard
- [ ] Search input filters the links table by name or short code as the user types (debounced).
- [ ] "All Links / Active / Archived" tabs filter the table accordingly.
- [ ] Archive/unarchive action toggles `is_archived` on a link without deleting it.

### 2.2 Sparklines
- [ ] Each row in the links table shows a small 7-day click trend line next to the click count, built from the `clicks` table grouped by day, rendered with `recharts`.

### 2.3 Analytics page
- [ ] A dedicated `/dashboard/analytics` page shows aggregate charts (clicks over time across all links, top 5 links by clicks).
- [ ] Optional: click geography using the free `ip-api.com` non-commercial endpoint to resolve `country` on each click at redirect time. This is a nice-to-have — skip it entirely if free-tier request limits are a concern; the app is fully functional without it.

### 2.4 Settings page
- [ ] Account settings: change password, view connected OAuth providers, delete account.

---

## Explicitly out of scope

- No pricing page, no paid plans, no billing integration of any kind.
- No custom domain purchase/setup (the architecture supports it later via the `NEXT_PUBLIC_SITE_URL` env variable, but it is not part of this build).
- No team/multi-user workspaces — every account is single-user.
- No password-protected or expiring links (could be a future portfolio "v2" idea, not part of this build).
