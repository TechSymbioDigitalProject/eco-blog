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

// Validation pour la mise a jour du rôle 
const validateUpdateUserRole = [
  // Validation pour roleId : doit être un nombre entier positif
  body('roleId')
    .notEmpty()
    .withMessage('Le rôle est obligatoire.')
    .isInt({ min: 1 })
    .withMessage('L\'ID du rôle doit être un nombre entier valide.'),
];


// Validation pour la mise à jour du profile utilisateur
const validateUpdateProfile = [
  // Validation du nom : Optionnel mais doit respecter le format
  body('nom')
    .optional()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']+$/)
    .withMessage('Le nom ne peut contenir que des lettres, accents, espaces, tirets et apostrophes.')
    .isLength({ max: 50 })
    .withMessage('Le nom ne doit pas dépasser 50 caractères.'),

  // Validation du prénom : Optionnel mais doit respecter le format
  body('prenom')
    .optional()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']+$/)
    .withMessage('Le prénom ne peut contenir que des lettres, accents, espaces, tirets et apostrophes.')
    .isLength({ max: 50 })
    .withMessage('Le prénom ne doit pas dépasser 50 caractères.'),

  // Validation de l'email : Optionnel mais doit être un email valide
  body('email')
    .optional()
    .isEmail()
    .withMessage('L\'adresse email est invalide.'),
];




// Route pour la création d'un nouvel utilisateur
router.post('/create', authMiddleware, isAdmin, validateCreateUser, userController.createUser);

// Route pour récupérer la liste de tous les utilisateurs
router.get('/', authMiddleware, isAdmin, userController.getAllUsers);

// Route pour supprimer un utilisateur
router.delete('/:id', authMiddleware, isAdmin, userController.deleteUser);

// Route pour mettre à jour le rôle utilisateur
router.put('/:id/update-role', authMiddleware, isAdmin, validateUpdateUserRole, userController.updateUserRole);

// Route pour la mise à jour du profil utilisateur
router.put('/update-profile/:id', authMiddleware, validateUpdateProfile, userController.updateUserProfile);


module.exports = router;