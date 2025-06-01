import { FastifyRequest, FastifyReply } from 'fastify'
import * as catalogService from '../services/catalogService'
import {
  addCatalogGameSchema,
  updateCatalogGameSchema
} from '../schemas/catalogSchemas'

export async function addCatalogGame(request: FastifyRequest, reply: FastifyReply) {
  const result = addCatalogGameSchema.safeParse(request.body)
  if (!result.success) {
    return reply.code(400).send({ error: 'Datos inválidos', details: result.error.format() })
  }

  try {
    const game = await catalogService.createCatalogGame(result.data)
    return reply.code(201).send({ message: 'Juego añadido al catálogo', data: game })
  } catch (err: any) {
    if (err.message === 'El juego ya existe') {
      return reply.code(409).send({ error: err.message })
    }
    return reply.code(500).send({ error: 'Error interno' })
  }
}

export async function listCatalogGames(request: FastifyRequest, reply: FastifyReply) {
  const filters = request.query as Record<string, string>
  const games = await catalogService.listCatalogGames(filters)
  return reply.send({ data: games })
}

export async function getCatalogGameById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const game = await catalogService.getCatalogGameById(id)
  if (!game) return reply.code(404).send({ error: 'Juego no encontrado' })
  return reply.send({ data: game })
}

export async function updateCatalogGame(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const result = updateCatalogGameSchema.safeParse(request.body)
  if (!result.success) {
    return reply.code(400).send({ error: 'Datos inválidos', details: result.error.format() })
  }

  const updated = await catalogService.updateCatalogGame(id, result.data)
  if (!updated) return reply.code(404).send({ error: 'Juego no encontrado' })

  return reply.send({ message: 'Juego actualizado', data: updated })
}

export async function deleteCatalogGame(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const deleted = await catalogService.deleteCatalogGame(id)
  if (!deleted) return reply.code(404).send({ error: 'Juego no encontrado' })

  return reply.send({ message: 'Juego eliminado del catálogo' })
}
