-- ============================================================================
-- CRC MOH OS — v12 database setup
-- Run this whole file in Supabase → SQL Editor → New query → Run.
-- It is safe to run more than once (everything is IF NOT EXISTS / idempotent).
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. user_info: two columns the app now needs
-- ----------------------------------------------------------------------------
-- area_name  : area leaders lead an AREA (Alpha, Bravo, Inside Group 1, ...),
--              not a group. Without this we cannot scope their team view.
-- primary_service : AM or PM. Previously this was only ever held in the browser
--              session and never saved, so service leaders had nothing to
--              filter on after a refresh or on another device.
alter table public.user_info
  add column if not exists area_name text,
  add column if not exists primary_service text;

-- Backfill primary_service from the group id where possible (AMU1 -> AM).
update public.user_info
set primary_service = case
    when upper(group_id) like 'AM%' then 'AM'
    when upper(group_id) like 'PM%' then 'PM'
    else primary_service
  end
where primary_service is null
  and group_id is not null;


-- ----------------------------------------------------------------------------
-- 2. serving_stats — already used by the app, created here if missing
-- ----------------------------------------------------------------------------
create table if not exists public.serving_stats (
  user_id  bigint not null references public.user_info(user_id) on delete cascade,
  service  text   not null check (service in ('am','pm','both','none')),
  date     date   not null,
  reason   text,
  comment  text,
  logged_at timestamptz not null default now(),
  primary key (user_id, date)
);

-- The app upserts with onConflict: "user_id,date" — that needs this constraint.
create index if not exists serving_stats_date_idx on public.serving_stats (date);


-- ----------------------------------------------------------------------------
-- 3. duty_assignment — NEW. Duty assignments were localStorage-only, so a duty
--    a leader assigned was invisible to the person it was assigned to.
-- ----------------------------------------------------------------------------
create table if not exists public.duty_assignment (
  assignment_id bigint generated always as identity primary key,
  user_id       bigint not null references public.user_info(user_id) on delete cascade,
  duty_title    text   not null,
  duty_area     text,
  arrival_time  text,
  supervisor    text,
  group_id      text,
  service_date  date   not null,
  assigned_by   bigint references public.user_info(user_id) on delete set null,
  created_at    timestamptz not null default now(),
  unique (user_id, service_date)
);

create index if not exists duty_assignment_date_idx  on public.duty_assignment (service_date);
create index if not exists duty_assignment_group_idx on public.duty_assignment (group_id);


-- ----------------------------------------------------------------------------
-- 4. notifications — already used by the app, created here if missing
-- ----------------------------------------------------------------------------
create table if not exists public.notifications (
  notification_id   bigint generated always as identity primary key,
  recipient_user_id bigint not null references public.user_info(user_id) on delete cascade,
  title             text not null,
  message           text,
  is_read           boolean not null default false,
  created_at        timestamptz not null default now()
);

create index if not exists notifications_recipient_idx
  on public.notifications (recipient_user_id, is_read);


-- ----------------------------------------------------------------------------
-- 5. feedback — indexes for the new filtered/sorted feedback console
-- ----------------------------------------------------------------------------
create index if not exists feedback_logged_idx   on public.feedback (date_time_logged desc);
create index if not exists feedback_resolved_idx on public.feedback (is_resolved);
create index if not exists feedback_user_idx     on public.feedback (user_id);


-- ----------------------------------------------------------------------------
-- 6. Row Level Security
-- ----------------------------------------------------------------------------
-- IMPORTANT, READ THIS.
-- This app does not use Supabase Auth yet — everything runs as the `anon` role.
-- That means RLS cannot distinguish one member from another, so the policies
-- below are permissive. They exist so the app functions; they are NOT real
-- security. Anyone with your anon key can read and write these tables.
--
-- Before this is used with real member data, move sign-in to Supabase Auth and
-- replace these with owner-scoped policies (auth.uid() = user_id).

alter table public.serving_stats   enable row level security;
alter table public.duty_assignment enable row level security;
alter table public.notifications   enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies
                 where schemaname='public' and tablename='serving_stats'
                   and policyname='serving_stats_anon_all') then
    create policy serving_stats_anon_all on public.serving_stats
      for all to anon using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies
                 where schemaname='public' and tablename='duty_assignment'
                   and policyname='duty_assignment_anon_all') then
    create policy duty_assignment_anon_all on public.duty_assignment
      for all to anon using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies
                 where schemaname='public' and tablename='notifications'
                   and policyname='notifications_anon_all') then
    create policy notifications_anon_all on public.notifications
      for all to anon using (true) with check (true);
  end if;
end $$;


-- ----------------------------------------------------------------------------
-- 7. Verify — run this after the above and check the output
-- ----------------------------------------------------------------------------
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('user_info','serving_stats','duty_assignment',
                     'notifications','feedback')
order by table_name, ordinal_position;
