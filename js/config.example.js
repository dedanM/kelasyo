/**
 * Copie en config.js (ne pas committer les secrets)
 */
window.KELASYO_SUPABASE = {
  url: "https://TON_PROJET.supabase.co",
  anonKey: "TON_ANON_KEY",
};

window.KELASYO_TEAMS = {
  clientId: "TON_AZURE_CLIENT_ID",
  tenantId: "common",
  redirectUri: window.location.origin + window.location.pathname,
};

window.KELASYO_PUSH = {
  vapidPublicKey: "TA_CLE_VAPID_PUBLIQUE",
  subscribeUrl: "https://ton-api.example.com/push/subscribe",
};
