# Création d'une nouvelle catégorie


## 📄 Description
Cette fonctionnalité permet à un administrateur de créer une nouvelle catégorie.  
Une catégorie est utilisée pour organiser les articles dans l'application.  
Chaque catégorie comporte un nom unique et une description.


## 🛠️ Route d'API

- Méthode : `POST`
- URL : `/api/categories/create`


## 🔍 Données attendues

Le corps de la requête doit contenir un **objet JSON** avec les champs suivants :

| Champ        | Type     | Obligatoire | Description                                    |
|--------------|----------|-------------|------------------------------------------------|
| `nom`        | `string` | Oui         | Le nom de la catégorie (unique).              |
| `description`| `string` | Oui         | Une description détaillée de la catégorie.    |


## ✅ Règles de validation

1. **Nom** : 
   - Ne doit pas être vide.
   - Doit contenir uniquement des lettres majuscules ou minuscules.
   - Doit être unique (une catégorie avec ce nom ne doit pas déjà exister).


2. **Description** :
   - Ne doit pas être vide.
   - Maximum **250 caractères**.


## 📤 Exemple de requête

### **Requête `POST` :**

**URL** : `http://localhost:3001/api/categories/create`

**Corps (Body) JSON** :

```json
{
  "nom": "Technologie",
  "description": "Articles sur les innovations technologiques et durables."
}


## 📥 Réponses possibles

1. ✅ Catégorie créée avec succès
Statut HTTP : 201 Created

Corps de la réponse :
{
  "message": "Catégorie créée avec succès.",
  "categorie": {
    "id": 1,
    "nom": "Technologie",
    "description": "Articles sur les innovations technologiques et durables."
  }
}


2. ❌ Validation des données échouée
Statut HTTP : 400 Bad Request

Corps de la réponse :
{
  "errors": [
    { "msg": "Le nom est obligatoire.", "param": "nom" },
    { "msg": "La description est obligatoire.", "param": "description" }
  ]
}


3. ❌ Catégorie déjà existante
Statut HTTP : 409 Conflict

Corps de la réponse :
{
  "message": "Une catégorie avec ce nom existe déjà."
}


4. ❌ Accès interdit (utilisateur non administrateur)
Statut HTTP : 403 Forbidden

Corps de la réponse :
{
  "message": "Accès interdit: vous devez être administrateur."
}