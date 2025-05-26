import fastifyJWT from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import dotenv from 'dotenv'
import Fastify from 'fastify'
import fs from 'fs'
import path from 'path'

import { authenticate } from './middlewares/auth'
import { inventoryRoutes } from './routes/inventoryRoutes'
import {
  addGameSchemaRef,
  idParamSchemaRef,
  updateGameSchemaRef
} from './schemas/inventorySchemas'; // 👈 asegurarse de exportarlos
import { connectDB } from './utils/db'

dotenv.config()

async function main() {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'production'
  })

  try {
    // ✅ Validación robusta de clave pública
    const publicKeyPath = path.resolve(process.env.JWT_PUBLIC_KEY_PATH || './public_key.pem')
    if (!fs.existsSync(publicKeyPath)) {
      throw new Error(`🔒 No se encontró el archivo de clave pública: ${publicKeyPath}`)
    }
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8')

    // 🔐 Registro de JWT con clave pública
    await app.register(fastifyJWT, {
      secret: {
        public: publicKey,
        format: 'pem',
        algorithm: 'RS256'
      }
    })

    // 📘 Registro de Swagger (OpenAPI)
    await app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Inventory API',
          version: '1.0.0',
          description: 'Microservicio para gestionar el inventario de juegos de mesa'
        },
        servers: [{ url: process.env.SWAGGER_SERVER_URL || 'http://localhost:3001' }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          },
          schemas: {
            AddGame: addGameSchemaRef,        // Schema POST
            UpdateGame: updateGameSchemaRef,  // Schema PUT
            IdParam: idParamSchemaRef         // Schema params
          }
        },
        security: [{ bearerAuth: [] }]
      }
    })

    await app.register(fastifySwaggerUi, {
      routePrefix: '/docs',
      staticCSP: true,
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false
      }
    })

    // 🗄️ Conexión a MongoDB
    await connectDB()

    // 🚏 Registro de rutas con autenticación
    await inventoryRoutes(app, authenticate)

    // 🧯 Manejador global de errores
    app.setErrorHandler((error, reply) => {
      app.log.error(error)
      reply.status(error.statusCode || 500).send({
        error: 'Error interno del servidor',
        message: error.message
      })
    })

    // 🚀 Lanzamiento del servidor
    const PORT = parseInt(process.env.PORT || '3001', 10)
    await app.listen({ port: PORT, host: '0.0.0.0' })
    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`)
  } catch (err) {
    console.error('❌ Error crítico al iniciar el servidor:', err)
    process.exit(1)
  }
}

main()
