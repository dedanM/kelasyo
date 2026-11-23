/** PWA + détection mises à jour SW */
(function () {
  if (!("serviceWorker" in navigator)) return;
  let refreshing = false;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then((reg) => {
      if (reg.waiting) showUpdateBanner(reg);
      reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) showUpdateBanner(reg);
        });
      });
      setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
    }).catch(() => {});
  });
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
  function showUpdateBanner(reg) {
    if (document.getElementById("sw-update-banner")) return;
    const bar = document.createElement("div");
    bar.id = "sw-update-banner";
    bar.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;gap:12px;align-items:center;padding:12px 18px;background:#161f2e;border:1px solid #1e293b;border-radius:12px;color:#f1f5f9;font:500 14px system-ui,sans-serif";
    bar.innerHTML = '<span>Nouvelle version disponible</span><button type="button" id="sw-update-btn" style="background:#6366f1;color:#fff;border:none;border-radius:8px;padding:8px 14px;font-weight:600;cursor:pointer">Mettre à jour</button>';
    document.body.appendChild(bar);
    document.getElementById("sw-update-btn").onclick = () => { reg.waiting?.postMessage("SKIP_WAITING"); bar.remove(); };
  }
  window.KelasyoPWA = {
    async checkUpdate() { const reg = await navigator.serviceWorker.getRegistration(); if (reg) await reg.update(); return reg; },
    async clearCache() { const keys = await caches.keys(); await Promise.all(keys.filter((k) => k.startsWith("kelasyo-")).map((k) => caches.delete(k))); return true; },
  };
})();
