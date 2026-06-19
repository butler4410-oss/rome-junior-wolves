/* ==========================================================================
   REGISTRATION ENGINE — CONFIG
   --------------------------------------------------------------------------
   Leave these blank to run in LOCAL TEST MODE (the form works end-to-end,
   saves to your browser, and emails a summary — great for trying it out).

   To go LIVE with Supabase:
     1. Create a free project at https://supabase.com
     2. Run the SQL in  supabase/schema.sql  (Supabase → SQL Editor)
     3. Create a PRIVATE storage bucket named "registration-docs"
     4. Paste your Project URL and the anon/public API key below
        (Supabase → Project Settings → API)

   The anon key is safe to expose: the database is locked down so the public
   can ONLY submit registrations — never read, edit, or delete them.
   See REGISTRATION-SETUP.md for full instructions.
   ========================================================================== */

window.RJW_CONFIG = {
  supabaseUrl:     "",                    // e.g. "https://abcdefgh.supabase.co"
  supabaseAnonKey: "",                    // e.g. "eyJhbGciOi..."
  docsBucket:      "registration-docs"
};
