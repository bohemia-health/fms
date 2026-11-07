# Bohemia Health · Storefront

The customer-facing web application for **Bohemia Health**: product discovery, batch-level lab reports, shopping bags, checkout, and order tracking.

[Visit the website](https://www.bhmhlth.com/) · [Report an issue](https://github.com/bohemia-health/fms/issues) · [License](LICENSE.md)

## Overview

This repository, packaged as `bhm-fms`, contains the Next.js frontend and its server-side integration layer. Product, inventory, customer, and order data come from the **Asclepius API**. Database access and schema management belong to that separate service.

The interface combines clear product imagery, a restrained visual hierarchy, and access to the original laboratory reports for each batch. Products are supplied for laboratory research use only, as described in the site's notices.

## Features

- **Product catalog** — browse product lines, search the store, and compare available sizes.
- **Product configuration** — select size, vendor, and quantity alongside a sticky image gallery and batch report links.
- **Lab report repository** — search and filter certificates of analysis, sort by product or test date, and preview PDFs inline.
- **Shopping bag and checkout** — guest bags, delivery details, address validation, and payment initiation through the API.
- **Customer orders** — signed-in order history, individual order details, and tracking by order number and email.
- **Shared site navigation** — local navigation, breadcrumbs, footnotes, and footer components supplied by the Asclepius design system.

## Architecture

```text
Browser
  │
  ├── Next.js storefront (this repository)
  │     ├── Server Components and server actions
  │     ├── Typed Asclepius API client
  │     └── Same-origin PDF and postal lookup routes
  │
  ├── Asclepius API → catalog, inventory, bags, checkout, orders, sessions
  └── Bohemia auth site → sign-in and registration

Public product images and lab reports → Backblaze B2
Shared navigation and design tokens   → @asclepius/ui
```

The API client derives its types from `asclepius-api` using Hono's client utilities. Interactive components own browser state; server-rendered pages and actions handle the store's service calls. Customer order requests forward the visitor's session cookie. Server-side service requests can include `ASCLEPIUS_SERVICE_KEY`.

Related repositories:

- [Asclepius API](https://github.com/bohemia-health/asclepius-api) — backend routes and database schema.
- [Asclepius UI](https://github.com/bohemia-health/asclepius) — shared components and design tokens.

## Stack

| Layer | Technology |
| --- | --- |
| Application | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4, CSS modules, shared Asclepius tokens |
| UI primitives | Base UI and shadcn/ui |
| API integration | Hono typed client |
| Authentication | Better Auth client and the separate Bohemia auth site |
| Document previews | Mozilla PDF.js |
| Motion and themes | Motion, next-themes |
| Public assets | Backblaze B2 |

## Local development

### Prerequisites

- **Node.js 22.13 or newer on the Node 22 release line, or Node 24 or newer**, matching the installed PDF.js dependency's engine requirement.
- npm and access to the GitHub-hosted `@asclepius/ui` and `asclepius-api` packages.
- A reachable Asclepius API with catalog data. Authentication and checkout also require the corresponding backend services and configuration.

### Install

```bash
git clone git@github.com:bohemia-health/fms.git
cd fms
npm ci
cp .env.example .env.local
```

### Configure the environment

The checked-in [`.env.example`](.env.example) uses this local service arrangement:

| Service | Local URL |
| --- | --- |
| Storefront | `http://localhost:3100` |
| Auth site | `http://localhost:3000` |
| Asclepius API | `http://localhost:8787` |

Start the API and auth application separately when their functionality is needed. Their setup lives in their own repositories.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | API origin used by browser authentication, session helpers, customer order requests, and the server API client's fallback. Defaults to `https://api.bhmhlth.com`. |
| `API_URL` | Optional server-side override for the typed API client. Does not override browser authentication or the customer order helpers. |
| `NEXT_PUBLIC_AUTH_URL` | Sign-in and registration origin. Defaults to `https://auth.bhmhlth.com`. |
| `NEXT_PUBLIC_SITE_URL` | Storefront origin for authentication return URLs and site metadata. Defaults to `https://www.bhmhlth.com`. |
| `ASCLEPIUS_SERVICE_KEY` | Server-only service credential; must match the API configuration for requests requiring service access. |
| `B2_PUBLIC_URL` | Public base URL of the lab-report bucket, without a trailing slash. Required for report links and PDF previews. |
| `B2_ITEMS_PUBLIC_URL` | Public base URL of the product-image bucket, without a trailing slash. Required for bucket-backed product images. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional Cloudflare Turnstile site key. The widget is omitted when unset; coordinate with the API's CAPTCHA settings. |

Add the required B2 URLs to `.env.local`; they are not included in the starter example. This frontend uses public bucket URLs and does not need B2 upload credentials or a database connection string.

Keep service credentials server-side. Variables prefixed with `NEXT_PUBLIC_` are public browser configuration. Environment files are ignored by Git, except for `.env.example`.

### Run

```bash
npm run dev -- --port 3100
```

Open [localhost:3100](http://localhost:3100). If you use another port, update `NEXT_PUBLIC_SITE_URL` and the API/auth service's allowed origins and redirect configuration to match.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js development server; pass `-- --port 3100` for the example setup. |
| `npm run build` | Create the production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run the Node test suite for postal, address, delivery, and checkout-gate helpers. |
| `npx tsc --noEmit` | Check TypeScript without emitting files. |

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Brand and product landing page. |
| `/shop` | Product catalog and product-line navigation. |
| `/shop/[slug]` | Product configuration or a product-line page, depending on the slug. |
| `/search` | Store search. |
| `/repository` | Searchable lab report library with inline document previews. |
| `/bag` | Shopping bag and estimated totals. |
| `/checkout` | Checkout overview. |
| `/checkout/shipping` | Shipping address and delivery options. |
| `/checkout/payment` | Payment selection. |
| `/checkout/pay/[number]` | Payment instructions and status. |
| `/order/list` | Signed-in customer order history. |
| `/order/[number]` | Customer order details and shipment information. |
| `/order/status` | Order lookup by number and email. |
| `/campaign` | Group-buy information. |
| `/legal` | Legal hub, with terms of use and ethics pages. |

Legacy `/orders` URLs redirect into the customer order routes.

## Project structure

```text
src/
  app/                 App Router pages, server actions, route-specific components
    api/places/        Postal-code lookup proxy
    bag/               Bag state, estimates, and actions
    checkout/          Address, delivery, payment, and checkout flow
    order/             Customer history, details, and tracking
    repository/        Lab report search, previews, and PDF worker route
    shop/              Catalog, product pages, galleries, and configuration
  components/          Shared store, bag, checkout, navigation, and UI components
  integrations/b2/     Public asset URL helpers
  lib/                 Typed API client, authentication, sessions, and helpers
public/                Fonts, product imagery, and static assets
```

## UI conventions

- Keep feature-specific components beside their route; put reusable primitives in `src/components/`.
- Use the shared Asclepius tokens and existing components before introducing new visual rules.
- Pages configure their local navigation, breadcrumbs, and footnotes using the design system's `Set*` components.
- Keep client components focused on interaction; keep service credentials and privileged requests on the server.
- Font faces are declared in `src/app/globals.css`. The Suisse Intl trial files use deliberate Unicode ranges; do not remove those ranges without reviewing the replacement font files. Product pages additionally scope a system font stack through their CSS module.

## Deployment

The app is configured for Vercel and can also run as a Next.js Node application with `npm run build` and `npm run start`.

Set the environment variables for the target environment before building. Keep API, auth, and storefront origins aligned. Changes to public asset hosts may also require updating `images.remotePatterns` in [`next.config.ts`](next.config.ts).

The production PDF worker is included through `outputFileTracingIncludes`. Preserve that configuration when changing the document preview implementation.

## Contributing

Keep changes focused and include a description of the resulting behavior. Before opening a pull request, run the relevant tests, lint, TypeScript checks, and a production build. For interface changes, check desktop and mobile layouts along with keyboard interaction.

Database schemas, migrations, and seed scripts belong in the Asclepius API repository, not this frontend.

## License

Copyright © 2026 Bohemia Health. All rights reserved.

This code is proprietary and publicly viewable for reference and permitted contributions. It is not open source. See [LICENSE.md](LICENSE.md) for the full terms; third-party dependencies retain their own licenses.
