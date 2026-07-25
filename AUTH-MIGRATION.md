# Moving CRC MOH OS to Supabase Auth

## 1. Is it free?

Yes, for what you are doing — with one important exception.

**Supabase free tier includes 50,000 monthly active users for Auth.** You have,
what, a few hundred people at most? You are nowhere near it. Free tier also
gives you 500MB database, 1GB file storage and 5GB bandwidth, which is far more
than this app needs.

The one free-tier catch: **a free project pauses after about a week with no
activity.** For a church app used every Sunday that will not happen, but if you
go quiet over December, you may have to un-pause it from the dashboard.

### The exception that changes the design: phone login is NOT free

Your app signs people in with a phone number. Supabase supports phone auth, but
it sends an SMS one-time-password, and **Supabase does not send SMS for you** —
you connect your own provider (Twilio, MessageBird, Vonage) and pay them per
message. In South Africa that is roughly R0.30–R0.60 per SMS. Every sign-in,
every password reset. For a few hundred volunteers that is a real monthly bill
for no real benefit.

### So: keep phone numbers, use email auth underneath

Supabase's email+password auth is free and unlimited on your tier. We keep the
phone number as what people type, and derive a stable internal email from it:

```
0821112222  ->  0821112222@crc-moh.local
```

Members never see this. They still type their phone number and password exactly
as they do now. You get real hashed passwords, real sessions, real RLS — at no
cost.

**The trade-off, stated plainly:** because `@crc-moh.local` is not a real
mailbox, there is no "forgot password" email. A leader has to reset it from the
Supabase dashboard (Authentication → Users → the person → Reset password). For
a church team that is workable. If you would rather have self-service resets,
collect real email addresses at sign-up instead and use those — that is the only
change needed, and everything else in this guide stays the same.

> Pricing and limits are from my knowledge as of mid-2026 and Supabase changes
> them from time to time. Confirm on supabase.com/pricing before you commit.

---

## 2. What the SQL file does

Run `supabase-full-setup.sql` in **SQL Editor → New query → Run**. It is
idempotent, so running it twice is safe. It creates:

| Table | Purpose |
|---|---|
| `user_info` | members, now with `auth_id` linking to the login |
| `score_type` / `score` | academy quiz and exam results |
| `feedback` | reports, now with `resolved_by` / `resolved_at` |
| `serving_request` | **new** — the weekly poll as a real dated record |
| `serving_stats` | who is serving on a given date |
| `duty_assignment` | duties, now shared instead of device-local |
| `notifications` | leader alerts |

Plus two storage buckets (`avatars` public-read, `feedback-photos` private),
RLS policies on everything, and a trigger that creates a member row
automatically whenever someone signs up.

### Two design decisions worth understanding

**We did not change `user_info.user_id` from bigint to uuid.** Every other
table has a foreign key pointing at it. Changing the primary key type would
mean rebuilding all of them and remapping every existing row — high risk, no
benefit. Instead there is a new `auth_id uuid` column linking to `auth.users`.
Your existing data is untouched.

**The helper functions are `SECURITY DEFINER` on purpose.** An RLS policy on
`user_info` that needs to check your role would have to SELECT from
`user_info` — which re-triggers the same policy, and Postgres throws
*"infinite recursion detected in policy"*. Running that lookup inside a
`SECURITY DEFINER` function bypasses RLS and breaks the loop. This is the
single most common thing that breaks Supabase RLS setups, and it is why
`me_id()`, `me_level()` and friends exist.

---

## 3. Client code changes

Three functions change. Everything else in the app keeps working, because
`user_info` keeps the same shape.

### 3a. Helper — phone to internal email

```js
const AUTH_DOMAIN = "crc-moh.local";
function phoneToEmail(phone) {
  return String(phone).replace(/[^0-9]/g, "") + "@" + AUTH_DOMAIN;
}
```

### 3b. Sign up

The trigger builds the `user_info` row from `options.data`, so the client no
longer inserts it directly.

```js
async handleSignUp(e) {
  e.preventDefault();
  // ...your existing validation stays exactly as it is...

  const { data, error } = await window.supabaseClient.auth.signUp({
    email: phoneToEmail(phoneInput),
    password: password,
    options: {
      data: {
        name, surname,
        phone: phoneInput,
        birthday: birthday || null,
        role: selectedRole,
        division: division || null,
        primary_service: primaryService || null,
        group_id: groupId || null,
        area_name: areaName || null,
      },
    },
  });

  if (error) {
    alert(
      error.message.includes("already registered")
        ? "That phone number is already registered. Sign in instead."
        : "Sign up failed: " + error.message
    );
    return;
  }

  // The trigger has created the member row — read it back.
  const { data: member } = await window.supabaseClient
    .from("user_info").select("*").eq("auth_id", data.user.id).single();

  this.startSession(member);
}
```

> In the dashboard, turn **Authentication → Providers → Email → Confirm email**
> **off**. With a `.local` address there is no inbox to confirm from, so leaving
> it on will block every sign-up.

### 3c. Sign in

```js
async handleSignIn(e) {
  e.preventDefault();
  const phone    = document.getElementById("signinPhone").value.trim();
  const password = document.getElementById("signinPassword").value;

  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email: phoneToEmail(phone),
    password,
  });

  if (error) {
    showSignInError("Incorrect phone number or password.");
    return;
  }

  const { data: member } = await window.supabaseClient
    .from("user_info").select("*").eq("auth_id", data.user.id).single();

  this.startSession(member);
}
```

### 3d. Session and sign out

Supabase now owns the session, so you stop hand-rolling one in localStorage.

```js
// On app start, replace checkActiveSession():
const { data: { session } } = await window.supabaseClient.auth.getSession();
if (session) {
  const { data: member } = await window.supabaseClient
    .from("user_info").select("*").eq("auth_id", session.user.id).single();
  if (member) { /* go to home screen with member */ }
}

// Logout:
await window.supabaseClient.auth.signOut();
```

### 3e. Avatar upload — path must change

The storage policy only lets you write inside your own uid folder.

```js
const { data: { user } } = await window.supabaseClient.auth.getUser();
const filePath = `${user.id}/${Date.now()}-${safeName}`;   // uid FIRST
await window.supabaseClient.storage.from("avatars").upload(filePath, file, { upsert: true });
```

### 3f. Delete the leadership PIN check

`LEADERSHIP_PINS` in `data.js` is five shared numeric PINs sitting in a file
anyone can read via View Source. It was doing nothing. Real roles plus RLS
replace it — remove it and the sign-in PIN field.

---

## 4. Migrating your existing members

Everyone already in `user_info` has `auth_id = null` and cannot sign in yet.
Pick one:

**Option A — everyone re-registers (simplest, recommended).**
The trigger's `on conflict (phone) do update set auth_id = excluded.auth_id`
means when someone signs up with a phone number that already exists, they get
**linked to their existing record** — academy scores, history, all of it. They
just set a new password. Nothing is lost.

**Option B — you create the logins for them.**
For a small team: Authentication → Users → Add user, using
`<phone>@crc-moh.local` and a temporary password, then hand them out. Tedious
past about twenty people.

Section 6c of the SQL lists everyone not yet linked. When it returns zero rows,
you are done — and only then run the final `drop column password` in section 7.

---

## 5. Order of operations

1. Run `supabase-full-setup.sql`.
2. Authentication → Providers → Email: **enabled**, **Confirm email off**.
3. Check Section 6a — every table should show `rowsecurity = true`.
4. Make the client changes in section 3.
5. Test with one throwaway account before telling anyone.
6. **Test that a group leader still sees their group** — RLS is where this
   breaks. If a leader suddenly sees nobody, it is almost always
   `can_see_member()` not matching because `primary_service` or `group_id` is
   null on those rows.
7. Roll out. Watch section 6c empty as people register.
8. Only then, drop the password column.

---

## 6. What this fixes

- Passwords become bcrypt hashes managed by Supabase, not plaintext in a table.
- Sign-in stops being `.eq("password", password)` — a query anyone could run
  against your anon key to dump every password in the ministry.
- RLS becomes real. Right now every policy is `anon` with `using (true)`:
  anyone with your anon key, which ships in the client and is readable by
  anyone, can read and write every table. After this, a trainee can read their
  own row and their leader's scope, and nothing else.
- Avatar uploads can no longer be overwritten by other members.
