# Kelasyo — Site SaaS

Site vitrine + mockup dashboard pour **Kelasyo**, un SaaS qui centralise :

- **Messages** d’équipe
- **Rapports GitHub** (PRs, issues, reviews)
- **Tests Playwright**
- **Déploiements Vercel**
- **Réunions** en direct
- **Agenda** + rappels intelligents
- **Plusieurs comptes / workspaces** (basculement, rôles, invitations)

## Structure

```
kelasyo/
├── index.html       # Landing + dashboard mockup
├── equipe.html      # Page Gestion d'équipe
├── css/
│   ├── styles.css   # Styles globaux
│   └── equipe.css   # Styles page équipe
├── js/
│   ├── main.js      # Interactivité landing
│   └── equipe.js    # Logique gestion équipe
└── README.md
```

## Lancer en local

Ouvre simplement `index.html` dans un navigateur, ou utilise un serveur local :

```bash
# Avec Python
python -m http.server 3000

# Avec Node (npx)
npx serve .
```

Puis va sur http://localhost:3000

## GitHub Pages

Site déployé sur : **https://dedanM.github.io/kelasyo/**

## Fonctionnalités du mockup

- Landing page moderne (dark theme)
- Dashboard interactif (Messages, GitHub, Playwright, Vercel, Réunions, Comptes)
- Page Gestion d’équipe
- Multi-comptes / workspaces
- Responsive mobile
