const db = require('../config/db');
const logger = require('../config/logger');


class Categorie {
  constructor(id, nom, description) {
    this._id = id;
    this._nom = nom;
    this._description = description;
  }

  // Getters
  get id() {
    return this._id;
  }

  get nom() {
    return this._nom;
  }

  get description() {
    return this._description;
  }

  // Setters
  set nom(nom) {
    this._nom = nom;
  }

  set description(description) {
    this._description = description;
  }


  // Méthode static pour récupérer la liste des catégories depuis la base de données
  static async findAll() {
    try {
      const result = await db.query('SELECT * FROM categorie');
      const categories = result.rows.map(row => new Categorie(row.id, row.nom, row.description));

      return categories;

    } catch(err) {
      logger.error('Erreur lors de la récupération des catégories.', {
        error: err.message,
        stack: err.stack,
      });

      throw new Error('impossible de récupérer les catégories.');
    }
  }
}


module.exports = Categorie;