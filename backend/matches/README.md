# 🎮 Microservicio de Partidas – Juegos de Mesa

Este microservicio forma parte de la arquitectura modular de la aplicación *LudoKeeper*, centrada en la gestión de partidas de juegos de mesa. A diferencia de otros servicios más sofisticados, este microservicio está diseñado de forma sencilla para registrar, consultar y eliminar partidas asociadas a usuarios y juegos.

---

## 📌 Características principales

* 🔧 Construido con [Fastify](https://www.fastify.io/) y [Node.js](https://nodejs.org/)
* 🗃 Utiliza MongoDB como base de datos
* 🔐 Autenticación por JWT (clave pública RS256)
* 📦 Compatible con Docker y Docker Compose

---

## 🚀 Tecnologías utilizadas

* **Node.js + TypeScript**
* **Fastify** como framework HTTP
* **MongoDB** y **Mongoose** para la base de datos
* **JWT** autenticación por token
* **Docker** para ejecución en contenedores

---

## 📁 Estructura de carpetas

```bash
src/
├── controllers/         # Controladores de endpoints
├── models/              # Modelos Mongoose
├── routes/              # Definición de rutas y handlers
├── services/            # Lógica de negocio
├── middlewares/         # Autenticación y middlewares reutilizables
├── types/               # Tipos personalizados
├── index.ts             # Punto de entrada principal
├── .env                 # Variables de entorno
├── Dockerfile           # Dockerización del microservicio
├── docker-compose.yml   # Orquestación con MongoDB
└── README.md            # Documentación del microservicio
```

---

## 🚀 Instalación y uso local

### 1. Clona el repositorio

```bash
git clone https://github.com/alvarocille/ludokeeper.git
cd ludokeeper/backend/match
```

### 2. Prepara entorno

```bash
cp .env.example .env
cp public_key.pem.test public_key.pem
```

### 3. Instala dependencias

```bash
npm install
```

### 4. Ejecuta con Docker (opcional)

```bash
docker-compose up --build
```

### 5. Accede a la API

> Por defecto: [http://localhost:3003](http://localhost:3003)

---

## 📘 API REST

| Método | Ruta           | Descripción                          |
| ------ | -------------- | ------------------------------------ |
| GET    | `/matches`     | Lista todas las partidas del usuario |
| GET    | `/matches/:id` | Obtiene detalles de una partida      |
| POST   | `/matches`     | Crea una nueva partida               |
| PUT    | `/matches/:id` | Edita una partida existente          |
| DELETE | `/matches/:id` | Elimina una partida                  |

> ⚠️ Todos los endpoints requieren JWT en el encabezado:
>
> ```
> Authorization: Bearer <token>
> ```

---

## 📄 Licencia

MIT © Álvaro Cilleruelo Sinovas
