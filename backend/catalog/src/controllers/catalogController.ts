import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import {
  addCatalogGameSchema,
  catalogGameQuerySchema,
  updateCatalogGameSchema
} from '../schemas/catalogSchemas'
import * as catalogService from '../services/catalogService'

type CatalogFilters = z.infer<typeof catalogGameQuerySchema>

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

export async function listCatalogGames(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Normaliza el prototipo nulo
  const rawQuery = { ...(typeof request.query === 'object' && request.query !== null ? request.query : {}) } as Record<string, string>;

  // Limpia valores vacíos
  const cleanedQuery: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(rawQuery)) {
    cleanedQuery[key] = value?.trim?.() === '' ? undefined : value;
  }

  // Validación con Zod
  const result = catalogGameQuerySchema.safeParse(cleanedQuery);

  console.log('✅ Query recibida:', cleanedQuery);
  console.log('🔍 Prototipo:', Object.getPrototypeOf(request.query));

  if (!result.success) {
    console.error('❌ Validación fallida:', result.error.flatten());
    return reply.status(400).send({ error: 'Parámetros inválidos', details: result.error.format() });
  }

  // Ya está validado
  const games = await catalogService.listCatalogGames(result.data);
  return reply.send({ data: games });
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
