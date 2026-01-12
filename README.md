# LinkUp - Frontend
## Plateforme de Gestion de Stages et Alternances

Frontend React + Vite pour LinkUp, plateforme moderne de gestion de stages et alternances avec une interface inspirée de LinkedIn.

## 🚀 Technologies

- **React** : 19.2.0
- **Vite** : 7.2.4
- **React Router** : 7.10.1
- **Axios** : 1.13.2
- **Tailwind CSS** : 3.4.14
- **React Toastify** : 11.0.5

## 📋 Prérequis

- Node.js 18+
- npm ou yarn

## ⚙️ Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Éditer `.env` et configurer :
```
VITE_API_BASE_URL=http://localhost:8080
VITE_TOKEN_KEY=token
VITE_APP_NAME=LinkUp
```

3. **Lancer l'application**
```bash
npm run dev
```

L'application sera disponible sur : http://localhost:5173

## 📁 Structure du Projet

```
src/
├── components/        # Composants réutilisables
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── context/          # Contextes React
│   └── AuthContext.jsx
├── pages/            # Pages de l'application
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── etudiant/     # Pages Étudiant
│   ├── entreprise/   # Pages Entreprise
│   ├── admin/        # Pages Administration
│   └── tuteur/       # Pages Tuteur
└── services/         # Services API
    ├── api.js
    ├── authService.js
    ├── offreService.js
    ├── candidatureService.js
    ├── conventionService.js
    ├── suiviService.js
    ├── userService.js
    └── dashboardService.js
```

## 🔐 Authentification

L'application utilise JWT pour l'authentification. Le token est stocké dans le localStorage et ajouté automatiquement aux requêtes API.

## 📱 Pages Disponibles

### Pages Publiques
- `/login` - Connexion
- `/register` - Inscription

### Pages Étudiant
- `/etudiant/dashboard` - Tableau de bord
- `/etudiant/offres` - Liste des offres
- `/etudiant/candidatures` - Mes candidatures
- `/etudiant/stage` - Mon stage et conventions

### Pages Entreprise
- `/entreprise/dashboard` - Tableau de bord
- `/entreprise/offres` - Mes offres
- `/entreprise/candidatures` - Candidatures reçues

### Pages Administration
- `/admin/dashboard` - Tableau de bord avec statistiques
- `/admin/offres` - Validation des offres
- `/admin/conventions` - Gestion des conventions
- `/admin/suivis` - Assignation de tuteurs

### Pages Tuteur
- `/tuteur/dashboard` - Tableau de bord
- `/tuteur/etudiants` - Mes étudiants

## 🎨 Styling & Design

L'application utilise Tailwind CSS avec un design moderne inspiré de LinkedIn :
- Thème blanc professionnel
- Colonne centrée pour le contenu principal
- Navbar avec navigation intuitive
- Footer avec copyright LinkUp
- Responsive design (mobile-friendly)
- États de chargement (spinners) pour toutes les actions
- Notifications toast pour le feedback utilisateur

## ✨ Fonctionnalités Avancées

- **Pagination** : Navigation par pages pour les listes (offres, candidatures, etc.)
- **Filtres Avancés** : Recherche et filtrage multi-critères pour les offres
- **Notifications In-App** : Système de notifications en temps réel avec badge et dropdown
- **Gestion CV** : Upload, téléchargement et visualisation des CV
- **Performance** : Réponses rapides grâce au traitement asynchrone côté backend

## 📝 Notes

- **Application complète** : Toutes les fonctionnalités principales sont implémentées
- Assurez-vous que le backend est démarré sur le port 8080
- Le frontend doit être démarré sur le port 5173 (Vite par défaut)

## 🚀 Démonstration

Pour un guide complet de démonstration, consultez `DEMO_WORKFLOW.md` dans le dossier backend.