# Mise à jour du profil utilisateur

## 📄 Description
Cette route permet à un utilisateur authentifié de mettre à jour son profil (nom, prénom, email).
L'utilisateur peut modifier un ou plusieurs champs sans être obligé de tous les envoyer.


## 🛠️ Route d'API

- Méthode : PUT
- URL : /api/users/update-profile/:id


## 🔍 Données attendues

Le corps de la requête doit contenir un **objet JSON** avec les champs suivants :

| Champ            | Type     | Obligatoire | Description                                                                  |
|--------------    |----------|-------------|------------------------------------------------------------------------------|
| `nom`            | `string` | Non         | Nom de l'utilisateur (lettres, accents, tirets, espaces, max 50 caractères). |
| `prenom`         | `string` | Non         | Prénom de l'utilisateur (mêmes règles que pour le nom).                      |
| `email`          | `string` | Non         | Adresse email valide de l'utilisateur.                                       | 


## ✅ Règles de Validation

1. **Nom et prénom** :
- Optionnel.
- Contient uniquement des lettres (majuscules/minuscules, accents), tirets, espaces et apostrophes.
Maximum 50 caractères.


2. **Email** :
- Optionnel.
- Doit être une adresse email valide.


## 🔒 Sécurité
- Token CSRF : Un token CSRF valide doit être inclus dans l'en-tête de la requête.
- Token JWT : Un token JWT valide doit être envoyé dans l'en-tête Authorization.


## 📤 Exemple de requête

### **Requête `PUT` :**

**URL** : `http://localhost:3001/api/users/update-profile/3`  

**Corps (Body) JSON** :

```json
1. Mise à jour d'un seul champ :
{
  "prenom": "Lucien"
}

2. Mise à jour de plusieurs champs :
{
  "nom": "Dupont",
  "prenom": "Marie",
  "email": "marie.dupont@example.com"
}


## 📥 Réponses possibles

1. ✅ Mise à jour réussie
Statut HTTP : 200 OK

Corps de la réponse :
{
  "message": "Profil mis à jour avec succès.",
  "utilisateur": {
    "id": 3,
    "nom": "Dupont",
    "prenom": "Lucien",
    "email": "lucien.dupont@example.com"
  }
}


2. ❌ Validation des données échouée
Statut HTTP : 400 Bad Request

Corps de la réponse :
{
  "errors": [
    { "msg": "Le nom ne peut contenir que des lettres, accents, espaces, tirets et apostrophes.", "param": "nom" },
    { "msg": "L'adresse email est invalide.", "param": "email" }
  ]
}


3. ⚠️ Utilisateur non authentifié
Statut HTTP : 401 Unauthorized

Corps de la réponse :
{
  "message": "Accès non autorisé, token manquant."
}


4. ⚠️ Tentative de modification d'un autre profil
Statut HTTP : 403 Forbidden

Corps de la réponse :
{
  "message": "Vous n'êtes pas autorisé à modifier ce profil."
}


5. 🛑 Erreur interne du serveur
Statut HTTP : 500 Internal Server Error

Corps de la réponse :
{
  "message": "Une erreur est survenue lors de la mise à jour du profil."
}


## 🛡️ Notes de sécurité

- Seul l'utilisateur authentifié peut mettre à jour son propre profil.
- Toutes les erreurs inattendues sont journalisées pour analyse.
- Le token CSRF doit être inclus dans l'en-tête X-CSRF-Token pour garantir la sécurité contre les attaques CSRF.
- La validation des données est appliquée uniquement aux champs envoyés.