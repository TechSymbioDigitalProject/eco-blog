const jwt = require('jsonwebtoken');
const logger = require('../config/logger');


// Récupération de la clé secrète JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Clé secrète pour le token de réinitialisation
const JWT_SECRET_RESET = process.env.JWT_SECRET_RESET;


/**
 * Génère un token JWT pour l'utilisateur donné.
 * @param {Object} utilisateur - L'objet utilisateur.
 * @returns {string} - Le token JWT
 */
function generateToken(utilisateur) {
  try {
    // Création du payload avec les informations de l'utilisateur
    const payload = {
      id: utilisateur.id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      role: utilisateur.roleId,
    };

    // Génération du token avec expiration (1h ici)
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  } catch (err) {
    // Journaliser une erreur si la génération échoue
    logger.error('Erreur lors de la génération du token JWT', {
      error: err.message,
      stack: err.stack,
    });
    throw new Error('Impossible de générer un token.');
  }
}


/**
 * Vérifie et décode un token JWT.
 * @param {string} token - Le token JWT.
 * @returns {Object} - Le payload décodé si valide.
 * @throws {Error} - Si le token est invalide ou expiré.
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // Journaliser une erreur si le token est invalide
    logger.error('Erreur lors de la vérification du token JWT', {
      error: err.message,
      stack: err.stack,
    });
    throw new Error('Token invalide ou expiré.');
  }
}


/**
 * Définit un cookie sécurisé contenant le token JWT.
 * @param {Object} utilisateur - L'objet utilisateur.
 * @param {Object} res - L'objet réponse Express.
 */
function setAuthCookie(utilisateur, res) {
  try {
    // Génération du token JWT
    const token = generateToken(utilisateur);

    // Options pour le cookie
    const cookieOptions = {
      httpOnly: true, // Empêche l'accès au cookie via le client (JavaScript)
      secure: process.env.NODE_ENV === 'production', // Active secure en production
      sameSite: 'Strict', // Protéger contre les attaques CSRF
      maxAge: 3600000, // Durée de validité du cookie (1h ici)
    };

    // Définir le cookie dans la réponse
    res.cookie('track', token, cookieOptions);
  } catch (err) {
    // Journaliser une erreur si l'opération échoue
    logger.error('Erreur lors de la configuration du cookie JWT', {
      error: err.message,
      stack: err.stack,
    });
    throw new Error('Impossible de définir le cookie.');
  }
}


/**
 * Génère un token de réinitialisation de mot de passe.
 * @param {Object} utilisateur - L'objet utilisateur contenant l'id et l'email.
 * @returns {string} - Le token JWT valide pendant 10 minutes.
 */
function generatePasswordResetToken(utilisateur) {
  const payload = {
    id: utilisateur.id,
    email: utilisateur.email,
  };

  try {
    // Générer le token avec expiration de 10 minutes
    return jwt.sign(payload, JWT_SECRET_RESET, { expiresIn: '10m' });
  } catch (error) {
    logger.error('Erreur lors de la génération du token de réinitialisation.', {
      error: error.message,
      stack: error.stack,
    });
    throw new Error('Impossible de générer le token de réinitialisation.');
  }
}


/**
 * Vérifie et décode le token de réinitialisation de mot de passe.
 * @param {string} token - Le token JWT à vérifier.
 * @returns {Object|null} - Retourne le payload décodé si le token est valide, sinon null.
 */
function verifyPasswordResetToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET_RESET);
  } catch (error) {
    logger.error('Erreur lors de la vérification du token de réinitialisation.', {
      error: error.message,
      stack: error.stack,
    });
    return null;
  }
}



module.exports = {
  generateToken,
  verifyToken,
  setAuthCookie,
  generatePasswordResetToken,
  verifyPasswordResetToken,
};


