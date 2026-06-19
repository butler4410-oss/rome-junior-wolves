# Registration Engine — Setup Guide

The site has its own branded sign-up wizard at **`register.html`**. It works in two modes:

| Mode | When | What happens on submit |
|---|---|---|
| **Test mode** | Default (no Supabase keys) | Saves the registration in the browser and opens a pre-filled email to the program. Great for trying the flow. |
| **Live mode** | After you add Supabase keys | Saves the registration to your Supabase database; any uploaded birth certificate goes to private storage. |

You can demo the whole experience **right now** in test mode — no setup needed. Follow the steps below when you're ready to store registrations for real.

---

## Going live with Supabase (≈15 minutes, free)

### 1. Create the project
1. Go to **https://supabase.com** → sign up → **New project**.
2. Name it (e.g. `rome-junior-wolves`), set a database password, pick a region near Georgia, create.

### 2. Create the database table
1. Open **SQL Editor → New query**.
2. Paste the entire contents of **`supabase/schema.sql`** and click **Run**.
   - This creates the `registrations` table and security rules so the public can **only submit** — never read or change other people's data.

### 3. Create private document storage
1. Go to **Storage → New bucket**.
2. Name it exactly **`registration-docs`** and leave **"Public bucket" unchecked** (keep it private).
3. The upload policy was already added by the SQL in step 2.

### 4. Connect the website
1. In Supabase go to **Project Settings → API** and copy:
   - **Project URL** (e.g. `https://abcdefgh.supabase.co`)
   - **anon / public** key (the long `eyJ…` string)
2. Open **`assets/js/config.js`** and paste them in:
   ```js
   window.RJW_CONFIG = {
     supabaseUrl:     "https://abcdefgh.supabase.co",
     supabaseAnonKey: "eyJhbGciOi...your-anon-key...",
     docsBucket:      "registration-docs"
   };
   ```
3. Save and reload `register.html`. The yellow "test mode" banner disappears — you're live.

> **Is the anon key safe to put in the website?** Yes. It's designed to be public. Because Row Level Security is on and the only rule allows *inserts*, that key cannot read, edit, or delete registrations. Sensitive viewing happens only inside your Supabase dashboard, which requires a login.

### 5. View & manage registrations
- **Supabase → Table Editor → `registrations`** — every sign-up, newest first.
- **Supabase → Storage → `registration-docs`** — uploaded birth certificates (private).
- To export: Table Editor has a **"Export to CSV"** button.

---

## Optional upgrades (later)
- **Email alerts on each sign-up** — add a Supabase *Database Webhook* → Zapier/Make, or an Edge Function, to email the board automatically.
- **Online payment** — when you're ready, we can add **Stripe Checkout** so families pay during sign-up (no card data touches your servers).
- **Admin login page** — a password-protected page on the site to view registrations without opening Supabase.

---

## Before you launch — checklist
- [ ] Replace the placeholder **waiver / code-of-conduct text** in `register.html` with your program's official language.
- [ ] Confirm the **divisions** in `assets/js/data.js` match your league's age brackets.
- [ ] Test a real submission end-to-end after connecting Supabase.
- [ ] Decide whether the birth certificate upload is required (currently optional).

## Security notes (because this is kids' data)
- The public site can only **add** registrations; it can't read them back.
- Birth-certificate uploads go to a **private** bucket — not downloadable without a Supabase login.
- Don't paste the **service_role** key anywhere in the website. Only the **anon** key belongs in `config.js`.
