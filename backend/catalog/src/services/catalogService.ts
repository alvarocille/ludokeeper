import { CatalogGame } from '../models/catalogGame'

/**
 * Crea un nuevo juego de catálogo.
 */
export async function createCatalogGame(data: any) {
  const exists = await CatalogGame.findOne({ name: data.name })
  if (exists) throw new Error('El juego ya existe')

  const game = new CatalogGame(data)
  await game.save()
  return game
}

/**
 * Lista todos los juegos con filtro opcional.
 */
export async function listCatalogGames(filters: Record<string, string>) {
  const {
    name,
    category,
    mechanic,
    publisher,
    minPlayers,
    maxPlayers,
    yearPublished
  } = filters

  const query: Record<string, any> = {}

  if (name) query.name = new RegExp(name, 'i')
  if (category) query.categories = category
  if (mechanic) query.mechanics = mechanic
  if (publisher) query.publisher = publisher
  if (yearPublished) query.yearPublished = parseInt(yearPublished)
  if (minPlayers) query.minPlayers = { $lte: parseInt(minPlayers) }
  if (maxPlayers) query.maxPlayers = { $gte: parseInt(maxPlayers) }

  return await CatalogGame.find(query)
}


/**
 * Obtiene un juego por su ID.
 */
export async function getCatalogGameById(id: string) {
  return await CatalogGame.findById(id)
}

/**
 * Actualiza un juego del catálogo.
 */
export async function updateCatalogGame(id: string, data: any) {
  return await CatalogGame.findByIdAndUpdate(id, data, { new: true })
}

/**
 * Elimina un juego del catálogo.
 */
export async function deleteCatalogGame(id: string): Promise<boolean> {
  const deleted = await CatalogGame.findByIdAndDelete(id)
  return !!deleted
}