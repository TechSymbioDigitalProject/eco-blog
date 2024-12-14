const authService = require('../services/authService');

function authMiddleware(req, res, next) {
  try {
    // Récupérer le token JWT depuis le cookie
    const token = req.cookies.jwt;

    // Vérifier si le token existe
    if (!token) {
      logger.warn('Accès refusé : Token manquant.', { ip: req.ip, url: req.originalUrl });
      return res.status(401).json({ message: 'Accès non autorisé, token manquant.' });
    }

    // Vérifier et décoder le token via le service JWT
    const user = authService.verifyToken(token);

    // Ajouter les informations utilisateur à l'objet req pour les utiliser dans les contrôleurs
    req.user = user;

    // Journaliser un accès réussi
    logger.info('Accès autorisé.', { userId: user.id, email: user.email, url: req.originalUrl });

    // Passer au prochain middleware ou contrôleur
    next();


  } catch (err) {
      // Journaliser une erreur pour un token invalide ou expiré
      logger.error('Token invalide ou expiré.', {
        error: err.message,
        ip: req.ip,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
      });

      // Retourner une réponse d'erreur à l'utilisateur
      return res.status(403).json({ message: 'Token invalide ou expiré.' });

  }
}

module.exports = authMiddleware;