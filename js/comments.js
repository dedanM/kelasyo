/** Commentaires sur fichiers */
(function (global) {
  const KEY = "kelasyo_file_comments_v1";
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; } }
  function save(data) { localStorage.setItem(KEY, JSON.stringify(data)); }
  global.KelasyoComments = {
    list(fileId) { return (load()[fileId] || []).sort((a, b) => new Date(a.at) - new Date(b.at)); },
    add(fileId, body) {
      const user = global.KelasyoAuth?.getUser?.() || { full_name: "Anonyme", id: "anon" };
      const data = load();
      if (!data[fileId]) data[fileId] = [];
      const c = { id: "c_" + Date.now().toString(36), body: body.trim(), author: user.full_name || user.email, author_id: user.id, at: new Date().toISOString() };
      data[fileId].push(c); save(data);
      global.KelasyoNotifs?.push({ title: "Nouveau commentaire", body: c.author + ": " + c.body.slice(0, 80), type: "comment", link: "fichiers.html" });
      return c;
    },
    remove(fileId, commentId) {
      const data = load();
      if (data[fileId]) { data[fileId] = data[fileId].filter((c) => c.id !== commentId); save(data); }
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
