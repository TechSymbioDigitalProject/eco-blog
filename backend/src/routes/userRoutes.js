const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/roleMiddleware');

const router = express.Router();

// Validation pour la création d'un utilisateur
const validateCreateUser = [
  // Validation du nom : lettres (majuscules/minuscules/accents), tirets, espaces, apostrophes, max 50 caractères
  body('nom')
    .notEmpty()
    .withMessage('Le nom est obligatoire.')
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']+$/)
    .withMessage('Le nom ne peut contenir que des lettres, accents, espaces, tirets et apostrophes.')
    .isLength({ max: 50 })
    .withMessage('Le nom ne doit pas dépasser 50 caractères.'),

  // Validation du prénom : mêmes règles que pour le nom
  body('prenom')
    .notEmpty()
    .withMessage('Le prénom est obligatoire.')
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']+$/)
    .withMessage('Le prénom ne peut contenir que des lettres, accents, espaces, tirets et apostrophes.')
    .isLength({ max: 50 })
    .withMessage('Le prénom ne doit pas dépasser 50 caractères.'),

  // Validation de l'email
  body('email')
    .notEmpty()
    .withMessage('L\'adresse email est obligatoire.')
    .isEmail()
    .withMessage('L\'adresse email est invalide.'),

  // Validation de roleId : nombre entier uniquement
  body('roleId')
    .notEmpty()
    .withMessage('Le rôle est obligatoire.')
    .isInt()
    .withMessage('L\'ID du rôle doit être un nombre entier.'),
];


// Route pour la création d'un nouvel utilisateur
router.post('/create', authMiddleware, isAdmin, validateCreateUser, userController.createUser);

// Route pour récupérer la liste de tous les utilisateurs
router.get('/', authMiddleware, isAdmin, userController.getAllUsers);


module.exports = router;