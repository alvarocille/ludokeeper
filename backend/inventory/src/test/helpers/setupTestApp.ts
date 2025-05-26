import fastify from 'fastify'
import mongoose from 'mongoose'
import { inventoryRoutes } from '../../routes/inventoryRoutes'
import { mockAuthenticate } from './authMock'

export async function buildTestApp() {
  const app = fastify()

  if (!globalThis.__MONGO_URI__) throw new Error('❌ Mongo URI no definido')
  await mongoose.connect(globalThis.__MONGO_URI__)

  await inventoryRoutes(app, mockAuthenticate)

  return app
}
