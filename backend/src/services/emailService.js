require('dotenv').config();
const nodemailer = require('nodemailer');
const logger = require('../config/logger');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);


// Configuration du transporteur d'emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


/**
 * Envoie un email de réinitialisation de mot de passe.
 * @param {string} to - Adresse e-mail du destinataire.
 * @param {string} resetToken - Token de réinitialisation.
 */

async function sendPasswordResetEmail(to, resetToken) {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  // Contenu de l'email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Réinitialisation de votre mot de passe',
    text: `Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`,
    html: `
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
      <a href="${resetLink}" style="color: blue; font-weight: bold;">Réinitialiser mon mot de passe</a>
      <p>Ce lien expirera dans 15 minutes.</p>
    `,
  };

  // Envoyer l'email avec gestion des erreurs
  try {
    await transporter.sendMail(mailOptions);
    logger.info('Email de réinitialisation envoyé avec succès.', { to });

  } catch (err) {
    logger.error('Erreur lors de l\'envoi de l\'e-mail de réinitialisation.', {
      error: err.message,
      to,
    });

    throw new Error('Impossible d\'envoyer l\'e-mail de réinitialisation.');
  }
}


module.exports = {
  sendPasswordResetEmail,
};