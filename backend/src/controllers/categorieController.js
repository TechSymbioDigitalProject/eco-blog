const Categorie = require('../models/Categorie');
const logger = require('../config/logger');


// Méthode pour récupérer la liste des catégories
async function getAllCategories(req, res) {
  try {
    // Récupérer toutes les catégories via le modèle
    const categories = await Categorie.findAll();

    // Transformer la liste en objet avec Id comme clé
    const caterogiesMap = {};
    categories.forEach(cat => {
      categoriesMap[cat.id] = {
        id: cat.id,
        nom: cat.nom,
        description: cat.description,
      };
    });

    // Journaliser le succès
    logger.info('Liste des catégorie récupérée avec succès.');

    // Retourner les données formatées
    res.status(200).json({
      message: 'Liste des catégories récupérée avec succès.',
      categories: categoriesMap,
    });

  } catch (err) {
    logger.error('Erreur lors de la récupération des catégories.', {
      error: err.message,
      stack: err.stack,
    });

    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des catégories.'});
  }
}


module.exports = {
  getAllCategories,
};