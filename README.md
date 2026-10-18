# Bohemia Health (bhm-fms)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle&logoColor=black)](https://orm.drizzle.team)
[![Neon](https://img.shields.io/badge/Postgres-Neon-00E599?logo=postgresql&logoColor=white)](https://neon.tech)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://bhmhlthcom.vercel.app)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-lightgrey)](LICENSE.md)

The storefront and order-management site for Bohemia Health: a Next.js app. "FMS" is the fulfilment-management side that staff use; the public store and repository are the customer side. Both live in this one app.

Live site: <https://bhmhlthcom.vercel.app>

## What it does

| Route                                            | What's there                                                                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `/`                                              | Landing page: storefront tiles leading with the MITO, Nootropic, and Bioregulator lines                                        |
| `/shop`                                          | Store: category chips, one product rail per line, trust row. Reads the `items` table                                           |
| `/shop/<slug>`                                   | Product page: one row per size variant with an Add to Bag button                                                               |
| `/bag`                                           | Shopping bag. Guest bags are keyed by an httpOnly cookie; no login needed                                                      |
| `/repository`                                    | Lab reports: every COA on file, filterable by category pill and searchable by title, batch number, vendor, or compound (`?q=`) |
| `/orders`, `/orders/<id>`                        | Staff order list and detail (FMS side, early)                                                                                  |
| `/legal`, `/legal/terms-of-use`, `/legal/ethics` | Legal hub and its pages                                                                                                        |
| `/contact-us`                                    | Placeholder                                                                                                                    |

Core model, in plain words:

- An **item code** is a product. Its **items** are the size variants you actually buy. Item codes belong to a **category**.
- A **batch** is one manufacturing run of an item code from a **manufacturer**. Each batch has one or more **COAs** (lab reports) from a **lab**; the PDFs live in a Backblaze B2 bucket and the database stores the file key.
- A **bag** holds **bag items** (item + quantity). **Orders** belong to **customers** and carry order items and addresses.

Schema lives under [`src/db/`](src/db/), one folder per table, all re-exported from [`src/db/index.ts`](src/db/index.ts).

## Why it exists

- **Every batch on the record.** The repository page is the point of the site: a buyer can check the lab report for the exact batch before they check out.
- **One database for store and back office.** The same Neon Postgres holds items, batches, COAs, bags, and orders, so the staff tools and the storefront never disagree.
- **Boring, server-first Next.** Pages are React Server Components that query Drizzle directly. Mutations are server actions. Client components are kept to the interactive bits (bag flyout, nav, rails).

## Tech stack

- [Next.js 16](https://nextjs.org) App Router, React 19, TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) with [shadcn/ui](https://ui.shadcn.com) on Base UI (`base-nova` style, see [`components.json`](components.json))
- [Drizzle ORM](https://orm.drizzle.team) over [Neon](https://neon.tech) serverless Postgres
- [Backblaze B2](https://www.backblaze.com/cloud-storage) via the AWS S3 SDK for lab-report PDFs and item images
- [Motion](https://motion.dev) for animation, [next-themes](https://github.com/pacocoursey/next-themes) for light/dark

## Getting started

### Prerequisites

- Node 22 or newer; `npm` is the package manager in use
- A Neon Postgres database (any Postgres works for local dev, but the client is `@neondatabase/serverless`)
- A Backblaze B2 bucket with S3-compatible access, if you want the repository page to resolve PDF links

### 1. Clone and install

```bash
git clone git@github.com:bohemia-health/fms.git
cd fms
npm install
```

### 2. Environment

Create a `.env` in the project root. The app reads these variables:

```bash
# Postgres (Neon connection string)
DATABASE_URL=

# Backblaze B2: lab-report bucket
B2_KEY_ID=
B2_APPLICATION_KEY=
B2_BUCKET=
B2_ENDPOINT=          # e.g. https://s3.us-east-005.backblazeb2.com
B2_PUBLIC_URL=        # public base URL of the lab-report bucket

# Backblaze B2: item-images bucket (public base URL only; uploads are manual for now)
B2_ITEMS_PUBLIC_URL=
```

`.env*` is gitignored. Only `DATABASE_URL` is needed to boot the app; the B2 variables are needed for working PDF and image links.

### 3. Push the schema

The schema is the source of truth and is pushed straight to the database. Do not run `drizzle-kit generate`; this repo does not use migration files for day-to-day work.

```bash
npx drizzle-kit push
```

If push says a relation does not exist, the table's folder is probably missing from [`src/db/index.ts`](src/db/index.ts), not the database.

### 4. Seed lab reports (optional)

Two scripts under [`scripts/`](scripts/) fill the repository page:

```bash
# Insert batches and COAs from the source sheet at scripts/data/coa.csv
npx tsx scripts/seed-coa.ts
```

```bash
# Or: list every object in the B2 bucket and insert a bare COA row per file
npx tsx scripts/seed-labreports.ts
```

To wipe every table (dev only):

```bash
npx tsx src/db/reset.ts
```

### 5. Run

```bash
npm run dev
```

Open <http://localhost:3000>. The store shows an empty "shelves are being restocked" state until the `items` table has rows; add them by hand in the database for now.

### Other scripts

| Command         | What it does               |
| --------------- | -------------------------- |
| `npm run dev`   | Dev server with hot reload |
| `npm run build` | Production build           |
| `npm run start` | Serve the production build |
| `npm run lint`  | ESLint (Next config)       |

## Project layout

```
src/
  app/            Routes. Feature files live with their route (e.g. app/bag/{page.tsx,actions.ts,bag.ts})
  components/     Shared UI: navbar, footer, store rails, bag, legal cards, shadcn primitives in ui/
  db/             Drizzle schema, one folder per table, re-exported from db/index.ts
  integrations/   External services (b2/ for Backblaze)
  lib/            Small helpers (cn, shared page column)
  index.ts        The Drizzle client (db)
scripts/          One-off seed scripts and their source data
drizzle/          Snapshots from earlier generate runs; not used for pushes
public/           Fonts, product renders, store cut-outs
```

Conventions worth knowing:

- Files are colocated by feature, not by layer. A route's server actions and queries sit next to its page.
- Pages set their own breadcrumb, footnotes, and local nav through small `Set*` components (`SetBreadcrumb`, `SetFootnotes`, `SetLocalNav`) rendered inside the page.
- The Suisse Intl font files in `public/fonts` are trial versions and the `@font-face` blocks carry a deliberate `unicode-range`. Leave it until licensed files land.

## Getting help

- Open an issue on [GitHub](https://github.com/bohemia-health/fms/issues).
- Design and architecture notes live in the code comments and the PR descriptions in this repo's history.
- Drizzle: <https://orm.drizzle.team/docs>. Neon: <https://neon.tech/docs>. Next.js: <https://nextjs.org/docs>.

## Maintainers and contributing

Built and maintained by Janae Dooley for [Bohemia Health](https://github.com/bohemia-health).

To contribute:

1. Branch from `main`, one feature per branch (`bag-logic-feat`, `repository-batch-feat` are the pattern).
2. Keep schema changes in `src/db/` and push them with `drizzle-kit push`.
3. Run `npm run lint` and `npm run build` before opening a pull request against `main`.

There is no separate CONTRIBUTING.md yet; this section is the contribution guide.

## License

Proprietary. Copyright Bohemia Health, all rights reserved. The code is public to read and to contribute to, but it may not be copied, redistributed, or deployed elsewhere without written permission. Full terms in [LICENSE.md](LICENSE.md).
