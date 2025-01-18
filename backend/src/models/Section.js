const db = require('../config/db');
const logger = require('../config/logger');


class Section {
  constructor(id, articleId, titre, position) {
    this._id = id;
    this._articleId = articleId;
    this._titre = titre;
    this._position = position;
  }

  // Getters
  get id() {
    return this._id;
  }

  get articleId() {
    return this._articleId;
  }

  get titre() {
    return this._titre;
  }

  get position() {
    return this._position;
  }

   // Setters
   set titre(titre) {
    this._titre = titre;
  }

  set position(position) {
    this._position = position;
  }


  // Méthode static pour la création d'une nouvelle section
  static async create(articleId, titre, position) {
    try {
      const query = `
        INSERT INTO section (article_id, titre, position)
        VALUES ($1, $2, $3)
        RETURNING id, article_id, titre, position;
      `;
      const result = await db.query(query, [articleId, titre, position]);

      return new Section(
        result.rows[0].id,
        result.rows[0].article_id,
        result.rows[0].titre,
        result.rows[0].position
      );

    } catch (err) {
      logger.error('Erreur lors de la création de la section.', {
        error: err.message,
        stack: err.stack,
        articleId,
        titre,
        position,
      });

      throw new Error('Impossible de créer la section.');
    }
  }

}