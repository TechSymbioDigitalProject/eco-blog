# Récupérer la liste des catégories


## 📄 Description
Cette route permet de récupérer toutes les catégories disponibles dans la base de données.
La réponse est structurée sous forme d'objet pour un mappage plus facile dans les composants front-end.


## 🛠️ Route d'API

- Méthode : GET
- URL : /api/categories


## 🔍 Données attendues

Aucune donnée n'est attendue dans le corps de la requête.

## 📤 Exemple de requête

### **Requête `GET` :**

**URL** : http://localhost:3001/api/categories

**Corps (Body) JSON** : Aucune donnée requise dans le corps de la requête.


## 📥 Réponses possibles

1. ✅ Récupération réussie
Statut HTTP : 200 OK

Corps de la réponse :
{
  "message": "Liste des catégories récupérée avec succès.",
  "categories": {
    "1": {
      "id": 1,
      "nom": "Environnement",
      "description": "Articles sur la protection de l'environnement."
    },
    "2": {
      "id": 2,
      "nom": "Énergie",
      "description": "Articles sur les énergies renouvelables."
    }
  }
}


2. 🛑 Erreur interne du serveur
Statut HTTP : 500 Internal Server Error

Corps de la réponse :
{
  "message": "Une erreur est survenue lors de la récupération des catégories."
}
