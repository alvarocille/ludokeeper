// 🌍 Carga de variables de entorno
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const { keycloak, memoryStore } = require('./config/keycloak');
const authRoutes = require('./routes/auth.routes');
const rolesRoutes = require('./routes/roles.routes');
const swaggerDocument = require('./docs/swagger.json');

const app = express();

// Configuración de host y puerto
const PORT = process.env.IAM_PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Middleware de parseo de JSON
app.use(express.json());

// Sesión necesaria para Keycloak
app.use(session({
  secret: process.env.SESSION_SECRET || 'clave', // ⚠️ Mover a .env seguro
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
}));

// Middleware de Keycloak
app.use(keycloak.middleware());

// Permitir CORS en todos los orígenes (configurable en .env si lo prefieres)
app.use(cors());

// Documentación Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas para gestión de roles
app.use('/rol', rolesRoutes);

// Inicio del servidor
app.listen(PORT, HOST, () => {
  console.log(`🛡️  IAM corriendo en http://${HOST}:${PORT}`);
});
