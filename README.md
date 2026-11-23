# Kelasyo

Hub SaaS pour équipes produit & engineering.

**Site :** https://dedanM.github.io/kelasyo/

## Fonctionnalités

- Landing + dashboard (Messages, GitHub, Playwright, Vercel, Réunions, Comptes)
- Auth (login / signup local + prêt Supabase)
- Gestion d'équipe (rôles, invitations)
- Partage de fichiers (tous types) + aperçu + commentaires + permissions
- Conférences Microsoft Teams (démo + Graph API)
- Notes de réunion + résumé auto
- Notifications in-app + Web Push
- Intégrations Slack / Discord + webhooks GitHub
- PWA (service worker, cache, installable)
- Schéma PostgreSQL (`database/schema.sql`)

## Lancer en local

```bash
python -m http.server 3000
```

Ouvre http://localhost:3000

**Archive complète recommandée** : télécharge le zip livré dans le chat (tous les JS / pages).

## GitHub Pages

1. Settings → Pages → Source = **GitHub Actions**
2. Actions → workflow *Deploy GitHub Pages* (vert = en ligne)

URL : **https://dedanM.github.io/kelasyo/**

## Config optionnelle

Copie `js/config.example.js` → `js/config.js` pour Supabase, Teams, VAPID push.
