/*
  CRC MOH OS Connection Bridge
  This file connects the standalone pages to the same onboarding/session/data layer.
  It mirrors user + operational collections across the older keys and the v2 API keys.
*/
(function () {
  const USER_KEYS = [
    "currentUser",
    "crc_moh_current_user",
    "crc_moh_user",
    "crc_moh_user_v2"
  ];

  const USER_LIST_KEYS = [
    "moh_users",
    "mohUsers",
    "crc_moh_users",
    "crc_moh_users_v2"
  ];

  const COLLECTION_SETS = [
    ["mohResponses", "crc_moh_responses", "crc_moh_responses_v2"],
    ["mohAssignments", "crc_moh_assignments", "crc_moh_assignments_v2"],
    ["mohAlerts", "crc_moh_alerts", "crc_moh_alerts_v2"],
    ["mohFeedback", "crc_moh_feedback", "crc_moh_feedback_v2"],
    ["mohRequests", "crc_moh_requests", "crc_moh_requests_v2"]
  ];

  function safeParse(raw, fallback) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function get(key, fallback = null) {
    return safeParse(localStorage.getItem(key), fallback);
  }

  function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  function uniqueById(arr) {
    const map = new Map();
    (arr || []).forEach(item => {
      if (!item) return;
      const id = item.id || item.phone || JSON.stringify(item);
      map.set(id, { ...map.get(id), ...item });
    });
    return Array.from(map.values());
  }

  function normalizeGroupId(groupId) {
    if (!groupId) return groupId;
    return String(groupId)
      .replace(/^UAM/, "AMU")
      .replace(/^UPM/, "PMU")
      .replace(/^HAM/, "AMH")
      .replace(/^HPM/, "PMH");
  }

  function normalizeUser(user) {
    if (!user) return user;
    const groupId = normalizeGroupId(user.groupId || user.group || "");
    const primaryService = user.primaryService || user.service || (groupId.startsWith("PM") ? "PM" : "AM");
    const division = user.division || (groupId.includes("H") ? "hostess" : "usher");
    const role = user.role || "volunteer";
    const roleLevels = { trainee: 1, volunteer: 2, group_leader: 3, area_leader: 4, service_leader: 5, ministry_leader: 6, pastor: 7 };
    const academy = user.academy || {
      track: division,
      progress: user.academyProgress || 0,
      completedModules: [],
      moduleScores: {},
      finalExamScore: user.academyScore || null,
      status: user.academyStatus || (role === "trainee" ? "in_progress" : "not_required")
    };
    return {
      ...user,
      id: user.id || ("user_" + (user.phone || Date.now())),
      name: user.name || user.firstName || "MOH",
      surname: user.surname || "",
      groupId,
      group: groupId,
      primaryService,
      service: primaryService,
      division,
      role,
      clearanceLevel: user.clearanceLevel || roleLevels[role] || 1,
      academy,
      academyProgress: academy.progress ?? user.academyProgress ?? 0,
      academyStatus: user.academyStatus ?? academy.status ?? "in_progress",
      academyScore: academy.finalExamScore ?? user.academyScore ?? 0,
      servicesLogged: user.servicesLogged || 0
    };
  }

  function getCurrentUser() {
    for (const key of USER_KEYS) {
      const user = get(key);
      if (user) return normalizeUser(user);
    }
    const sessionPhone = localStorage.getItem("moh_user_session");
    if (sessionPhone) {
      const users = getUsers();
      return normalizeUser(users.find(u => u.phone === sessionPhone));
    }
    return null;
  }

  function getUsers() {
    let all = [];
    USER_LIST_KEYS.forEach(key => {
      const value = get(key, []);
      if (Array.isArray(value)) all = all.concat(value);
    });
    const current = getCurrentUserNoRecursion();
    if (current) all.push(current);
    return uniqueById(all.map(normalizeUser));
  }

  function getCurrentUserNoRecursion() {
    for (const key of USER_KEYS) {
      const user = safeParse(localStorage.getItem(key), null);
      if (user) return normalizeUser(user);
    }
    return null;
  }

  function syncUser(user) {
    const normalized = normalizeUser(user || getCurrentUser());
    if (!normalized) return null;

    USER_KEYS.forEach(key => set(key, normalized));
    if (normalized.phone) localStorage.setItem("moh_user_session", normalized.phone);

    const users = uniqueById([...getUsers(), normalized]).map(normalizeUser);
    USER_LIST_KEYS.forEach(key => set(key, users));

    return normalized;
  }

  function syncCollections() {
    COLLECTION_SETS.forEach(keys => {
      let combined = [];
      keys.forEach(key => {
        const value = get(key, []);
        if (Array.isArray(value)) combined = combined.concat(value);
      });
      combined = uniqueById(combined);
      keys.forEach(key => set(key, combined));
    });
  }

  function syncAll() {
    const user = getCurrentUser();
    if (user) syncUser(user);
    syncCollections();
  }

  window.MOHBridge = {
    syncUser,
    syncCollections,
    syncAll,
    normalizeUser,
    getCurrentUser,
    getUsers
  };

  syncAll();
  window.addEventListener("storage", syncAll);
})();

(function patchApiAfterBridge(){
  if (!window.Api) return;
  const wrapNames = ["saveCurrentUser","createUser","loginUser","submitResponse","assignDuty","createAlert","submitFeedback","saveAcademyState","updateUser","reset"];
  wrapNames.forEach(function(name){
    if (typeof Api[name] !== "function" || Api[name].__moh_patched) return;
    const original = Api[name].bind(Api);
    const patched = async function(){
      const result = await original.apply(null, arguments);
      if (result && (result.role || result.phone)) MOHBridge.syncUser(result);
      MOHBridge.syncCollections();
      return result;
    };
    patched.__moh_patched = true;
    Api[name] = patched;
  });
})();
