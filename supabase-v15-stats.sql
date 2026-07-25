-- ============================================================================
-- CRC MOH OS — v15: area teams, serving poll, stats
-- Run AFTER supabase-full-setup.sql. Idempotent.
-- ============================================================================

-- 1. Area leaders lead one or more GROUPS, not a single group.
alter table public.user_info
  add column if not exists area_teams text[] default '{}';

-- Optional demographics. Gender is stored; see note below about race.
alter table public.user_info
  add column if not exists gender text;

-- NOTE ON RACE
-- Under South Africa's POPIA, race is "special personal information" (s26) and
-- its processing is PROHIBITED by default unless a s27 exemption applies.
-- A ministry duty roster has no obvious lawful basis for it, and this database
-- holds minors. No race column is created here. If your church has a specific
-- documented reason and a consent process, add it deliberately rather than by
-- default:
--   alter table public.user_info add column if not exists race text;

create index if not exists user_info_area_teams_idx on public.user_info using gin (area_teams);

-- 2. Serving poll — one open request per service date.
create table if not exists public.serving_request (
  request_id   bigint generated always as identity primary key,
  title        text not null,
  service_date date not null,
  deadline     timestamptz,
  message      text,
  status       text not null default 'open' check (status in ('open','closed')),
  division     text,
  created_by   bigint references public.user_info(user_id) on delete set null,
  created_at   timestamptz not null default now(),
  unique (service_date, division)
);
create index if not exists serving_request_status_idx on public.serving_request (status, service_date);

alter table public.serving_request enable row level security;
drop policy if exists serving_request_read  on public.serving_request;
create policy serving_request_read  on public.serving_request
  for select to authenticated using (true);
drop policy if exists serving_request_write on public.serving_request;
create policy serving_request_write on public.serving_request
  for all to authenticated using (public.me_level() >= 3) with check (public.me_level() >= 3);

-- 3. Scope helper must understand area_teams.
create or replace function public.can_see_member(target_user_id bigint)
returns boolean
language sql stable security definer set search_path = public
as $$
  select case
    when target_user_id = public.me_id() then true
    when public.me_level() >= 7 then true
    when public.me_level() = 6 then exists (
      select 1 from public.user_info t
      where t.user_id = target_user_id and t.division = public.me_division())
    when public.me_level() = 5 then exists (
      select 1 from public.user_info t, public.user_info v
      where t.user_id = target_user_id and v.auth_id = auth.uid()
        and t.primary_service = v.primary_service
        and (v.division is null or t.division = v.division))
    when public.me_level() = 4 then exists (
      select 1 from public.user_info t, public.user_info v
      where t.user_id = target_user_id and v.auth_id = auth.uid()
        and (
          (array_length(v.area_teams,1) is not null and t.group_id = any(v.area_teams))
          or (array_length(v.area_teams,1) is null
              and t.division = v.division and t.primary_service = v.primary_service)
        ))
    when public.me_level() = 3 then exists (
      select 1 from public.user_info t
      where t.user_id = target_user_id and t.group_id = public.me_group())
    else false
  end
$$;

-- 4. Seed an open poll for the coming Sunday if none exists.
insert into public.serving_request (title, service_date, message, status)
select 'Sunday Service',
       (current_date + ((7 - extract(dow from current_date)::int) % 7))::date,
       'Please confirm availability for this Sunday. Choose AM, PM, Both or Not Serving.',
       'open'
where not exists (
  select 1 from public.serving_request
  where service_date = (current_date + ((7 - extract(dow from current_date)::int) % 7))::date
    and division is null
);

select 'v15 applied' as status;
