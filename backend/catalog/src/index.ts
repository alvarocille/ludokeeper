import Fastify from 'fastify'
import fastifyJWT from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import { catalogRoutes } from './routes/catalogRoutes'
import { requireAdmin, authenticate } from './middlewares/auth'
import { connectDB } from './utils/db'
import {
  addCatalogGameSchemaRef,
  updateCatalogGameSchemaRef,
  idParamSchemaRef
} from './schemas/catalogSchemas' // Asegúrate de tener estos exports

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
    await app.register(fastifyJWT as any, {
      secret: {
        public: publicKey,
        format: 'pem',
        algorithm: 'RS256'
      }
    })



    // 📄 Swagger OpenAPI
    await app.register(fastifySwagger as any, {
      openapi: {
        info: {
          title: 'Catálogo de Juegos de Mesa',
          version: '1.0.0',
          description: 'Microservicio para la gestión del catálogo público de juegos de mesa'
        },
        servers: [{ url: process.env.SWAGGER_SERVER_URL || 'http://localhost:3002' }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          },
          schemas: {
            AddGame: addCatalogGameSchemaRef,
            UpdateGame: updateCatalogGameSchemaRef,
            IdParam: idParamSchemaRef
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

    // 📦 MongoDB
    await connectDB()

    // 🛣️ Rutas del catálogo
    await catalogRoutes(app, { authenticate, requireAdmin })

    // 🧯 Manejador global de errores
    app.setErrorHandler((error, request, reply) => {
      app.log.error(error)
      reply.code(error.statusCode || 500).send({
        error: 'Error interno del servidor',
        message: error.message
      })
    })

    // 🚀 Lanzar servidor
    const PORT = parseInt(process.env.PORT || '3002', 10)
    await app.listen({ port: PORT, host: '0.0.0.0' })
    console.log(`🚀 Catálogo iniciado en http://localhost:${PORT}/docs`)
  } catch (err) {
    console.error('❌ Error crítico al iniciar el servidor:', err)
    process.exit(1)
  }
}

main()
