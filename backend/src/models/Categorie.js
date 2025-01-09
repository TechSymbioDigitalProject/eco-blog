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
  static async create(nom, description) {
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

  // Méthode static pour vérifier si une catégorie existe déjà
  static async exists(nom) {
    try {
      const result = await db.query('SELECT id FROM categorie WHERE LOWER(nom) = LOWER($1)', [nom]);

      return result.rows.length > 0;

    } catch (err) {
      logger.error('Erreur lors de la vérification de l\'existence de la catégorie.', {
        error: err.message,
        stack: err.stack,
        nom,
      });

      throw new Error('Erreur lors de la vérification de l\'existence de la catégorie.');
    }
  }


  // Méthode static pour vzrifier si une catégorie existe par son ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM categorie WHERE id = $1';
      const result = await db.query(query, [id]);

      if (result.rows.length > 0) {
        const { id, nom, description } = result.rows[0];
        return new Categorie(id, nom, description);
      }
  
      return null; // Aucun résultat trouvé



    } catch (err) {
      logger.error('Erreur lors de la récupération de la catégorie par id', {
        error: err.message,
        stack: err.stack,
        categoryId: id,
      });

      throw new Error('Erreur lors de la récupération de la catégorie.');
    }
  }


  // Méthode static pour la mise à jour d'une catégorie existante
  static async update(id, nom, description) {
    try {
      const fieldsToUpdate = [];
      const values = [];

      if (nom) {
        fieldsToUpdate.push('nom = $' + (fieldsToUpdate.length +1));
        values.push(nom);
      }

      if (description) {
        fieldsToUpdate.push('description = $' + (fieldsToUpdate.length +1 ));
        values.push(description);
      }

      if (fieldsToUpdate.length === 0) {
        throw new Error('aucun champ à mettre à jour');
      }

      values.push(id);

      const query = `UPDATE categorie SET ${fieldsToUpdate.join(', ')} WHERE id = $${values.length} RETURNING *;`;
      const result = await db.query(query, values);

      if( result.rows.length > 0) {
        return result.rows[0];
      }

      throw new Error('Mise à jour échouée : Catégorie introuvable.');

    } catch (err) {
      logger.error('Erreur lors de la mise à jour de la catégorie.', {
        error: err.message,
        categoryId: id,
        nom,
        description,
      });
      throw new errorMonitor('Erreur lors de la mise à jour de la catégorie.');
    }
  }
}


module.exports = Categorie;