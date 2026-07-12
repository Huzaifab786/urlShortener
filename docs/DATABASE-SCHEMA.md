# Database Schema

Run this SQL in the Supabase SQL Editor (Dashboard → SQL Editor → New Query) exactly
as written, in order. Do not add columns or tables outside this file without updating
it first.

## Table: `links`

```sql
create table public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  original_url text not null,
  short_code text not null unique,
  is_custom_alias boolean not null default false,
  title text,
  tag text check (tag in ('social', 'email', 'marketing', 'personal', 'other') or tag is null),
  is_archived boolean not null default false,
  created_at timestamptz not null default now()
);

create index links_user_id_idx on public.links(user_id);
create index links_short_code_idx on public.links(short_code);
```

Notes:
- `user_id` is nullable — anonymous links have `user_id = null` until claimed.
- `short_code` is globally unique regardless of whether it was generated or custom.
- `tag` is a fixed enum-style check constraint — do not let the app insert arbitrary tag strings; if a new tag category is needed, update this constraint here first.

## Table: `clicks`

```sql
create table public.clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.links(id) on delete cascade,
  clicked_at timestamptz not null default now(),
  referrer text,
  user_agent text,
  country text
);

create index clicks_link_id_idx on public.clicks(link_id);
create index clicks_clicked_at_idx on public.clicks(clicked_at);
```

Notes:
- `country` is nullable and only populated if/when Phase 2 geo-lookup is added. Leave null in Phase 1.

## Table: `rate_limits`

Used to throttle anonymous link creation per IP address, avoiding the need for a
separate Redis service.

```sql
create table public.rate_limits (
  ip_address text not null,
  request_date date not null default current_date,
  request_count int not null default 1,
  primary key (ip_address, request_date)
);
```

Usage: before inserting a new anonymous link, the Server Action runs an upsert:

```sql
insert into public.rate_limits (ip_address, request_date, request_count)
values ($1, current_date, 1)
on conflict (ip_address, request_date)
do update set request_count = rate_limits.request_count + 1
returning request_count;
```

If the returned `request_count` exceeds the limit (5 per day for
anonymous, unauthenticated requests), reject the request with a clear error message
("Sign in to create more links today").

## Row Level Security (RLS)

Enable RLS on both user-facing tables:

```sql
alter table public.links enable row level security;
alter table public.clicks enable row level security;
```

### Policies for `links`

```sql
-- Anyone (anon or authenticated) can insert a link.
-- The Server Action controls whether user_id is null or set — RLS just allows the insert.
create policy "anyone can create a link"
on public.links for insert
to anon, authenticated
with check (true);

-- Authenticated users can only see their own links.
create policy "users can view their own links"
on public.links for select
to authenticated
using (auth.uid() = user_id);

-- Authenticated users can only update their own links
-- (this also covers the "claim" action, which sets user_id from null to auth.uid() —
-- see the special claim policy below).
create policy "users can update their own links"
on public.links for update
to authenticated
using (auth.uid() = user_id);

-- Authenticated users can only delete their own links.
create policy "users can delete their own links"
on public.links for delete
to authenticated
using (auth.uid() = user_id);

-- Special case: allow an authenticated user to claim an unclaimed (user_id is null) link.
-- Without this, the "users can update their own links" policy above would block claiming,
-- since auth.uid() = user_id would be false while user_id is still null.
create policy "users can claim an unclaimed link"
on public.links for update
to authenticated
using (user_id is null)
with check (auth.uid() = user_id);
```

Important: the redirect route (`app/[shortCode]/route.ts`) needs to look up a link by
`short_code` regardless of who owns it (to redirect anonymous visitors). Since the
`select` policy above only allows a user to see their own rows, the redirect route
must use the **service-role client** (`lib/supabase/admin.ts`), which bypasses RLS
entirely. Never expose the service-role key to the browser — it must only be
referenced in server-only files.

### Policies for `clicks`

```sql
-- Users can view click data only for links they own.
create policy "users can view clicks on their own links"
on public.clicks for select
to authenticated
using (
  exists (
    select 1 from public.links
    where links.id = clicks.link_id
    and links.user_id = auth.uid()
  )
);

-- Click inserts happen only via the service-role client in the redirect route,
-- so no insert policy is needed for anon/authenticated roles — RLS blocks all
-- client-side inserts to this table by default once RLS is enabled with no
-- matching insert policy, which is the desired behavior.
```

### Policy for `rate_limits`

This table is only ever read/written by the service-role client inside a Server
Action, never directly from the browser. Enable RLS with no policies at all, which
blocks all direct client access by default:

```sql
alter table public.rate_limits enable row level security;
```

## Generating TypeScript types

After running the SQL above, generate types so Cursor has accurate database types to
work against instead of guessing shapes:

```
npx supabase gen types typescript --project-id <your-project-id> > types/database.ts
```

Re-run this command any time the schema changes.
