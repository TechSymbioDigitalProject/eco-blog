const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const Utilisateur = require('../models/Utilisateur');
const Role = require('../models/Role');
const logger = require('../config/logger');
const passwordService = require('../services/passwordService');
const emailService = require('../services/emailService');


// Méthode pour créer un utilisateur
async function createUser(req, res) {
  // Valider les données de la requête
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nom, prenom, email, roleId } = req.body;
    
    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await Utilisateur.findByEmail(email);
    if (existingUser) {
      logger.warn('Tentative de création d\'un utilisateur existanr.', { email });
      return res.status(400).json({ message: 'Unutilisateur avec cet email existe déjà.'});
    }

    // Générer un mot de passe provisoire sécurisé
    const provisionalPassword = passwordService.generatePassword();

    // Hacher le mot de passe provisoir avant stockage
    const hashedPassword = await bcrypt.hash(provisionalPassword, 10);

    // Créer un nouvel utilisateur dans la base de données
    const newUser = await Utilisateur.create({
      nom,
      prenom,
      email,
      password: hashedPassword,
      roleId,
    });

    // envoyer un email avec le mot de passe provisoire
    await emailService.sendNewUserEmail(email, provisionalPassword);

    // Journaliser la création réussie
    logger.info('Utilisateur créé avec succès.', {userId: newUser.id, email: newUser.email});

    // Réponse avec un message de confirmation
    res.status(201).json({
      message: 'Utilisateur créé avec succès. Un mot de passe procisoire a été envoyé par email.',
      utilisateur: {
        id: newUser.id,
        nom: newUser.nom,
        prenom: newUser.prenom,
        email: newUser.email,
        roleId: newUser.roleId,
      },
    });

  } catch (err) {
    // Journaliser les erreurs inattendues
    logger.error('Erreur lors de la création de l\'utilisateur', {
      error: err.message,
      stack: err.stack,
    });

    res.status(500).json({message: 'Une erreur est survenue lors de la création de l\'utilisateur.'});
  }
}


// Méthode pour récupérer la liste des utilisateurs
async function getAllUsers(req, res) {
  try {
    // Récupérer tous les utilisateurs avec leur rôle
    const utilisateurs = await Utilisateur.findAll();

    // Reformater pour le front-end
    const utilisateursFormattes = utilisateurs.map(user => ({
      id: user.id,
      nomComplet: `${user.prenom} ${user.nom}`,
      email: user.email,
      role: user.role || 'Rôle inconnu', // Gérer les cas où le rôle n'est pas trouvé
    }));

    res.status(200).json({
      message: 'Liste des utilisateurs récupérée avec succès.',
      utilisateurs: utilisateursFormattes,
    });
  } catch (err) {
    logger.error('Erreur lors de la récupération des utilisateurs.', {
      error: err.message,
      stack: err.stack,
    });

    res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération des utilisateurs.',
    });
  }
}


// Méthode pour supprimer un utilisateur
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    const utilisateur = await Utilisateur.findById(id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier le rôle de l'utilisateur
    const role = await Role.findById(utilisateur.roleId);
    if (role.nom === 'administrateur') {
      return res.status(403).json({ message: 'Impossible de supprimer un administrateur.' });
    }

    // Supprimer l'utilisateur
    const deleted = await Utilisateur.deleteById(id);
    if (deleted) {
      logger.info(`Utilisateur supprimé : ${id}`);
      return res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    }

    res.status(500).json({ message: 'Échec de la suppression de l\'utilisateur.' });
  } catch (err) {
    logger.error('Erreur lors de la suppression de l\'utilisateur', { error: err.message });
    res.status(500).json({ message: 'Une erreur est survenue.' });
  }
}


module.exports = {
  createUser,
  getAllUsers,
  deleteUser
};