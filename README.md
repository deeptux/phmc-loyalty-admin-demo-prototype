# PHMC Privilege Admin - Demo Prototype

Clickable **web admin demo** for the PHMC loyalty program. UI, navigation, and in-memory mock data only - no hospital systems connection.

## Run locally

```bash
cd apps/phmc-loyalty-admin-demo-prototype
npm install
npm run dev
```

Open **http://localhost:3000** (Next.js default port).

For production-style URLs locally, set `NEXT_PUBLIC_BASE_PATH=/demo/phmc-privilege-admin` in `.env.local` (see `.env.example`).

## Deploy to Vercel

See **[docs/VERCEL-DEPLOY.md](../../docs/VERCEL-DEPLOY.md)** - includes `portfolio-handrian` custom-domain linking at `/demo/phmc-privilege-admin`.

## Demo accounts

| Email | Password | Role |
|-------|----------|------|
| `admin@phmc.demo` | `demo123` | Super Admin |
| `marketing@phmc.demo` | `demo123` | Marketing |
| `support@phmc.demo` | `demo123` | Support L1 |

Any other non-empty credentials also sign in as Super Admin (demo convenience).

## Phase 1 scope (implemented)

- Login portal
- Admin shell (sidebar, header, demo banner)
- Dashboard (score cards, charts, CSV export)
- News (list, create, edit, delete)
- Vouchers (list, filter by status, CRUD, bulk pause)
- Benefits (privileges, perks, tiers)

## Shared mock data

Seed fixtures live in `packages/demo-data/` (vendored in this repo for Vercel deploy).

## Limitations

- Mock data stored in browser memory + `localStorage`
- No real RBAC, SSO, HIS, or backend APIs
- Post-MVP modules (Partnerships, Marketing campaigner) are not included
