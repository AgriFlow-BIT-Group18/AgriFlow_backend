# AgriFlow Backend API

Ce projet contient le backend de l'application AgriFlow, construit avec **Node.js, Express et MongoDB**. Il intègre une authentification sécurisée par JWT et une gestion basée sur les rôles (Customer, Farmer, Admin).

## Prérequis

- **Node.js** (v14 ou supérieur)
- **MongoDB** (en cours d'exécution sur le port local par défaut `27017` ou URL distante)

## Installation et Lancement

1. **Extraire le fichier ZIP** dans le dossier de votre choix.
2. Ouvrir un terminal dans le dossier extrait (`backend`).
3. Installer les dépendances (le dossier `node_modules` a été supprimé pour alléger le fichier ZIP) :
   ```bash
   npm install
   ```
4. Assurez-vous que le fichier `.env` est bien présent à la racine du projet avec les informations suivantes :
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/agriflow
   JWT_SECRET=supersecretjwtkeytest123
   ```
5. **Démarrer le serveur** :
   - Mode développement (avec rechargement automatique) : `npm run dev`
   - Mode production : `npm start`

## Documentation de l'API (Swagger)

Une fois le serveur démarré, la documentation interactive de l'API est disponible à l'adresse suivante :
👉 **http://localhost:5000/api-docs**

Vous pouvez y tester toutes les routes (Authentification, Produits, Commandes, etc.) directement depuis votre navigateur.

# 🌾 AgriFlow Backend API

Ce projet contient le backend de l'application mobile et web AgriFlow.
Il est construit avec **Node.js, Express et MongoDB**, intègre une authentification sécurisée par **JWT** et gère trois rôles distincts (`customer`, `farmer`, `admin`) pour sécuriser les routes métier.

## 🛠️ Configuration & Lancement

1. **Installer les dépendances**
   Assurez-vous d'avoir Node.js installé, puis à la racine du dossier `/backend` lancez :
   ```bash
   npm install

# Pour le développement (avec rechargement automatique) :
npm run dev

# Pour la production :
npm start
