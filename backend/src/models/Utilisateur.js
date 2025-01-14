const bcrypt = require('bcrypt');
const db = require('../config/db');
const logger = require('../config/logger');

class Utilisateur {
    constructor(id, nom, prenom, email, password, roleId) {
        this._id = id;
        this._nom = nom;
        this._prenom = prenom;
        this._email = email;
        this._password = password;
        this._roleId = roleId;
    }

    // Getters
    get id() {
      return this._id;
    }

    get nom() {
      return this._nom;
    }

    get prenom() {
      return this._prenom;
    }

    get email() {
      return this._email;
    }

    get roleId() {
      return this._roleId;
    }

    // Setters

    set nom(nom) {
      this._nom = nom;
    }

    set prenom(prenom) {
      this._prenom = prenom;
    }

    set email(email) {
      this._email = email;
    }

    set roleId(roleId) {
      this._roleId = roleId;
    }


    // Méthode pour vérifier le mot de passe
    async checkPassword(password) {
        try {
            return await bcrypt.compare(password, this._password);
        } catch (err) {
            // Utiliser le logger pour journaliser l'erreur
            logger.error('Erreur lors de la vérification du mot de passe', {
              error: err.message, // Message de l'erreur
              stack: err.stack,   // Pile d'exécution pour déboguer
            });

          // Relancer une erreur générique
          throw new Error('Erreur lors de la vérification du mot de passe.');
       }
    }


    // Méthode pour mettre à jour le mot de passe
    async updatePassword(newPassword) {
      try {
        // Hacher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe da ns la base de données
        await db.query('UPDATE utilisateurs SET password = $1 WHERE id = $2', [hashedPassword, this._id]);

        // Mettre à jour le mot de passe dans l'objet actuel
        this._password = hashedPassword;

        // Journaliser la mise à jour réussie
        logger.info('Mot de passe mis à jour avec succès', { userId: this._id });

      } catch (err) {
        // Journaliser l'erreur
        logger.error('Erreur lors de la mise à jour du mot de passe', {
          error: err.message,
          stack: err.stack,
          userId: this._id,
        });

        // Relancer une erreur géré par le controller
        throw new Error('Une erreur est survenue lors de la mise à jour du mot de passe.')
      }
    }


    // Méthode statique pour trouver un utilisateur par email
    static async findByEmail(email) {
        try {
            // Exécuter la requête pour rechercher l'utilisateur par email
            const result = await db.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);

            // Vérifier si un utilisateur a été trouvé
            if (result.rows[0]) {
                const { id, nom, prenom, email, password, role_id } = result.rows[0];
                return new Utilisateur(id, nom, prenom, email, password, role_id);
            }

            // Retourner null si aucun utilisateur n'a été trouvé
            return null;
        } catch (err) {
            // Journaliser l'erreur avec des détails
            logger.error('Erreur lors de la recherche de l\'utilisateur par email', {
                error: err.message, // Message de l'erreur
                stack: err.stack,   // Stack trace de l'erreur
                context: { email }, // Contexte additionnel (email recherché)
            });

            // Relancer une erreur générique pour que le contrôleur puisse la gérer
            throw new Error('Une erreur est survenue lors de la recherche de l\'utilisateur.');
        }
    }


    // Méthode static pour trouver un utilisateur par son id
    static async findById(id) {
      try {
        // Exécuter la requête pour recherche l'utilisateur par id
        const result = await db.query('SELECT * FROM utilisateurs WHERE id = $1', [id]);

        // Vérifier si un utilisateur a été trouvé
        if (result.rows[0]) {
          const { id, nom, prenom, email, password, role_id } = result.rows[0];
          return new Utilisateur(id, nom, prenom, email, password, role_id);
        }

        // Rertourner null si aucun utilisateur n'a étét trouvé
        return null;

      } catch (err) {
        // Journaliser l'erreur avec le logger
        logger.error('Erreur lors de la recherche de l\'utilisateur par Id', {
          error: err.message,
          stack: err.stack,
          context: { userId: id }
        });

        // Relancer une erreur générique pour que le contrôleur puisse la gérer
        throw new Error('Une erreur est survenue lors de la recherche de l\'utilisateur.');

      }
    }


  // Méthode static pour récupérer la liste des utilisateurs
  static async findAll() {
    try {
      const query = `
        SELECT u.id, u.nom, u.prenom, u.email, r.role AS role
        FROM utilisateurs u
        LEFT JOIN roles r ON u.role_id = r.id
      `;

      const result = await db.query(query);

      return result.rows; // Retourner directement les résultats
    } catch (err) {
      logger.error('Erreur lors de la récupération des utilisateurs avec rôles.', {
        error: err.message,
        stack: err.stack,
      });
      throw new Error('Erreur lors de la récupération des utilisateurs.');
    }
  }

  
  // Méthode static pour créer un nouvel utilisateur
  static async create({ nom, prenom, email, password, roleId }) {
    try {
      // Exécuter la requête pour céer un nouvel utilisateur
      const result = await db.query('INSERT INTO utilisateurs (nom, prenom, email, password, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [nom, prenom, email, password, roleId]);

      const { id } = result.rows[0];
      return new Utilisateur(id, nom, prenom, email, password, roleId);

    } catch(err) {
      logger.error('Erreur lors de la création de l\'utilisateur', {
        error: err.message,
        stack: err.stack,
      });

      throw new Error('Erreur lors de la création de l\'utilisateur');
    }
  }


  // Méthode static pour supprimer un utilisateur
  static async deleteById(userId) {
    try {
      const result = await db.query('DELETE FROM utilisateurs WHERE id = $1 RETURNING *', [userId]);
      return result.rowCount > 0; // Retourne true si une ligne a été supprimée
    } catch (err) {
      logger.error('Erreur lors de la suppression de l\'utilisateur', {
        error: err.message,
        stack: err.stack,
        userId,
      });
      throw new Error('Erreur lors de la suppression de l\'utilisateur.');
    }
  }


  // Méthode static pour mettre à jour le rôle utilisateur
  static async updateRole(userId, newRoleId) {
    try {
      const result = await db.query(
        'UPDATE utilisateurs SET role_id = $1 WHERE id = $2 RETURNING id, role_id',
        [newRoleId, userId]
      );
  
      if (result.rows.length > 0) {
        return result.rows[0]; // Retourner les données mises à jour
      }
  
      throw new Error('La mise à jour du rôle a échoué.');
    } catch (err) {
      logger.error('Erreur lors de la mise à jour du rôle utilisateur.', {
        error: err.message,
        userId,
        newRoleId,
      });
      throw new Error('Erreur lors de la mise à jour du rôle.');
    }
  }


  // Méthode pout compter le nomdre d'administrateur dans la base de données
  static async countAdmins() {
    try {
      const result = await db.query(
        'SELECT COUNT(*) FROM utilisateurs WHERE role_id = 1'
      );
  
      return parseInt(result.rows[0].count);
    } catch (err) {
      logger.error('Erreur lors du comptage des administrateurs.', {
        error: err.message,
      });
      throw new Error('Impossible de compter les administrateurs.');
    }
  }


  // Méthode pour mettre à jour le profile utilisateur
  async updateProfile(data) {
    try {
      const fields = [];
      const values = [];
      let index = 1;
  
      // Construire dynamiquement la liste des champs et des valeurs
      for (const key in data) {
        if (['nom', 'prenom', 'email'].includes(key) && data[key]) {
          fields.push(`${key} = $${index}`);
          values.push(data[key]);
          index++;
        }
      }
  
      // Ajouter l'ID de l'utilisateur pour la clause WHERE
      values.push(this._id);
  
      if (fields.length === 0) {
        throw new Error('Aucune donnée à mettre à jour.');
      }
  
      // Construire la requête SQL finale
      const query = `
        UPDATE utilisateurs 
        SET ${fields.join(', ')}
        WHERE id = $${index}
        RETURNING id, nom, prenom, email
      `;
  
      // Exécuter la requête SQL
      const result = await db.query(query, values);
  
      if (result.rows.length > 0) {
        const { nom, prenom, email } = result.rows[0];
        this._nom = nom || this._nom;
        this._prenom = prenom || this._prenom;
        this._email = email || this._email;
  
        return { id: this._id, nom, prenom, email };
      }
  
      throw new Error('La mise à jour a échoué.');
    } catch (err) {
      logger.error('Erreur lors de la mise à jour du profil.', {
        error: err.message,
        userId: this._id,
      });
      throw new Error('Erreur lors de la mise à jour du profil.');
    }
  }
  
}

module.exports = Utilisateur;