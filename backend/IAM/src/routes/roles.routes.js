const express = require('express');
const router = express.Router();
const { keycloak } = require('../config/keycloak');

// Ruta exclusiva para administradores (rol: realm-admin)
router.get('/admin', keycloak.protect('realm:admin'), (req, res) => {
  res.json({ mensaje: 'Ruta exclusiva para administradores' });
});

// Ruta exclusiva para jugadores (rol: realm-jugador)
router.get('/jugador', keycloak.protect('realm:jugador'), (req, res) => {
  res.json({ mensaje: 'Ruta exclusiva para jugadores' });
});

module.exports = router;
