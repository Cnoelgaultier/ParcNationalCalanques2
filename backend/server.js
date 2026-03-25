const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ── Configuration MySQL ──────────────────────────────
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // ← ton utilisateur MySQL
  password: '',          // ← ton mot de passe MySQL
  database: 'calanques',   // ← le nom de ta base de données
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur MySQL :', err.message);
    return;
  }
  console.log('✅ MySQL connecté');
});

// ── Route : Inscription ──────────────────────────────
app.post('/register', (req, res) => {
  const { nom, prenom, email, password } = req.body;

  if (!nom || !prenom || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  // Vérifie si l'email existe déjà
  db.query('SELECT id FROM utilisateurs WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length > 0) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Insère le nouvel utilisateur
    const sql = 'INSERT INTO utilisateurs (nom, prenom, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [nom, prenom, email, password], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: 'Compte créé avec succès !' });
    });
  });
});

// ── Route : Connexion ────────────────────────────────
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis.' });
  }

  db.query('SELECT * FROM utilisateurs WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const user = results[0];
    res.json({
      message: 'Connexion réussie !',
      token: 'token_' + user.id, // remplace par JWT plus tard
      user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email },
    });
  });
});

// ── Démarrage du serveur ─────────────────────────────
app.listen(3000, () => {
  console.log('🚀 Serveur démarré sur http://localhost:3000');
});