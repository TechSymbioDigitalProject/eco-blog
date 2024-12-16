# eco-blog

# installation du projet 
  1. Cloner le dépot git https://github.com/TechSymbioDigitalProject/eco-blog.git
  2. Se déplacer dans le répertoire du projet backend eco-blog/backend
  3. Installer les dépendances via la commande npm install
  4. Créer le fichier .env à la racine du projet backend avec les variables d'environnement suivantes: 
    PGUSER=postgres
    PGPASSWORD="votre mot de passe"
    PGHOST=localhost
    PGDATABASE=blog_db
    PGPORT=5432
    PORT=3001 
    JWT_SECRET="définir une clé secrète pour la création du JWT lors de la connexion de l'utilisateur"
    JWT_SECRET_RESET="définir une clé secrète pour générer un JWT de demande de réinitialisation de mot de passe
    EMAIL_USER="adresse mail du compte chargé de l envoi des email"
    EMAIL_PASSWORD="mot de passe du compte chargé d envoyer les email"
    NODE_ENV=development "pour le fonctionnement du logger en mode developpement (affichage des erreur server dans la console et journalisation en production). 
    


    ## Table des matières

### Authentification
- [Connexion utilisateur](./backend/docs/auth/login.md),
- [Déconnexion utilisateur](./backend//docs/auth/logout.md),
- [Demande de réinitialisation du mot de passe](./backend//docs/auth/reset-password-request.md)
- [Changement du mot de passe](./backend//docs/auth/reset-password.md)


### Utilisateur
- [Création d'un utilisateur](./backend/docs/user/create-user.md),
- [Récupérer les utilisateurs](./backend/docs/user/get-all-users.md),


### Sécurité
- [Protection CSRF](./backend/docs/securite/csrf-token.md),