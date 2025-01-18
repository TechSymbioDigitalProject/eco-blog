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


  // Méthode pour récupérer toutes les sections associées à un article
  static async findByArticleId(articleId) {
    try {
      const query = `
      SELECT id, article_id, titre, position
      FROM section
      WHERE article_id = $1
      ORDER BY position ASC;
      `;

      const result = await db.query(query, [articleId]);

      return result.rows.map(
        (row) => new Section(row.id, row.article_id, row.titre, row.position)
      );

    } catch (err) {
      logger.error('Erreur lors de la récupération des sections.', {
        error: err.message,
        stack: err.stack,
        articleId,
      });

      throw new Error('Impossible de récupérer les sections.');
    }
  }


  // Méthode pour supprimer une section
  static async delete(id) {
    try {
      const query = `
        DELETE FROM section
        WHERE id = $1
        RETURNING id;
      `;
      const result = await db.query(query, [id]);

      return result.rowCount > 0;

    } catch (err) {
      logger.error('Erreur lors de la suppression de la section.', {
        error: err.message,
        stack: err.stack,
        sectionId: id,
      });

      throw new Error('Impossible de supprimer la section.');
    }
  }
}