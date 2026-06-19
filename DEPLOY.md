# Going Live — romejrwolves.com

This is a plain static site (HTML/CSS/JS, no server). Hosting is free and takes ~15 minutes. Pick **one** host below — Cloudflare Pages or Netlify are the easiest.

---

## Recommended: Cloudflare Pages (free, fast, free SSL)

1. Create an account at **https://dash.cloudflare.com** → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Name the project `romejrwolves`, then **drag the entire `rome-junior-wolves` folder** in and **Deploy**.
3. You'll get a temporary URL like `romejrwolves.pages.dev` — confirm the site looks right.
4. **Custom domain:** Pages project → **Custom domains** → **Set up a domain** → enter `romejrwolves.com` (and add `www.romejrwolves.com` too).
   - If your domain's DNS is already on Cloudflare, it's automatic.
   - If not, Cloudflare shows the exact DNS records to add at your registrar (a `CNAME`).
5. SSL/HTTPS is automatic. Done.

To update later: re-upload the folder (or connect your Git repo for auto-deploys).

---

## Alternative A: Netlify (drag-and-drop, no account-git needed)

1. Go to **https://app.netlify.com/drop** and **drag the `rome-junior-wolves` folder** onto the page.
2. You get a temporary `something.netlify.app` URL instantly.
3. **Domain settings → Add a domain → `romejrwolves.com`.** Netlify shows the exact DNS records:
   - `A` record `@` → `75.2.60.5`  (Netlify's load balancer)
   - `CNAME` record `www` → `your-site.netlify.app`
   - Or switch your domain's nameservers to Netlify DNS (they'll guide you).
4. Netlify provisions HTTPS automatically (Let's Encrypt). Done.

## Alternative B: GitHub Pages

1. Create a GitHub repo, push the contents of `rome-junior-wolves` to it.
2. Repo **Settings → Pages →** deploy from `main` branch, root.
3. The included **`CNAME`** file already contains `romejrwolves.com`, so Pages will claim the domain.
4. At your registrar add: `A` records for `@` → `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`, and a `CNAME` `www` → `YOURUSER.github.io`.
5. Enable "Enforce HTTPS" in Pages settings once the cert is issued.

---

## Your domain is registered at Squarespace — here's how to point it

`romejrwolves.com` is registered through **Squarespace Domains**. You don't host the site on Squarespace; you just edit its DNS so the domain points to your static host. Two ways:

### Easiest: keep DNS at Squarespace + Netlify (recommended for you)
1. Deploy the folder to **Netlify** (see Alternative A above) and add `romejrwolves.com` as a custom domain. Netlify will show you the records to add.
2. In Squarespace: **Settings → Domains → `romejrwolves.com` → DNS → DNS Settings → Add record.** Add:
   - **A record** — Host `@` (root) → value **`75.2.60.5`**
   - **CNAME record** — Host `www` → value **`yoursite.netlify.app`** (Netlify gives you the exact target)
3. Back in Netlify, click **Verify / provision certificate**. HTTPS turns on automatically within a few minutes to a few hours.

### Cleanest long-term: move DNS to Cloudflare
1. In Cloudflare, **Add a site** for `romejrwolves.com`; it gives you two nameservers.
2. In Squarespace: **Settings → Domains → `romejrwolves.com` → Nameservers → Use custom nameservers**, and paste Cloudflare's two nameservers.
3. Deploy via **Cloudflare Pages** and add the custom domain — apex + `www` + SSL configure automatically.

> Either way, DNS changes can take a few minutes to ~24 hours to propagate. Don't share the link widely until `https://romejrwolves.com` loads with a padlock.

## DNS, in plain terms
Whoever you **bought the domain from** (here, Squarespace) controls its DNS. Your chosen host gives you 1–3 records to paste into the registrar's DNS settings, or you switch nameservers to the host so it manages everything.

---

## What's already production-ready in this build
- All asset paths are relative → works on any domain with no changes.
- SEO: per-page `<title>`, meta descriptions, **canonical URLs**, **Open Graph + Twitter** cards (so links unfurl with the team photo), `robots.txt`, `sitemap.xml`, and `SportsOrganization` structured data on the home page.
- Favicon + Apple touch icon.
- Custom `404.html` (Cloudflare Pages, Netlify, and GitHub Pages all serve it automatically).
- "Coaches: edit data.js" helper notes and the registration "test mode" banner **auto-hide** on the live domain (they only appear on localhost).

## Pre-launch checklist (do these before sharing the link widely)
- [x] **Registration:** launching on **LeagueApps** (`org.registerUrl` points there). Our own wizard stays dormant — it shows a "use current portal" card on the live site and is hidden from search. *Pending directors' approval.*
- [x] **Rosters:** cleared to a clean "coming soon" state per division.
- [ ] **Divisions/fees:** confirm the age brackets and pricing for the season.
- [ ] **Schedule:** add real games and set `scheduleReleased: true` when ready.
- [ ] After DNS resolves, submit `https://romejrwolves.com/sitemap.xml` in **Google Search Console** to get indexed.

### Later — activating our own registration engine (after the directors meet)
- [ ] Replace the placeholder liability/code-of-conduct wording in `register.html` with official language.
- [ ] Connect Supabase (`REGISTRATION-SETUP.md`) and paste keys into `assets/js/config.js`.
- [ ] Set `org.registerUrl` back to `"register.html"` and remove the `noindex` tag + re-add it to `sitemap.xml`.

## After launch
- Add a privacy note if you collect registrations (a short page is fine).
- Consider lightweight analytics (Cloudflare Web Analytics is free and privacy-friendly — one toggle in the Pages dashboard).
