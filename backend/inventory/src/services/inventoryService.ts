import { UserInventory } from '../models/userInventory'

interface GameBase {
  userId: string
  source: 'catalog' | 'custom'
  gameId?: string
  customData?: {
    name: string
    description?: string
    players?: {
      min: number
      max: number
    }
    duration?: number
    imageUrl?: string
  }
  acquisitionDate?: string
  notes?: string
}

interface UpdateGame {
  notes?: string
  acquisitionDate?: string
  customData?: {
    name?: string
    description?: string
    players?: {
      min?: number
      max?: number
    }
    duration?: number
    imageUrl?: string
  }
}

/**
 * Agrega un juego al inventario del usuario.
 * Acepta juegos personalizados o referencias a catálogo.
 */
export async function addGame(userId: string, data: Omit<GameBase, 'userId'>) {
  const newEntry = new UserInventory({ userId, ...data })
  await newEntry.save()
  return newEntry
}

/**
 * Devuelve todos los juegos del inventario de un usuario ordenados por fecha.
 */
export async function getUserInventory(userId: string) {
  return await UserInventory.find({ userId }).sort({ createdAt: -1 })
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
 * Actualiza un juego del inventario del usuario.
 * Permite sobrescribir datos incluso si el juego proviene del catálogo.
 * La referencia (gameId) se conserva para trazabilidad.
 */
export async function updateGame(userId: string, gameId: string, updates: UpdateGame) {
  const existing = await UserInventory.findOne({ _id: gameId, userId })
  if (!existing) return null

  // Permite personalizar campos de customData
  if (updates.customData) {
    existing.customData = {
      ...existing.customData,
      ...updates.customData
    }
  }

  if (updates.notes !== undefined) {
    existing.notes = updates.notes
  }

  if (updates.acquisitionDate !== undefined) {
    const parsed = new Date(updates.acquisitionDate)
    if (!isNaN(parsed.getTime())) {
      existing.acquisitionDate = parsed
    }
  }

  await existing.save()
  return existing
}
