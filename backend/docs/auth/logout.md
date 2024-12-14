# Déconnexion utilisateur

## 📝 Description
Cette route permet à un utilisateur authentifié de se déconnecter de l'application.  
Elle supprime le **cookie JWT** contenant le token d'authentification, invalidant ainsi la session de l'utilisateur.


## 🛠️ Route d'API

- **Méthode** : `POST`
- **URL** : `/api/auth/logout`


## 🔍 Données attendues
Aucune donnée n'est requise dans le corps de la requête.
Le token JWT doit être présent dans le cookie nommé track.


## 🔒 Accès requis
- L'utilisateur doit être **authentifié** (token JWT valide présent dans le cookie nommé `track`).


## ✅ Réponse attendue

1. ✅ Connexion réussie
Statut HTTP : 200 OK


Corps de la réponse 
```json
{
  "message": "Déconnexion réussie."
}


2. ❌ Validation des données échouée
Statut HTTP : 403 Forbidden


Corps de la réponse 
{
  "message": "Token invalide ou expiré."
}


3. 🛑 Erreur interne du serveur
Statut HTTP : 500 Internal Server Error

Corps de la réponse 
{
  "message": "Une erreur est survenue lors de la déconnexion."
}


## 🔒 Notes de sécurité
Le cookie track est configuré avec les options suivantes pour renforcer la sécurité :
- httpOnly : Empêche l'accès au cookie via JavaScript côté client.
- secure : Activé en environnement de production pour HTTPS.
- sameSite : Défini sur Strict pour limiter les risques d'attaque CSRF.

Le middleware authMiddleware protège la route pour s'assurer que l'utilisateur est authentifié avant de pouvoir se déconnecter.








