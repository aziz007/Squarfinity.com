# Deploy SquarFinity to GoDaddy shared hosting (cPanel)

This package is a static site plus one PHP endpoint. It works on standard shared hosting, with no Node.js needed.

## 1. Upload the site
1. Log in to GoDaddy → My Products → Web Hosting → **cPanel**.
2. Open **File Manager** → `public_html`.
3. Delete the default placeholder files there (for example `default.php` or an old `index.html`), if present.
4. Upload **everything inside `public_html/`** from this package. Upload the contents, not the folder itself, so `index.html` sits directly in `public_html`.
   - You can upload `squarfinity-hosting.zip` and use **Extract**.
5. Check that these exist: `public_html/index.html`, `public_html/.htaccess`, `public_html/api/leads.php`.

## 2. Turn on HTTPS
1. cPanel → **SSL/TLS Status** → run AutoSSL for your domain, or use **Let's Encrypt**.
2. Once the padlock works, open `public_html/.htaccess` in File Manager and remove the `#` from the four HTTPS redirect lines.

## 3. Check the domain
- In cPanel, **Domains** should list `squarfinity.com` as the primary domain. If it's an add-on domain, point it to `public_html`.
- In GoDaddy's DNS panel, the `A` record for `@` and `CNAME` for `www` should point to your hosting server (GoDaddy sets this automatically for hosting on the same account).

## 4. Lead storage and email alerts
- Leads are saved to `/home/<your-user>/squarfinity-data/leads.ndjson`. The folder is created automatically, and it sits **outside** `public_html`, so it can't be downloaded from the web.
- To get an email for every lead, open `public_html/api/leads.php` and set:
  ```php
  const NOTIFY_EMAIL = 'hello@squarfinity.com';
  ```
  The address needs to be a working email account in cPanel. Test the forms once after setting it.

## 5. Test
- Open `https://squarfinity.com` and click through the pages.
- Submit the consultation and guide forms. You should see the thank-you page, and a new line should appear in `squarfinity-data/leads.ndjson`.

## Updating the site later
The source code is in GitHub (`aziz007/Squarfinity.com`). To publish changes:
1. Run `npm install` and `npm run build` locally, then re-run the `cp` step to refresh `deploy/public_html`.
2. Re-upload `public_html`. **Keep the `api/` folder** and `.htaccess` changes you made in cPanel, or re-add them.
3. When you add services or case studies, add their paths to `prerender-routes.txt` in the project, then rebuild. Otherwise those pages won't be pre-rendered.
