const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');


// Configuration du logger
const logger = winston.createLogger({
  level: 'info', // Niveau minimum des logs à enregistrer
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Ajoute un timestamp
    winston.format.json() // Format JSON pour les logs
  ),
  transports: [
    // Rotation des logs d'erreurs
    new DailyRotateFile({
      filename: path.join(__dirname, '../../logs/error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD', // Un nouveau fichier par jour
      level: 'error', // Enregistre uniquement les erreurs
      maxSize: '20m', // Taille maximale d'un fichier
      maxFiles: '14d', // Conserve les logs pendant 14 jours
    }),
    // Rotation des logs combinés
    new DailyRotateFile({
      filename: path.join(__dirname, '../../logs/combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

// En développement, afficher les logs dans la console
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(), // Logs en texte simple pour la console
    })
  );
}

module.exports = logger;