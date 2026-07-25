# Supabase Query Guide — CRC MOH OS

Your own reference for writing new Supabase queries (service leader features, and
anything else going forward) without needing to ask each time.

---

## 1. Where the connection lives

Your Supabase client is created once, near the top of `index.html`, in a
`<script type="module">` block (search for `Supabase connection start`). It's
attached to `window.supabaseClient`, so **every other script on the page can use it**
just by writing `window.supabaseClient` (or `supabaseClient` if you're inside another
`type="module"` script — but your app's other scripts are NOT modules, so always use
`window.supabaseClient` to be safe).

You never need to create the client again. Just call it.

---

## 2. Where to put new code in `index.html`

Your app has **two big JavaScript objects** — know which one you're editing:

- **`App`** (starts ~line 1549) — handles sign up, sign in, session/login state.
- **`DashGuide`** (starts ~line 2044) — handles everything AFTER login: dashboard,
  Academy/quizzes, and holds `this.user` (the currently logged-in person).

**Rule of thumb:** if your new feature needs to know *who's logged in*
(`this.user.id`, `this.user.role`, etc.), it almost certainly belongs as a method
inside `DashGuide`, not `App`. That's the mistake that caused the
`saveScoreToSupabase is not a function` bug earlier — I'd put a function on the wrong
object.

**How to add a new function**, e.g. for a service-leader feature:

```js
const DashGuide = {
  user: null,

  // ... existing methods ...

  async myNewFeature() {
    const { data, error } = await window.supabaseClient
      .from("some_table")
      .select("*")
      .eq("user_id", this.user.id);

    if (error) {
      console.error("myNewFeature failed:", error);
      return;
    }
    console.log(data);
  },

  // ... more existing methods ...
};
```

Just add a comma after the previous method's closing `},` and paste your new method
in — same pattern as everything else in that object.

---

## 3. Your real table + column names (reference)

Copy-paste these exactly — typos in column names are the #1 cause of silent failures.

**`user_info`**
`user_id` (auto, PK) · `name` · `surname` · `phone` (unique) · `username` ·
`password` · `birthday` · `role` · `division` · `group_id` · `clearance_level` ·
`services_logged` · `academy_progress` · `academy_status` · `avatar_url` ·
`started_date` · `last_log` · `created_at`

**`feedback`**
`feedback_id` (auto, PK) · `user_id` (FK → user_info) · `category` · `title` ·
`location` · `urgency_level` · `description` · `is_resolved` · `date_time_logged`

**`score_type`**
`score_type_id` (PK, text, e.g. `"module_1"`) · `description`

**`score`**
`score_id` (auto, PK) · `user_id` (FK → user_info) · `score_type_id` (FK → score_type)
· `score` · `date_time_logged`

**`seating`**
`seating_id` (PK, text) · `date` · `service` · `hou`

**`seating_names`**
`seating_name_id` (auto, PK) · `user_id` (FK → user_info) · `seating_id` (FK → seating)
· `seat`

Not sure if this is still 100% accurate? Run this in SQL Editor any time to double-check:
```sql
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position;
```

---

## 4. Query templates

### SELECT (read)
```js
// All rows
const { data, error } = await window.supabaseClient
  .from("table_name")
  .select("*");

// Specific columns only
.select("column_one, column_two")

// Filtered (WHERE column = value)
.select("*").eq("role", "Leader")

// Multiple filters (AND)
.select("*").eq("role", "Leader").eq("division", "PM")

// Sort + limit
.select("*").order("created_at", { ascending: false }).limit(10)

// Get exactly one row (errors if 0 or 2+ matches)
.select("*").eq("user_id", 5).single()

// Get one row OR null (doesn't error if none found — usually what you want)
.select("*").eq("user_id", 5).maybeSingle()
```

### INSERT (create)
```js
const { data, error } = await window.supabaseClient
  .from("table_name")
  .insert({ column_one: "value", column_two: 123 })
  .select()   // gives you back the row that was created, including auto-generated IDs
  .single();
```

### UPDATE
```js
const { data, error } = await window.supabaseClient
  .from("table_name")
  .update({ column_one: "new value" })
  .eq("primary_key_column", someId)   // ALWAYS filter, or it updates every row
  .select();
```

### DELETE
```js
const { error } = await window.supabaseClient
  .from("table_name")
  .delete()
  .eq("primary_key_column", someId);  // ALWAYS filter, or it deletes every row
```

### Every query — the pattern to always follow
```js
const { data, error } = await window.supabaseClient. /* ...query... */;

if (error) {
  console.error("Description of what failed:", error);
  return; // don't continue as if it worked
}

// use `data` here
```

---

## 5. Filter reference (beyond `.eq`)

| Method | Meaning |
|---|---|
| `.eq("col", val)` | equals |
| `.neq("col", val)` | not equals |
| `.gt` / `.gte` | greater than / or equal |
| `.lt` / `.lte` | less than / or equal |
| `.like("col", "%text%")` | contains text (case-sensitive) |
| `.ilike("col", "%text%")` | contains text (case-insensitive) |
| `.in("col", [1,2,3])` | matches any value in the list |
| `.is("col", null)` | IS NULL check |

Chain as many as you want: `.eq("role", "Leader").gte("clearance_level", 3)`

---

## 6. Before you ship a new query — checklist

1. **Column names correct?** Cross-check against section 3, or re-run the schema
   query.
2. **RLS policy exists for this action on this table?** If your INSERT/UPDATE/DELETE
   silently does nothing (no error, but nothing shows up in Table Editor), this is
   almost always why. Check with:
   ```sql
   select tablename, policyname, cmd, roles
   from pg_policies
   where schemaname = 'public'
   order by tablename;
   ```
   Every table you query needs a policy matching the operation (`SELECT`, `INSERT`,
   `UPDATE`, `DELETE`) and role (`anon`, since this app doesn't use real auth yet).
3. **Tested with DevTools console open?** Every `error` gets logged there — always
   check before assuming something silently worked.
4. **Foreign keys valid?** e.g. if inserting into `score`, the `user_id` you're
   sending must be a real `user_id` that exists in `user_info` — an old/fake id will
   fail.

---

## 7. Quick way to test a brand-new query without wiring up UI yet

Paste this in the browser console (F12) while your site is open — it uses the same
live connection as your app:

```js
const { data, error } = await window.supabaseClient
  .from("table_name")
  .select("*")
  .limit(5);
console.log({ data, error });
```

This lets you sanity-check a query works before you build a whole feature around it.

---

## Reminder: security

Every table here is currently wide open (`anon` can read/write everything) so the
app works without real login. That's fine for testing, but before real public
launch, revisit RLS policies to restrict writes to "your own row only" — that
requires moving to Supabase Auth first, which is a separate, bigger step.
