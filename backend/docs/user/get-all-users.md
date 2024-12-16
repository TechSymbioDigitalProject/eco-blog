# Récupérer la liste des utilisateurs


## 📄 Description
Cette route permet de récupérer la liste complète des utilisateurs enregistrés dans l'application.
Seuls les administrateurs ont le droit d'accéder à cette route. Chaque utilisateur est retourné avec ses informations de base, y compris le nom du rôle correspondant.


## 🛠️ Route d'API

- Méthode : GET
- URL : /api/users


## 🔍 Données attendues

Aucune donnée n'est requise dans le corps de la requête.


## 📤 Exemple de requête

### **Requête `GET` :**

**URL** : http://localhost:3001/api/users

**Corps (Body) JSON** :

```json
{
  "message": "Liste des utilisateurs récupérée avec succès.",
  "utilisateurs": [
    {
      "id": 1,
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean.dupont@example.com",
      "role": "administrateur"
    },
    {
      "id": 2,
      "nom": "Doe",
      "prenom": "John",
      "email": "john.doe@example.com",
      "role": "rédacteur"
    }
  ]
}


## 📥 Réponses possibles

1. ✅ Récupération réussie
Statut HTTP : 200 OK

Corps de la réponse :
{
  "message": "Liste des utilisateurs récupérée avec succès.",
  "utilisateurs": [
    {
      "id": 1,
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean.dupont@example.com",
      "role": "administrateur"
    },
    {
      "id": 2,
      "nom": "Doe",
      "prenom": "John",
      "email": "john.doe@example.com",
      "role": "rédacteur"
    }
  ]
}


2. ❌ Accès interdit (utilisateur non administrateur)
Statut HTTP : 403 Forbidden

Corps de la réponse :
{
  "message": "Accès interdit: vous devez être administrateur."
}


3. 🛑 Token manquant ou invalide
Statut HTTP : 401 Unauthorized

Corps de la réponse :
{
  "message": "Token manquant ou invalide."
}


4. 🛑 Erreur interne du serveur
Statut HTTP : 500 Internal Server Error

Corps de la réponse :
{
  "message": "Une erreur est survenue lors de la récupération de la liste des utilisateurs."
}


## 🛡️ Notes de sécurité

- Authentification requise :
Un token JWT valide doit être inclus dans l'en-tête de la requête.

- CSRF Token : 
Le token CSRF doit également être inclus dans l'en-tête.

- Vérification des rôles :
L'accès est strictement réservé aux utilisateurs ayant le rôle administrateur.

