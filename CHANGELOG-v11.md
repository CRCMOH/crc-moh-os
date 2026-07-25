# CRC MOH OS — v11

## New

**Usher Academy** (`academy-usher.js`)
Built from the Usher Guide, structured identically to the Hostess track.
6 modules → 10-question quiz each → final exam → certificate.

| # | Module | Guide source |
|---|--------|--------------|
| 1 | Attire, Groups & Serving Times | Stage 1 + times table |
| 2 | Storeroom & Equipment | Stage 2 |
| 3 | Set Up & Leadership | Stage 3 |
| 4 | Outside — Parking, Equipment & Weather | Stage 4 (outside) |
| 5 | Inside — Doors, Catching & Offering | Stage 4 (inside) |
| 6 | Set Down, Feedback & Ministry Protocol | Stages 5–6 |

- 60 module questions + a 53-question final pool that samples 30 at random.
- The "Usher Academy Coming Soon" gate is removed; the academy reads
  `user.division` and loads the matching syllabus.

**Profile editing**
- Edit name, surname, phone, birthday, division, service and group.
- Group list re-filters live when division or service changes.
- Avatar upload with type + 2MB validation and live preview.
- Separate change-password flow that verifies the current password.
- Writes to Supabase and localStorage; session token follows a phone change.
- Changing division resets the academy track (different syllabus).

**Navigation**
- Bottom nav replaced by a hamburger drawer on mobile.
- The same drawer becomes a pinned sidebar at ≥1024px.
- Grouped sections (Serving / Leadership / Account), identity card,
  unread badge on Alerts, logout in the footer.
- Escape key and scrim both close it.
- Applied consistently to `index.html`, `leadership.html`,
  `dashboard-extended.html`.

**Academy UI**
Progress ring hero, vertical timeline curriculum path with numbered nodes,
collapsible study sections, redesigned quiz runner (sticky progress bar,
lettered options, Back button, exit-without-saving), results screen with
score ring and full answer review, polished certificate with print CSS.

## Bugs fixed

### Critical
1. **Service worker served stale builds forever.** Cache-first on HTML/JS/CSS
   with a cache name that was never bumped — installed PWAs would never have
   received this update. Rewritten: network-first for app code, cache-first
   for images, cache bumped to `crc-moh-os-v11`, new assets registered.
2. **Quiz crashed when offline.** `saveScoreToSupabase` had no null guard, so
   an unreachable DB threw mid-grading and destroyed the result screen.
3. **Same unguarded pattern** in Feedback load/submit, Alerts load,
   resolveFeedback, markNotificationRead and sign-in score loading — all now
   degrade gracefully instead of blanking the view.
4. **Final exam was not random.** Read `pool[0..29]` sequentially despite the
   UI promising "30 dynamic questions". Now shuffles and samples.
5. **Quiz options containing apostrophes broke the HTML.** Options were
   interpolated into inline `onclick="...'opt'..."` handlers. Replaced with
   data attributes and event delegation.

### Standard
6. `initials()` returned "MUNDEFINED" when surname was empty
   (index.html and leadership.html).
7. Leadership console's nav was five dead `alert()` stubs — Guide, Academy,
   Feedback, Alerts and Profile went nowhere. Now real deep links.
8. `dashboard-extended.html` header avatar was hardcoded to "M" and never
   populated from the current user.
9. `dashboard-extended.html` active-tab selector pointed at the removed
   `.bottom-nav` container.
10. Guide search lost focus and caret on every keystroke (full re-render per
    character). Now debounced with caret restore.
11. Sign-up had no duplicate-phone check — a second sign-up on an existing
    number silently hijacked that login. Added, plus field validation and a
    Supabase-availability guard.
12. `syncState()` matched only on phone, so editing your phone orphaned your
    record. Now matches on ID first, falls back to phone.
13. Hardcoded `/10` and `/6` divisors throughout the academy — now derived
    from the actual module and quiz lengths.
14. `finalExamScore || 100` displayed a fake 100% on the certificate when no
    score existed.
15. `openAssign` crashed when the member could not be found.
16. "Cross-service free agent" flag read `primaryService` off response
    records, which never carry it.
17. `render()` called `nav()` twice per navigation.
18. Stale quiz/reader state persisted when navigating away from the academy.
19. Partially-shaped academy objects (missing `moduleScores`) threw on read.
20. The avatar file chosen during a sign-up stayed in memory for the next one.
21. Supabase debug badge shipped visible in the running app.
22. Dead bottom-nav space reserved at the bottom of every page on desktop.

## Notes

- `.env` is in this folder and now in `.gitignore`. Anon keys are semi-public
  by design, but confirm your Supabase Row Level Security policies are locked
  down — RLS is the only thing protecting your data.
- Passwords are still stored in plain text in the `user_info` table. That is
  pre-existing and out of scope here, but it should be moved to Supabase Auth
  before this goes wide.

## v11.1 — mobile scroll pass

23. **Sticky bars hid behind the fixed header.** A sticky element resolves its
    offsets against the *scrollport*, which is the scroll container's padding
    box — i.e. y=0 of `.app-main`, which sits underneath the fixed 64px
    header. `top:0` therefore tucked the quiz progress bar and the guide
    search field out of sight while scrolling. Both now offset by the header
    height.
24. **Content scrolled behind the open drawer.** `.app-main` is its own scroll
    container, so the scrim blocked taps but not scrolling. Opening the drawer
    now sets `body.nav-open`, which locks `.app-main`. Released on close and
    on nav selection. Never applied at ≥1024px, where the sidebar is pinned
    rather than overlaid.
25. **iOS Safari zoomed the viewport on every input focus.** `.field-input` is
    15px; iOS zooms below 16px. Bumped to 16px under 720px only, so desktop
    density is unchanged.
26. Added momentum scrolling, `overscroll-behavior-y: contain` to stop
    scroll-chaining, and a 1px end-stop so the last card clears the
    safe-area inset on notched devices.

# v12 — leadership, structure, feedback, guides

## THE HEADLINE BUG: leaders could not see their team

`leadership.html` contained **zero Supabase calls**, and `team()` read its
roster from `localStorage("moh_users")`. localStorage is per-device, so a group
leader only ever saw people who had signed in on that leader's own phone — in
practice, only themselves. Serving responses had the same problem: they went to
`serving_stats` in Supabase but were read back from localStorage.

Fixed with a new shared data layer, `moh-data.js`:
- Roster comes from Supabase `user_info`, scoped by the viewer's role.
- Serving status comes from `serving_stats` for the upcoming Sunday.
- `teamOverview()` merges the two and returns per-person serving state plus
  counts, so leaders now see exactly who is serving AM / PM / both / not
  serving / hasn't replied.
- Every method returns `{ data, source, error }`, and the UI shows an honest
  banner when it's serving cached or local data instead of live.

Verified scope, per role:

| Role | Sees |
|---|---|
| Group leader | their group |
| Area leader | their area (falls back to division + service) |
| Service leader | the whole AM or PM service |
| Ministry leader | their division, both services |
| Pastor | everyone |
| Volunteer / trainee | themselves only |

## Sign-up restructured around role

Leaders above group level do not belong to a group, but the form demanded one,
so their records carried meaningless group data. Role is now the first
question and drives the rest:

- Trainee / Volunteer / Group leader → division, service, group
- Area leader → division, service, **area** (Alpha…Foxtrot / Inside–Outside groups)
- Service leader → service only
- Ministry leader → division only
- Pastor → nothing

## Database

New `supabase-setup-v12.sql` (idempotent, safe to re-run):
- `user_info.area_name` and `user_info.primary_service` — **`primary_service`
  never existed**, so sign-in aliased it to `division`. Every service-level
  scope was comparing "usher" against "AM" and silently matching nobody.
- `duty_assignment` table — duty assignments were localStorage-only, so a duty
  a leader assigned was invisible to the person it was assigned to.
- `serving_stats` and `notifications` created if missing, plus indexes.
- RLS enabled with permissive `anon` policies, clearly marked as not real
  security until Supabase Auth replaces the current password check.

## Feedback console rebuilt

The old view stacked a permanent submit form plus one large card per report —
roughly 30% of the screen each, so 30 reports was unusable.

- Dense one-line rows that expand on tap.
- Sorted unresolved first, then by urgency, then newest.
- Filters: Open / All / Resolved / Mine, plus an urgency row.
- Live search across title, description, location and category.
- Header shows open count and high-priority count.
- Submitting moved into a modal behind a `+` button.
- Submit failures now surface instead of silently vanishing.

Tested at 32 reports: 24 open by default, all collapsed, Critical filter → 8.

## Guides

- Cards collapse by default with a bullet count, so the usher and hostess
  libraries are scannable rather than one continuous wall.
- Search auto-expands matches and shows a match count.
- Tab chips show per-tab result counts that update with the search.
- The guide opens on the member's own division.

## Additional fixes

27. `respond()` threw an unhandled rejection when offline, killing the poll.
    Now warns and keeps the local answer.
28. The "not serving" leader-notification block ran without a Supabase client
    and threw.
29. `scopeUsers()` in index.html and the leadership console had separate,
    diverging scope rules. Both now use `MOHData.scopeFilter`.
30. Area leader scope previously filtered on `division + primaryService`, which
    with the aliasing bug above matched nobody.

# v13 — Supabase Auth migration (client side)

Pairs with `supabase-full-setup.sql`. Run the SQL first.

## Replaced
- `handleSignUp` → `auth.signUp()` with member metadata. The database trigger
  creates the `user_info` row, so the browser no longer inserts member records.
- `handleSignIn` → `auth.signInWithPassword()`. The old query was
  `.eq("password", password)` against a plaintext column.
- `checkActiveSession` → `auth.getSession()`. Supabase owns the session;
  localStorage is now only a UI cache.
- `logout` / `clearCurrentSession` → `auth.signOut()`.
- Password change → `auth.updateUser()`, **preceded by a re-authentication**.
  `updateUser` does not verify the old password, so without the re-auth step
  anyone with an unlocked phone could change it.
- Avatar upload paths → `<auth_uid>/<file>`. The storage policy only permits
  writes inside your own uid folder.

## Removed
- `LEADERSHIP_PINS` from `data.js` and both PIN fields from the forms. Five
  shared numeric PINs in a client-readable file were never security.

## Fixed
- Phone numbers are stored digits-only, so `user_info.phone` always matches the
  number the login email is derived from.
- The profile editor now persists `primary_service`.

## Verified
Sign-up, duplicate-signup rejection, sign-out, sign-in (wrong and right
password), session restore across reload, password change with re-auth, and —
importantly — **an existing member re-linking**: signing up with a phone number
already in `user_info` links to that row rather than creating a second one.
Tested with a member on 14 services and 83% academy progress; user_id, services
and progress all preserved.

# v14 — scroll, assign, guide

Diagnosed with real headless Chromium (149) rather than by reading CSS.

## 31. NOTHING SCROLLED — root cause found

`.app-main` carries `flex: 1` from the base stylesheet, making it a flex item
in `.app-shell`'s column layout. A flex item's **automatic minimum size is its
content size** (`min-height: auto`), so `height: 100dvh` never constrained it —
the element simply grew to fit its content. Measured: `.app-main` was **933px
tall inside an 820px viewport** on laptop, 984px inside 844px on mobile.

Two consequences:
- It never became a scroll container (`scrollHeight === clientHeight`).
- `html, body { overscroll-behavior: none }` blocked the wheel from chaining to
  the document, so there was no fallback scroll either.

Net effect: anything past the fold was unreachable at every screen size. My
earlier v11 "scroll fixes" addressed sticky offsets and drawer locking — real
issues, but not this one, and I claimed the container itself was fine based on
CSS reading rather than measurement.

Fix: give `.app-shell` a definite `height: 100dvh`, then let `.app-main` take
the remainder with **`min-height: 0`** so it may shrink below its content and
scroll internally. `min-height: 0` is the load-bearing line.

Verified in Chromium at 1440x820 and 390x844: shell now measures exactly the
viewport height on every view, and dashboard, academy, guide and profile all
scroll to the bottom.

## 32. Assign Duties had no buttons

`assign()` only rendered an Assign button for members who had confirmed serving.
With the serving poll still frozen nobody can confirm, so the page rendered
"0 of 0 assigned" and an awaiting-response list with no controls at all — which
is why the button "wouldn't press". It was never there.

A duty can now be given to anyone in scope, grouped into Confirmed serving /
Awaiting a response / Said not serving, with serving status shown as context
rather than used as a gate. Verified: 3 members, 3 buttons, save round-trip
updates the header to "1 of 3", flips the button to "Change" and shows the duty
on the row.

Also removed the 2.2-second red-banner delay after saving offline. The duty is
always written locally first, so the modal now closes immediately and sync
status is reported on the refreshed page.

## 33. Guide rewritten as prose

New `guide-content.js`. The guide was pure bullet points, which read as a
checklist rather than a manual. Each chapter now has an overview paragraph and
sections with explanatory prose, with bullets kept only where a list is
genuinely clearest (the AM/PM timelines).

Seven usher chapters written from the Usher Guide, covering not just what to do
but why — why fists are balled when catching, why only one door opens at a
time, why inside and outside brooms are kept apart.

**Hostess chapters are thinner on purpose.** They expand only the structural
facts already held in the app. Rather than invent hostess procedure, they
describe it generally. Supply the Hostess Guide document to bring them to the
same depth.

# v15 — poll, area teams, stats, hostess guide

## 34. Serving poll fixed
`respond()` wrote `serving_stats` against the seeded request's stale date
(2026-06-14) while leaders read the upcoming Sunday. Both now use
`MOHData.nextSundayISO()`. `serving_request` is a real dated table with
`currentRequest()` / `createRequest()` in the data layer.

## 35. Area leaders pick their teams
Area leaders lead several GROUPS, not one. Sign-up now shows a multi-select
team picker after division + service, stored in `user_info.area_teams`.
`can_see_member()` and `MOHData` scope both honour it, falling back to
division+service only while no teams are recorded.

## 36. Ministry Stats view (leaders only)
Role-scoped automatically — a group leader sees their group, an AM usher
service leader sees only AM ushers, a ministry leader their division, a pastor
everything. Shows: serving count with week-on-week delta, last 4 Sundays as
AM/PM bars, training pipeline (trainees serving this Sunday, academy
certified), composition (average age, under-18 count, gender split), role
breakdown, and birthdays this month. Non-leaders are redirected out.

## 37. academyStatus was being clobbered
`bridge.js` overwrote the Supabase-format `academyStatus` ("Certified") with
the internal lowercase `academy.status` ("in_progress") on every sync, so the
certified count could never be anything but zero. Fixed, plus a
case-tolerant `isCertified()` helper.

## 38. Hostess guide written from source
The "MOH Potch Hostess Guide" arrived, so the hostess chapters are no longer
thin. Ten chapters now, including Parents & Baby Room (temperature 22-23,
dimming during the countdown, nappy protocol) and Inside — Seating (middle
block to the camera box, then the wings, middle seats outward — and why:
smoother offering, and nobody passing in front of others during worship).

# v16 — the leadership chain

Run `supabase-v16.sql` first.

## 39. Gender removed
Ushers are male, hostesses are female, so division already carries it. The
column is dropped rather than storing a duplicate attribute, and Composition
now reports division instead.

## 40. Service leader → group → area chain
`group_area_assignment` records which area each group serves on a given date.
The service leader sets it from the new **Areas & Placements** view. Once a
group has an area, its leader's duty picker is filtered to that area only —
the restriction lifts automatically for level 5+, who can still assign
anything.

## 41. Placements (cross-service and trainee rotation)
`group_placement` overrides a member's home group for one date. Two uses:
a PM usher serving AM gets placed into an AM group so its leader can assign
them duties, and a trainee gets rotated into a different group for the week.
The Areas view surfaces both lists automatically.

## 42. Announcements and polls
`announcement` + `announcement_response`. Leaders compose from **Send Notice**;
audience options are generated from their own scope so nobody can address more
than they lead. Verified:

| Role | May address |
|---|---|
| Group leader | their group only |
| Area leader | their teams, their group |
| Service leader | their service, teams, group |
| Ministry leader | their division and below |
| Pastor | whole ministry and below |

Polls carry options and collect replies. Members see both in Alerts, answer
inline, and can change their answer. Unanswered polls add to the nav badge.

## 43. Duty assignments carry a message
`duty_assignment.note` — the group leader can attach instructions to a duty
("take the far gate first, then help with cones").

## 44. Trainee tracking
New **Trainees** view for level 4+. Per trainee: academy progress, areas
covered vs still outstanding as chips, and the last three Sundays of duties —
so a service leader can see at a glance who still hasn't done Delta. A
**Promote** action moves them to Standard Volunteer and fixes their permanent
group. Area leaders have the same access, so it can be delegated.

## Not done yet
- `leadership.html` consoles remain localStorage-driven.
- No realtime subscriptions — views refresh on navigation, not live.
- Announcements do not yet raise a push notification, only in-app.

# v17 — leadership goes live

## 45. leadership.html is no longer localStorage
It had **no Supabase client at all** — that is the whole reason every console
showed only people who had signed in on that device.

Rather than rewrite five consoles, the change targets the single choke point
they all share: `resolveDatastores()`. It now calls `MOHData.teamOverview()`,
`assignments()` and `feedback()`, maps the results into the exact shapes the
consoles already expect (`serving_stats.service` am/pm/both/none →
`serving_am`/`serving_pm`/`serving_both`/`not_serving`), and falls back to the
old local read if the network is unavailable. All five consoles went live
without being touched.

A banner reports whether the data is live or cached, so a leader is never
misled by stale numbers.

## 46. Realtime
`MOHData.subscribe()` / `onChange()` open one channel per table and fan out to
registered listeners, debounced at 400ms so a burst of responses causes one
re-render rather than one per row. Verified: a single change triggers exactly
1 re-render; six rapid changes also trigger exactly 1.

Both the main app and the leadership console re-render on changes to
`serving_stats`, `duty_assignment`, `user_info`, `feedback`,
`group_area_assignment` and `group_placement`.

## 47. Announcement notifications
A new announcement or poll raises an OS notification and bumps the badge,
whichever view is open. Audience is checked first, so a notice addressed to
another group is ignored, and you are never notified about your own post.
Both verified.

## 48. notify() could hang forever
`await navigator.serviceWorker.ready` never resolves when no worker is
registered — file://, first load, or after a hard refresh — which would have
left the notification silently undelivered. Now raced against an 800ms timeout
with a direct `new Notification()` fallback.

## Still needs a server
Notifications only reach people whose app is open or backgrounded. True push
to a closed app needs VAPID keys, stored subscriptions and an Edge Function.
`sw.js` already has the handlers; see **PUSH-NOTES.md** for the remaining work.

# v18 — motion, dashboard, app help

## 49. Command Centre was empty — my bug
The v13 auth migration replaced the session keys, and **nothing writes
`currentUser` / `crc_moh_current_user` / `crc_moh_user` any more**.
`leadership.html`'s `getCurrentUser()` still read those, got null, and either
bounced to index.html or rendered nothing. It now reads the current session
(`moh_user_session` + `moh_users`) with the legacy keys as fallback.

The leadership PIN gate was also still live, checking a flag set by PINs that
were deleted in v13 — it could never pass. Removed.

## 50. Motion system
- **Boot splash**: logo pop + breathing scale, spinning accent ring, sliding
  progress bar. Dismisses on load with a 4s failsafe so it can never stick.
- **Page transitions**: content fades and lifts in, with children cascading at
  20-30ms intervals so a list feels assembled rather than dumped.
- **Button physics**: 0.955 scale on press with a spring curve, ripple from the
  touch point on primary actions.
- **Skeleton loaders** replace the spinner on Team, Assign, Feedback, Stats.
- **Drawer items** stagger in; modal sheets spring up.
- **Bell shake** when the unread count rises.
- All of it disabled under `prefers-reduced-motion`.

## 51. Notification bell in the header
Sits next to the profile picture with a live unread badge, so alerts are one
tap away instead of buried in the drawer.

## 52. Dashboard rebuilt
Greeting with time of day and avatar; a status strip that says whether you've
answered and how many days until the service (with a pulsing dot when you
haven't); a duty card showing area, arrival, supervisor and the leader's
message; an academy progress ring; four quick actions with an alert count; and
the stats strip. The duty now reads from Supabase, not just the local copy.

Also added a **Change my answer** button to the poll — previously, once you had
answered there was no way to change it from the dashboard.

## 53. "Using the App" guide tab
Eight chapters written for volunteers, not developers: signing in and password
resets, editing your profile, answering the poll, duties and alerts, the
Academy, reporting problems, installing to the home screen, and a leaders'
section. It's the first tab in the Guide.

## 54. Guide search now matches words in any order
`JSON.stringify(...).includes(query)` needed one contiguous substring, so
"forgot password" returned nothing even though a chapter says "I forgot my
password". Now every word must appear, in any order.

# v19 — poll lifecycle & event poll results

Run `supabase-v19.sql`.

## 55. The serving poll had no lifecycle
It opened the moment it was created, never closed, and nothing rolled it over
to the next week. The "Thursday 21:00" deadline in the seed text was
decorative — nothing enforced it.

`serving_request` now has `opens_at` and `closes_at`, defaulting to **Tuesday
00:00 → Friday 21:00** relative to the service date. Three states:

| State | Member sees |
|---|---|
| upcoming | "The poll hasn't opened yet · Opens Tuesday", no buttons |
| open | Normal answer buttons |
| closed | "The poll has closed", buttons still shown |

Late answers are deliberately still accepted — better that a leader learns
someone can come than that the app refuses to listen — but the card says the
poll closed and to tell the leader directly, so nobody assumes it was counted
in planning.

## 56. The poll rolls forward on its own
`ensure_serving_request()` creates the row for a given Sunday if missing.
`MOHData.currentRequest()` calls it before reading, so the poll always exists
without a cron job. A pg_cron alternative is included, commented, for anyone
who wants it created on a timer regardless of app usage.

## 57. Event poll results — the missing half
A ministry leader could send a poll and **had no way to see the answers**.
`announcementTally()` existed in the data layer and was never surfaced.

New **Poll Results** view for leaders: pick any poll you sent, see a tally bar
per option, then the respondents **grouped by AM and PM service** — which is
what an event needs, since both services staff it. Filter to one answer to see
exactly who said it, with their comments.

## 58. Building an event team
From the results, tap **Assign** next to anyone who said yes. It writes a
`duty_assignment` dated to the **event date** rather than a Sunday, so an event
roster is just duties on a different day and everything downstream already
understands it. Setting an event date on a poll is what enables this.

Verified: 3 replies of 4 asked, tally 2/1/0, split AM (1) and PM (2), filtering
to "Yes I can serve" narrows to Thabo (AM) and Naledi (PM), and assigning opens
"Duty for Wednesday, 05 August" with all 50 duties available.
