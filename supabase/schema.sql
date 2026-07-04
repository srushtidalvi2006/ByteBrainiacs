-- ============================================================================
-- Byte Brainiacs - Teams & Members schema
-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE / DROP ... IF EXISTS guards.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'team_type') then
    create type team_type as enum ('solo', 'duo', 'trio');
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'team_status') then
    create type team_status as enum ('pending', 'approved', 'rejected');
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'team_source') then
    create type team_source as enum ('registration', 'admin_created');
  end if;
end$$;

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

create table if not exists public.teams (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  type         team_type not null,
  category     text,
  experience   text,
  status       team_status not null default 'pending',
  source       team_source not null default 'registration',
  reviewed_at  timestamptz,
  review_note  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.members (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references public.teams(id) on delete cascade,
  member_order smallint not null default 1, -- 1, 2, or 3 within the team
  name        text not null,
  email       text not null,
  phone       text,
  college     text not null,
  course      text not null,
  year        text not null,
  github      text,
  linkedin    text,
  created_at  timestamptz not null default now(),
  constraint members_order_range check (member_order between 1 and 3)
);

-- One member per (team, slot) and no duplicate email within the same team
create unique index if not exists members_team_order_unique on public.members(team_id, member_order);
create unique index if not exists members_team_email_unique on public.members(team_id, lower(email));

create index if not exists teams_status_idx on public.teams(status);
create index if not exists teams_created_at_idx on public.teams(created_at desc);
create index if not exists members_email_idx on public.members(lower(email));

-- ----------------------------------------------------------------------------
-- Keep updated_at fresh on teams
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists teams_set_updated_at on public.teams;
create trigger teams_set_updated_at
  before update on public.teams
  for each row
  execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
--
-- The app talks to Supabase from Next.js server-side route handlers only,
-- using the SERVICE ROLE key (which bypasses RLS) for all reads/writes.
-- The browser never talks to Supabase directly, so anon-key policies are
-- intentionally locked down to "no access" as defense in depth.
-- ----------------------------------------------------------------------------
alter table public.teams enable row level security;
alter table public.members enable row level security;

drop policy if exists "no anon access teams" on public.teams;
create policy "no anon access teams" on public.teams
  for all
  to anon, authenticated
  using (false)
  with check (false);

drop policy if exists "no anon access members" on public.members;
create policy "no anon access members" on public.members
  for all
  to anon, authenticated
  using (false)
  with check (false);

-- service_role bypasses RLS by default in Supabase, so no policy is needed
-- for the server-side admin/registration API routes.
