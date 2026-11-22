/** Kelasyo Auth — localStorage + Supabase ready */
(function (global) {
  const AUTH_KEY = "kelasyo_auth_v1";
  const USERS_KEY = "kelasyo_auth_users_v1";
  function loadUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; } }
  function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
  function getSession() { try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); } catch { return null; } }
  function setSession(u) { if (u) localStorage.setItem(AUTH_KEY, JSON.stringify(u)); else localStorage.removeItem(AUTH_KEY); }
  function hash(pw) { let h = 0; for (let i = 0; i < pw.length; i++) h = (Math.imul(31, h) + pw.charCodeAt(i)) | 0; return "local_" + Math.abs(h).toString(16); }
  const LocalAuth = {
    mode: "local",
    async signup({ email, password, full_name }) {
      email = (email || "").trim().toLowerCase();
      if (!email || !password) throw new Error("Email et mot de passe requis");
      if (password.length < 6) throw new Error("Mot de passe : 6 caractères minimum");
      const users = loadUsers();
      if (users.some(u => u.email === email)) throw new Error("Un compte existe déjà avec cet email");
      const user = { id: "u_" + Math.random().toString(36).slice(2, 10), email, full_name: full_name || email.split("@")[0], password_hash: hash(password) };
      users.push(user); saveUsers(users);
      const session = { id: user.id, email: user.email, full_name: user.full_name };
      setSession(session); return session;
    },
    async login({ email, password }) {
      email = (email || "").trim().toLowerCase();
      const user = loadUsers().find(u => u.email === email && u.password_hash === hash(password));
      if (!user) throw new Error("Email ou mot de passe incorrect");
      const session = { id: user.id, email: user.email, full_name: user.full_name };
      setSession(session); return session;
    },
    async logout() { setSession(null); },
    getUser() { return getSession(); },
    isLoggedIn() { return !!getSession(); }
  };
  async function getAuth() {
    const cfg = global.KELASYO_SUPABASE;
    if (cfg?.url && cfg?.anonKey && global.supabase) {
      const client = global.supabase.createClient(cfg.url, cfg.anonKey);
      return {
        mode: "supabase", client,
        async signup({ email, password, full_name }) {
          const { data, error } = await client.auth.signUp({ email, password, options: { data: { full_name } } });
          if (error) throw error;
          return data.user ? { id: data.user.id, email: data.user.email, full_name } : null;
        },
        async login({ email, password }) {
          const { data, error } = await client.auth.signInWithPassword({ email, password });
          if (error) throw error;
          const u = data.user;
          return { id: u.id, email: u.email, full_name: u.user_metadata?.full_name || u.email };
        },
        async logout() { await client.auth.signOut(); setSession(null); },
        getUser() { return getSession(); },
        isLoggedIn() { return !!getSession(); }
      };
    }
    return LocalAuth;
  }
  function ensureAuthModal() {
    if (document.getElementById("authModal")) return;
    document.body.insertAdjacentHTML("beforeend", `<div class="modal-overlay" id="authModal"><div class="modal" style="max-width:400px"><div class="modal-header"><h3 id="authTitle">Connexion</h3><button class="modal-close" id="authClose" type="button">×</button></div><div class="modal-body"><div style="display:flex;gap:8px;margin-bottom:16px"><button type="button" class="btn btn-secondary" data-auth-tab="login" style="flex:1">Connexion</button><button type="button" class="btn btn-secondary" data-auth-tab="signup" style="flex:1">Créer un compte</button></div><form id="authForm"><div id="authNameField" hidden><label class="form-label">Nom</label><input type="text" id="authName" style="width:100%;padding:12px;margin-bottom:12px;border-radius:8px;border:1px solid var(--border,#1e293b);background:var(--bg,#0b0f19);color:var(--text,#fff)" /></div><label class="form-label">Email</label><input type="email" id="authEmail" required style="width:100%;padding:12px;margin-bottom:12px;border-radius:8px;border:1px solid var(--border,#1e293b);background:var(--bg,#0b0f19);color:var(--text,#fff)" /><label class="form-label">Mot de passe</label><input type="password" id="authPassword" required minlength="6" style="width:100%;padding:12px;margin-bottom:12px;border-radius:8px;border:1px solid var(--border,#1e293b);background:var(--bg,#0b0f19);color:var(--text,#fff)" /><p id="authError" style="color:#f87171;font-size:13px;display:none"></p><button type="submit" class="btn btn-primary" id="authSubmit" style="width:100%">Se connecter</button></form><p style="font-size:12px;color:var(--text-muted,#94a3b8);margin-top:12px;text-align:center">Mode local — comptes dans ce navigateur</p></div></div></div>`);
    let mode = "login";
    document.getElementById("authClose").onclick = closeAuthModal;
    document.getElementById("authModal").onclick = e => { if (e.target.id === "authModal") closeAuthModal(); };
    document.querySelectorAll("[data-auth-tab]").forEach(tab => {
      tab.onclick = () => {
        mode = tab.dataset.authTab;
        document.getElementById("authTitle").textContent = mode === "login" ? "Connexion" : "Créer un compte";
        document.getElementById("authSubmit").textContent = mode === "login" ? "Se connecter" : "Créer mon compte";
        document.getElementById("authNameField").hidden = mode === "login";
        document.getElementById("authError").style.display = "none";
      };
    });
    document.getElementById("authForm").onsubmit = async e => {
      e.preventDefault();
      const err = document.getElementById("authError");
      err.style.display = "none";
      try {
        const auth = await getAuth();
        const email = document.getElementById("authEmail").value;
        const password = document.getElementById("authPassword").value;
        const full_name = document.getElementById("authName").value;
        if (mode === "signup") await auth.signup({ email, password, full_name });
        else await auth.login({ email, password });
        closeAuthModal(); updateAuthUI();
      } catch (ex) { err.textContent = ex.message; err.style.display = "block"; }
    };
  }
  function openAuthModal(tab) {
    ensureAuthModal();
    document.getElementById("authModal").classList.add("open");
    document.querySelector(`[data-auth-tab="${tab || "login"}"]`)?.click();
  }
  function closeAuthModal() { document.getElementById("authModal")?.classList.remove("open"); }
  async function updateAuthUI() {
    const user = getSession();
    document.querySelectorAll("[data-auth-login],[data-auth-signup]").forEach(el => { el.style.display = user ? "none" : ""; });
    document.querySelectorAll("[data-auth-logout]").forEach(el => { el.style.display = user ? "" : "none"; });
    document.querySelectorAll("[data-auth-user]").forEach(el => {
      if (user) { el.style.display = ""; el.textContent = user.full_name || user.email; }
      else { el.style.display = "none"; el.textContent = ""; }
    });
  }
  function initAuth() {
    ensureAuthModal(); updateAuthUI();
    document.querySelectorAll("[data-auth-login]").forEach(el => el.addEventListener("click", e => { e.preventDefault(); openAuthModal("login"); }));
    document.querySelectorAll("[data-auth-signup]").forEach(el => el.addEventListener("click", e => { e.preventDefault(); openAuthModal("signup"); }));
    document.querySelectorAll("[data-auth-logout]").forEach(el => el.addEventListener("click", async e => { e.preventDefault(); const a = await getAuth(); await a.logout(); updateAuthUI(); }));
  }
  global.KelasyoAuth = { open: openAuthModal, close: closeAuthModal, init: initAuth, updateUI: updateAuthUI, getAuth, getUser: getSession };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAuth);
  else initAuth();
})(typeof window !== "undefined" ? window : globalThis);
