# Demande de réinitialisation du mot de passe

## 📄 Description
Cette route permet à un utilisateur de demander la réinitialisation de son mot de passe.
Un e-mail contenant un lien temporaire de réinitialisation sera envoyé à l'adresse e-mail fournie si celle-ci est valide.

## 🛠️ Route d'API

- **Méthode** : `POST`
- **URL** : `/api/auth/password-reset-request`


## 🔍 Données attendues
Le corps de la requête doit contenir un objet JSON avec les champs suivants :


| Champ        | Type     | Obligatoire | Description                                    |
|--------------|----------|-------------|------------------------------------------------|
| `email`      | `string` | Oui         | Adresse email de l'utilisateur.               |


## ✅ Règles de validation

**Email** : 
   - Doit être une adresse email valide.


## 🔒 Sécurité CSRF
Pour protéger cette route contre les attaques CSRF, l'en-tête X-CSRF-Token doit être inclus dans la requête avec un token CSRF valide.
Le token CSRF peut être obtenu via la route GET /api/csrf-token.


## 🔄 Fonctionnement
- L'utilisateur envoie une requête contenant son adresse e-mail.
- Si l'e-mail correspond à un utilisateur existant dans la base de données :
- Un token temporaire est généré.
- Un e-mail contenant le lien de réinitialisation est envoyé.
- Le lien inclut un token JWT valide pour 10 minutes.
- Si l'e-mail n'est pas trouvé, une réponse indiquant que l'utilisateur n'existe pas est renvoyée.


## 📤 Exemple de requête

### **Requête `POST` :**

**URL** : `http://localhost:3001/api/auth/password-reset-request`  

**Corps (Body) JSON** :

```json
{
  "email": "user@example.com",
}


## 📥 Réponses possibles

1. ✅ Connexion réussie
Statut HTTP : 200 OK

Corps de la réponse :
{ "message": "Un email de réinitialisation a été envoyé." }


2. ❌ Validation des données échouée
Statut HTTP : 400 Bad Request

Corps de la réponse :
{
  "errors": [
    { "msg": "L'adresse email est invalide.", "param": "email" }
  ]
}


3. ⚠️ Utilisateur non trouvé
Statut HTTP : 404 Not Found

Corps de la réponse :
{
  "message": "Utilisateur non trouvé."
}


4. 🛑 Erreur interne du serveur
Statut HTTP : 500 Internal Server Error

Corps de la réponse 
{
  "message": "Une erreur est survenue, veuillez réessayer plus tard."
}


## 🔒 Notes de sécurité
Si l'adresse e-mail fournie ne correspond à aucun utilisateur, la réponse 404 Not Found sera renvoyée pour éviter toute fuite d'informations sur les utilisateurs existants.
Le lien de réinitialisation expire au bout de 10 minutes pour des raisons de sécurité.
Le lien de réinitialisation renvoie vers le front-end de l'application pour permettre à l'utilisateur de saisir un nouveau mot de passe.