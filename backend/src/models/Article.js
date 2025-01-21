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


  // Méthode static pour récupérer les articles de la page d'accueil admin
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

  // Méthode static pour la pagination des articles de la page d'accueil public
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


  // Méthode static pour la création d'un nouvel article
  static async create(titre, statutPublication, auteur, categorieId, metaDescription, mainImageUrl) {
    try {
      const query = `
      INSERT INTO article (titre, statut_publication, auteur, categorie_id, meta_description, main_image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
      `;

      const values = [titre, statutPublication, auteur, categorieId, metaDescription, mainImageUrl];
      const result = await db.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Échec de la création de l\'article.');
      }

      return result.rows[0].id;

    } catch (err) {
      logger.error('Erreur lors de la création de l\'article.', {
        error: err.message,
        stack: err.stack,
        titre,
        auteur,
      });

      throw new Error('Erreur lors de la création de l\'article.');
    }
  }


  // Méthode pour récupérer un article par son ID
  static async findById(id) {
    try {
      const query = `
      SELECT id, titre, statut_publication, auteur, categorie_id, date_publication, meta_description, main_image_url
      FROM article
      WHERE id = $1;
      `;

      const result = await db.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const article = result.rows[0];
      return new Article(
        article.id,
        article.titre,
        article.statut_publication,
        article.auteur,
        article.categorie_id,
        article.date_publication,
        article.meta_description,
        article.main_image_url
      );

    } catch (err) {
      logger.error('Erreur lors de la récupération de l\'article par ID.', {
        error: err.message,
        stack: err.stack,
        articleId: id,
      });

      throw new Error('Impossible de récupérer l\'article.');

    }
  }


  // Méthode pour mise à jour de l'url de l'image principale
  static async updateMainImageUrl(articleId, mainImageUrl) {
    try {
      const query = `
        UPDATE article
        SET main_image_url = $1
        WHERE id = $2;
      `;
      await db.query(query, [mainImageUrl, articleId]);
      logger.info('URL de l\'image principale mise à jour avec succès.', { articleId, mainImageUrl });
    } catch (err) {
      logger.error('Erreur lors de la mise à jour de l\'URL de l\'image principale.', {
        error: err.message,
        stack: err.stack,
        articleId,
        mainImageUrl,
      });
      throw new Error('Impossible de mettre à jour l\'URL de l\'image principale.');
    }
  }

}

module.exports = Article;