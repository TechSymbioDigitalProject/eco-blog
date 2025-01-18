const fs = require('fs');
const path = require('path');
const sharp = require('sharp');


// Fonction pour la création d'un dossier pourun article si il n'existe pas 
function createArticleFolder(articleId) {
  const articleFolder = path.join(__dirname, '../uploads/media/images', `article${articleId}`);
  
  if (!fs.existsSync(articleFolder)) {
    fs.mkdirSync(articleFolder, { recursive: true });
  
  }
  
  return articleFolder;
};