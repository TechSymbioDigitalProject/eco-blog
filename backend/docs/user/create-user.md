# Création d'un nouvel utilisateur

## 📄 Description
Cette route permet à un administrateur de créer un nouvel utilisateur dans l'application. Lors de la création, un mot de passe provisoire sécurisé est généré automatiquement et envoyé par email à l'utilisateur nouvellement créé.


## 🛠️ Route d'API

- Méthode : POST
- URL : /api/users/create
- Accès : Administrateur uniquement (protégé par un middleware isAdmin).


## 🔍 Données attendues

Le corps de la requête doit contenir un **objet JSON** avec les champs suivants :

| Champ            | Type     | Obligatoire | Description                                                                  |
|--------------    |----------|-------------|------------------------------------------------------------------------------|
| `nom`            | `string` | Oui         | Nom de l'utilisateur (lettres, accents, tirets, espaces, max 50 caractères). |
| `prenom`         | `string` | Oui         | Prénom de l'utilisateur (mêmes règles que pour le nom).                      |
| `email`          | `string` | Oui         | Adresse email valide de l'utilisateur.                                       | 
| `roleId`         | `number` | Oui         | ID du rôle de l'utilisateur.                                                 |    


## ✅ Règles de Validation

1. **Nom et prénom** :
- Ne doivent pas être vides.
- Autorisent uniquement les lettres (avec accents), tirets, espaces, et apostrophes.
- Maximum 50 caractères.

2. **Email** :
- Doit être une adresse email valide.

3. **RoleId** :
- Ne doit pas être vide.
- Doit être un nombre entier (ex : 1 pour administrateur).


## 🔒 Sécurité CSRF
- Middleware : Seuls les utilisateurs ayant le rôle administrateur peuvent accéder à cette route.
- Token CSRF : Un token CSRF valide doit être inclus dans l'en-tête de la requête.
- Token JWT : Un token JWT valide doit être envoyé dans l'en-tête Authorization.


## 📤 Exemple de requête

### **Requête `POST` :**

**URL** : `http://localhost:3001/api/users/create`  

**Corps (Body) JSON** :

```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "roleId": 2
}


## 📥 Réponses possibles

1. ✅ Utilisateur créé avec succès
Statut HTTP : 201 Created

Corps de la réponse :
{
  "message": "Utilisateur créé avec succès. Un mot de passe provisoire a été envoyé par email.",
  "utilisateur": {
    "id": 4,
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "role": "rédacteur"
  }
}


2. ❌ Validation des données échouée
Statut HTTP : 400 Bad Request

Corps de la réponse :
{
  "errors": [
    { "msg": "Le nom est obligatoire.", "param": "nom" },
    { "msg": "L'adresse email est invalide.", "param": "email" }
  ]
}


3. ❌ Accès interdit (utilisateur non administrateur)
Statut HTTP : 403 Forbidden

Corps de la réponse :
{
  "message": "Accès interdit: vous devez être administrateur."
}


4. ❌ Email déjà existant
Statut HTTP : 409 Conflict

Corps de la réponse :
{
  "message": "Un utilisateur avec cet email existe déjà."
}


5. 🛑 Erreur interne du serveur
Statut HTTP : 500 Internal Server Error

Corps de la réponse :
{
  "message": "Une erreur est survenue lors de la création de l'utilisateur."
}

 
## 🔄 Fonctionnement

- Middleware isAdmin : Vérifie si l'utilisateur connecté a le rôle administrateur.
- Validation des données : Les données saisies sont validées avec express-validator.
- Mot de passe provisoire : Un mot de passe sécurisé est généré automatiquement.
- Hachage du mot de passe : Le mot de passe est haché avec bcrypt avant stockage.
- Email de bienvenue : Un email contenant le mot de passe provisoire est envoyé au nouvel utilisateur.
Retour de la réponse : Retourne les informations de l'utilisateur créé (sans le mot de passe).


## 🛡️ Notes de sécurité

- Le mot de passe provisoire respecte les règles de sécurité :
12 caractères minimum, avec majuscules, minuscules, chiffres, et caractères spéciaux.

- Le mot de passe provisoire est envoyé par email mais n'est jamais renvoyé dans la réponse de l'API.

 - L'API est protégée par :
       Le middleware JWT pour vérifier l'authentification.
       Le middleware CSRF pour les attaques CSRF.
       Le middleware isAdmin pour restreindre l'accès.