# Byte Brainiacs — Admin & Registration Backend

This adds a full admin system on top of the existing site: team approval/rejection,
direct team creation for solo/duo (or trio) members, admin login, and the Supabase
database + API routes backing all of it.

## What was added

- **Database**: `supabase/schema.sql` — `teams` + `members` tables, enums, indexes, RLS.
- **Backend API** (`app/api/...`):
  - `POST /api/register` — public registration endpoint (wired up to the existing form).
  - `POST /api/admin/login` / `POST /api/admin/logout` — admin session cookie.
  - `GET /api/admin/teams` — list all teams + members, optional `?status=` filter.
  - `POST /api/admin/teams` — admin creates a solo/duo/trio team directly, auto-approved.
  - `PATCH /api/admin/teams/:id` — approve / reject / reset a team's status.
  - `DELETE /api/admin/teams/:id` — delete a team and its members.
- **Auth**: `middleware.ts` + `lib/adminAuth.ts` — every `/admin/*` page and `/api/admin/*`
  route is gated behind a signed, httpOnly session cookie. Login checks a single shared
  `ADMIN_PASSWORD` from the environment (no admin-accounts table, per your setup choice).
- **Admin UI** (`app/admin`, `components/admin/*`): dashboard with status tabs, approve/
  reject/delete actions, and a "Create Team" modal for adding solo/duo members directly.
  Styled to match the existing dark/neon look (same fonts, gradients, glass cards).
- **Registration form**: was previously cosmetic only (never sent data anywhere). It now
  actually submits to `/api/register`, with loading and error states.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com) if you don't have one.
2. Open **SQL Editor** in your project, paste the contents of `supabase/schema.sql`, and run it.
   This creates the `teams` and `members` tables with indexes and RLS policies.
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not currently used by the
     backend, but kept for any future client-side Supabase usage)
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

The service role key bypasses Row Level Security and is what the server-side API routes
use to read/write. **Never** expose it to the browser — it's only read in
`lib/supabaseAdmin.ts`, which is marked `server-only`.

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in real values:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=set-a-strong-password
ADMIN_SESSION_SECRET=set-a-long-random-string-32-chars-or-more
```

Generate a good `ADMIN_SESSION_SECRET` with:
```bash
openssl rand -base64 32
```

## 3. Install and run

```bash
npm install
npm run dev
```

- Public site: `http://localhost:3000`
- Registration: `http://localhost:3000/register`
- Admin login: `http://localhost:3000/admin/login` (password = your `ADMIN_PASSWORD`)
- Admin dashboard: `http://localhost:3000/admin` (redirects to login if not authenticated)

## How it works

- **Registrations** (from the public form) are always created with `status: "pending"`
  and `source: "registration"`. An admin must approve them before they count as confirmed.
- **Admin-created teams** (via the "Create Team" button in the dashboard) are created
  with `status: "approved"` and `source: "admin_created"` immediately, since an admin is
  vouching for them directly — this is the flow for solo/dual members who registered
  outside the normal form (e.g. by email, in person, etc.).
- The admin session is a signed JWT (HS256, `jose`) stored in an httpOnly cookie, checked
  by `middleware.ts` on every request to `/admin/*` and `/api/admin/*`. There's no admin
  accounts table — anyone with the shared `ADMIN_PASSWORD` gets the same access.
- All Supabase access happens server-side via the service-role client; the browser never
  talks to Supabase directly. RLS policies on `teams`/`members` deny all anon/authenticated
  access as a defense-in-depth measure, since service-role bypasses RLS anyway.

## Notes / things to double check before going live

- The shared `ADMIN_PASSWORD` model means anyone with the password has full admin
  rights (approve, reject, delete, create teams) — there's no audit trail of *which*
  admin did what. If you later need multiple distinct admin identities or an audit log,
  swapping in Supabase Auth with a proper `admins` table is the natural upgrade path.
- Member emails must be unique *within* a team (enforced at the DB level), but the same
  person could in principle register on multiple different teams — there's no cross-team
  duplicate-email check. Let me know if you'd like that added.
- This was built against Next.js 15.3.9 / React 19.0.7, since the originally-requested
  15.3.1 / 19.0.0 versions are affected by a critical RCE (CVE-2025-66478) and a couple of
  follow-on DoS/source-exposure CVEs. Keep an eye on Next.js security advisories and
  upgrade promptly if new patches land.
