-- ============================================================================
-- CRC MOH OS — v16: area assignment chain, placements, announcements & polls,
--                   trainee tracking
-- Run AFTER supabase-v15-stats.sql. Idempotent.
-- ============================================================================

-- 1. Gender is redundant: ushers are male, hostesses are female, so division
--    already carries it. Removing rather than storing a duplicate attribute.
alter table public.user_info drop column if exists gender;

-- Trainee tracking needs a start date and a target length.
alter table public.user_info
  add column if not exists training_started date,
  add column if not exists training_weeks   int default 6;

update public.user_info
set training_started = coalesce(training_started, started_date, current_date)
where role = 'trainee' and training_started is null;


-- 2. SERVICE LEADER -> GROUP -> AREA
--    The service leader assigns each group an area for a given Sunday.
--    The group leader may then only hand out duties belonging to that area.
create table if not exists public.group_area_assignment (
  id           bigint generated always as identity primary key,
  group_id     text not null,
  area_name    text not null,
  service_date date not null,
  division     text,
  service      text,
  assigned_by  bigint references public.user_info(user_id) on delete set null,
  created_at   timestamptz not null default now(),
  unique (group_id, service_date)
);
create index if not exists gaa_date_idx on public.group_area_assignment (service_date);


-- 3. PLACEMENTS
--    Covers two cases the ministry actually has:
--      a) a PM usher serving AM this Sunday, placed into an AM group
--      b) a trainee rotated into a different group for the week
--    A placement overrides the member's home group for that date only.
create table if not exists public.group_placement (
  id           bigint generated always as identity primary key,
  user_id      bigint not null references public.user_info(user_id) on delete cascade,
  group_id     text not null,
  service_date date not null,
  reason       text,
  placed_by    bigint references public.user_info(user_id) on delete set null,
  created_at   timestamptz not null default now(),
  unique (user_id, service_date)
);
create index if not exists placement_date_idx  on public.group_placement (service_date);
create index if not exists placement_group_idx on public.group_placement (group_id, service_date);


-- 4. Duty assignments carry a custom message from the group leader.
alter table public.duty_assignment
  add column if not exists note text;


-- 5. ANNOUNCEMENTS & POLLS
--    One table, two kinds. `kind='poll'` carries options and collects replies.
--    Audience is resolved client-side against the sender's own scope, so a
--    group leader can never address more than their group.
create table if not exists public.announcement (
  announcement_id bigint generated always as identity primary key,
  kind            text not null default 'announcement'
                  check (kind in ('announcement','poll')),
  title           text not null,
  body            text,
  poll_options    text[] default '{}',
  audience_type   text not null default 'group'
                  check (audience_type in ('all','division','service','area_teams','group')),
  audience_value  text,
  event_date      date,
  created_by      bigint references public.user_info(user_id) on delete set null,
  created_at      timestamptz not null default now(),
  closes_at       timestamptz,
  status          text not null default 'open' check (status in ('open','closed'))
);
create index if not exists announcement_created_idx on public.announcement (created_at desc);
create index if not exists announcement_status_idx  on public.announcement (status);

create table if not exists public.announcement_response (
  announcement_id bigint not null references public.announcement(announcement_id) on delete cascade,
  user_id         bigint not null references public.user_info(user_id) on delete cascade,
  choice          text,
  comment         text,
  responded_at    timestamptz not null default now(),
  primary key (announcement_id, user_id)
);


-- 6. RLS
alter table public.group_area_assignment  enable row level security;
alter table public.group_placement        enable row level security;
alter table public.announcement           enable row level security;
alter table public.announcement_response  enable row level security;

-- Everyone signed in may read area assignments and placements; only leaders
-- at level 3+ may write. Level 5+ (service leader and above) sets areas.
drop policy if exists gaa_read on public.group_area_assignment;
create policy gaa_read on public.group_area_assignment
  for select to authenticated using (true);
drop policy if exists gaa_write on public.group_area_assignment;
create policy gaa_write on public.group_area_assignment
  for all to authenticated
  using (public.me_level() >= 5) with check (public.me_level() >= 5);

drop policy if exists placement_read on public.group_placement;
create policy placement_read on public.group_placement
  for select to authenticated using (true);
drop policy if exists placement_write on public.group_placement;
create policy placement_write on public.group_placement
  for all to authenticated
  using (public.me_level() >= 4) with check (public.me_level() >= 4);

-- Announcements: readable by anyone signed in (audience filtering happens in
-- the app); writable by leaders.
drop policy if exists announcement_read on public.announcement;
create policy announcement_read on public.announcement
  for select to authenticated using (true);
drop policy if exists announcement_write on public.announcement;
create policy announcement_write on public.announcement
  for all to authenticated
  using (public.me_level() >= 3) with check (public.me_level() >= 3);

drop policy if exists ar_read on public.announcement_response;
create policy ar_read on public.announcement_response
  for select to authenticated
  using (user_id = public.me_id() or public.me_level() >= 3);
drop policy if exists ar_write on public.announcement_response;
create policy ar_write on public.announcement_response
  for all to authenticated
  using (user_id = public.me_id()) with check (user_id = public.me_id());


-- 7. Trainee rotation: which areas has each trainee worked, and when.
create or replace view public.trainee_rotation as
select
  u.user_id,
  u.name,
  u.surname,
  u.group_id,
  u.division,
  u.primary_service,
  u.training_started,
  u.training_weeks,
  greatest(0, (current_date - u.training_started) / 7) as weeks_in_training,
  d.service_date,
  d.duty_area,
  d.duty_title
from public.user_info u
left join public.duty_assignment d on d.user_id = u.user_id
where u.role = 'trainee';

select 'v16 applied' as status;
