const keycloakService = require("../services/keycloak.service");

async function register(req, res) {
  const { username, email, password, firstName, lastName } = req.body;

  try {
    await keycloakService.createUser({
      username,
      email,
      password,
      firstName,
      lastName,
      attributes: {
        avatar_url: "",
        nickname: username,
      },
    });

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    console.error(err);
    const status = err.response?.status || 500;
    const mensaje =
      status === 409 ? "El usuario ya existe" : "Error al registrar el usuario";

    res.status(status).json({ error: mensaje });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const tokenData = await keycloakService.login({ username, password });
    res.json(tokenData);
  } catch (err) {
    console.error(err);
    const status = err.response?.status || 401;
    const mensaje =
      status === 401 ? "Credenciales inválidas" : "Error al iniciar sesión";

    res.status(status).json({ error: mensaje });
  }
}

module.exports = { register, login };
