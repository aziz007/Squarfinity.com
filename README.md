# SquarFinity – Angular 19 SSR website

Complete website: Angular 19 standalone app with server-side rendering, served by an Express server that also handles the lead API (`POST /api/leads`).

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Run it

```bash
npm install

# Development: hot-reloading client app on :4200.
# Start the API in a second terminal first (see below); /api calls are proxied to :4000.
npm start

# Production build + SSR server (serves pages and the API)
npm run build
npm run serve:ssr:squarfinity   # http://localhost:4000  (set PORT to change)
```

Leads are appended to `data/leads.ndjson` in the project folder (created automatically).

## Project structure

```
server.ts                         Express: SSR + /api/leads + JSON error handling
angular.json                      Build config (SSR entry, allowed hosts)
proxy.conf.json                   Dev proxy for /api -> localhost:4000
src/
  main.ts                         Browser bootstrap
  main.server.ts                  Server bootstrap (receives BootstrapContext)
  index.html, favicon.svg, styles.css
  app/
    app.config.ts                 Browser providers (router, hydration, HttpClient)
    app.config.server.ts          Server providers (platform-server, SSR routing)
    app.routes.ts                 All pages, lazy-loaded; /lp sits outside the shell
    app.routes.server.ts          Render mode per route (Server rendering)
    components/
      shell.component.ts          Header, footer, sticky bar, WhatsApp, exit intent
      project-card.component.ts   Reusable portfolio card
    data/
      content.ts                  Services, projects, posts, team, CONFIG    <- edit me
      lead-config.ts              Every form: fields, steps, labels          <- edit me
    pages/                        One component per page
    services/
      lead.service.ts             POST to /api/leads
      seo.ts                      Title and meta description helper
```

## Editing content

- **Contact details, booking link, WhatsApp number:** `CONFIG` in `src/app/data/content.ts`.
- **Services, case studies, team, industries, blog posts:** the arrays in `src/app/data/content.ts`.
- **Forms:** `src/app/data/lead-config.ts`. Each form has `steps`, and each step has fields. Add a step to make a multi-step form.
- **Adding a form:** add a route in `app.routes.ts` using `lead('your-type')`, then add the type to `LEAD_TYPES` in `server.ts`.
- **Allowed hosts:** `angular.json` → `build.options.security.allowedHosts`. Add your production domain there. Angular rejects SSR requests from hosts that are not listed.

## Before going live

1. **Lead delivery:** leads are only saved to a file. Connect them to your CRM or email where the TODO is in `server.ts`.
2. **Spam protection:** add `express-rate-limit` on `/api/leads`. A honeypot field is already in place.
3. **Sample content:** clients, case studies, testimonials, metrics and team names are placeholders. Replace them.
4. **Legal pages:** replace the Privacy and Terms stubs.
5. **Images:** the portfolio uses emoji thumbnails. Swap in real screenshots.
6. **Hosting:** run `npm run serve:ssr:squarfinity` behind a reverse proxy (Nginx, Caddy) or on a Node host such as Render, Railway, or a VPS. Make sure the `data/` folder is persistent.
