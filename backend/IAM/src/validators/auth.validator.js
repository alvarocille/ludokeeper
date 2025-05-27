const Joi = require('joi');

// Expresión regular para contraseñas fuertes
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

// Validación para registro
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(passwordRegex)
    .message(
      'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial.'
    )
    .required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
});

// 🔐 Validación para login
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

module.exports = {
  registerSchema,
  loginSchema
};
