# 🧩 Microservicio de Inventario – Juegos de Mesa 🎲

Este microservicio forma parte de una aplicación modular orientada a la gestión personal de juegos de mesa. Desarrollado como parte del proyecto de fin de grado, este componente se encarga de almacenar, consultar y gestionar el inventario de juegos de un usuario autenticado.

---

## 📌 Características principales

- 📚 API RESTful construida con [Fastify](https://www.fastify.io/)
- 🧪 Testeado con [Vitest](https://vitest.dev/) y base de datos en memoria
- ✅ Validación de datos robusta con [Zod](https://zod.dev/)
- 🛡 Autenticación basada en JWT con claves públicas RS256
- 🧾 Documentación OpenAPI 3.0 generada automáticamente con Swagger UI
- 🐳 Listo para ejecutar en entornos Docker

---

## 🚀 Tecnologías utilizadas

- **Node.js + TypeScript**
- **Fastify** como framework HTTP
- **MongoDB** como base de datos
- **Zod** para validación de esquemas
- **JWT** autenticación por token
- **Swagger (OpenAPI)** para documentación de endpoints
- **Docker** para despliegue en contenedores
- **Vitest + MongoMemoryServer** para pruebas unitarias y de integración

---

## 📁 Estructura de carpetas

```bash
src/
├── controllers/          # Lógica de los endpoints (controladores HTTP)
│   └── inventoryController.ts
├── middlewares/          # Middlewares como autenticación JWT
│   └── auth.ts
├── models/               # Modelos Mongoose para MongoDB
│   └── userInventory.ts
├── routes/               # Rutas Fastify y su documentación Swagger
│   └── inventoryRoutes.ts
├── schemas/              # Validaciones Zod + conversión a JSON Schema
│   └── inventorySchemas.ts
├── services/             # Lógica de negocio desacoplada
│   └── inventoryService.ts
├── test/
│   └── inventory/
│       ├── helpers/      # Setup de entorno de pruebas y mocks
│       │   ├── authMock.ts
│       │   ├── db.ts
│       │   └── setupTestApp.ts
│       ├── inventory.test.ts           # Pruebas de integración (rutas)
│       └── inventoryService.test.ts    # Pruebas unitarias (servicios)
├── types/                # Tipado global o personalizado para Fastify
│   └── index.ts
├── .env                       # Variables de entorno
├── Dockerfile                 # Imagen del microservicio
├── docker-compose.yml         # Orquestación (inventario + MongoDB)
├── package.json / tsconfig.json / vitest.config.ts
├── public_key.pem            # Clave pública para verificación de JWT
├── setup.ts                  # Setup global de tests con MongoMemoryServer
└── README.md                 # Documentación del microservicio
```

---

## 🚀 Instalación y uso local (para uso especifico del microservicio)
### 1. Clona el repositorio completo
``` bash
git clone https://github.com/alvarocille/ludokeeper.git
cd ludokeeper/backend/inventory
```
### 2. Crea los archivos de entorno
``` bash
cp .env.test .env
cp public_key.pem.test public_key.pem
```

🔐 Si usas este microservicio de forma independiente, asegúrate de tener una clave pública válida en el archivo public_key.pem.
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
http://localhost:3001/docs
#### Endpoint protegido de ejemplo:
GET http://localhost:3001/inventory

---

## 🧪 Testing
Este microservicio incluye pruebas unitarias y de integración utilizando Vitest y MongoMemoryServer.
### Ejecutar pruebas
``` bash
npm run test
```

---

## 📘 API REST

La API del microservicio está documentada automáticamente con Swagger y accesible desde:

```
http://localhost:3001/docs
```

#### Endpoints principales

| Método | Ruta                 | Descripción                         |
|--------|----------------------|-------------------------------------|
| GET    | `/inventory`         | Lista todos los juegos del usuario |
| GET    | `/inventory/:id`     | Obtiene un juego por ID            |
| POST   | `/inventory`         | Agrega un juego al inventario      |
| PUT    | `/inventory/:id`     | Actualiza un juego existente       |
| DELETE | `/inventory/:id`     | Elimina un juego del inventario    |

> ⚠️ Todos los endpoints requieren un JWT válido en el encabezado:
> 
> ```
> Authorization: Bearer <token>
> ```

## 📄 Licencia

MIT © Álvaro Cilleruelo Sinovas

