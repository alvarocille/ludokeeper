const axios = require("axios");
const qs = require("qs");

// Variables de entorno necesarias para interactuar con Keycloak
const baseUrl = process.env.KEYCLOAK_URL;
const realm = process.env.KEYCLOAK_REALM;
const adminUser = process.env.KEYCLOAK_ADMIN_USER;
const adminPass = process.env.KEYCLOAK_ADMIN_PASSWORD;

/**
 * Solicita un token de acceso como administrador de Keycloak.
 */
async function getAdminToken() {
  const tokenUrl = `${baseUrl}/realms/master/protocol/openid-connect/token`;

  const data = qs.stringify({
    client_id: "admin-cli",
    grant_type: "password",
    username: adminUser,
    password: adminPass,
  });

  const res = await axios.post(tokenUrl, data, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data.access_token;
}

/**
 * Crea un nuevo usuario en Keycloak usando las credenciales del administrador.
 */
async function createUser({
  username,
  email,
  password,
  firstName,
  lastName,
  attributes,
}) {
  const token = await getAdminToken();

  const res = await axios.post(
    `${baseUrl}/admin/realms/${realm}/users`,
    {
      username,
      email,
      enabled: true,
      firstName,
      lastName,
      attributes,
      credentials: [
        {
          type: "password",
          value: password,
          temporary: false,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.status === 201;
}

/**
 * Realiza login contra el realm configurado y devuelve los tokens JWT.
 */
async function login({ username, password }) {
  const tokenUrl = `${baseUrl}/realms/${realm}/protocol/openid-connect/token`;

  const data = qs.stringify({
    client_id: process.env.KEYCLOAK_CLIENT_ID,
    grant_type: "password",
    username,
    password,
  });

  const res = await axios.post(tokenUrl, data, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data;
}

/**
 * Refresca el token JWT del usuario actual.
 */
async function refreshToken(refreshToken) {
  const tokenUrl = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const data = qs.stringify({
    client_id: process.env.KEYCLOAK_CLIENT_ID,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const res = await axios.post(tokenUrl, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res.data;
}

module.exports = { createUser, login, refreshToken };
