// Tabs for dashboard
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.dashboard-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panelId = 'panel-' + tab.dataset.tab;
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
  });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const demoBtn = document.getElementById('demoBtn');
if (demoBtn) {
  demoBtn.addEventListener('click', () => {
    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
  });
}

const mobileBtn = document.getElementById('mobileMenuBtn');
if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    const actions = document.querySelector('.header-actions');
    if (nav.style.display === 'flex') {
      nav.style.display = '';
      actions.style.display = '';
    } else {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '64px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = 'var(--bg-elevated)';
      nav.style.padding = '20px';
      nav.style.borderBottom = '1px solid var(--border)';
      actions.style.display = 'flex';
      actions.style.position = 'absolute';
      actions.style.top = '200px';
      actions.style.left = '0';
      actions.style.right = '0';
      actions.style.background = 'var(--bg-elevated)';
      actions.style.padding = '16px 20px 24px';
      actions.style.justifyContent = 'center';
      actions.style.borderBottom = '1px solid var(--border)';
    }
  });
}

document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', function () {
    if (this.textContent.includes('gratuit') || this.textContent.includes('Essayer') || this.textContent.includes('workspace')) {
      const original = this.textContent;
      this.textContent = '✓ Redirection...';
      this.disabled = true;
      setTimeout(() => {
        this.textContent = original;
        this.disabled = false;
        alert('Bienvenue sur Kelasyo !\n\nDans une vraie version, tu serais redirigé vers la page d’inscription / onboarding.');
      }, 800);
    }
  });
});

console.log('Kelasyo — site chargé ✓');
