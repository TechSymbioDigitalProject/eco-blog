# Connexion utilisateur

## 📄 Description

Cette route permet à un utilisateur existant de se connecter à l'application.  
Elle vérifie les informations d'identification fournies (**email** et **mot de passe**) et renvoie un **token JWT** sécurisé si les informations sont valides.  
Le token est défini dans un cookie sécurisé HTTPOnly.

---

## 🛠️ Route d'API

- **Méthode** : `POST`
- **URL** : `/api/auth/login`

---

## 🔍 Données attendues

Le corps de la requête doit contenir un **objet JSON** avec les champs suivants :

| Champ        | Type     | Obligatoire | Description                                    |
|--------------|----------|-------------|------------------------------------------------|
| `email`      | `string` | Oui         | Adresse email de l'utilisateur.               |
| `password`   | `string` | Oui         | Mot de passe de l'utilisateur.                |

---

## ✅ Règles de validation

1. **Email** : 
   - Doit être une adresse email valide.

2. **Mot de passe** :
   - Minimum **12 caractères**.
   - Contient au moins **une majuscule**.
   - Contient au moins **une minuscule**.
   - Contient au moins **un chiffre**.
   - Contient au moins **un caractère spécial** (ex. : `@`, `#`, `!`, etc.).

---

## 📤 Exemple de requête

### **Requête `POST` :**

**URL** : `http://localhost:3001/api/auth/login`  

**Corps (Body) JSON** :

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}


📥 Réponses possibles
1. ✅ Connexion réussie
Statut HTTP : 200 OK

Corps de la réponse :
{
  "message": "Connexion réussie.",
  "utilisateur": {
    "id": "123",
    "nom": "Dupont",
    "prenom": "Jean",
    "roleId": "456"
  }
}


2. ❌ Validation des données échouée
Statut HTTP : 400 Bad Request

Corps de la réponse :
{
  "errors": [
    { "msg": "L'adresse email est invalide.", "param": "email" },
    { "msg": "Le mot de passe doit contenir au moins 12 caractères.", "param": "password" }
  ]
}


3. ⚠️ Utilisateur non trouvé
Statut HTTP : 404 Not Found

Corps de la réponse :
{
  "message": "Utilisateur non trouvé."
}


4. ⚠️ Mot de passe incorrect
Statut HTTP : 401 Unauthorized

Corps de la réponse :
{
  "message": "Mot de passe incorrect."
}


5. 🛑 Erreur interne du serveur
Statut HTTP : 500 Internal Server Error

Corps de la réponse 
{
  "message": "Une erreur est survenue, veuillez réessayer plus tard."
}


🔒 Notes de sécurité
Le token JWT est défini dans un cookie sécurisé (httpOnly).
Le token expirera après 1 heure pour limiter les risques de sécurité.
Les erreurs inattendues sont journalisées dans des fichiers de log grâce à Winston.