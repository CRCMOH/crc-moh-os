import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

webpush.setVapidDetails(
  "mailto:you@crcpotch.co.za",
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

// Resolve an announcement's audience to a list of user_ids.
async function audienceUserIds(a: any): Promise<number[]> {
  let q = supabase.from("user_info").select("user_id");
  if (a.audience_type === "division") q = q.eq("division", a.audience_value);
  else if (a.audience_type === "service") q = q.eq("primary_service", a.audience_value);
  else if (a.audience_type === "group") q = q.eq("group_id", a.audience_value);
  else if (a.audience_type === "area_teams")
    q = q.in("group_id", String(a.audience_value || "").split(","));
  // 'all' → no filter

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((r: any) => r.user_id).filter((id) => id !== a.created_by);
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const a = body.record ?? body;           // webhook sends { record: {...} }
    if (!a?.title) return new Response("no record", { status: 400 });

    const ids = await audienceUserIds(a);
    if (!ids.length) return new Response(JSON.stringify({ sent: 0 }), { status: 200 });

    const { data: subs } = await supabase
      .from("push_subscription")
      .select("*")
      .in("user_id", ids);

    const payload = JSON.stringify({
      title: a.kind === "poll" ? `Poll: ${a.title}` : a.title,
      body: a.body ?? "Open MOH OS to read it.",
      url: "/index.html#alerts",
    });

    let sent = 0;
    const dead: string[] = [];

    await Promise.all(
      (subs ?? []).map(async (s: any) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload,
          );
          sent++;
        } catch (err: any) {
          // 404/410 = the browser threw the subscription away. Clean it up.
          if (err?.statusCode === 404 || err?.statusCode === 410) dead.push(s.endpoint);
          else console.error("push failed:", err?.statusCode, err?.body);
        }
      }),
    );

    if (dead.length)
      await supabase.from("push_subscription").delete().in("endpoint", dead);

    return new Response(JSON.stringify({ sent, cleaned: dead.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(String(err), { status: 500 });
  }
});