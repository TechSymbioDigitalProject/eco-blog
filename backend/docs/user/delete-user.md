# Supprimer un utilisateur


## 📄 Description
Cette fonctionnalité permet à un administrateur de supprimer un utilisateur existant dans l'application.
Un utilisateur ayant le rôle administrateur ne peut pas être supprimé.


## 🛠️ Route d'API

- Méthode : DELETE
- URL : /api/users/:id
- Accès : Administrateur uniquement (protégé par un middleware isAdmin).


## 🔍 Données attendues

Le corps de la requête doit contenir un **objet JSON** avec les champs suivants :


| Champ            | Type     | Obligatoire | Description                       |
|--------------    |----------|-------------|-----------------------------------|
| `id`             | `number` | Oui         | ID de l'utilisateur à supprimer. |



## ✅ Règles de Validation

1. ID utilisateur** :
- Doit être un nombre entier.
- Correspond à un utilisateur existant dans la base de données.


## 📤 Exemple de requête

### **Requête `DELETE` :**

**URL** : `http://localhost:3001/api/users/6`

**Corps (Body) JSON** :

```json
{
  "message": "Utilisateur supprimé avec succès."
}


## 📥 Réponses possibles

1. ✅ Utilisateur supprimé avec succès
Statut HTTP : 200 OK

Corps de la réponse :
{
  "message": "Utilisateur supprimé avec succès."
}


2. ❌ Utilisateur administrateur
Statut HTTP : 403 Forbidden

Corps de la réponse :
{
  "message": "Impossible de supprimer un utilisateur avec le rôle administrateur."
}


3. ⚠️ Utilisateur non trouvé
Statut HTTP : 404 Not Found

Corps de la réponse :
{
  "message": "Utilisateur non trouvé."
}


4. ❌ Accès interdit
Statut HTTP : 403 Forbidden

Corps de la réponse :
{
  "message": "Accès interdit : vous devez être administrateur."
}


5. 🛑 Erreur interne du serveur
Statut HTTP : 500 Internal Server Error

Corps de la réponse :
{
  "message": "Une erreur est survenue lors de la suppression de l'utilisateur."
}



## 🛡️ Notes de sécurité

- Protection CSRF : Cette route nécessite un token CSRF dans les en-têtes.
- Authentification : Seuls les utilisateurs authentifiés avec le rôle administrateur peuvent supprimer un utilisateur.
- Précaution : Les utilisateurs administrateurs ne peuvent pas être supprimés pour éviter les pertes d'accès.