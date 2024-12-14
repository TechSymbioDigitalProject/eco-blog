const { validationResult } = require('express-validator');
const Utilisateur = require('../models/Utilisateur');
const authService = require('../services/authService');
const logger = require('../config/logger');

// Méthode pour la connexion utilisateur
async function login (req, res) {
  // Validation des données avec express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Rechercher l'utilisateur par email
    const utilisateur = await Utilisateur.findByEmail(email);
    if (!utilisateur) {
      logger.warn('Tentative de connexion avec un email inconnu.', { email });
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // 3. Vérifier le mot de passe
    const isPasswordValid = await utilisateur.checkPassword(password);
    if (!isPasswordValid) {
      logger.warn('Mot de passe incorrect pour l\'utilisateur.', { email });
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Générer le token JWT et définir un cookie sécurisé
    authService.setAuthCookie(utilisateur, res);

    // Journaliser et répondre avec succès
    logger.info('Connexion réussie.', { userId: utilisateur.id, email: utilisateur.email });
    res.status(200).json({
      message: 'Connexion réussie.',
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        roleId: utilisateur.roleId,
      },
    });

  } catch (err) {
    // Journaliser les erreurs inattendues
    logger.error('Erreur lors de la connexion utilisateur.', {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ message: 'Une erreur est survenue, veuillez réessayer plus tard.' });
  }
}


// Méthode pour la déconnexion utilisateur
function logout (req, res) {
  try {
    // Effacer le cookie JWT
    res.clearCookie('track', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    // Journaliser la déconnexion réussie
    logger.info('Déconnexion réussi.', { ip: req.ip, url: req.originalUrl });

    // Retourner une réponse de confirmation
    res.status(200).json({ message: 'Déconnexion réussie.'});

  } catch (err) {
    // Journaliser les erreurs inattendues
    logger.error('Erreur lors de la déconnexion utilisateur.', {
      error: err.message,
      stack: err.stack,
      ip: req.ip,
      url: req.originalUrl,
    });
    res.status(500).json({ message: 'Une erreur est survenue lors de la déconnexion.' });
  }
}

module.exports = {
  login,
  logout,
};