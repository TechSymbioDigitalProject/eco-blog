# Mise à jour du rôle urilisateur


## 📄 Description
Cette route permet à un administrateur de modifier le rôle d'un utilisateur.
Elle vérifie également certaines règles pour garantir la sécurité, comme empêcher la rétrogradation du dernier administrateur ou d'un administrateur qui tente de modifier son propre rôle.


## 🛠️ Route d'API

- Méthode : PUT
- URL : /api/users/:id/update-role


## 🔍 Données attendues

Le corps de la requête doit contenir un **objet JSON** avec les champs suivants :

| Champ            | Type     | Obligatoire | Description                       |
|--------------    |----------|-------------|-----------------------------------|
| `roleId`         | `string` | Oui         | Le nouvel ID du rôle à assigner. |


## ✅ Règles de Validation

1. **RoleId** :
- Ne doit pas être vide.
- Doit être un nombre entier (ex : 1 pour administrateur).


## ✅ Règles métier

1. **Protection des administrateurs** :

- Un administrateur ne peut pas modifier son propre rôle.
- Le dernier administrateur ne peut pas être rétrogradé pour éviter de bloquer la gestion de l'application.


2. **Middleware de sécurité** : 

- Seuls les administrateurs peuvent accéder à cette route (grâce au middleware isAdmin).
- Token CSRF : Un token CSRF valide doit être inclus dans l'en-tête de la requête.
- Token JWT : Un token JWT valide doit être envoyé dans l'en-tête Authorization.



## 📤 Exemple de requête

### **Requête `PUT` :**

**URL** : `http://localhost:3001/api/users/7/update-role`  

**Headers** :
{
  "Authorization": "Bearer <token_JWT>"
}

**Corps (Body) JSON** :

```json
{
  "roleId": 2
}


## 📥 Réponses possibles

1. ✅ Mise à jour réussie
Statut HTTP : 200 OK

Corps de la réponse :
{
  "message": "Rôle de l'utilisateur mis à jour avec succès.",
  "utilisateur": {
    "id": 7,
    "nom": "Dupont",
    "prenom": "Marie",
    "roleId": 2
  }
}


2. ❌ Validation des données échouée
Statut HTTP : 400 Bad Request

Corps de la réponse :
{
  "errors": [
    { "msg": "L'id doit être un nombre valide'.", "param": "roleId" },  
  ]
}


3. ⚠️ Dernier administrateur
Statut HTTP : 403 Forbidden

Corps de la réponse :
{
  "message": "Impossible de rétrograder le dernier administrateur."
}


4. ⚠️ Modification de son propre rôle interdite
Statut HTTP : 403 Forbidden

Corps de la réponse :
{
  "message": "Vous ne pouvez pas modifier votre propre rôle."
}


5. ❌ Utilisateur introuvable
Statut HTTP : 404 Not Found

Corps de la réponse :
{
  "message": "Utilisateur non trouvé."
}


6. 🛑 Erreur interne du serveur
Statut HTTP : 500 Internal Server Error

Corps de la réponse :
{
  "message": "Une erreur est survenue lors de la mise à jour du rôle."
}



## 🛡️ Notes de sécurité

- L'accès à cette route est restreint aux administrateurs.
- Le système empêche la suppression ou la rétrogradation du dernier administrateur.
- Le rôle actuel de l'utilisateur est vérifié avant toute modification.



