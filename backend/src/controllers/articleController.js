const { validationResult } = require('express-validator');
const Article = require('../models/Article');
const Section = require('../models/Section');
const Paragraphe = require('../models/Paragraphe');
const Media = require('../models/Media');
const { createArticleFolder, generateImageName, processImage } = require ('../utils/imageUtils');
const db = require('../config/db');
const logger = require('../config/logger');


// Méthode poru récupérer les articles à afficher sur la page d'accueil
async function getAllHomepageArticles(req, res) {
  try {
    const articles = await Article.getHomepageArticles();

    const formattedArticles = articles.map(article => ({
      id: article.id,
      titre: article.titre,
      image: article.main_image_url,
      description: article.meta_description,
      date: new Date(article.date_publication).toLocaleDateString('fr-FR'),
    }));

    logger.info('Liste des articles récupérée avec succès.', {
        count: formattedArticles.length,
    });

    res.status(200).json({
        message: 'Liste des articles récupérée avec succès.',
        articles: formattedArticles,
    });

  } catch (err) {
    logger.error('Erreur lors de la récupération des articles pour la page d\'accueil.', {
      error: err.message,
      stack: err.stack,
    });

    res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération des articles.',
    });
  }
}


// Méthode pour la pagination des articles sur la page d'accueil publique
async function getPaginatedArticles(req, res) {
  const limit = parseInt(req.query.limit, 10) || 10; // Nombre d'articles par page
  const offset = parseInt(req.query.offset, 10) || 0; // Position de départ

  try {
    const articles = await Article.findPaginated(offset, limit);

    const formattedArticles = articles.map(article => ({
      id: article.id,
      titre: article.titre,
      image: article.main_image_url,
      description: article.meta_description,
      date: new Date(article.date_publication).toLocaleDateString('fr-FR'),
    }));

    res.status(200).json({
      message: 'Articles récupérés avec succès.',
      articles: formattedArticles,
    });
  } catch (err) {
    logger.error('Erreur lors de la récupération des articles paginés.', {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des articles.' });
  }
}


// Méthode pour la création d'un article complet
async function createArticleComplet(req, res) {
  // Vérification des erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { titre, auteur, categorie_id, meta_description, main_image_url, sections } = req.body;

  try {
    // Début de la transaction
    await db.query('BEGIN');

    // Créer l'article
    const articleId = await Article.create(
      titre,
      'brouillon', // Statut par défaut
      auteur,
      categorie_id,
      meta_description || null,
      main_image_url || null
    );

    // Créer les sections, paragraphes et médias
    for (const sectionData of sections) {
      const sectionId = await Section.create(
        articleId, 
        sectionData.titre,
        sectionData.position 
      );

      if (Array.isArray(sectionData.paragraphes)) {
        for (const [index, contenu] of sectionData.paragraphes.entries()) {
          await Paragraphe.create(
            sectionId,
            contenu,
            index + 1,
          );
        }
      }

      if (Array.isArray(sectionData.medias)) {
        for (const [index, mediaData] of sectionData.medias.entries()) {
          // Rechercher le fichier correspondant dans req.files
          const file = req.files.find(
            (f) => f.fieldname === `sections[${sections.indexOf(sectionData)}][medias][${index}][file]`
          );
      
          // Vérifier si le fichier est trouvé
          if (!file) {
            logger.error('Fichier manquant pour le média', { mediaData, index, sectionIndex: sections.indexOf(sectionData) });
            throw new Error('Fichier manquant pour le média.');
          }
      
          const { path: tempPath, mimetype, originalname } = file; // Détails du fichier
          const type = mimetype.startsWith('image/') ? 'image' : 'video';
      
          // Créer le média dans la base de données et récupérer l'ID
          const mediaId = await Media.create(
            sectionId,
            null, // L'URL sera mise à jour après le traitement de l'image
            type,
            mediaData.description,
            index + 1
          );
      
          if (type === 'image') {
            // Traiter les images
            const articleFolder = createArticleFolder(articleId);
            const imageName = generateImageName(articleId, mediaId); // mediaId est directement l'ID
            const imagePath = `${articleFolder}/${imageName}`;
      
            await processImage(tempPath, imagePath);
      
            // Mettre à jour l'URL du média dans la base de données
            await Media.updateUrl(mediaId, `/uploads/media/images/article${articleId}/${imageName}`);
          }
        }
      }
    }

    // Commit de la transaction
    await db.query('COMMIT');

    res.status(201).json({ message: 'Article créé avec succès.', articleId });

  } catch (err) {
    // En cas d'erreur, rollback de la transaction
    await db.query('ROLLBACK');
    logger.error('Erreur lors de la création de l\'article complet.', { error: err.message, stack: err.stack });
    res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'article.' });
  }
}


module.exports = {
  getAllHomepageArticles,
  getPaginatedArticles,
  createArticleComplet,
};