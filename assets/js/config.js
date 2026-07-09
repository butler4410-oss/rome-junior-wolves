/* ==========================================================================
   REGISTRATION ENGINE — CONFIG  (LIVE)
   --------------------------------------------------------------------------
   Connected to Supabase project "rome-jr-wolves". Sign-ups save to the
   `registrations` table; any uploaded documents go to the private
   `registration-docs` bucket.

   The anon key below is SAFE to be public: the database has Row Level
   Security with an insert-only policy, so the public can submit a sign-up
   but cannot read, edit, or delete anyone's data. View submissions in the
   Supabase dashboard → Table Editor → registrations.
   ========================================================================== */

window.RJW_CONFIG = {
  supabaseUrl:     "https://jqrgcwyiouzvlypyssql.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxcmdjd3lpb3V6dmx5cHlzc3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4ODU4NDIsImV4cCI6MjA5NzQ2MTg0Mn0.MynGqizki_GgQsnSorcZA2BcUSFo5EWiQs66Ptjiq-g",
  docsBucket:      "registration-docs",

  // ---- Admin panel (/admin) & live content -------------------------
  // Public bucket that holds coach/player photos and flyers uploaded
  // from the admin panel.
  mediaBucket:     "media",
  // Leave FALSE until you've run supabase/admin-schema.sql and added
  // content in /admin. Flip to TRUE to let the public pages read live
  // coaches / players / news / events from Supabase (falls back to the
  // content in data.js for anything not yet added).
  contentApi:      false
};
