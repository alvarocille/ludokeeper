const express = require('express');
const router = express.Router();

const { register, login, refresh } = require('../controllers/auth.controller');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const validate = require('../middlewares/validate');

// Registro de usuario nuevo
router.post('/register', validate(registerSchema), register);

// Login del usuario
router.post('/login', validate(loginSchema), login);

router.post('/refresh', refresh);


module.exports = router;
