const express = require('express');
const router = express.Router();
const { keycloak } = require('../config/keycloak');

router.get('/admin', keycloak.protect('realm:admin'), (req, res) => {
  res.json({ mensaje: 'Ruta exclusiva para administradores' });
});

router.get('/jugador', keycloak.protect('realm:jugador'), (req, res) => {
  res.json({ mensaje: 'Ruta exclusiva para jugadores' });
});

module.exports = router;
