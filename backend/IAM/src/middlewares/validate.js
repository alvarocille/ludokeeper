/**
 * Middleware de validación usando un esquema Joi.
 * Si los datos son inválidos, responde con errores.
 */
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajes = error.details.map(d => d.message);
      return res.status(400).json({ errores: mensajes });
    }

    next();
  };
}

module.exports = validate;
