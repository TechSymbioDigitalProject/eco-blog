const express = require('express');
const { body } = require('express-validator');
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');


// Configuration de multer pour le stockage temporaire des fichiers
const upload = multer({
  dest: path.join(__dirname, '../uploads/temp'), // Dossier temporaire
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB par fichier
});


const router = express.Router();


// Route pour récupérer les articles pour la page d'accueil
router.get('/homepage', articleController.getAllHomepageArticles);

// Route pour la pagination des articles
router.get('/paginated', articleController.getPaginatedArticles);


// Règles de validation pour la création d'un article
const validateCreateArticle = [
  body('titre')
    .notEmpty()
    .withMessage('Le titre de l\'article est obligatoire.')
    .isLength({ max: 255 })
    .withMessage('Le titre de l\'article ne doit pas dépasser 255 caractères.'),
  body('categorie_id')
    .notEmpty()
    .withMessage('La catégorie est obligatoire.')
    .isInt()
    .withMessage('L\'ID de la catégorie doit être un entier.'),
  body('sections')
    .isArray({ min: 1 })
    .withMessage('Un article doit contenir au moins une section.'),
  body('sections.*.titre')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Le titre d\'une section ne doit pas dépasser 255 caractères.'),
  body('sections.*.paragraphes')
    .isArray()
    .withMessage('Les paragraphes doivent être un tableau.'),
  body('sections.*.medias')
    .optional()
    .isArray()
    .withMessage('Les médias doivent être un tableau.'),
];

// Route pour la création d'un article
router.post(
  '/create',
  authMiddleware,
  upload.any(),
  validateCreateArticle,
  articleController.createArticleComplet
);


module.exports = router;