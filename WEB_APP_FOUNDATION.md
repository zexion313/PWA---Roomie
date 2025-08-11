## Roomie Web App Foundation (PWA)

A single codebase web app that works on Android, iPhone, and desktop via the browser (installable PWA). This document captures goals, scope, architecture, schema, security, UI/UX, and deployment steps.

---

## Goals

- Cross-platform web app (Android, iPhone, desktop) with a single codebase
- Free-tier friendly hosting and database
- Secure multi-tenant data isolation per account (RLS)
- Familiar Material UI and modern UX patterns
- Smooth path to scale later

### Non-goals (initially)
- Native iOS app binaries
- Complex role hierarchies or organization-level sharing
- Offline sync with the current Android app (can be added later)

---

## MVP Scope (must-have)

- Auth: email/password login, forgot password
- Tenants: list, search, add/edit/delete, ID image upload + preview
- Rooms: list, add/edit/delete, capacity
- Assignments: assign tenant to room, contract expiry, move-in date
- Payments: record payments, list, basic filters
- PWA: installable, responsive UI, sticky actions in long forms
- Security: row-level data isolation per user (owner)

### Nice-to-have (post-MVP)
- Tenant ID image full-screen preview with zoom/share
- Quick actions on tenant cards (call/message)
- Contract expiry indicator pill on cards
- Export to CSV
- Swipe-to-delete with undo (mobile pattern)

---

## Tech Stack

- Framework: Next.js (React) on Vercel free tier
- Backend: Supabase (free tier)
  - Postgres (database)
  - Auth (email/password)
  - Storage (ID images)
  - Row-Level Security (RLS)
- UI: Material UI (MUI) or Tailwind CSS + Headless UI (choose one; MUI aligns with our Android look)
- PWA: manifest.json + service worker (Next.js + next-pwa or custom SW)

---

## Data Model (Postgres)

Add an `owner_id uuid` column to every table and enforce RLS so each user only sees their own rows.

```sql
-- Enable pgcrypto for UUID generation if needed
create extension if not exists pgcrypto;

-- Tenants
create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  name text not null,
  phone text,
  address text not null,
  email text,
  is_active boolean not null default true,
  id_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Rooms
create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  number text not null,
  capacity int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, number)
);

-- Room-Tenants (assignments)
create table if not exists room_tenants (
  room_id uuid not null references rooms(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  owner_id uuid not null,
  contract_expiry_date timestamptz,
  move_in_date timestamptz not null default now(),
  rent_type text default 'Monthly',
  advance_payment numeric,
  deposit numeric,
  person_count int,
  total_amount numeric,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (room_id, tenant_id)
);

-- Payments
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  tenant_id uuid not null references tenants(id) on delete cascade,
  room_id uuid references rooms(id) on delete set null,
  amount numeric not null,
  paid_at timestamptz not null default now(),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Basic updated_at trigger
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tenants_set_updated_at before update on tenants
for each row execute procedure set_updated_at();
create trigger rooms_set_updated_at before update on rooms
for each row execute procedure set_updated_at();
create trigger room_tenants_set_updated_at before update on room_tenants
for each row execute procedure set_updated_at();
create trigger payments_set_updated_at before update on payments
for each row execute procedure set_updated_at();
```

---

## Row-Level Security (Supabase)

Enable RLS and enforce per-owner access. Supabase exposes the authenticated user via `auth.uid()`.

```sql
-- Enable RLS
alter table tenants enable row level security;
alter table rooms enable row level security;
alter table room_tenants enable row level security;
alter table payments enable row level security;

-- Tenants policies
create policy "tenants_select_own" on tenants
for select using (owner_id = auth.uid());
create policy "tenants_modify_own" on tenants
for insert with check (owner_id = auth.uid());
create policy "tenants_update_own" on tenants
for update using (owner_id = auth.uid());
create policy "tenants_delete_own" on tenants
for delete using (owner_id = auth.uid());

-- Rooms policies
create policy "rooms_select_own" on rooms
for select using (owner_id = auth.uid());
create policy "rooms_modify_own" on rooms
for insert with check (owner_id = auth.uid());
create policy "rooms_update_own" on rooms
for update using (owner_id = auth.uid());
create policy "rooms_delete_own" on rooms
for delete using (owner_id = auth.uid());

-- Room-Tenants policies
create policy "rt_select_own" on room_tenants
for select using (owner_id = auth.uid());
create policy "rt_modify_own" on room_tenants
for insert with check (owner_id = auth.uid());
create policy "rt_update_own" on room_tenants
for update using (owner_id = auth.uid());
create policy "rt_delete_own" on room_tenants
for delete using (owner_id = auth.uid());

-- Payments policies
create policy "payments_select_own" on payments
for select using (owner_id = auth.uid());
create policy "payments_modify_own" on payments
for insert with check (owner_id = auth.uid());
create policy "payments_update_own" on payments
for update using (owner_id = auth.uid());
create policy "payments_delete_own" on payments
for delete using (owner_id = auth.uid());
```

Note: Application code must always set `owner_id` to the logged-in user ID during inserts.

---

## Storage (ID Images)

- Bucket: `tenant-ids` (private)
- Path convention: `owner_id/tenant_id/<timestamp>.jpg`
- Save the generated public/signed URL in `tenants.id_image_url` (use signed URLs for private bucket)

Example storage policies (limit access by owner folder):

```sql
-- For Storage, create a policy to allow owners to manage files under their own folder.
-- Supabase exposes storage objects as table storage.objects with name and bucket_id.

-- Allow read of own files
create policy "read_own_files"
on storage.objects for select to authenticated
using (
  bucket_id = 'tenant-ids'
  and split_part(name, '/', 1) = auth.uid()::text
);

-- Allow upload to own folder
create policy "upload_own_files"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'tenant-ids'
  and split_part(name, '/', 1) = auth.uid()::text
);

-- Allow delete own files
create policy "delete_own_files"
on storage.objects for delete to authenticated
using (
  bucket_id = 'tenant-ids'
  and split_part(name, '/', 1) = auth.uid()::text
);
```

---

## Pages and Routes

- `/login` — email/password
- `/tenants` — list/search, add/edit/delete, details dialog with ID image
- `/rooms` — list, add/edit/delete, capacity, tenants per room
- `/payments` — list, add payment
- API: Supabase client-side (no separate server required for MVP)

---

## UI/UX Guidelines

- Forms
  - Use outlined inputs; client-side validation; show helper/error text
  - Sticky action bar on long forms (Cancel / Save)
- Tenants list
  - Search (debounced), empty state, skeletons
  - Card row with name, phone, room chip, overflow menu (Edit/Delete)
- Tenant details dialog
  - Name, phone, address, room chip
  - ID image card with full-width preview (tap to open full-screen in future)
  - Edit/Close actions
- Rooms
  - Capacity, occupancy, assign tenant flow
- Payments
  - Capture amount/tenant/room/date; list with filters
- Accessibility
  - Labels, alt text, logical tab order, color contrast
- Performance
  - Pagination or infinite scroll; image dimensions; lazy loading

### Text mockups

Tenants page
```
[ Search …                           ]     [ + Add Tenant ]

John Doe             Room 101
0948 930 8315
[View] [Edit] […]

Jane Smith           - (Unassigned)
(—)
[View] [Assign] […]
```

Tenant details dialog
```
John Doe
Phone: 0948…
Address: 123 Main St
[ Room: 101 ]

ID Verification
┌──────────────────────────────────────────┐
│              [ ID image ]               │
└──────────────────────────────────────────┘
[ Edit ]    [ Close ]
```

Add/Edit tenant (sticky actions)
```
Full Name *
Phone (optional)
Address *

ID Verification
[ Upload ID ] [ Take Photo ]
┌──────────────────────────────────────────┐
│              [ Preview ]                │
└──────────────────────────────────────────┘

──────────────  (divider)
[ Cancel ]            [ Save ]
```

---

## PWA Setup

- manifest.json
```json
{
  "name": "Roomie",
  "short_name": "Roomie",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#1976D2",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```
- Service worker (via next-pwa or custom): cache static assets, runtime cache for images

---

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional (server-side if needed later):
- `SUPABASE_SERVICE_ROLE_KEY` (never expose to client)

---

## Local Development (Next.js)

1) Create Supabase project (free tier), note `URL` and `anon key`
2) Run the SQL in this doc (schema + RLS)
3) Create Storage bucket `tenant-ids` (private) and apply storage policies
4) Create Next.js app
```
npx create-next-app@latest roomie-web --ts
cd roomie-web
npm i @supabase/supabase-js @mui/material @mui/icons-material @emotion/react @emotion/styled
```
5) Add `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
6) Add PWA manifest and icons, configure SW (e.g., next-pwa)
7) Implement pages and components using Supabase client
8) `npm run dev`

---

## Deployment (Vercel)

1) Push repo to GitHub
2) Import project in Vercel
3) Set env vars in Vercel (same as `.env.local`)
4) Deploy (automatic per commit)

---

## Security Notes

- RLS mandatory: never disable in production
- Always set `owner_id = auth.uid()` on inserts
- Validate uploads: file type (image/*) and reasonable size (e.g., <= 5MB)
- Use signed URLs for private images; set short expiration for links shown in UI
- Avoid leaking internal IDs in public URLs

---

## Mapping from Android app

- `Tenant.idImagePath` → `tenants.id_image_url` (URL to Storage object)
- `RoomTenant` fields map to `room_tenants` table
- Contract expiry and search behaviors mirror current logic
- UI keeps Material look and sticky action pattern already implemented in Android dialogs

---

## Future Enhancements

- Full-screen image viewer with zoom/share
- CSV export of tenants/payments
- Debounced search and advanced filters (by room, expiry window)
- Offline cache and background sync
- Multi-user roles (assistant/manager) with shared access

---

## Checklist (MVP)

- [ ] Supabase: schema + RLS deployed
- [ ] Storage bucket + policies
- [ ] Next.js app scaffolded with PWA
- [ ] Auth screens
- [ ] Tenants pages (list, details, add/edit with image upload)
- [ ] Rooms pages
- [ ] Assignments and contract dates
- [ ] Payments pages
- [ ] Deployment to Vercel
- [ ] Basic analytics/logging (optional) 