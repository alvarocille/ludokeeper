require('dotenv').config();
const express = require('express');
const { keycloak, memoryStore } = require('./config/keycloak');
const authRoutes = require('./routes/auth.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const rolesRoutes = require('./routes/roles.routes');
const cors = require('cors');

const app = express();
const PORT = process.env.IAM_PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.use(express.json());

app.use(
  require('express-session')({
    secret: process.env.SESSION_SECRET || 'clave',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

app.use(keycloak.middleware());

app.use(cors());

// Documentación Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas de autenticación
app.use('/auth', authRoutes);

app.use('/rol', rolesRoutes);

app.listen(PORT, HOST, () => {
  console.log(`🛡️  IAM corriendo en http://${HOST}:${PORT}`);
});