import cors from '@fastify/cors';
import fastifyJWT from '@fastify/jwt';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import fs from 'fs';
import path from 'path';
import matchRoutes from './routes/matchRoutes';
import { connectDB } from './utils/db';

dotenv.config()

async function main() {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'production'
  })

  try {
    await app.register(cors, {
      origin: ['http://localhost:8081'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    // Validación robusta de clave pública
    const publicKeyPath = path.resolve(process.env.JWT_PUBLIC_KEY_PATH || './public_key.pem')
    if (!fs.existsSync(publicKeyPath)) {
      throw new Error(`🔒 No se encontró el archivo de clave pública: ${publicKeyPath}`)
    }
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8')

    // Registro de JWT con clave pública
    await app.register(fastifyJWT, {
      secret: async () => publicKey,
    })

    // Conexión a MongoDB
    await connectDB()

    // Registro de rutas con autenticación
    await matchRoutes(app)

    // Manejador global de errores
    app.setErrorHandler((error, request, reply) => {
      app.log.error(error)
      reply.status(error.statusCode || 500).send({
        error: 'Error interno del servidor',
        message: error.message
      })
    })


    // Lanzamiento del servidor
    const PORT = parseInt(process.env.PORT || '3001', 10)
    await app.listen({ port: PORT, host: '0.0.0.0' })
    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`)
  } catch (err) {
    console.error('❌ Error crítico al iniciar el servidor:', err)
    process.exit(1)
  }
}

main()
