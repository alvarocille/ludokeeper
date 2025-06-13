import mongoose from 'mongoose'
import { UserInventory } from '../models/userInventory'
import { CustomDataCreate, CustomDataUpdate } from '../types/customData'
import { fetchCatalogGameById } from '../utils/catalogClient'


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

export async function addGame(
  userId: string,
  data: Omit<GameBase, 'userId'>,
  authHeader?: string
) {
  if (data.source === 'catalog') {
    if (!data.gameId) {
      throw new Error('El ID del juego del catálogo es requerido');
    }

    const catalogGame = await fetchCatalogGameById(data.gameId, authHeader);
    if (!catalogGame) {
      throw new Error('El juego del catálogo no existe');
    }

    const newEntry = new UserInventory({
      userId,
      source: 'catalog',
      gameId: new mongoose.Types.ObjectId(data.gameId),
      acquisitionDate: data.acquisitionDate,
      notes: data.notes
    });

    await newEntry.save();
    return newEntry;
  }

  // Para juegos personalizados
  const newEntry = new UserInventory({
    userId,
    source: 'custom',
    customData: {
      ...data.customData!,
      name: data.customData!.name || ''
    },
    acquisitionDate: data.acquisitionDate,
    notes: data.notes
  });

  await newEntry.save();
  return newEntry;
}

export async function getUserInventory(
  userId: string,
  filters: Record<string, string> = {},
  token?: string
) {
  const match: any = { userId }
  const andConditions: any[] = []

  if (filters.name) {
    const regex = new RegExp(filters.name, 'i')
    andConditions.push({
      $or: [
        { 'customData.name': regex },
        { 'gameId.name': regex }
      ]
    })
  }

  if (filters.category) {
    andConditions.push({ 'gameId.categories': filters.category })
  }

  if (filters.mechanic) {
    andConditions.push({ 'gameId.mechanics': filters.mechanic })
  }

  if (filters.year) {
    const year = parseInt(filters.year)
    if (!isNaN(year)) {
      andConditions.push({ 'gameId.yearPublished': year })
    }
  }

  if (filters.minPlayers) {
    const min = parseInt(filters.minPlayers)
    if (!isNaN(min)) {
      andConditions.push({
        $or: [
          { 'customData.minPlayers': { $lte: min } },
          { 'gameId.minPlayers': { $lte: min } }
        ]
      })
    }
  }

  if (filters.maxPlayers) {
    const max = parseInt(filters.maxPlayers)
    if (!isNaN(max)) {
      andConditions.push({
        $or: [
          { 'customData.maxPlayers': { $gte: max } },
          { 'gameId.maxPlayers': { $gte: max } }
        ]
      })
    }
  }

  if (filters.source === 'catalog' || filters.source === 'custom') {
    match.source = filters.source
  }

  const finalQuery = andConditions.length > 0
    ? { ...match, $and: andConditions }
    : match

  const entries = await UserInventory.find(finalQuery)

  const catalogCache = new Map<string, any>()

  const results = await Promise.all(entries.map(async (entry) => {
    let baseData: any = entry.customData ?? {}

    if (entry.source === 'catalog' && entry.gameId && token) {
      const id = entry.gameId.toString()

      try {
        const cached = catalogCache.get(id)
        const catalogData = cached || await fetchCatalogGameById(id, token)

        if (!cached) catalogCache.set(id, catalogData)

        if (catalogData) {
          baseData = {
            name: catalogData.name ?? 'Juego sin datos',
            description: catalogData.description ?? '',
            minPlayers: catalogData.minPlayers ?? null,
            maxPlayers: catalogData.maxPlayers ?? null,
            playTime: catalogData.playTime ?? null,
            imageUrl: catalogData.imageUrl ?? null,
            yearPublished: catalogData.yearPublished ?? null,
            publisher: catalogData.publisher ?? null,
            categories: catalogData.categories ?? [],
            mechanics: catalogData.mechanics ?? []
          }
        }
      } catch (err) {
        console.error(`Error al obtener datos del catálogo para ${id}`, err)
      }
    }

    return {
      _id: entry._id,
      userId: entry.userId,
      source: entry.source,
      gameId: entry.source === 'catalog' ? entry.gameId?.toString() ?? null : null,
      customData: baseData,
      acquisitionDate: entry.acquisitionDate,
      notes: entry.notes,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt
    }
  }))

  return results
}




export async function getGameById(userId: string, gameId: string, token?: string) {
  const entry = await UserInventory.findOne({ _id: gameId, userId });
  if (!entry) return null;

  let baseData: any = entry.customData ?? {};

  if (entry.source === 'catalog' && entry.gameId && token) {
    try {
      baseData = await fetchCatalogGameById(entry.gameId.toString(), token);
    } catch (err) {
      console.error('Error al obtener juego del catálogo', err);
    }
  }

  return {
    _id: entry._id,
    userId: entry.userId,
    source: entry.source,
    gameId: entry.gameId?.toString() ?? null,
    customData: baseData,
    acquisitionDate: entry.acquisitionDate,
    notes: entry.notes,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}


export async function deleteGame(userId: string, gameId: string): Promise<boolean> {
  const deleted = await UserInventory.findOneAndDelete({ _id: gameId, userId })
  return !!deleted
}


export async function updateGame(userId: string, gameId: string, updates: UpdateGame) {
  const existing = await UserInventory.findOne({ _id: gameId, userId }).populate({
    path: 'gameId',
    select: 'name categories mechanics yearPublished minPlayers maxPlayers imageUrl publisher playTime description'
  });

  if (!existing) return null;

  // Si es de catálogo, creamos una nueva entrada personalizada
  if (existing.source === 'catalog') {
    const catalogData = existing.gameId as any;

    const newCustomEntry = new UserInventory({
      userId,
      source: 'custom',
      customData: {
        name: updates.customData?.name ?? catalogData.name,
        description: updates.customData?.description ?? catalogData.description,
        minPlayers: updates.customData?.minPlayers ?? catalogData.minPlayers,
        maxPlayers: updates.customData?.maxPlayers ?? catalogData.maxPlayers,
        playTime: updates.customData?.playTime ?? catalogData.playTime,
        imageUrl: updates.customData?.imageUrl ?? catalogData.imageUrl,
        yearPublished: catalogData.yearPublished,
        publisher: catalogData.publisher,
        categories: catalogData.categories,
        mechanics: catalogData.mechanics,
      },
      acquisitionDate: updates.acquisitionDate ?? existing.acquisitionDate,
      notes: updates.notes ?? existing.notes,
    });

    await newCustomEntry.save();
    await existing.deleteOne(); // eliminamos la entrada original

    return newCustomEntry;
  }

  // Si ya es personalizado, simplemente actualizamos
  if (updates.customData) {
    existing.customData = {
      ...existing.customData,
      ...updates.customData,
      name: updates.customData.name ?? existing.customData?.name ?? ''
    };
  }

  if (updates.notes !== undefined) {
    existing.notes = updates.notes;
  }

  if (updates.acquisitionDate !== undefined) {
    const parsedDate = new Date(updates.acquisitionDate);
    if (!isNaN(parsedDate.getTime())) {
      existing.acquisitionDate = parsedDate;
    }
  }

  await existing.save();
  return existing;
}

