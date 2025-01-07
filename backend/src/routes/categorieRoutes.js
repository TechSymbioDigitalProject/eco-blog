const express = require('express');
const categorieController = require('../controllers/categorieController');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/roleMiddleware');


const router = express.Router();


// Règles de validation pour la création d'une catégorie
const validateCreateCategorie = [
  body('nom')
    .notEmpty()
    .withMessage('Le nom de la catégorie est obligatoire.')
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
    .withMessage('Le nom de la catégorie ne peut contenir que des lettres et des espaces.')
    .isLength({ max: 50 })
    .withMessage('Le nom de la catégorie ne doit pas dépasser 50 caractères.'),

  body('description')
    .notEmpty()
    .isLength({ max: 250 })
    .withMessage('La description ne doit pas dépasser 250 caractères.'),
];


// Règle de validation pour la mise à jour d"une catégorie
const validateUpdateCategorie = [
  body('nom')
    .optional()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
    .withMessage('Le nom de la catégorie ne peut contenir que des lettres et des espaces.')
    .isLength({ max: 50})
    .withMessage('Le nom de la catégorie ne doit pas dépasser 50 caractères.'),

  body('description')
    .optional(),
    .isLength({ max: 250 })
    .withMessage('La description ne doit pas dépasser 250 caractères.'),
]

// Route pour récupérer toutes les catégories
router.get('/', categorieController.getAllCategories);

// Route pour créer une nouvelle catégorie
router.post('/create', authMiddleware, isAdmin, validateCreateCategorie, categorieController.createCategorie);

// Route pour mettre à jour une catégorie existante
router.put('/:id/update', authMiddleware, isAdmin, validateUpdateCategorie, categorieController.updateCategorie);


module.exports = router;