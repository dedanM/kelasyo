/** Kelasyo data layer — localStorage by default */
(function (global) {
  const STORAGE_KEY = "kelasyo_db_v1";
  const DEFAULT_DB = {
    users: [
      { id: "u1", email: "toi@acme.com", full_name: "Toi", avatar_color: "#6366f1" },
      { id: "u2", email: "sara@acme.com", full_name: "Sara Martin", avatar_color: "#a855f7" },
      { id: "u3", email: "alex@acme.com", full_name: "Alex Dupont", avatar_color: "#3b82f6" },
      { id: "u4", email: "lea@acme.com", full_name: "Léa Bernard", avatar_color: "#22c55e" }
    ],
    workspaces: [
      { id: "w1", name: "Acme Corp", slug: "acme-corp", plan: "pro", avatar_color: "#6366f1" },
      { id: "w2", name: "Startup X", slug: "startup-x", plan: "starter", avatar_color: "#a855f7" }
    ],
    members: [
      { id: "m1", workspace_id: "w1", user_id: "u1", role: "owner", status: "active", last_active: "Maintenant" },
      { id: "m2", workspace_id: "w1", user_id: "u2", role: "admin", status: "active", last_active: "Il y a 12 min" },
      { id: "m3", workspace_id: "w1", user_id: "u3", role: "member", status: "active", last_active: "Il y a 1 h" },
      { id: "m4", workspace_id: "w1", user_id: "u4", role: "member", status: "active", last_active: "Hier" }
    ],
    invitations: [
      { id: "i1", workspace_id: "w1", email: "paul@startup.io", role: "member", sent_at: "Il y a 2 jours" },
      { id: "i2", workspace_id: "w1", email: "emma@design.co", role: "viewer", sent_at: "Il y a 5 heures" }
    ],
    channels: [{ id: "c1", workspace_id: "w1", name: "général" }, { id: "c2", workspace_id: "w1", name: "sprint-24" }],
    messages: [],
    meetings: [],
    current_workspace_id: "w1",
    current_user_id: "u1"
  };
  function load() {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch (_) {}
    const db = JSON.parse(JSON.stringify(DEFAULT_DB)); save(db); return db;
  }
  function save(db) { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }
  function uid(p) { return p + "_" + Math.random().toString(36).slice(2, 10); }
  global.KelasyoDB = {
    mode: "local",
    getWorkspace() { const db = load(); return db.workspaces.find(w => w.id === db.current_workspace_id) || db.workspaces[0]; },
    listWorkspaces() { return load().workspaces; },
    switchWorkspace(id) { const db = load(); if (db.workspaces.some(w => w.id === id)) { db.current_workspace_id = id; save(db); } return this.getWorkspace(); },
    listMembers(workspaceId) {
      const db = load(); const wid = workspaceId || db.current_workspace_id;
      return db.members.filter(m => m.workspace_id === wid).map(m => {
        const user = db.users.find(u => u.id === m.user_id) || {};
        return { ...m, name: user.full_name || "?", email: user.email || "", avatar_color: user.avatar_color || "#64748b", isYou: m.user_id === db.current_user_id };
      });
    },
    updateMemberRole(memberId, role) { const db = load(); const m = db.members.find(x => x.id === memberId); if (m && m.role !== "owner") { m.role = role; save(db); } return m; },
    setMemberStatus(memberId, status) { const db = load(); const m = db.members.find(x => x.id === memberId); if (m && m.role !== "owner") { m.status = status; save(db); } return m; },
    removeMember(memberId) { const db = load(); const m = db.members.find(x => x.id === memberId); if (m && m.role !== "owner") { db.members = db.members.filter(x => x.id !== memberId); save(db); return true; } return false; },
    listInvitations(workspaceId) { const db = load(); return db.invitations.filter(i => i.workspace_id === (workspaceId || db.current_workspace_id)); },
    invite(emails, role) {
      const db = load(); const created = [];
      emails.forEach(email => { const inv = { id: uid("i"), workspace_id: db.current_workspace_id, email: email.trim().toLowerCase(), role: role || "member", sent_at: "À l’instant" }; db.invitations.push(inv); created.push(inv); });
      save(db); return created;
    },
    cancelInvitation(id) { const db = load(); db.invitations = db.invitations.filter(i => i.id !== id); save(db); },
    stats(workspaceId) {
      const members = this.listMembers(workspaceId); const inv = this.listInvitations(workspaceId);
      return { members: members.filter(m => m.status === "active").length, pending: inv.length, admins: members.filter(m => m.role === "admin").length, owners: members.filter(m => m.role === "owner").length };
    },
    reset() { localStorage.removeItem(STORAGE_KEY); return load(); }
  };
})(typeof window !== "undefined" ? window : globalThis);
