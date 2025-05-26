import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { afterAll, afterEach, beforeAll } from 'vitest'

let mongo: MongoMemoryServer

beforeAll(async () => {
  // Iniciar instancia en memoria de MongoDB
  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()
  console.log('✅ MongoMemory URI generado:', uri)

  // Guardar URI global para acceso en tests
  globalThis.__MONGO_URI__ = uri

  // Conectar Mongoose a la base temporal
  await mongoose.connect(uri)
})

afterEach(async () => {
  // Limpiar colecciones después de cada test
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

afterAll(async () => {
  // Cerrar y limpiar recursos
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongo.stop()
})
