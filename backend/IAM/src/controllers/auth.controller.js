const keycloakService = require("../services/keycloak.service");

// Controlador para registrar un nuevo usuario
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
        avatar_url: "", // Campo adicional opcional
        nickname: username, // Alias predefinido
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

// Controlador para autenticación de usuario
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

// Controlador para refrescar el token de acceso
async function refresh(req, res) {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ error: "Refresh token requerido" });
  }

  try {
    const data = await keycloakService.refreshToken(refresh_token);
    res.json(data);
  } catch (err) {
    console.error(
      "[Auth] Error al refrescar token:",
      err.response?.data || err.message
    );
    const status = err.response?.status || 500;
    res.status(status).json({ error: "No se pudo refrescar el token" });
  }
}

module.exports = { register, login, refresh };
