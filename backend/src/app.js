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

// Création de l'application express
const app = express();

// Configurer CORS
app.use(cors({
  origin: 'http://localhost:5173', // Autoriser uniquement cette origine (front-end)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
  credentials: true, // Si vous utilisez des cookies ou des sessions
}));

// Analyse des requêtes JSON
app.use(express.json());

// Servir les fichiers statiques (par exemple, des images téléchargées)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware pour parser les cookies
app.use(cookieParser());

// Activer la protection CSRF avec un cookie
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

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
