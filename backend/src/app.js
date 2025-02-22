const dotenv = require('dotenv');
// Charger les variables d'environnement
dotenv.config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categorieRoutes = require('./routes/categorieRoutes');
const articleRoutes = require('./routes/articleRoutes');

// Création de l'application express
const app = express();

// Configurer CORS
app.use(cors({
  origin: 'http://localhost:5173', // Autoriser uniquement cette origine (front-end)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'], // En-têtes autorisés
  credentials: true, // Si vous utilisez des cookies ou des sessions
}));

// Analyse des requêtes JSON
app.use(express.json());

// Servir les fichiers statiques (par exemple, des images téléchargées)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware pour parser les cookies
app.use(cookieParser());

// Activer la protection CSRF sauf pour certaines routes spécifiques
const csrfProtection = csrf({ cookie: true });

app.use((req, res, next) => {
  // Liste des routes à exclure de la protection CSRF
  const excludedRoutes = ['/api/auth/login'];

  // Si la route actuelle est dans la liste des exclusions, continuer sans appliquer CSRF
  if (excludedRoutes.includes(req.path)) {
    return next();
  }

  // Sinon, appliquer la protection CSRF
  csrfProtection(req, res, next);
});

// Route pour envoyer le token CSRF au front-end
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
})

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes Utilisateur
app.use('/api/users', userRoutes);

// Routes pour les catégories
app.use('/api/categories', categorieRoutes);

// Routes pour les articles
app.use('/api/articles', articleRoutes);

// Route de bienvenue
// Vérifier que le serveur fonctionne correctement
app.get('/', (req, res) => {
  res.send('Server Express est opérationnel');
});

// Définition du port écouté par le serveur
const PORT = process.env.PORT || 3001;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Server en cours d'exécution sur le port ${PORT}`);
});
