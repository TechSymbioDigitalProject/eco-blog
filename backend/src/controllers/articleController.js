const Article = require('../models/Article');
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
      date: new Date(article.date_publication).toLocaleDateString('fr-FR'), // Format jj/mm/aaaa
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


module.exports = {
  getAllHomepageArticles,
  getPaginatedArticles,
};