# Mise à jour d'une catégorie


## 📄 Description
Cette fonctionnalité permet de mettre à jour une catégorie existante dans la base de données.  
L'utilisateur peut modifier le nom, la description ou les deux champs en fonction des besoins.


## 🛠️ Route d'API

- **Méthode** : `PUT`
- **URL** : `/api/categories/:id/update`
- **Accès** : Authentification requise. Seuls les administrateurs peuvent accéder à cette route.


## 🔍 Données attendues

Le corps de la requête doit contenir un **objet JSON** avec au moins un des champs suivants :  

| Champ        | Type     | Obligatoire | Description                                      |
|--------------|----------|-------------|--------------------------------------------------|
| `nom`        | `string` | Non         | Le nouveau nom de la catégorie.                 |
| `description`| `string` | Non         | La nouvelle description de la catégorie. 


## ✅ Règles de validation

1. **Nom** : 
   - Ne peut contenir que des lettres (majuscules/minuscules), espaces.
   - Maximum : 50 caractères.
   
2. **Description** : 
   - Maximum : 500 caractères.
   - Peut contenir n'importe quel texte valide.

3. Au moins un des champs (`nom` ou `description`) doit être fourni.


## 📤 Exemple de requête

### **Requête `PUT` :**

**URL** : `http://localhost:3001/api/categories/13/update`

**Corps (Body) JSON** :

```json
{
  "nom": "Technologie Durable",
  "description": "Articles sur les avancées technologiques écoresponsables."
}


## 📥 Réponses possibles

1. ✅ Mise à jour réussie
Statut HTTP : 200 OK

Corps de la réponse :
{
  "message": "Catégorie mise à jour avec succès.",
  "categorie": {
    "id": 13,
    "nom": "Technologie Durable",
    "description": "Articles sur les avancées technologiques écoresponsables."
  }
}


2. ⚠️ Aucune catégorie trouvée
Statut HTTP : 404 Not Found

Corps de la réponse :
{
  "message": "Catégorie introuvable."
}


3. ❌ Validation échouée
Statut HTTP : 400 Bad Request

Corps de la réponse :
{
  "errors": [
    { "msg": "Le nom de la catégorie ne doit pas dépasser 50 caractères." },
    { "msg": "Veuillez fournir au moins un champ à mettre à jour (nom ou description)." }
  ]
}


4. 🛑 Erreur interne
Statut HTTP : 500 Internal Server Error

Corps de la réponse :
{
  "message": "Une erreur est survenue lors de la mise à jour de la catégorie."
}


🔒 Notes de sécurité

- Connectez-vous en tant qu'administrateur pour obtenir un token JWT.
- Ajoutez le token JWT dans les en-têtes de la requête sous la clé Authorization avec le préfixe Bearer.
- Incluez le token CSRF dans l'en-tête X-CSRF-Token pour la protection CSRF.