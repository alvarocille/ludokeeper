import { addGameSchema, updateGameSchema } from '../schemas/inventorySchemas'
import * as inventoryService from '../services/inventoryService'
import { AuthenticatedUser } from '../test/types/global'

/**
 * Crea una entrada de juego en el inventario del usuario autenticado.
 */
export async function addGame(request, reply) {
  const result = addGameSchema.safeParse(request.body)
  if (!result.success) {
    return reply.code(400).send({ error: 'Datos inválidos', details: result.error.format() })
  }

  const user = request.user as AuthenticatedUser
  const newEntry = await inventoryService.addGame(user.sub, result.data)

  return reply.code(201).send({
    message: 'Juego añadido al inventario',
    data: newEntry.toObject({ versionKey: false })
  })
}

/**
 * Devuelve todos los juegos del inventario del usuario autenticado.
 */
export async function getUserInventory(request, reply) {
  const user = request.user as AuthenticatedUser
  const inventory = await inventoryService.getUserInventory(user.sub)

  return reply.send({
    data: inventory.map(game => game.toObject({ versionKey: false }))
  })
}

/**
 * Devuelve un juego específico del inventario por ID.
 */
export async function getGameById(request, reply) {
  const user = request.user as AuthenticatedUser
  const { id } = request.params as { id: string }

  const game = await inventoryService.getGameById(user.sub, id)
  if (!game) {
    return reply.code(404).send({ error: 'Juego no encontrado' })
  }

  return reply.send({ data: game.toObject({ versionKey: false }) })
}

/**
 * Elimina un juego del inventario por ID.
 */
export async function deleteGame(request, reply) {
  const user = request.user as AuthenticatedUser
  const { id } = request.params as { id: string }

  const success = await inventoryService.deleteGame(user.sub, id)
  if (!success) {
    return reply.code(404).send({ error: 'Juego no encontrado o no autorizado' })
  }

  return reply.send({ message: 'Juego eliminado del inventario' })
}

/**
 * Actualiza un juego del inventario por ID.
 */
export async function updateGame(request, reply) {
  const user = request.user as AuthenticatedUser
  const { id } = request.params as { id: string }

  const result = updateGameSchema.safeParse(request.body)
  if (!result.success) {
    return reply.code(400).send({ error: 'Datos inválidos', details: result.error.format() })
  }

  const updated = await inventoryService.updateGame(user.sub, id, result.data)
  if (!updated) {
    return reply.code(404).send({ error: 'Juego no encontrado o no autorizado' })
  }

  return reply.send({
    message: 'Juego actualizado',
    data: updated.toObject({ versionKey: false })
  })
}
