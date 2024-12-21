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

  // Méthode static pour la création d'une catégorie
  static async create(nom, prenom) {
    try {
      const result = await db.query('INSERT INTO categorie (nom, description) VALUES ($1, $2) RETURNING id, nom, description', [nom, description]);

      return new Categorie(result.rows[0].id, result.rows[0].nom, result.rows[0].description);

    } catch (err) {
      logger.error('Erreur lors de la création de la catégorie.', {
        error: err.message,
        stack: err.stack,
      });

      throw new Error('Erreur lors de la création de la c&tégorie.');
    }
  }
}


module.exports = Categorie;