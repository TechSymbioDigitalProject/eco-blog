# Protection CSRF

## 📄 Description
Cette implémentation ajoute une protection CSRF pour sécuriser les routes sensibles (POST, PUT, DELETE) contre les attaques Cross-Site Request Forgery.
Le middleware csurf a été intégré avec la gestion des cookies pour protéger les requêtes.
Un token CSRF est généré côté serveur et doit être inclus dans chaque requête sécurisée.


## 🛠️ Middleware utilisé
csurf : Middleware Node.js pour la protection CSRF.
cookie-parser : Pour la gestion des cookies dans Express.


## 🛠️ Route d'API

- **Méthode** : `GET`
- **URL** : `/api/csrf-token`

📥 Réponse attendue

**Corps (Body) JSON** :

```json
{
  "csrfToken": "exemple-de-token-csrf"
}


## 🔍 Utilisation du token CSRF dans les requêtes

1. Le client (front-end) doit récupérer le token CSRF en appelant la route /api/csrf-token

2. Ajouter le token CSRF dans les requêtes sensibles
Le token CSRF doit être inclus dans l'en-tête X-CSRF-Token pour toutes les requêtes POST, PUT, DELETE.


## ⚠️ Gestion des erreurs CSRF
Si le token CSRF est absent ou incorrect, le serveur renverra automatiquement une erreur 403 Forbidden.

Corps de la réponse :
{
  "message": "Invalid CSRF Token"
}


##  🔑 Points clés à retenir

- Token CSRF : Obligatoire pour les requêtes sensibles (POST, PUT, DELETE).
- Route dédiée : Le token est fourni via la route /api/csrf-token.
- En-tête requis : Ajoutez le token dans X-CSRF-Token.
- Cookies : Le middleware utilise un cookie sécurisé pour gérer le token.
