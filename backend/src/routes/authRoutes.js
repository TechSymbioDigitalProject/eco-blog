const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

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

// Route de connexion avec validation des données
router.post('/login', validateLogin, authController.login);

module.exports = router;