# Rome Junior Wolves — Admin Panel Setup

The admin panel lets board members log in and manage **Coaches, Players, News, and Events** (with photo uploads) — no code editing. It lives at **`romejrwolves.com/admin`** and is powered by your existing Supabase project (`rome-jr-wolves`).

It's a **one-time, ~5-minute setup**. After that, everything is point-and-click.

---

## Step 1 — Create the content tables (once)

1. Open the Supabase dashboard → your **rome-jr-wolves** project.
2. Left sidebar → **SQL Editor** → **New query**.
3. Open the file **`supabase/admin-schema.sql`** from this repo, copy **all** of it, paste it into the query box, and click **Run**.
   - This creates the `coaches`, `players`, `news`, and `events` tables, locks them so only logged-in board members can edit (the public can only read), and creates a public **`media`** storage bucket for photos.
4. You should see *"Success. No rows returned."*

## Step 2 — Add board-member logins

1. Supabase dashboard → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter each board member's **email** and a **temporary password**, and click **Create user**.
   - Repeat for everyone who should have admin access.
   - (Leave "Auto Confirm User" on so they can log in immediately.)
3. Share the email + temporary password with each person; they can change the password later.

## Step 3 — Turn on live content on the public site

Once you've added some real coaches/players/news/events in the admin:

1. Open **`assets/js/config.js`**.
2. Change `contentApi: false` to **`contentApi: true`**.
3. Commit & push (or ask Claude to).

Now the public pages read your live content from Supabase. Anything you haven't added yet falls back to the sample content in `data.js`, so the site always looks complete.

---

## Using the panel

Go to **romejrwolves.com/admin** and sign in.

- **Tabs** across the top: News · Events · Coaches · Players.
- **+ Add new** to create; click **Edit** on any row to change or **Delete** it.
- **Photos:** on Coaches/Players/News, either **upload an image** or paste an image URL. Uploads go to the public `media` bucket and appear automatically.
- Changes are **live immediately** (once `contentApi` is on).

### Please keep players safe
For player profiles, use **first name + last initial and jersey number only** — no birthdates or home info — and only add a **photo with the parent's permission**. The form repeats this reminder.

---

## Notes
- The admin page is `noindex` and blocked in `robots.txt`, so it won't show up in Google.
- The anon key in `config.js` is safe to be public — the database's Row Level Security means only a **logged-in** user can write; everyone else can only read the public content.
- Forgot a password? Reset it from Supabase → Authentication → Users.
