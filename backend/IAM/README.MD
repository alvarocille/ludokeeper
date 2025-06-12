# 🔐 Microservicio de Autenticación – IAM

Este microservicio forma parte de una aplicación modular orientada a la gestión de juegos de mesa. Desarrollado como parte del proyecto de fin de grado, este componente se encarga de gestionar el registro, inicio de sesión y control de acceso de usuarios mediante Keycloak, siguiendo una arquitectura desacoplada y escalable.

---

## 📌 Características principales

- 🔐 Integración completa con [Keycloak](https://www.keycloak.org/) como proveedor de identidad
- ✅ Validación de datos con [Joi](https://joi.dev/)
- 📦 API RESTful construida con [Express.js](https://expressjs.com/)
- 🧪 Testeado con [Vitest](https://vitest.dev/) y [Supertest](https://github.com/visionmedia/supertest)
- 📄 Documentación con [Swagger UI](https://swagger.io/tools/swagger-ui/)
- 🐳 Preparado para ejecutarse en entornos Docker

---

## 🚀 Tecnologías utilizadas

- **Node.js**
- **Express** como framework HTTP
- **Keycloak** para gestión de identidades y roles
- **Joi** para validación de esquemas
- **Swagger (OpenAPI)** para documentación
- **Docker** para contenerización
- **Vitest + Supertest** para pruebas unitarias y de integración

---

## 📁 Estructura de carpetas

```bash
src/
├── config/               # Configuración de Keycloak y sesión
│   └── keycloak.js
├── controllers/          # Lógica de endpoints (register/login)
│   └── auth.controller.js
├── middlewares/          # Validación de datos con Joi
│   └── validate.js
├── routes/               # Definición de rutas de autenticación y roles
│   ├── auth.routes.js
│   └── roles.routes.js
├── services/             # Acceso a la API de Keycloak desde Node.js
│   └── keycloak.service.js
├── validators/           # Esquemas Joi
│   └── auth.validator.js
├── docs/                 # Swagger JSON para documentación OpenAPI
│   └── swagger.json
├── server.js             # Punto de entrada de la app
├── .env                  # Variables de entorno
├── Dockerfile            # Imagen de Docker
├── docker-compose.yml    # Orquestación de contenedor
└── README.md             # Documentación del microservicio
```

---

## 🚀 Instalación y uso local (para uso especifico del microservicio)
### 1. Clona el repositorio completo
``` bash
git clone https://github.com/alvarocille/ludokeeper.git
cd ludokeeper/backend/IAM
```
### 2. Crea los archivos de entorno
``` bash
cp .env.test .env
```
### 3. Instala las dependencias
``` bash
npm install
```
### 4. Lanza el microservicio y MongoDB con Docker
``` bash
docker-compose up --build
```
### 5. Accede a la API
#### Swagger UI:
http://localhost:3000/docs
#### Endpoint de ejemplo:
GET http://localhost:3000/auth/register

---

## 🧪 Testing
Este microservicio incluye pruebas de validación y respuestas HTTP.
### Ejecutar pruebas
``` bash
npm run test
```

---

## 📘 API REST

La API del microservicio está documentada automáticamente con Swagger y accesible desde:

```
http://localhost:3000/docs
```

### Endpoints principales

| Método | Ruta                 | Descripción                                |
|--------|----------------------|--------------------------------------------|
| POST   | `/auth/register`     | Registra un nuevo usuario                  |
| POST   | `/auth/login`        | Inicia sesión y devuelve un token JWT      |
| POST   | `/auth/refresh`      | Refresca el token JWT del usuario activo   |
| GET    | `/rol/admin`         | Ruta protegida, accesible solo por admins  |
| GET    | `/rol/jugador`       | Ruta protegida, accesible solo por jugadores |

> ⚠️ Los endpoints protegidos requieren un JWT válido en el encabezado:
> ```
> Authorization: Bearer <token>
> ```

## 📄 Licencia

MIT © Álvaro Cilleruelo Sinovas

