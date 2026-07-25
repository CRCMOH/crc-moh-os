# Notifications — what works, and what needs a server

## What works now

**In-app, live.** A Supabase realtime subscription on `announcement` fires the
moment a leader posts. The badge updates, the Alerts view refreshes, and an
OS-level notification is raised via `MOHData.notify()`.

Audience filtering is applied before notifying, so a group leader's notice only
reaches their group, and you are never notified about your own post.

**This covers the common case**: someone with the PWA open or backgrounded but
not killed.

## What does NOT work

**Notifications when the app is fully closed.** That is *web push*, and it
needs three things this app does not have:

1. A **VAPID key pair**.
2. A **push subscription** stored per device (`PushSubscription` from
   `registration.pushManager.subscribe()`).
3. A **server** that calls the browser's push service when something happens.
   It cannot be done from the client — the whole point is that the client is
   not running.

`sw.js` already has the `push` and `notificationclick` handlers, so the last
mile is the server.

## How to finish it (Supabase Edge Function)

1. Generate VAPID keys: `npx web-push generate-vapid-keys`
2. Store the public key in the client, the private key as a Supabase secret.
3. Add a table:

```sql
create table if not exists public.push_subscription (
  user_id    bigint references public.user_info(user_id) on delete cascade,
  endpoint   text primary key,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz default now()
);
```

4. On the client, after notification permission is granted:

```js
const reg = await navigator.serviceWorker.ready;
const sub = await reg.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: VAPID_PUBLIC_KEY,
});
await supabaseClient.from('push_subscription').upsert({
  user_id: currentUser.id,
  endpoint: sub.endpoint,
  p256dh: btoa(String.fromCharCode(...new Uint8Array(sub.getKey('p256dh')))),
  auth:   btoa(String.fromCharCode(...new Uint8Array(sub.getKey('auth')))),
});
```

5. Create an Edge Function triggered by a database webhook on `announcement`
   insert. It resolves the audience to a list of `user_id`s, loads their
   subscriptions, and sends a web-push message to each.

Roughly an afternoon's work. Worth doing before you rely on polls for anything
time-sensitive — right now, if nobody opens the app, nobody sees the poll.

## Note on iOS

Safari only delivers web push to a PWA that has been **added to the home
screen**, and only from a real HTTPS origin. Test on a device once you are
deployed, not on localhost.
