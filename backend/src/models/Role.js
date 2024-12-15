const db = require('../config/db');
const logger = require('../config/logger');


class Role {
  constructor (id, nom) {
    this._id = id;
    this._nom = nom;
  }

  // Getters
  get id() {
    return this._id;
  }

  get nom() {
    return this._nom;
  }

  
  // Méthode static pour récupérer un rôle par son id
  static async findById(roleId) {
    try {
      const result = await db.query('SELECT * FROM roles WHERE id = $1', [roleId]);

      if(result.rows.length > 0) {
        const { id, nom } = result.rows[0];
        return new Role(id, nom);
      }

      return null;

    } catch (err) {
      logger.error('Erreur lors de la récupération du rôle.', {
        error: err.message,
        stack: err.stack,
        roleId,
      });

      throw new Error('Erreur lors de la récupération du rôle.');
    }
  }
} 


module.exports = Role;