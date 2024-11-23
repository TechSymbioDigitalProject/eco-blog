// Charger les variables d'environnement
require('dotenv').config(); 
const { Pool } = require('pg');

// Création d'une nouvelle instance de Pool avec les variables d'environnement
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Exporter la fonction de requête pour être utilisée dans d'autres fichiers
module.exports = {
  query: (text, params) => pool.query(text, params),
};
