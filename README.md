# Gestion de Stages et Alternances - Frontend

Interface web React pour la gestion des stages et alternances.

## 🚀 Technologies

- **React** : 18.2
- **Vite** : 5.0
- **React Router** : 6.20
- **Axios** : 1.6
- **Tailwind CSS** : 3.3
- **Formik + Yup** : Validation des formulaires

## 📋 Prérequis

- Node.js 18+ (ou 20+)
- npm 9+

## ⚙️ Installation

1. **Cloner le repository**
```bash
   git clone https://github.com/VotreUsername/gestion-stages-frontend.git
   cd gestion-stages-frontend
```

2. **Installer les dépendances**
```bash
   npm install
```

3. **Créer le fichier `.env`**
```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_APP_NAME=Gestion de Stages
   VITE_TOKEN_KEY=gestion_stages_token
```

4. **Démarrer en mode développement**
```bash
   npm run dev
```

5. **Ouvrir le navigateur** : http://localhost:5173

## 🏗️ Build pour Production
```bash
npm run build
npm run preview
```

## 📁 Structure du Projet
```
frontend/
├── public/
├── src/
│   ├── components/       # Composants réutilisables
│   ├── pages/           # Pages de l'application
│   ├── services/        # API calls (Axios)
│   ├── context/         # Context API
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utilitaires
│   └── routes/          # Configuration des routes
├── .env                 # Variables d'environnement
└── package.json
```

## 👥 Équipe

- [Sahraoui Youness] - Frontend Developer
- [Mjahdi Abdelouahab] - Frontend Developer

## 🔗 Backend

Le backend de ce projet : [gestion-stages-backend](https://github.com/VotreUsername/gestion-stages-backend)

## 📄 Licence

Projet académique.