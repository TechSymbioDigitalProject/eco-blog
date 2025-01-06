const Categorie = require('../models/Categorie');
const logger = require('../config/logger');
const { validationResult } = require ('express-validator');


// Méthode pour récupérer la liste des catégories
async function getAllCategories(req, res) {
  try {
    // Récupérer toutes les catégories via le modèle
    const categories = await Categorie.findAll();

    // Transformer la liste en objet avec Id comme clé
    const categoriesMap = {};
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

async function createCategorie(req, res) {

  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nom, description } = req.body;

  try {

    // Vérifier si une catégorie avec le même nom existe déjà
    const categorieExiste = await Categorie.exists(nom);
    if (categorieExiste) {
      logger.warn('Tentative de création d\'une catégorie existante.', { nom });
      return res.status(409).json({
        message: 'Une catégorie avec ce nom existe déjà.',
      });
    }
    
    const nouvelleCategorie = await Categorie.create(nom, description);

    logger.info('Catégorie créée avec succès.', { nom, description });
    res.status(201).json({
      message: 'Catégorie créée avec succès.',
      categorie: {
        id: nouvelleCategorie.id,
        nom: nouvelleCategorie.nom,
        description: nouvelleCategorie.description,
      },
    });

  } catch (err) {
    logger.error('Erreur lors de la création de la catégorie.', { error: err.message });
    res.status(500).json({ message: 'Une erreur est survenue lors de la création de la catégorie.'});
  }
};


module.exports = {
  getAllCategories,
  createCategorie
};