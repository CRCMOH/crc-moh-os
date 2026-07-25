/* ============================================================================
   CRC MOH OS — SHARED DATA LAYER  (moh-data.js)

   WHY THIS EXISTS
   Before this file, every leadership view read its roster from
   localStorage("moh_users"). localStorage is per-device, so a group leader
   only ever saw people who had signed in on that leader's own phone —
   in practice, just themselves. Leaders could not see who was serving.

   This layer reads the roster from Supabase `user_info` and serving status
   from `serving_stats`, scoped by the viewer's role, and falls back to the
   local cache when offline so nothing hard-fails.

   Every method returns { data, source, error } so the UI can honestly show
   "live" vs "cached" vs "offline".
   ==========================================================================*/
(function () {
  const LOCAL_USERS = "moh_users";
  const CACHE_PREFIX = "moh_cache_";
  const CACHE_TTL_MS = 5 * 60 * 1000;

  function sb() {
    return typeof window !== "undefined" && window.supabaseClient
      ? window.supabaseClient
      : null;
  }

  function readLocal(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function cacheGet(name) {
    const box = readLocal(CACHE_PREFIX + name, null);
    if (!box || typeof box.at !== "number") return null;
    return { value: box.value, stale: Date.now() - box.at > CACHE_TTL_MS };
  }

  function cacheSet(name, value) {
    try {
      localStorage.setItem(
        CACHE_PREFIX + name,
        JSON.stringify({ at: Date.now(), value }),
      );
    } catch {
      /* quota — non-fatal */
    }
  }

  /* ---------------------------------------------------------------- shapes */
  // Supabase row -> the camelCase shape the rest of the app already expects.
  function rowToUser(r) {
    return {
      id: r.user_id,
      name: r.name,
      surname: r.surname,
      phone: r.phone,
      birthday: r.birthday,
      division: r.division,
      // There is no separate primary_service column; service is encoded in the
      // group id (AMU1 / PMH2 ...). Derive it, and fall back to division.
      primaryService: deriveService(r.group_id) || r.primary_service || null,
      groupId: r.group_id,
      areaName: r.area_name || null,
      areaTeams: Array.isArray(r.area_teams) ? r.area_teams : [],
      role: r.role,
      profileImage: r.avatar_url,
      clearanceLevel: r.clearance_level,
      servicesLogged: r.services_logged,
      academyProgress: r.academy_progress,
      academyStatus: r.academy_status,
      lastLog: r.last_log,
    };
  }

  // academyStatus arrives as "Certified" from Supabase but as "certified"
  // from the internal academy object, so compare case-insensitively.
  function isCertified(u) {
    const a = String(u.academyStatus || "").toLowerCase();
    const b = String((u.academy && u.academy.status) || "").toLowerCase();
    return a === "certified" || b === "certified";
  }

  function deriveService(groupId) {
    if (!groupId) return null;
    const g = String(groupId).toUpperCase();
    if (g.startsWith("AM")) return "AM";
    if (g.startsWith("PM")) return "PM";
    return null;
  }

  /* ------------------------------------------------------------ role scope */
  // Who is this viewer allowed to see? Mirrors the ministry structure:
  // group leader -> their group; area leader -> their area (or division+service
  // if no area recorded); service leader -> their whole service; ministry
  // leader -> their division; pastor -> everyone.
  function scopeFilter(viewer) {
    const role = viewer && viewer.role;
    switch (role) {
      case "pastor":
        return { kind: "all" };
      case "ministry_leader":
        return { kind: "division", division: viewer.division };
      case "service_leader":
        return { kind: "service", service: viewer.primaryService };
      case "area_leader":
        return {
          kind: "area",
          division: viewer.division,
          service: viewer.primaryService,
          area: viewer.areaName || null,
          teams: Array.isArray(viewer.areaTeams) ? viewer.areaTeams : [],
        };
      case "group_leader":
        return { kind: "group", groupId: viewer.groupId };
      default:
        return { kind: "self", id: viewer && viewer.id };
    }
  }

  function matchesScope(user, scope) {
    switch (scope.kind) {
      case "all":
        return true;
      case "division":
        return user.division === scope.division;
      case "service":
        return user.primaryService === scope.service;
      case "area":
        // An area leader owns specific GROUPS. Fall back to division+service
        // only while no teams have been recorded for them.
        if (scope.teams && scope.teams.length)
          return scope.teams.includes(user.groupId);
        if (scope.area && user.areaName) return user.areaName === scope.area;
        return (
          user.division === scope.division &&
          user.primaryService === scope.service
        );
      case "group":
        return user.groupId === scope.groupId;
      case "self":
        return user.id === scope.id;
      default:
        return false;
    }
  }

  function scopeLabel(viewer) {
    const s = scopeFilter(viewer);
    switch (s.kind) {
      case "all":
        return "Whole ministry";
      case "division":
        return `${cap(s.division)} division`;
      case "service":
        return `${s.service || "—"} service`;
      case "area":
        if (s.teams && s.teams.length)
          return `${s.teams.length} team${s.teams.length === 1 ? "" : "s"}: ${s.teams.join(", ")}`;
        return s.area ? `Area ${s.area}` : `${cap(s.division)} · ${s.service || "—"}`;
      case "group":
        return `Group ${s.groupId || "—"}`;
      default:
        return "Your own record";
    }
  }

  function cap(v) {
    if (!v) return "—";
    return String(v)[0].toUpperCase() + String(v).slice(1);
  }

  /* -------------------------------------------------------------- roster */
  async function roster(viewer) {
    const scope = scopeFilter(viewer);
    const client = sb();

    if (client) {
      try {
        let q = client.from("user_info").select("*");
        // Narrow server-side where we safely can; the rest is filtered below.
        if (scope.kind === "group" && scope.groupId)
          q = q.eq("group_id", scope.groupId);
        else if (scope.kind === "division" && scope.division)
          q = q.eq("division", scope.division);
        else if (scope.kind === "self" && scope.id)
          q = q.eq("user_id", scope.id);

        const { data, error } = await q;
        if (error) throw error;

        const users = (data || []).map(rowToUser).filter((u) => matchesScope(u, scope));
        users.sort((a, b) =>
          `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`),
        );
        cacheSet("roster_" + (viewer.id || "x"), users);
        return { data: users, source: "live", error: null };
      } catch (error) {
        console.error("Roster fetch failed, falling back to cache:", error);
        const cached = cacheGet("roster_" + (viewer.id || "x"));
        if (cached)
          return { data: cached.value, source: "cached", error };
        return {
          data: localRoster(scope),
          source: "local",
          error,
        };
      }
    }

    const cached = cacheGet("roster_" + (viewer.id || "x"));
    if (cached) return { data: cached.value, source: "cached", error: null };
    return { data: localRoster(scope), source: "local", error: null };
  }

  function localRoster(scope) {
    return readLocal(LOCAL_USERS, []).filter((u) => matchesScope(u, scope));
  }

  /* ------------------------------------------------------- serving status */
  // serving_stats: user_id · service ('am'|'pm'|'both'|'none') · date
  async function serving(dateISO) {
    const date = dateISO || nextSundayISO();
    const client = sb();
    if (!client) {
      const cached = cacheGet("serving_" + date);
      return {
        data: cached ? cached.value : {},
        source: cached ? "cached" : "local",
        error: null,
        date,
      };
    }
    try {
      const { data, error } = await client
        .from("serving_stats")
        .select("user_id, service, date")
        .eq("date", date);
      if (error) throw error;
      const map = {};
      (data || []).forEach((r) => {
        map[r.user_id] = r.service;
      });
      cacheSet("serving_" + date, map);
      return { data: map, source: "live", error: null, date };
    } catch (error) {
      console.error("Serving status fetch failed:", error);
      const cached = cacheGet("serving_" + date);
      return {
        data: cached ? cached.value : {},
        source: cached ? "cached" : "offline",
        error,
        date,
      };
    }
  }

  function nextSundayISO() {
    const d = new Date();
    const day = d.getDay();
    d.setDate(d.getDate() + ((7 - day) % 7));
    return d.toISOString().slice(0, 10);
  }

  /* ------------------------------------------------ combined team overview */
  // The single call every leadership view should use.
  async function teamOverview(viewer, dateISO) {
    const [r, s] = await Promise.all([roster(viewer), serving(dateISO)]);

    const members = r.data.map((u) => ({
      ...u,
      serving: s.data[u.id] || null, // 'am' | 'pm' | 'both' | 'none' | null
    }));

    const counts = {
      total: members.length,
      am: members.filter((m) => m.serving === "am" || m.serving === "both").length,
      pm: members.filter((m) => m.serving === "pm" || m.serving === "both").length,
      both: members.filter((m) => m.serving === "both").length,
      notServing: members.filter((m) => m.serving === "none").length,
      noResponse: members.filter((m) => !m.serving).length,
      trainees: members.filter((m) => m.role === "trainee").length,
      certified: members.filter((m) => isCertified(m)).length,
    };
    counts.responded = counts.total - counts.noResponse;
    counts.responseRate = counts.total
      ? Math.round((counts.responded / counts.total) * 100)
      : 0;

    return {
      members,
      counts,
      date: s.date,
      scopeLabel: scopeLabel(viewer),
      source: r.source === "live" && s.source === "live" ? "live" : r.source,
      error: r.error || s.error || null,
    };
  }

  /* ------------------------------------------------------ duty assignments */
  // Uses the duty_assignment table when present; always mirrors locally so the
  // app still works if that table hasn't been created yet.
  const LOCAL_ASSIGN = "crc_moh_assignments_v2";

  async function assignments(dateISO) {
    const date = dateISO || nextSundayISO();
    const client = sb();
    const local = readLocal(LOCAL_ASSIGN, []);
    if (!client) return { data: local, source: "local", error: null, date };
    try {
      const { data, error } = await client
        .from("duty_assignment")
        .select("*")
        .eq("service_date", date);
      if (error) throw error;
      const mapped = (data || []).map((r) => ({
        id: r.assignment_id,
        assignedToUserId: r.user_id,
        dutyTitle: r.duty_title,
        dutyArea: r.duty_area,
        arrivalTime: r.arrival_time,
        supervisor: r.supervisor,
        note: r.note || null,
        groupId: r.group_id,
        serviceDate: r.service_date,
      }));
      return { data: mapped, source: "live", error: null, date };
    } catch (error) {
      // Table may not exist yet — that's expected until the SQL is run.
      console.warn("duty_assignment unavailable, using local copy:", error.message);
      return { data: local, source: "local", error, date };
    }
  }

  async function saveAssignment(a) {
    const local = readLocal(LOCAL_ASSIGN, []).filter(
      (x) =>
        !(
          x.assignedToUserId === a.assignedToUserId &&
          x.serviceDate === a.serviceDate
        ),
    );
    local.push(a);
    try {
      localStorage.setItem(LOCAL_ASSIGN, JSON.stringify(local));
    } catch {}

    const client = sb();
    if (!client) return { ok: false, offline: true, error: null };
    try {
      const { error } = await client.from("duty_assignment").upsert(
        {
          user_id: a.assignedToUserId,
          duty_title: a.dutyTitle,
          duty_area: a.dutyArea,
          arrival_time: a.arrivalTime,
          supervisor: a.supervisor,
          note: a.note || null,
          group_id: a.groupId,
          service_date: a.serviceDate,
          assigned_by: a.assignedByUserId,
        },
        { onConflict: "user_id,service_date" },
      );
      if (error) throw error;
      return { ok: true, offline: false, error: null };
    } catch (error) {
      console.error("Saving duty assignment failed:", error);
      return { ok: false, offline: false, error };
    }
  }

  /* ------------------------------------------------------------- feedback */
  async function feedback(viewer) {
    const client = sb();
    if (!client) return { data: [], source: "offline", error: null };
    try {
      const { data, error } = await client
        .from("feedback")
        .select("*")
        .order("date_time_logged", { ascending: false });
      if (error) throw error;

      // Non-leaders only ever see their own submissions.
      const isLeader = (viewer.clearanceLevel || 0) >= 3;
      const rows = isLeader
        ? data || []
        : (data || []).filter((f) => f.user_id === viewer.id);

      cacheSet("feedback_" + (viewer.id || "x"), rows);
      return { data: rows, source: "live", error: null };
    } catch (error) {
      console.error("Feedback fetch failed:", error);
      const cached = cacheGet("feedback_" + (viewer.id || "x"));
      return {
        data: cached ? cached.value : [],
        source: cached ? "cached" : "offline",
        error,
      };
    }
  }

  /* -------------------------------------------------------- serving poll */
  // The poll used to be a hardcoded record in data.js dated 2026-06-14, and
  // nothing could create a new one. Responses were written against that stale
  // date while leaders read the upcoming Sunday, so every member permanently
  // showed as "no reply". The poll is now a real dated row.
  // The poll has a window: opens Tuesday, closes Friday 21:00. Returns the
  // request plus a state so the UI can say "opens Tuesday" / "closes Friday" /
  // "closed" rather than silently accepting answers forever.
  function pollWindow(req) {
    if (!req) return { state: "none" };
    const now = Date.now();
    const opens = req.opens_at ? new Date(req.opens_at).getTime() : null;
    const closes = req.closes_at ? new Date(req.closes_at).getTime() : null;

    if (req.status === "closed") return { state: "closed", opens, closes };
    if (opens && now < opens) return { state: "upcoming", opens, closes };
    if (closes && now > closes) return { state: "closed", opens, closes, late: true };
    return { state: "open", opens, closes };
  }

  async function currentRequest() {
    const date = nextSundayISO();
    const client = sb();
    if (!client) {
      const req = {
        request_id: null,
        title: "Sunday Service",
        service_date: date,
        message:
          "Please confirm availability for this Sunday. Choose AM, PM, Both or Not Serving.",
        status: "open",
        opens_at: null,
        closes_at: null,
      };
      return { data: req, window: pollWindow(req), source: "local", error: null };
    }
    try {
      // Make sure the row exists before reading it, so the poll rolls forward
      // on its own without a cron job.
      try {
        await client.rpc("ensure_serving_request");
      } catch (e) {
        /* function may not exist yet — fall through to the read */
      }

      const { data, error } = await client
        .from("serving_request")
        .select("*")
        .eq("service_date", date)
        .order("request_id", { ascending: false })
        .limit(1);
      if (error) throw error;
      const req = data && data.length ? data[0] : null;
      return { data: req, window: pollWindow(req), source: "live", error: null };
    } catch (error) {
      console.error("Loading serving request failed:", error);
      return { data: null, window: { state: "none" }, source: "offline", error };
    }
  }

  async function createRequest(viewer, opts = {}) {
    const client = sb();
    if (!client) return { ok: false, error: new Error("offline") };
    const date = opts.serviceDate || nextSundayISO();
    try {
      const { error } = await client.from("serving_request").upsert(
        {
          title: opts.title || "Sunday Service",
          service_date: date,
          message:
            opts.message ||
            "Please confirm availability for this Sunday. Choose AM, PM, Both or Not Serving.",
          status: "open",
          division: opts.division || null,
          created_by: viewer.id,
        },
        { onConflict: "service_date,division" },
      );
      if (error) throw error;
      return { ok: true, error: null, date };
    } catch (error) {
      console.error("Creating serving request failed:", error);
      return { ok: false, error };
    }
  }

  /* --------------------------------------------------------- history/stats */
  function sundaysBack(n) {
    const out = [];
    const d = new Date();
    d.setDate(d.getDate() + ((7 - d.getDay()) % 7)); // upcoming Sunday
    for (let i = 0; i < n; i++) {
      out.push(d.toISOString().slice(0, 10));
      d.setDate(d.getDate() - 7);
    }
    return out;
  }

  // Serving counts for the last `weeks` Sundays, limited to the viewer's scope.
  async function servingHistory(viewer, weeks = 4) {
    const dates = sundaysBack(weeks);
    const r = await roster(viewer);
    const ids = new Set(r.data.map((u) => u.id));
    const client = sb();

    if (!client)
      return {
        weeks: dates.map((d) => ({ date: d, am: 0, pm: 0, both: 0, none: 0, total: 0 })),
        source: "offline",
        roster: r.data,
      };

    try {
      const { data, error } = await client
        .from("serving_stats")
        .select("user_id, service, date")
        .in("date", dates);
      if (error) throw error;

      const rows = (data || []).filter((x) => ids.has(x.user_id));
      const weeksOut = dates.map((d) => {
        const forDate = rows.filter((x) => x.date === d);
        const c = (v) => forDate.filter((x) => x.service === v).length;
        const am = c("am"), pm = c("pm"), both = c("both"), none = c("none");
        return {
          date: d,
          am: am + both,
          pm: pm + both,
          both,
          none,
          responded: forDate.length,
          total: ids.size,
        };
      });
      return { weeks: weeksOut, source: "live", roster: r.data };
    } catch (error) {
      console.error("Serving history failed:", error);
      return {
        weeks: dates.map((d) => ({ date: d, am: 0, pm: 0, both: 0, none: 0, total: 0 })),
        source: "offline",
        roster: r.data,
        error,
      };
    }
  }

  /* ================= AREA ASSIGNMENT CHAIN =================
     Service leader assigns GROUP -> AREA for a date.
     The group leader may then only hand out duties from that area.
     ========================================================= */
  async function groupAreas(dateISO) {
    const date = dateISO || nextSundayISO();
    const client = sb();
    if (!client) return { data: {}, source: "offline", date };
    try {
      const { data, error } = await client
        .from("group_area_assignment")
        .select("*")
        .eq("service_date", date);
      if (error) throw error;
      const map = {};
      (data || []).forEach((r) => (map[r.group_id] = r.area_name));
      return { data: map, source: "live", date };
    } catch (error) {
      console.error("Loading group areas failed:", error);
      return { data: {}, source: "offline", date, error };
    }
  }

  async function setGroupArea(viewer, groupId, areaName, dateISO) {
    const client = sb();
    if (!client) return { ok: false, error: new Error("offline") };
    const date = dateISO || nextSundayISO();
    try {
      const { error } = await client.from("group_area_assignment").upsert(
        {
          group_id: groupId,
          area_name: areaName,
          service_date: date,
          division: viewer.division || null,
          service: viewer.primaryService || null,
          assigned_by: viewer.id,
        },
        { onConflict: "group_id,service_date" },
      );
      if (error) throw error;
      return { ok: true, error: null };
    } catch (error) {
      console.error("Setting group area failed:", error);
      return { ok: false, error };
    }
  }

  /* ================= PLACEMENTS ================= */
  async function placements(dateISO) {
    const date = dateISO || nextSundayISO();
    const client = sb();
    if (!client) return { data: {}, source: "offline", date };
    try {
      const { data, error } = await client
        .from("group_placement")
        .select("*")
        .eq("service_date", date);
      if (error) throw error;
      const map = {};
      (data || []).forEach((r) => (map[r.user_id] = r));
      return { data: map, source: "live", date };
    } catch (error) {
      console.error("Loading placements failed:", error);
      return { data: {}, source: "offline", date, error };
    }
  }

  async function placeMember(viewer, userId, groupId, reason, dateISO) {
    const client = sb();
    if (!client) return { ok: false, error: new Error("offline") };
    try {
      const { error } = await client.from("group_placement").upsert(
        {
          user_id: userId,
          group_id: groupId,
          service_date: dateISO || nextSundayISO(),
          reason: reason || null,
          placed_by: viewer.id,
        },
        { onConflict: "user_id,service_date" },
      );
      if (error) throw error;
      return { ok: true, error: null };
    } catch (error) {
      console.error("Placing member failed:", error);
      return { ok: false, error };
    }
  }

  /* ================= ANNOUNCEMENTS & POLLS ================= */
  // What audiences may this person address? Never wider than their own scope.
  function allowedAudiences(viewer) {
    const lvl = viewer.clearanceLevel || 0;
    const out = [];
    if (lvl >= 7) out.push({ type: "all", value: null, label: "Whole ministry" });
    if (lvl >= 6)
      out.push({
        type: "division",
        value: viewer.division,
        label: `${cap(viewer.division)} division`,
      });
    if (lvl >= 5)
      out.push({
        type: "service",
        value: viewer.primaryService,
        label: `${viewer.primaryService} service`,
      });
    if (lvl >= 4 && (viewer.areaTeams || []).length)
      out.push({
        type: "area_teams",
        value: (viewer.areaTeams || []).join(","),
        label: `My teams (${(viewer.areaTeams || []).length})`,
      });
    if (lvl >= 3 && viewer.groupId)
      out.push({
        type: "group",
        value: viewer.groupId,
        label: `Group ${viewer.groupId}`,
      });
    return out;
  }

  function audienceMatches(a, user) {
    switch (a.audience_type) {
      case "all":
        return true;
      case "division":
        return user.division === a.audience_value;
      case "service":
        return user.primaryService === a.audience_value;
      case "area_teams":
        return String(a.audience_value || "")
          .split(",")
          .includes(user.groupId);
      case "group":
        return user.groupId === a.audience_value;
      default:
        return false;
    }
  }

  async function announcements(viewer) {
    const client = sb();
    if (!client) return { data: [], responses: {}, source: "offline" };
    try {
      const { data, error } = await client
        .from("announcement")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;

      const mine = (data || []).filter(
        (a) => audienceMatches(a, viewer) || a.created_by === viewer.id,
      );

      let responses = {};
      if (mine.length) {
        const { data: rs } = await client
          .from("announcement_response")
          .select("*")
          .eq("user_id", viewer.id);
        (rs || []).forEach((r) => (responses[r.announcement_id] = r));
      }
      return { data: mine, responses, source: "live" };
    } catch (error) {
      console.error("Loading announcements failed:", error);
      return { data: [], responses: {}, source: "offline", error };
    }
  }

  async function createAnnouncement(viewer, payload) {
    const client = sb();
    if (!client) return { ok: false, error: new Error("offline") };
    try {
      const { error } = await client.from("announcement").insert({
        kind: payload.kind || "announcement",
        title: payload.title,
        body: payload.body || null,
        poll_options: payload.options || [],
        audience_type: payload.audienceType,
        audience_value: payload.audienceValue,
        event_date: payload.eventDate || null,
        created_by: viewer.id,
        status: "open",
      });
      if (error) throw error;
      return { ok: true, error: null };
    } catch (error) {
      console.error("Creating announcement failed:", error);
      return { ok: false, error };
    }
  }

  async function respondToAnnouncement(viewer, announcementId, choice, comment) {
    const client = sb();
    if (!client) return { ok: false, error: new Error("offline") };
    try {
      const { error } = await client.from("announcement_response").upsert(
        {
          announcement_id: announcementId,
          user_id: viewer.id,
          choice,
          comment: comment || null,
        },
        { onConflict: "announcement_id,user_id" },
      );
      if (error) throw error;
      return { ok: true, error: null };
    } catch (error) {
      console.error("Responding failed:", error);
      return { ok: false, error };
    }
  }

  // Full results for the sender: who answered what, grouped so a ministry
  // leader can build a team across AM and PM.
  async function announcementResults(announcementId, viewer) {
    const client = sb();
    if (!client) return { rows: [], tally: {}, source: "offline" };
    try {
      const { data, error } = await client
        .from("announcement_response")
        .select("user_id, choice, comment, responded_at")
        .eq("announcement_id", announcementId);
      if (error) throw error;

      const r = await roster(viewer);
      const byId = {};
      r.data.forEach((u) => (byId[u.id] = u));

      const rows = (data || []).map((x) => {
        const u = byId[x.user_id] || {};
        return {
          userId: x.user_id,
          name: u.name || "Member",
          surname: u.surname || "",
          division: u.division || null,
          service: u.primaryService || null,
          groupId: u.groupId || null,
          role: u.role || null,
          choice: x.choice,
          comment: x.comment,
          at: x.responded_at,
        };
      });

      const tally = {};
      rows.forEach((x) => (tally[x.choice] = (tally[x.choice] || 0) + 1));

      return { rows, tally, source: "live", inScope: r.data.length };
    } catch (error) {
      console.error("Loading poll results failed:", error);
      return { rows: [], tally: {}, source: "offline", error };
    }
  }

  // Announcements this person SENT, so they can check the replies.
  async function myAnnouncements(viewer) {
    const client = sb();
    if (!client) return { data: [], source: "offline" };
    try {
      const { data, error } = await client
        .from("announcement")
        .select("*")
        .eq("created_by", viewer.id)
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return { data: data || [], source: "live" };
    } catch (error) {
      console.error("Loading sent announcements failed:", error);
      return { data: [], source: "offline", error };
    }
  }

  async function announcementTally(announcementId) {
    const client = sb();
    if (!client) return {};
    try {
      const { data, error } = await client
        .from("announcement_response")
        .select("choice")
        .eq("announcement_id", announcementId);
      if (error) throw error;
      const t = {};
      (data || []).forEach((r) => (t[r.choice] = (t[r.choice] || 0) + 1));
      return t;
    } catch {
      return {};
    }
  }

  /* ================= TRAINEE ROTATION ================= */
  // Which areas has each trainee already worked? Used to make sure they see
  // every area across their training weeks.
  async function traineeRotation(viewer, weeks = 3) {
    const r = await roster(viewer);
    const trainees = r.data.filter((u) => u.role === "trainee");
    const client = sb();
    const dates = sundaysBack(weeks + 1);

    if (!client || !trainees.length)
      return { trainees: trainees.map((t) => ({ ...t, history: [] })), source: "offline" };

    try {
      const { data, error } = await client
        .from("duty_assignment")
        .select("user_id, service_date, duty_area, duty_title")
        .in("service_date", dates);
      if (error) throw error;
      return {
        trainees: trainees.map((t) => ({
          ...t,
          history: (data || [])
            .filter((d) => d.user_id === t.id)
            .sort((a, b) => (a.service_date < b.service_date ? 1 : -1)),
        })),
        source: "live",
      };
    } catch (error) {
      console.error("Trainee rotation failed:", error);
      return {
        trainees: trainees.map((t) => ({ ...t, history: [] })),
        source: "offline",
        error,
      };
    }
  }

  /* ================= REALTIME =================
     One subscription per table, fanned out to registered callbacks, so
     several views can listen without opening duplicate sockets.
     ========================================================= */
  const _channels = {};
  const _listeners = {};

  function subscribe(table, cb) {
    const client = sb();
    if (!client || typeof client.channel !== "function") return () => {};

    _listeners[table] = _listeners[table] || [];
    _listeners[table].push(cb);

    if (!_channels[table]) {
      try {
        _channels[table] = client
          .channel("moh_" + table)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table },
            (payload) => {
              (_listeners[table] || []).forEach((fn) => {
                try {
                  fn(payload);
                } catch (err) {
                  console.error("Realtime listener failed:", err);
                }
              });
            },
          )
          .subscribe();
      } catch (err) {
        console.error("Realtime subscribe failed for " + table + ":", err);
      }
    }

    return () => {
      _listeners[table] = (_listeners[table] || []).filter((f) => f !== cb);
    };
  }

  // Subscribe to several tables with one callback, debounced so a burst of
  // changes triggers a single refresh rather than one per row.
  function onChange(tables, cb, waitMs = 400) {
    let t = null;
    const fire = (payload) => {
      clearTimeout(t);
      t = setTimeout(() => cb(payload), waitMs);
    };
    const offs = tables.map((tb) => subscribe(tb, fire));
    return () => offs.forEach((off) => off());
  }

  /* ============ LOCAL NOTIFICATIONS ============
     Real background web push needs a server (VAPID keys + a push service);
     see PUSH-NOTES.md. This raises an OS-level notification while the app is
     running, which covers the common case of someone with the PWA open.
     ============================================= */
  async function notify(title, body, url) {
    try {
      if (!("Notification" in window)) return false;
      if (Notification.permission === "denied") return false;
      if (Notification.permission !== "granted") {
        const p = await Notification.requestPermission();
        if (p !== "granted") return false;
      }
      // navigator.serviceWorker.ready never resolves when no worker is
      // registered (file://, first load, hard refresh), which would leave this
      // awaiting forever and silently drop the notification. Race it.
      let reg = null;
      if (navigator.serviceWorker) {
        reg = await Promise.race([
          navigator.serviceWorker.ready.catch(() => null),
          new Promise((r) => setTimeout(() => r(null), 800)),
        ]);
      }
      const opts = {
        body,
        icon: "./icon-192.png",
        badge: "./favicon-32.png",
        data: { url: url || "./index.html#alerts" },
        tag: "moh-" + (title || "").slice(0, 20),
      };
      if (reg && reg.showNotification) await reg.showNotification(title, opts);
      else new Notification(title, opts);
      return true;
    } catch (err) {
      console.error("Notification failed:", err);
      return false;
    }
  }

  /* ---------------------------------------------------------------- export */
  const api = {
    roster,
    serving,
    teamOverview,
    assignments,
    saveAssignment,
    feedback,
    scopeFilter,
    scopeLabel,
    matchesScope,
    nextSundayISO,
    deriveService,
    rowToUser,
    isCertified,
    currentRequest,
    createRequest,
    sundaysBack,
    servingHistory,
    groupAreas,
    setGroupArea,
    placements,
    placeMember,
    allowedAudiences,
    audienceMatches,
    announcements,
    createAnnouncement,
    respondToAnnouncement,
    announcementTally,
    announcementResults,
    myAnnouncements,
    pollWindow,
    traineeRotation,
    subscribe,
    onChange,
    notify,
  };
  window.MOHData = api;
})();
