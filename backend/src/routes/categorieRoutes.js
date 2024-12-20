const express = require('express');
const categorieController = require('../controllers/categorieController');


const router = express.Router();


// Route pour récupérer toutes les catégories
router.get('/', categorieController.getAllCategories);


module.exports = router;