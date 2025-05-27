const session = require('express-session');
const Keycloak = require('keycloak-connect');

// Almacén de sesión en memoria (requerido por Keycloak)
const memoryStore = new session.MemoryStore();

// Instancia de Keycloak con soporte de sesión
const keycloak = new Keycloak({ store: memoryStore });

module.exports = {
  keycloak,
  memoryStore
};
