const db = require('../config/db');
const logger = require('../config/logger');


class Paragraphe {
  constructor(id, sectionId, contenu, position) {
    this._id = id;
    this._sectionId = sectionId;
    this._contenu = contenu;
    this._position = position;
  }

  // Getters
  get id() {
    return this._id;
  }

  get sectionId() {
    return this._sectionId;
  }

  get contenu() {
    return this._contenu;
  }

  get position() {
    return this._position;
  }

  // Setters
  set contenu(contenu) {
    this._contenu = contenu;
  }

  set position(position) {
    this._position = position;
  }


  // Méthode pour créer un nouveau paragraphe
  static async create(sectionId, contenu, position) {
    try {
      const query = `
        INSERT INTO paragraphe (section_id, contenu, position)
        VALUES ($1, $2, $3)
        RETURNING id, section_id, contenu, position;
      `;

      const result = await db.query(query, [sectionId, contenu, position]);

      return new Paragraphe(
        result.rows[0].id,
        result.rows[0].section_id,
        result.rows[0].contenu,
        result.rows[0].position
      );

    } catch (err) {
      logger.error('Erreur lors de la création du paragraphe.', {
        error: err.message,
        stack: err.stack,
        sectionId,
        contenu,
        position,
      });

      throw new Error('Impossible de créer le paragraphe.');
    }
  }


  // Méthode pour récupérer tous les paragraphes d'une section
  static async findBySectionId(sectionId) {
    try {
      const query = `
        SELECT id, section_id, contenu, position
        FROM paragraphe
        WHERE section_id = $1
        ORDER BY position ASC;
      `;
      
      const result = await db.query(query, [sectionId]);

      return result.rows.map(
        (row) => new Paragraphe(row.id, row.section_id, row.contenu, row.position)
      );
       
    } catch (err) {
      logger.error('Erreur lors de la récupération des paragraphes.', {
        error: err.message,
        stack: err.stack,
        sectionId,
      });

      throw new Error('Impossible de récupérer les paragraphes.');
    }
  }
}


module.exports = Paragraphe;