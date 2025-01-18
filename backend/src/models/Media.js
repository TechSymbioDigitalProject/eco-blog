const db = require('../config/db');
const logger = require('../config/logger');


class Media {
  constructor(id, sectionId, url, type, description, position) {
    this._id = id;
    this._sectionId = sectionId;
    this._url = url;
    this._type = type;
    this._description = description;
    this._position = position;
  }

  // Getters
  get id() {
    return this._id;
  }

  get sectionId() {
    return this._sectionId;
  }

  get url() {
    return this._url;
  }

  get type() {
    return this._type;
  }

  get description() {
    return this._description;
  }

  get position() {
    return this._position;
  }

  // Setters
  set url(url) {
    this._url = url;
  }

  set type(type) {
    this._type = type;
  }

  set description(description) {
    this._description = description;
  }

  set position(position) {
    this._position = position;
  }


  // Méthode pour créer un nouveau média
  static async create(sectionId, url, type, description, position) {
    try {

      const query = `
        INSERT INTO media (section_id, url, type, description, position)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, section_id, url, type, description, position;
      `;

      const result = await db.query(query, [sectionId, url, type, description, position]);

      return new Media(
        result.rows[0].id,
        result.rows[0].section_id,
        result.rows[0].url,
        result.rows[0].type,
        result.rows[0].description,
        result.rows[0].position
      );

    } catch (err) {
      logger.error('Erreur lors de la création du média.', {
        error: err.message,
        stack: err.stack,
        sectionId,
        url,
        type,
        description,
        position,
      });

      throw new Error('Impossible de créer le média.');
    }
  }


  // Méthode pour récupérer tous les média d'une section
  static async findBySectionId(sectionId) {
    try {
      const query = `
        SELECT id, section_id, url, type, description, position
        FROM media
        WHERE section_id = $1
        ORDER BY position ASC;
      `;
      const result = await db.query(query, [sectionId]);

      return result.rows.map(
        (row) =>
          new Media(
            row.id,
            row.section_id,
            row.url,
            row.type,
            row.description,
            row.position
          )
      );
      
    } catch (err) {
      logger.error('Erreur lors de la récupération des médias.', {
        error: err.message,
        stack: err.stack,
        sectionId,
      });

      throw new Error('Impossible de récupérer les médias.');
    }
  }


}