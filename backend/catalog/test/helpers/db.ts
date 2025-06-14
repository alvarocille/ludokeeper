import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { beforeAll, afterAll, afterEach } from 'vitest'

// Instancia compartida para todas las pruebas
let mongo: MongoMemoryServer

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()
  await mongoose.connect(uri)
})

afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongo.stop()
})
