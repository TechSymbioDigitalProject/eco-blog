const express = require('express');
const articleController = require('../controllers/articleController');

const router = express.Router();


// Route pour récupérer les articles pour la page d'accueil
router.get('/homepage', articleController.getAllHomepageArticles);


module.exports = router;