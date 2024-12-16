const Role = require('../models/Role');
const logger = require('../config/logger');


/**
 * Middleware pour vérifier si l'utilisateur est administrateur.
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */

async function isAdmin(req, res, next) {
  try {
    console.log('req.user:', req.user);
    // Vérifie si req.user existe 
    if (!req.user || !req.user.roleId) {
      logger.warn('Accès refusé: Aucun rôle trouvé dans le token', {
        userId: req.user ? req.user.id : null,
        url: req.originalUrl,
        ip: req.ip,
      });

      return res.status(403).json({ message: 'Accès interdit.'});
    }

    // Récupère le nom du rôle depuis la base de données
    const role = await Role.findById(req.user.roleId);
    console.log('Rôle récupéré depuis la base de données :', role);
    // Vérifie que le rôle est "administrateur"
    if (!role || role._role !== 'administrateur') {
      logger.warn('Accès refusé: Rôle non autorisé', {
        userId: req.user.id,
        roleId: req.user.roleId,
        roleName: role ? role.role : 'Inconnu',
        url: req.originalUrl,
        ip: req.ip,
      });

      return res.status(403).json({ message: 'Accès interdit: vous devez être administrateur.'});
    }

    // Journaliser l'accès autorisé
    logger.info('Accès autorisé pour un administrateur.', {
      userId: req.user.id,
      roleName: role._role,
      url: req.originalUrl,
      ip: req.ip,
    });

    // Passe au prochain middleware ou contrôleur
    next();

  } catch (err) {
    logger.error('Erreur lors de la vérification du rôle administrateur.', {
      error: err.message,
      stack: err.stack,
      userId: req.user ? req.user.id : null,
      url: req.originalUrl,
      ip: req.ip,
    });

    return res.status(500).json({ message: 'Une erreur est survenue lors de la vérification du rôle.' });
  }
}

module.exports = isAdmin;