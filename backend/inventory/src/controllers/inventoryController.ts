import { addGameSchema, inventoryQuerySchema, updateGameSchema } from '../schemas/inventorySchemas';
import * as inventoryService from '../services/inventoryService';
import { AuthenticatedUser } from '../test/types/global';

/**
 * POST /inventory
 * Agrega un nuevo juego al inventario del usuario autenticado.
 */
export async function addGame(request, reply) {
  const parsed = addGameSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.format() });
  }

  const user = request.user as AuthenticatedUser;
  const authHeader = request.headers.authorization;

  const game = await inventoryService.addGame(user.sub, parsed.data, authHeader);

  return reply.code(201).send({
    message: 'Juego añadido al inventario',
    data: game.toObject({ versionKey: false })
  });
}



/**
 * GET /inventory
 * Lista todos los juegos del inventario del usuario.
 */
export async function getUserInventory(request, reply) {
  const user = request.user as AuthenticatedUser

  // Validación segura del query usando el schema de Zod
  const parsed = inventoryQuerySchema.safeParse(request.query || {})

  if (!parsed.success) {
    return reply.code(400).send({
      error: 'Parámetros de filtro inválidos',
      details: parsed.error.format()
    })
  }

  const filters = parsed.data
   const token = request.headers.authorization

  const inventory = await inventoryService.getUserInventory(user.sub, filters, token)

  return reply.send({
    data: inventory
  })
}


/**
 * GET /inventory/:id
 * Obtiene los datos de un juego específico del inventario.
 */
export async function getGameById(request, reply) {
  const user = request.user as AuthenticatedUser
  const { id } = request.params as { id: string }

  const game = await inventoryService.getGameById(user.sub, id)
  if (!game) {
    return reply.code(404).send({ error: 'Juego no encontrado' })
  }

  return reply.send({ data: game })
}

/**
 * DELETE /inventory/:id
 * Elimina un juego del inventario del usuario por ID.
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
 * PUT /inventory/:id
 * Actualiza los campos de un juego del inventario.
 */
export async function updateGame(request, reply) {
  const user = request.user as AuthenticatedUser
  const { id } = request.params as { id: string }

  const parsed = updateGameSchema.safeParse(request.body)
  if (!parsed.success) {
    return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.format() })
  }

  const updated = await inventoryService.updateGame(user.sub, id, parsed.data)
  if (!updated) {
    return reply.code(404).send({ error: 'Juego no encontrado o no autorizado' })
  }

  return reply.send({
    message: 'Juego actualizado',
    data: updated.toObject({ versionKey: false })
  })
}
