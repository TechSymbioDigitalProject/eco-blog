const db = require('../config/db');
const logger = require('../config/logger');


class Article {
  constructor(id, titre, statutPublication, auteur, categorieId, datePublication, metaDescription, mainImageUrl) {
    this._id = id;
    this._titre = titre;
    this._statutPublication = statutPublication;
    this._auteur = auteur;
    this._categorieId = categorieId;
    this._datePublication = datePublication;
    this._metaDescription = metaDescription;
    this._mainImageUrl = mainImageUrl;
  }

   // Getters
  get id() {
    return this._id;
  }

  get titre() {
      return this._titre;
  }

  get statutPublication() {
      return this._statutPublication;
  }

  get auteur() {
      return this._auteur;
  }

  get categorieId() {
      return this._categorieId;
  }

  get datePublication() {
      return this._datePublication;
  }

  get metaDescription() {
      return this._metaDescription;
  }

  get mainImageUrl() {
      return this._mainImageUrl;
  }


  // Setters
  set titre(titre) {
    this._titre = titre;
  }

  set statutPublication(statutPublication) {
      this._statutPublication = statutPublication;
  }

  set auteur(auteur) {
      this._auteur = auteur;
  }

  set categorieId(categorieId) {
      this._categorieId = categorieId;
  }

  set datePublication(datePublication) {
      this._datePublication = datePublication;
  }

  set metaDescription(metaDescription) {
      this._metaDescription = metaDescription;
  }

  set mainImageUrl(mainImageUrl) {
      this._mainImageUrl = mainImageUrl;
  }


  // Méthode pour récupérer les articles de la page d'accueil admin
  static async getHomepageArticles() {
    try {
      const query = `
                SELECT id, titre, main_image_url, meta_description, date_publication
                FROM article
                WHERE statut_publication = 'publié'
                ORDER BY date_publication DESC; -- Articles les plus récents en premier
            `;

      const result = await db.query(query);
      return result.rows; 

    } catch (err) {
      logger.error('Erreur lors de la récupération des articles pour la page d\'accueil.', {
        error: err.message,
        stack: err.stack,
      });

      throw new Error('Impossible de récupérer les articles.');
    }
  } 

  // Méthode pour la pagination des articles de la page d'accueil public
  static async findPaginated(offset = 0, limit = 10) {
    try {
      const query = `
        SELECT id, titre, main_image_url, meta_description, date_publication
        FROM article
        ORDER BY date_publication DESC
        LIMIT $1 OFFSET $2
      `;
      const result = await db.query(query, [limit, offset]);
      return result.rows; // Retourner les articles paginés
      
    } catch (err) {
      logger.error('Erreur lors de la récupération des articles paginés.', {
        error: err.message,
        stack: err.stack,
      });
      throw new Error('Impossible de récupérer les articles paginés.');
    }
  }

}

module.exports = Article;