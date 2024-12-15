# Changement du mot de passe utilisateur

## 📄 Description
Cette fonctionnalité permet à un utilisateur de réinitialiser son mot de passe après avoir demandé un lien de réinitialisation par email. 
Le backend valide le token JWT transmis et met à jour le mot de passe.


## 🛠️ Route d'API

- **Méthode** : `POST`
- **URL** : `/api/auth/reset-password`


## 🔍 Données attendues

Le corps de la requête doit contenir un **objet JSON** avec les champs suivants :

| Champ            | Type     | Obligatoire | Description                                         |
|--------------    |----------|-------------|-----------------------------------------------------|
| `token`          | `string` | Oui         | Token JWT envoyé dans le lien de réinitialisation. |
| `password`       | `string` | Oui         | Le nouveau mot de passe à définir.                 |
| `confirmPassword`| `string` | Oui         | Confirmation du mot de passe (doit être identique).|           


## ✅ Règles de validation

1. **Token** : 
   - Ne doit pas être vide.

2. **Nouveau Mot de passe** :
   - Minimum **12 caractères**.
   - Contient au moins **une majuscule**.
   - Contient au moins **une minuscule**.
   - Contient au moins **un chiffre**.
   - Contient au moins **un caractère spécial** (ex. : `@`, `#`, `!`, etc.).

3. **Confirmation du mot de passe** : 
   - Ne doit pas être vide.
   - Doit être identique au champ password


## 🔒 Sécurité CSRF
Pour protéger cette route contre les attaques CSRF, l'en-tête X-CSRF-Token doit être inclus dans la requête avec un token CSRF valide.
Le token CSRF peut être obtenu via la route GET /api/csrf-token.



## 📤 Exemple de requête

### **Requête `POST` :**

**URL** : `http://localhost:3001/api/auth/reset-password`  

**Corps (Body) JSON** :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "MonNouveauMotDePasse@123",
  "confirmPassword": "MonNouveauMotDePasse@123"
}


📥 Réponses possibles

1. ✅ Changement de mot de passe réussi
Statut HTTP : 200 OK

Corps de la réponse :
{
  "message": "Votre mot de passe a été réinitialisé avec succès."
}


2. ❌ Validation des données échouée
Statut HTTP : 400 Bad Request

{
  "message": "Les mots de passe ne correspondent pas."
}

ou

{
  "errors": [
    { "msg": "Le mot de passe doit contenir au moins 12 caractères." },
    { "msg": "Le mot de passe doit contenir au moins une majuscule." }
  ]
}


3. ❌ Token invalide ou expiré
Statut HTTP : 403 Forbidden


Corps de la réponse 
{
  "message": "Token invalide ou expiré."
}


4. ⚠️ Utilisateur non trouvé
Statut HTTP : 404 Not Found

Corps de la réponse :
{
  "message": "Utilisateur non trouvé."
}


5. 🛑 Erreur interne du serveur
Statut HTTP : 500 Internal Server Error

Corps de la réponse 
{
  "message": "Une erreur est survenue, veuillez réessayer plus tard."
}


🔒 Notes de sécurité
Le token JWT envoyé dans l'email de réinitialisation expire après 10 à 15 minutes.
Les mots de passe sont hachés avec bcrypt avant d'être stockés dans la base de données.