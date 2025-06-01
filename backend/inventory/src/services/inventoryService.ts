import { IUserInventory } from '../models/userInventory'

export async function createCatalogGame(data: any) {
  const exists = await CatalogGame.findOne({ name: data.name })
  if (exists) throw new Error('El juego ya existe')

  const game = new IUserInventory(data)
  await game.save()
  return game
}

export async function listCatalogGames(filters: Record<string, string>) {
  const {
    name, category, mechanic, publisher, minPlayers, maxPlayers, yearPublished
  } = filters

  const query: Record<string, any> = {}
  if (name) query.name = new RegExp(name, 'i')
  if (category) query.categories = category
  if (mechanic) query.mechanics = mechanic
  if (publisher) query.publisher = publisher
  if (yearPublished) query.yearPublished = parseInt(yearPublished)
  if (minPlayers) query.minPlayers = { $gte: parseInt(minPlayers) }
  if (maxPlayers) query.maxPlayers = { $lte: parseInt(maxPlayers) }

  return await CatalogGame.find(query)
}

export async function getCatalogGameById(id: string) {
  return await CatalogGame.findById(id)
}

export async function updateCatalogGame(id: string, data: any) {
  return await CatalogGame.findByIdAndUpdate(id, data, { new: true })
}

export async function deleteCatalogGame(id: string): Promise<boolean> {
  const deleted = await CatalogGame.findByIdAndDelete(id)
  return !!deleted
}

import { UserInventory } from '../models/userInventory'
import { CustomDataCreate, CustomDataUpdate } from '../types/customData'

// Define GameBase y UpdateGame usando CustomDataBase
interface GameBase {
  userId: string
  source: 'catalog' | 'custom'
  gameId?: string
  customData?: CustomDataCreate
  acquisitionDate?: string
  notes?: string
}

interface UpdateGame {
  notes?: string
  acquisitionDate?: string
  customData?: CustomDataUpdate
}


/**
 * Agrega un juego al inventario del usuario.
 */
export async function addGame(userId: string, data: Omit<GameBase, 'userId'>) {
  const newEntry = new UserInventory({ userId, ...data })
  await newEntry.save()
  return newEntry
}

/**
 * Devuelve todos los juegos del inventario de un usuario ordenados por fecha.
 */
export async function getUserInventory(userId: string, filters: Record<string, string> = {}) {
  const query: any = { userId }

  if (filters.name) query['customData.name'] = new RegExp(filters.name, 'i')
  if (filters.category) query['customData.categories'] = filters.category
  if (filters.mechanic) query['customData.mechanics'] = filters.mechanic
  if (filters.year) query['customData.yearPublished'] = parseInt(filters.year)

  return UserInventory.find(query)
}


/**
 * Busca un juego específico del inventario del usuario por ID.
 */
export async function getGameById(userId: string, gameId: string) {
  return await UserInventory.findOne({ _id: gameId, userId })
}

/**
 * Elimina un juego del inventario.
 * Devuelve true si se eliminó, false si no se encontró.
 */
export async function deleteGame(userId: string, gameId: string): Promise<boolean> {
  const deleted = await UserInventory.findOneAndDelete({ _id: gameId, userId })
  return !!deleted
}

/**
 * Actualiza los campos permitidos de un juego del inventario.
 */
export async function updateGame(userId: string, gameId: string, updates: UpdateGame) {
  const existing = await UserInventory.findOne({ _id: gameId, userId })
  if (!existing) return null

  if (updates.customData) {
    // Actualizar SOLO los campos presentes y garantizar que name no desaparezca
    existing.customData = {
      ...existing.customData,
      ...updates.customData,
      // Si updates.customData.name está undefined, mantener el name existente
      name: updates.customData.name ?? existing.customData?.name ?? ''
    }
  }

  if (updates.notes !== undefined) {
    existing.notes = updates.notes
  }

  if (updates.acquisitionDate !== undefined) {
    const parsedDate = new Date(updates.acquisitionDate)
    if (!isNaN(parsedDate.getTime())) {
      existing.acquisitionDate = parsedDate
    }
  }

  await existing.save()
  return existing
}


