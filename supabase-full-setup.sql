-- ============================================================================
-- CRC MOH OS — COMPLETE SUPABASE SETUP (schema + auth + RLS + storage)
--
-- HOW TO RUN
--   Supabase Dashboard -> SQL Editor -> New query -> paste all -> Run.
--   Idempotent: safe to run more than once.
--
-- RUN ORDER: this file, then the Storage section notes at the bottom.
--
-- IMPORTANT DESIGN NOTE
--   We do NOT change user_info.user_id from bigint to uuid. Every other table
--   (score, feedback, serving_stats, duty_assignment) has a foreign key to it.
--   Changing the primary key type would mean rebuilding all of them and
--   remapping existing rows — high risk for no benefit.
--   Instead we ADD a column `auth_id uuid` that links each member row to their
--   Supabase Auth account. Existing keys and data stay exactly as they are.
-- ============================================================================


-- ############################################################################
-- SECTION 1 — CORE TABLES
-- ############################################################################

-- ---------------------------------------------------------------- user_info
create table if not exists public.user_info (
  user_id          bigint generated always as identity primary key,
  auth_id          uuid unique references auth.users(id) on delete cascade,
  name             text not null,
  surname          text not null,
  phone            text unique not null,
  username         text,
  birthday         date,
  role             text not null default 'trainee',
  division         text,
  primary_service  text,
  group_id         text,
  area_name        text,
  clearance_level  int  not null default 1,
  services_logged  int  not null default 0,
  academy_progress int  not null default 0,
  academy_status   text default 'In Progress',
  avatar_url       text,
  started_date     date default current_date,
  last_log         timestamptz,
  created_at       timestamptz not null default now()
);

-- If the table already existed, add anything missing.
alter table public.user_info
  add column if not exists auth_id         uuid unique references auth.users(id) on delete cascade,
  add column if not exists area_name       text,
  add column if not exists primary_service text,
  add column if not exists username        text;

-- The plaintext password column is retired by this migration. It is dropped at
-- the very bottom of this file, AFTER you have confirmed everyone can sign in.

create index if not exists user_info_auth_idx     on public.user_info (auth_id);
create index if not exists user_info_group_idx    on public.user_info (group_id);
create index if not exists user_info_division_idx on public.user_info (division);
create index if not exists user_info_service_idx  on public.user_info (primary_service);

-- Backfill primary_service from group id (AMU1 -> AM) where it is missing.
update public.user_info
set primary_service = case
    when upper(group_id) like 'AM%' then 'AM'
    when upper(group_id) like 'PM%' then 'PM'
    else primary_service end
where primary_service is null and group_id is not null;


-- --------------------------------------------------------------- score_type
create table if not exists public.score_type (
  score_type_id text primary key,
  description   text
);

insert into public.score_type (score_type_id, description) values
  ('module_1','Academy module 1 quiz'),
  ('module_2','Academy module 2 quiz'),
  ('module_3','Academy module 3 quiz'),
  ('module_4','Academy module 4 quiz'),
  ('module_5','Academy module 5 quiz'),
  ('module_6','Academy module 6 quiz'),
  ('final_exam','Academy final examination')
on conflict (score_type_id) do nothing;


-- -------------------------------------------------------------------- score
create table if not exists public.score (
  score_id         bigint generated always as identity primary key,
  user_id          bigint not null references public.user_info(user_id) on delete cascade,
  score_type_id    text   not null references public.score_type(score_type_id),
  score            numeric not null,
  date_time_logged timestamptz not null default now()
);

create index if not exists score_user_idx on public.score (user_id, score_type_id);


-- ----------------------------------------------------------------- feedback
create table if not exists public.feedback (
  feedback_id      bigint generated always as identity primary key,
  user_id          bigint not null references public.user_info(user_id) on delete cascade,
  category         text,
  title            text not null,
  location         text,
  urgency_level    text default 'Medium',
  description      text,
  is_resolved      boolean not null default false,
  resolved_by      bigint references public.user_info(user_id) on delete set null,
  resolved_at      timestamptz,
  date_time_logged timestamptz not null default now()
);

alter table public.feedback
  add column if not exists resolved_by bigint references public.user_info(user_id) on delete set null,
  add column if not exists resolved_at timestamptz;

create index if not exists feedback_logged_idx   on public.feedback (date_time_logged desc);
create index if not exists feedback_resolved_idx on public.feedback (is_resolved);
create index if not exists feedback_user_idx     on public.feedback (user_id);


-- ---------------------------------------------------------- serving_request
-- NEW. The weekly poll was a hardcoded record in data.js dated 2026-06-14,
-- and nothing could create a new one. This makes it a real, dated record.
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


-- ------------------------------------------------------------ serving_stats
create table if not exists public.serving_stats (
  user_id    bigint not null references public.user_info(user_id) on delete cascade,
  service    text   not null check (service in ('am','pm','both','none')),
  date       date   not null,
  request_id bigint references public.serving_request(request_id) on delete set null,
  reason     text,
  comment    text,
  logged_at  timestamptz not null default now(),
  primary key (user_id, date)
);

alter table public.serving_stats
  add column if not exists request_id bigint references public.serving_request(request_id) on delete set null,
  add column if not exists reason  text,
  add column if not exists comment text;

create index if not exists serving_stats_date_idx on public.serving_stats (date);


-- ----------------------------------------------------------- duty_assignment
create table if not exists public.duty_assignment (
  assignment_id bigint generated always as identity primary key,
  user_id       bigint not null references public.user_info(user_id) on delete cascade,
  duty_title    text not null,
  duty_area     text,
  arrival_time  text,
  supervisor    text,
  group_id      text,
  service_date  date not null,
  assigned_by   bigint references public.user_info(user_id) on delete set null,
  created_at    timestamptz not null default now(),
  unique (user_id, service_date)
);

create index if not exists duty_assignment_date_idx  on public.duty_assignment (service_date);
create index if not exists duty_assignment_group_idx on public.duty_assignment (group_id);


-- ------------------------------------------------------------- notifications
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


-- ############################################################################
-- SECTION 2 — HELPER FUNCTIONS
--
-- CRITICAL: these are SECURITY DEFINER on purpose.
-- An RLS policy on user_info that needs to look up the current user's role
-- would have to SELECT from user_info — which re-triggers the same policy and
-- causes "infinite recursion detected in policy". Running the lookup inside a
-- SECURITY DEFINER function bypasses RLS and breaks that loop.
-- This is the single most common thing that breaks Supabase RLS setups.
-- ############################################################################

create or replace function public.me_id()
returns bigint
language sql stable security definer set search_path = public
as $$ select user_id from public.user_info where auth_id = auth.uid() limit 1 $$;

create or replace function public.me_level()
returns int
language sql stable security definer set search_path = public
as $$ select coalesce(clearance_level, 0) from public.user_info where auth_id = auth.uid() limit 1 $$;

create or replace function public.me_role()
returns text
language sql stable security definer set search_path = public
as $$ select role from public.user_info where auth_id = auth.uid() limit 1 $$;

create or replace function public.me_division()
returns text
language sql stable security definer set search_path = public
as $$ select division from public.user_info where auth_id = auth.uid() limit 1 $$;

create or replace function public.me_service()
returns text
language sql stable security definer set search_path = public
as $$ select primary_service from public.user_info where auth_id = auth.uid() limit 1 $$;

create or replace function public.me_group()
returns text
language sql stable security definer set search_path = public
as $$ select group_id from public.user_info where auth_id = auth.uid() limit 1 $$;

-- Can the signed-in member see this particular member row?
-- Mirrors MOHData.scopeFilter() in the app exactly.
create or replace function public.can_see_member(target_user_id bigint)
returns boolean
language sql stable security definer set search_path = public
as $$
  select case
    when target_user_id = public.me_id() then true          -- always yourself
    when public.me_level() >= 7 then true                    -- pastor: everyone
    when public.me_level() = 6 then exists (                 -- ministry: division
      select 1 from public.user_info t
      where t.user_id = target_user_id and t.division = public.me_division())
    when public.me_level() = 5 then exists (                 -- service: AM or PM
      select 1 from public.user_info t
      where t.user_id = target_user_id and t.primary_service = public.me_service())
    when public.me_level() = 4 then exists (                 -- area
      select 1 from public.user_info t
      where t.user_id = target_user_id
        and t.division = public.me_division()
        and t.primary_service = public.me_service())
    when public.me_level() = 3 then exists (                 -- group
      select 1 from public.user_info t
      where t.user_id = target_user_id and t.group_id = public.me_group())
    else false
  end
$$;


-- ############################################################################
-- SECTION 3 — AUTO-PROVISION A MEMBER ROW ON SIGN-UP
--
-- When someone signs up, Supabase inserts into auth.users. This trigger then
-- creates their matching public.user_info row from the metadata the client
-- passed in options.data. Doing it in a trigger means the member row cannot
-- be forged from the browser.
-- ############################################################################

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_role  text := coalesce(new.raw_user_meta_data->>'role', 'trainee');
  v_level int;
begin
  v_level := case v_role
    when 'pastor' then 7 when 'ministry_leader' then 6
    when 'service_leader' then 5 when 'area_leader' then 4
    when 'group_leader' then 3 when 'volunteer' then 2 else 1 end;

  insert into public.user_info (
    auth_id, name, surname, phone, birthday, role, division,
    primary_service, group_id, area_name, clearance_level
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Member'),
    coalesce(new.raw_user_meta_data->>'surname', ''),
    coalesce(new.raw_user_meta_data->>'phone', new.id::text),
    nullif(new.raw_user_meta_data->>'birthday','')::date,
    v_role,
    nullif(new.raw_user_meta_data->>'division',''),
    nullif(new.raw_user_meta_data->>'primary_service',''),
    nullif(new.raw_user_meta_data->>'group_id',''),
    nullif(new.raw_user_meta_data->>'area_name',''),
    v_level
  )
  on conflict (phone) do update
    set auth_id = excluded.auth_id;   -- links an existing member to their new login

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();


-- ############################################################################
-- SECTION 4 — ROW LEVEL SECURITY
-- ############################################################################

alter table public.user_info       enable row level security;
alter table public.score           enable row level security;
alter table public.score_type      enable row level security;
alter table public.feedback        enable row level security;
alter table public.serving_request enable row level security;
alter table public.serving_stats   enable row level security;
alter table public.duty_assignment enable row level security;
alter table public.notifications   enable row level security;

-- Drop any previous permissive anon policies from the old setup.
do $$
declare p record;
begin
  for p in
    select schemaname, tablename, policyname from pg_policies
    where schemaname = 'public'
      and policyname like '%anon_all%'
  loop
    execute format('drop policy if exists %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;


-- ---------------------------------------------------------------- user_info
drop policy if exists user_info_select on public.user_info;
create policy user_info_select on public.user_info
  for select to authenticated
  using (public.can_see_member(user_id));

drop policy if exists user_info_update_self on public.user_info;
create policy user_info_update_self on public.user_info
  for update to authenticated
  using (auth_id = auth.uid())
  with check (auth_id = auth.uid());

-- Leaders (group leader and above) may update people in their scope,
-- e.g. to correct a group or promote a trainee.
drop policy if exists user_info_update_leader on public.user_info;
create policy user_info_update_leader on public.user_info
  for update to authenticated
  using (public.me_level() >= 3 and public.can_see_member(user_id))
  with check (public.me_level() >= 3 and public.can_see_member(user_id));

-- No INSERT policy on purpose: rows are only ever created by the
-- handle_new_auth_user trigger, which runs as SECURITY DEFINER.
-- No DELETE policy: removing members is a Dashboard/admin action.


-- -------------------------------------------------------------------- score
drop policy if exists score_select on public.score;
create policy score_select on public.score
  for select to authenticated
  using (public.can_see_member(user_id));

drop policy if exists score_insert_self on public.score;
create policy score_insert_self on public.score
  for insert to authenticated
  with check (user_id = public.me_id());

drop policy if exists score_type_read on public.score_type;
create policy score_type_read on public.score_type
  for select to authenticated using (true);


-- ----------------------------------------------------------------- feedback
drop policy if exists feedback_select on public.feedback;
create policy feedback_select on public.feedback
  for select to authenticated
  using (user_id = public.me_id() or (public.me_level() >= 3 and public.can_see_member(user_id)));

drop policy if exists feedback_insert_self on public.feedback;
create policy feedback_insert_self on public.feedback
  for insert to authenticated
  with check (user_id = public.me_id());

drop policy if exists feedback_resolve_leader on public.feedback;
create policy feedback_resolve_leader on public.feedback
  for update to authenticated
  using (public.me_level() >= 3 and public.can_see_member(user_id))
  with check (public.me_level() >= 3);


-- ---------------------------------------------------------- serving_request
drop policy if exists serving_request_read on public.serving_request;
create policy serving_request_read on public.serving_request
  for select to authenticated using (true);

drop policy if exists serving_request_write on public.serving_request;
create policy serving_request_write on public.serving_request
  for all to authenticated
  using (public.me_level() >= 3)
  with check (public.me_level() >= 3);


-- ------------------------------------------------------------ serving_stats
drop policy if exists serving_stats_select on public.serving_stats;
create policy serving_stats_select on public.serving_stats
  for select to authenticated
  using (public.can_see_member(user_id));

drop policy if exists serving_stats_write_self on public.serving_stats;
create policy serving_stats_write_self on public.serving_stats
  for all to authenticated
  using (user_id = public.me_id())
  with check (user_id = public.me_id());


-- ----------------------------------------------------------- duty_assignment
drop policy if exists duty_assignment_select on public.duty_assignment;
create policy duty_assignment_select on public.duty_assignment
  for select to authenticated
  using (user_id = public.me_id() or public.can_see_member(user_id));

drop policy if exists duty_assignment_write_leader on public.duty_assignment;
create policy duty_assignment_write_leader on public.duty_assignment
  for all to authenticated
  using (public.me_level() >= 3 and public.can_see_member(user_id))
  with check (public.me_level() >= 3 and public.can_see_member(user_id));


-- ------------------------------------------------------------- notifications
drop policy if exists notifications_select on public.notifications;
create policy notifications_select on public.notifications
  for select to authenticated
  using (recipient_user_id = public.me_id());

drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own on public.notifications
  for update to authenticated
  using (recipient_user_id = public.me_id())
  with check (recipient_user_id = public.me_id());

-- Any signed-in member can notify a leader (used by the "not serving" flow).
drop policy if exists notifications_insert on public.notifications;
create policy notifications_insert on public.notifications
  for insert to authenticated with check (true);


-- ############################################################################
-- SECTION 5 — STORAGE
-- ############################################################################

-- Buckets. 'avatars' is public-read so <img src> works without signed URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars','avatars', true, 2097152,
        array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update
  set public = true,
      file_size_limit = 2097152,
      allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];

-- Private bucket for photos attached to feedback reports.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('feedback-photos','feedback-photos', false, 5242880,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = false,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg','image/png','image/webp'];


-- Storage policies.
-- FILE PATH CONVENTION — this matters, the policies depend on it:
--   avatars/<auth_uid>/<filename>
-- storage.foldername(name) splits the path, so [1] is the first folder.
-- A member can therefore only write inside their own uid folder.

drop policy if exists avatars_public_read on storage.objects;
create policy avatars_public_read on storage.objects
  for select to public
  using (bucket_id = 'avatars');

drop policy if exists avatars_write_own on storage.objects;
create policy avatars_write_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists avatars_update_own on storage.objects;
create policy avatars_update_own on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists avatars_delete_own on storage.objects;
create policy avatars_delete_own on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists feedback_photos_read on storage.objects;
create policy feedback_photos_read on storage.objects
  for select to authenticated
  using (
    bucket_id = 'feedback-photos'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.me_level() >= 3)
  );

drop policy if exists feedback_photos_write on storage.objects;
create policy feedback_photos_write on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'feedback-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ############################################################################
-- SECTION 6 — VERIFY
-- ############################################################################

-- 6a. Every table should show rowsecurity = true.
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;

-- 6b. Review the policies that now exist.
select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 6c. Who has not been linked to a login yet?
--     These people cannot sign in until they register (see AUTH-MIGRATION.md).
select user_id, name, surname, phone, role
from public.user_info
where auth_id is null
order by user_id;


-- ############################################################################
-- SECTION 7 — FINAL STEP, RUN LATER
--
-- Only after every member has signed in successfully at least once and
-- section 6c returns zero rows, retire the plaintext password column:
--
--   alter table public.user_info drop column if exists password;
--
-- Do not run this line until then. It cannot be undone.
-- ############################################################################
