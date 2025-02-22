const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const logger = require('../config/logger');


// Fonction pour la création d'un dossier pourun article si il n'existe pas 
function createArticleFolder(articleId) {
  const articleFolder = path.join(__dirname, '../uploads/media/images', `article${articleId}`);
  
  if (!fs.existsSync(articleFolder)) {
    fs.mkdirSync(articleFolder, { recursive: true });
    logger.info(`Dossier créé : ${articleFolder}`); 
  } else {
    logger.info(`Dossier déjà existant : ${articleFolder}`);
  }
  
  return articleFolder;
};

function generateMainImageName(articleId) {
  return `main-article${articleId}.webp`;
}

// Fonction pour générer un nom de fichier unique pour une image
function generateImageName(articleId, mediaId) {
  return `image-article${articleId}-media${mediaId}.webp`;
}

// Fonction pour le traitement de l'image enregistrement au format webp et redimentionnement 800x800 maximum
async function processImage(imageBuffer, destinationPath) {
  try {
    await sharp(imageBuffer)
      .resize(800, 800, { fit: 'inside' }) // Redimensionne tout en maintenant les proportions
      .toFormat('webp') // Convertit en WebP
      .toFile(destinationPath);
    
    logger.info(`Image traitée et enregistrée : ${destinationPath}`);

  } catch (error) {
    logger.error('Erreur lors du traitement de l\'image :', { error: error.message });

    throw error;
  }
}


// fonction pour nettoyer le dossier temp 
function clearTempFolder(tempFolderPath) {
  fs.readdir(tempFolderPath, (err, files) => {
    if (err) {
      logger.error('Erreur lors de la lecture du dossier temporaire', { error: err.message });
      return;
    }

    for (const file of files) {
      const filePath = path.join(tempFolderPath, file);

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          logger.error('Erreur lors de la suppression d\'un fichier temporaire', { file: filePath, error: unlinkErr.message });
        } else {
          logger.info('Fichier temporaire supprimé', { file: filePath });
        }
      });
    }
  });
}


module.exports = {
  createArticleFolder,
  generateMainImageName,
  generateImageName,
  processImage,
  clearTempFolder,
}