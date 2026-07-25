-- ============================================================================
-- CRC MOH OS — v19: serving poll lifecycle + event polls
-- Run AFTER supabase-v16.sql. Idempotent.
-- ============================================================================

-- 1. The serving poll gains a window.
--    Opens Tuesday 00:00, closes Friday 21:00, relative to its service date.
alter table public.serving_request
  add column if not exists opens_at  timestamptz,
  add column if not exists closes_at timestamptz;

-- Backfill any existing rows: Tuesday before the service, Friday 21:00 before it.
update public.serving_request
set opens_at  = coalesce(opens_at,  (service_date - interval '5 days')::timestamptz),
    closes_at = coalesce(closes_at, (service_date - interval '2 days')::date + time '21:00')
where opens_at is null or closes_at is null;


-- 2. Roll the poll forward automatically.
--    Creates the request for a given Sunday if it does not exist. Safe to call
--    from anywhere, any number of times.
create or replace function public.ensure_serving_request(target date default null)
returns bigint
language plpgsql security definer set search_path = public
as $$
declare
  d  date;
  id bigint;
begin
  d := coalesce(target, (current_date + ((7 - extract(dow from current_date)::int) % 7))::date);

  select request_id into id
  from public.serving_request
  where service_date = d and division is null
  limit 1;

  if id is not null then
    return id;
  end if;

  insert into public.serving_request
    (title, service_date, message, status, opens_at, closes_at)
  values (
    'Sunday Service',
    d,
    'Please confirm availability for this Sunday. Choose AM, PM, Both or Not Serving.',
    'open',
    (d - interval '5 days')::timestamptz,
    (d - interval '2 days')::date + time '21:00'
  )
  returning request_id into id;

  return id;
end $$;

grant execute on function public.ensure_serving_request(date) to authenticated;

-- Make sure this week and next week both exist right now.
select public.ensure_serving_request();
select public.ensure_serving_request(
  ((current_date + ((7 - extract(dow from current_date)::int) % 7)) + 7)::date
);


-- 3. OPTIONAL — true scheduling.
--    The function above is called lazily by the app, which is enough: the poll
--    exists before anyone can look at it. If you would rather it be created on
--    a timer regardless of app usage, enable pg_cron and uncomment:
--
--   create extension if not exists pg_cron;
--   select cron.schedule('roll-serving-poll', '0 1 * * 1',
--                        $$select public.ensure_serving_request()$$);
--
--   That runs 01:00 every Monday, a day before the poll opens.


-- 4. Event polls need to know which services they concern, so a ministry
--    leader can build a team from both AM and PM responders.
alter table public.announcement
  add column if not exists services text[] default '{}',
  add column if not exists needed_count int;

-- 5. Responses get a timestamp we can compare to the close time, so a late
--    reply is visible as late rather than silently counted the same.
alter table public.serving_stats
  add column if not exists is_late boolean default false;

select 'v19 applied' as status;
