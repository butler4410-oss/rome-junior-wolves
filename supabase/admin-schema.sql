-- =====================================================================
-- ROME JUNIOR WOLVES — ADMIN CONTENT SCHEMA
-- Run in Supabase -> SQL Editor -> New query -> Run.
--
-- Creates the content tables the /admin panel manages: coaches, players,
-- news, events. Public visitors (anon) can READ; only logged-in board
-- members (authenticated) can add / edit / delete. Photos live in a
-- PUBLIC storage bucket called 'media'.
-- =====================================================================

-- ---- COACHES --------------------------------------------------------
create table if not exists public.coaches (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  sort_order  int  default 0,
  name        text not null,
  role        text,
  team        text,
  bio         text,
  photo       text
);

-- ---- PLAYERS --------------------------------------------------------
create table if not exists public.players (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  sort_order  int  default 0,
  division_id text,          -- g12 | g23 | g34 | g45 | cheer  (matches data.js divisions)
  number      text,
  name        text not null,
  position    text,
  grade       text,
  bio         text,
  photo       text
);

-- ---- NEWS -----------------------------------------------------------
create table if not exists public.news (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  "date"      date not null default current_date,
  category    text,
  title       text not null,
  body        text,
  image       text
);

-- ---- EVENTS ---------------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  "date"      date not null default current_date,
  title       text not null,
  "time"      text,
  location    text,
  blurb       text,
  featured    boolean default false
);

-- ---- Row Level Security --------------------------------------------
-- Anyone may READ (the site is public); only logged-in board writes.
do $$
declare t text;
begin
  foreach t in array array['coaches','players','news','events'] loop
    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists "public read %1$s" on public.%1$I;', t);
    execute format('create policy "public read %1$s" on public.%1$I for select to anon, authenticated using (true);', t);

    execute format('drop policy if exists "auth write %1$s" on public.%1$I;', t);
    execute format('create policy "auth write %1$s" on public.%1$I for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- ---- Keep updated_at fresh on edits --------------------------------
create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

do $$
declare t text;
begin
  foreach t in array array['coaches','players','news','events'] loop
    execute format('drop trigger if exists trg_touch_%1$s on public.%1$I;', t);
    execute format('create trigger trg_touch_%1$s before update on public.%1$I for each row execute function public.touch_updated_at();', t);
  end loop;
end $$;

-- =====================================================================
-- MEDIA STORAGE (coach & player photos, flyers) — PUBLIC bucket
-- Public can view the photos; only logged-in board can upload/replace.
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists "auth manage media" on storage.objects;
create policy "auth manage media" on storage.objects
  for all to authenticated
  using (bucket_id = 'media') with check (bucket_id = 'media');

-- =====================================================================
-- DONE. Next: create board-member logins in
--   Authentication -> Users -> Add user  (email + password).
-- Then set  contentApi: true  in assets/js/config.js so the public
-- site reads live content from these tables.
-- =====================================================================
