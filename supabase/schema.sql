-- ===========================================================================
-- ROME JUNIOR WOLVES — REGISTRATION DATABASE SCHEMA
-- Run this in Supabase → SQL Editor → New query → Run.
-- It creates the registrations table and locks it down so the public website
-- can ONLY submit (insert) — never read, edit, or delete anyone's data.
-- ===========================================================================

create table if not exists public.registrations (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  status        text default 'new',          -- new | contacted | paid | confirmed

  -- program
  season        text,
  program       text,
  division      text,

  -- athlete
  athlete_first text not null,
  athlete_last  text not null,
  athlete_dob   date,
  grade         text,
  school        text,
  gender        text,
  returning     boolean,
  experience    text,
  size          text,

  -- guardian
  guardian_name   text,
  relationship    text,
  email           text not null,
  phone           text,
  address         text,
  city            text,
  state           text,
  zip             text,
  guardian2_name  text,
  guardian2_phone text,

  -- emergency & medical
  emergency_name  text,
  emergency_phone text,
  emergency_rel   text,
  medical         text,
  doctor          text,

  -- documents & agreements
  doc_path      text,              -- path in the private 'registration-docs' bucket
  photo_release boolean,
  agree_conduct boolean,
  agree_waiver  boolean,
  signature     text,
  signed_date   date
);

-- Lock the table down ---------------------------------------------------------
alter table public.registrations enable row level security;

-- Public (anon) may INSERT a registration, and nothing else.
drop policy if exists "public can submit registrations" on public.registrations;
create policy "public can submit registrations"
  on public.registrations
  for insert
  to anon
  with check (true);

-- NOTE: With RLS on and only an INSERT policy, the anon key CANNOT select,
-- update, or delete rows. Board members read registrations while logged in to
-- the Supabase dashboard (Table Editor), which uses the privileged service role.

-- ===========================================================================
-- PRIVATE DOCUMENT STORAGE (birth certificates, etc.)
-- 1. In Supabase → Storage, create a bucket named  registration-docs
--    and leave "Public bucket" UNCHECKED (private).
-- 2. Then run the policy below so the public can UPLOAD but never download.
-- ===========================================================================

drop policy if exists "public can upload reg docs" on storage.objects;
create policy "public can upload reg docs"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'registration-docs');

-- (No SELECT policy for anon = uploaded files are NOT publicly downloadable.
--  Staff view/download them from the Supabase Storage dashboard.)

-- ===========================================================================
-- OPTIONAL: a tidy admin view sorted newest-first
-- ===========================================================================
create or replace view public.registrations_admin as
  select created_at, status, program, division,
         athlete_first || ' ' || athlete_last as athlete,
         athlete_dob, grade, guardian_name, email, phone, doc_path
  from public.registrations
  order by created_at desc;
