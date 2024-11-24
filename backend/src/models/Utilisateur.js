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

}

module.exports = Utilisateur;