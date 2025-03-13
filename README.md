# EcoDrive - Plateforme de Covoiturage Écologique au Maroc 🚗

## Description
EcoDrive est une plateforme innovante de covoiturage et de transport collaboratif, conçue pour faciliter la mobilité durable au Maroc. Cette application connecte conducteurs et passagers pour des trajets plus écologiques et économiques.

## Structure du Projet
```
ecodrive/
├── config/         # Configuration de l'application
├── controllers/    # Logique métier
├── models/        # Modèles de données MongoDB
├── routes/        # Routes de l'API
├── middlewares/   # Middlewares personnalisés
├── utils/         # Utilitaires et helpers
├── tests/         # Tests unitaires et d'intégration
└── docs/          # Documentation
```

## Prérequis
- Node.js (v14+)
- MongoDB
- npm ou yarn

## Installation
1. Cloner le repository
```bash
git clone https://github.com/sanaahamliri/EcoDrive_PFR.git
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```

4. Lancer le serveur de développement
```bash
npm run dev
```

## Scripts Disponibles
- `npm start` : Démarre le serveur en production
- `npm run dev` : Démarre le serveur en mode développement
- `npm test` : Lance les tests

## Technologies Utilisées
- Express.js - Framework web
- MongoDB - Base de données
- Mongoose - ODM pour MongoDB
- JWT - Authentification
- Jest - Tests
- Autres dépendances (voir package.json)

## Contribution
Les contributions sont les bienvenues ! Veuillez suivre ces étapes :
1. Forker le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence
ISC
