# Rome Junior Wolves — Website

A fast, self-contained website for the Rome Junior Wolves youth football & cheerleading program. No build step, no database — just static files you can host anywhere.

> **Fear the Pack.** Rome, GA · Youth Football & Cheer · Feeder for the Rome High School Wolves.

---

## Run it locally

You only need a simple web server (opening the files directly with `file://` will break the shared header/footer).

**Option A — Python (already installed on this machine):**
```bash
cd rome-junior-wolves
python -m http.server 8000
```
Then open **http://localhost:8000** in your browser.

**Option B — Node:**
```bash
cd rome-junior-wolves
npx serve .
```

---

## How to update content (no coding needed)

Almost everything you'll want to change lives in **one file**:

```
assets/js/data.js
```

Open it in any text editor. It's organized into clearly labeled sections:

| Section | What it controls |
|---|---|
| `org` | Name, email, address, Facebook, registration link |
| `news` | Announcements / updates feed (newest first) |
| `events` | Camps, fundraisers, key dates |
| `schedule` | Game schedule (set `scheduleReleased: true` to show it) |
| `teams` | Divisions + player rosters (tap-to-open profiles) |
| `coaches` | Coaching staff |
| `sponsors` | Community sponsors + tiers |
| `gallery` | Photos (add files to `assets/img/gallery/`) |
| `divisions`, `fees`, `faqs` | Programs, pricing, FAQ |

Edit the text between the quotes, keep the commas, save, and refresh the page.

**Anything marked `SAMPLE`** (e.g. sample players) is placeholder content — replace it with your real info.

### Add a photo to the gallery
1. Drop the image into `assets/img/gallery/` (e.g. `gameday.jpg`).
2. In `data.js`, add a line under `gallery`:
   ```js
   { src: "assets/img/gallery/gameday.jpg", caption: "Game day!" }
   ```

---

## File structure
```
rome-junior-wolves/
├── index.html          Home
├── programs.html       Programs, divisions, fees, how to register
├── teams.html          Teams & rosters (player profiles)
├── schedule.html       Game schedule, practice, key dates
├── news.html           News & updates
├── gallery.html        Photo gallery
├── sponsors.html       Sponsors & fundraising
├── about.html          Mission, values, feeder program, coaches
├── contact.html        Contact, map, FAQ
├── 404.html
└── assets/
    ├── css/styles.css   Design system (colors, layout)
    ├── js/data.js       ← EDIT THIS for content
    ├── js/main.js       Site engine (renders the content)
    └── img/             Logo, hero photo, favicons, gallery/
```

---

## Going live (when you're ready for a real domain)

This is a plain static site, so hosting is cheap or free:

- **Netlify** or **Cloudflare Pages** — drag-and-drop the folder, connect a domain. (free)
- **GitHub Pages** — push the folder to a repo, enable Pages. (free)
- **Any web host** — upload the folder via FTP.

Point your custom domain (e.g. `romejuniorwolves.com`) at whichever host you pick.

### Before launch — quick checklist
- [ ] Replace `SAMPLE` rosters in `data.js` with real players
- [ ] Confirm registration fees and division ages for the season
- [ ] Add real game schedule and set `scheduleReleased: true`
- [ ] Add real sponsor names/logos
- [ ] Add real game-day photos to the gallery
- [ ] Add a public phone number in `org.phone` (optional)

---

## Brand
- **Crimson** `#9E1B32` · **Gold** `#C9A24A` · **Warm black** `#1A1012`
- Logo and hero photo were taken from the team's own materials.
- Fonts: Anton + Oswald (display) and Inter (body), loaded from Google Fonts.
