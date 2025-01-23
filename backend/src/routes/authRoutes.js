const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


// Définir les règles de validation
const validateLogin = [
  // Validation de l'email
  body('email')
    .isEmail()
    .withMessage('L\'adresse email est invalide.'),

  // Validation du mot de passe
  body('password')
    .isLength({ min: 12 })
    .withMessage('Le mot de passe doit contenir au moins 12 caractères.')
    .matches(/[A-Z]/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule.')
    .matches(/[a-z]/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule.')
    .matches(/[0-9]/)
    .withMessage('Le mot de passe doit contenir au moins un chiffre.')
    .matches(/[\W_]/)
    .withMessage('Le mot de passe doit contenir au moins un caractère spécial.'),
];

// Définir les règles de validation pour la réinitialisation du mot de passe
const validatePasswordResetRequest = [
  body('email')
    .isEmail()
    .withMessage('L\'adresse email est invalide.'),
];


// Règles de validation pour la réinitialisation du mot de passe
const validateResetPassword = [
  body('token').notEmpty().withMessage('Le token est requis.'),
  body('password')
    .isLength({ min: 12 })
    .withMessage('Le mot de passe doit contenir au moins 12 caractères.')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule.')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une minuscule.')
    .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre.')
    .matches(/[\W_]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial.'),
  body('confirmPassword')
    .notEmpty().withMessage('La confirmation du mot de passe est requise.')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Les mots de passe ne correspondent pas.'),
];



// Route de connexion avec validation des données
router.post('/login', validateLogin, authController.login);

// Route de déconnexion (protégée)
router.post('/logout', authMiddleware, authController.logout);

// Route pour la demande de réinitialisation du mot de passe
router.post('/password-reset-request', validatePasswordResetRequest, authController.requestPasswordReset);

// Route pour réinitialiser le mot de passe
router.post('/reset-password', validateResetPassword, authController.resetPassword);

// Route pour vérifier si l'utilisateur est connecté
router.get('/check-session', authController.checkSession);

module.exports = router;