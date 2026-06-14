# TRA — Travel Reimbursement Application

B2B SaaS for managing travel requests, approvals, and reimbursements. A modern,
multi-tenant rebuild of an enterprise Power Platform system I architected and ran in
production for a 92-school district serving 7,200 staff.

## Why it exists

Most reimbursement flows are spreadsheets and approval emails held together by hope.
I spent three years building the real thing inside a large public-sector org:
multi-stage estimate to GL to audit to final approval, role-based visibility, and
compliant document archival. TRA carries that hard-won workflow knowledge onto a
current stack so any organization can run it.

## Features

- Travel request submission with multi-level approval routing
- Reimbursement processing tied to requests
- Role-based access (admin, approver, requester)
- Dashboard, requests, approvals, reimbursements, and settings surfaces
- Enterprise SSO via WorkOS AuthKit

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Prisma** + **PostgreSQL** (`@prisma/adapter-pg`)
- **WorkOS AuthKit** for authentication and SSO
- **Tailwind CSS** + lucide-react

## Getting started

```bash
npm install
cp .env.example .env   # set DATABASE_URL + WorkOS keys
npx prisma migrate dev
npm run dev            # http://localhost:3000
```

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Status

Active development. Core request and approval flows are in place; billing and
multi-org onboarding are in progress.
