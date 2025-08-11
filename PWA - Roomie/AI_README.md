# AI Onboarding (Roomie)

- Project: Roomie (PWA) — Next.js 14 (app dir), MUI, Supabase, Vercel
- Read first: `WEB_APP_FOUNDATION.md`, `PWA - Roomie/FRONTEND_DESIGN.md`
- UX: Mobile-first, MUI, sticky actions, Bottom Nav
- Routes: `/login`, `/dashboard`, `/tenants`, `/rooms`, `/payments`, `/settings`
- Data model: tenants, rooms, room_tenants, payments — all with `owner_id` + RLS
- Dev: frontend first; backend later (Supabase)
- Dev creds (dummy): `owner@roomie.app` / `password123` (local only)
- When starting new work:
  1) Skim the two docs above and summarize constraints
  2) Confirm MUI usage and navigation patterns
  3) If coding, follow high-verbosity code style and avoid unrelated refactors
  4) Prefer semantic search to explore; cite files when explaining changes 


Project: Roomie (Next.js + MUI PWA)
Read first: WEB_APP_FOUNDATION.md, PWA - Roomie/FRONTEND_DESIGN.md, PWA - Roomie/AI_README.md
Then: summarize key constraints (1–2 bullets), confirm current goal, and proceed.
Do not write code until I say “code”.