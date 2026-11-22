# Kelasyo

Hub SaaS pour équipes produit & engineering.

**Site en ligne :** https://dedanM.github.io/kelasyo/

## Fonctionnalités

- Messages d'équipe
- Rapports GitHub (PRs, issues, reviews)
- Tests Playwright
- Déploiements Vercel
- Réunions en direct + agenda / rappels
- Multi-comptes / workspaces
- Gestion d'équipe (rôles, invitations)

## Structure

```
kelasyo/
├── index.html              # Landing + dashboard
├── equipe.html             # Gestion d'équipe
├── css/
│   ├── styles.css
│   └── equipe.css
├── js/
│   ├── main.js
│   └── equipe.js
├── database/
│   ├── schema.sql          # Schéma PostgreSQL complet
│   └── seed.sql            # Données de démo
└── README.md
```

## Base de données

Schéma PostgreSQL prêt pour **Supabase**, **Neon**, **Railway** ou tout Postgres.

Tables principales :
- `users`, `workspaces`, `workspace_members`, `invitations`
- `channels`, `messages`
- `github_connections`, `github_repos`
- `playwright_runs`, `vercel_deployments`
- `meetings`, `meeting_participants`, `reminders`

### Installer la DB

```bash
psql $DATABASE_URL -f database/schema.sql
psql $DATABASE_URL -f database/seed.sql
```

Ou dans Supabase : SQL Editor → coller `schema.sql` puis `seed.sql`.

## Lancer en local

```bash
python -m http.server 3000
# ou: npx serve .
```

Ouvre http://localhost:3000

## GitHub Pages

Déploiement automatique via `.github/workflows/pages.yml` sur chaque push `main`.

URL : **https://dedanM.github.io/kelasyo/**

## Prochaines étapes backend

1. Brancher Supabase (auth + Postgres)
2. API REST ou Edge Functions pour messages / réunions
3. Webhooks GitHub + Vercel
4. Sync calendrier (Google / Outlook)
