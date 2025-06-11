import { UserInventory } from '../models/userInventory'
import { CustomDataCreate, CustomDataUpdate } from '../types/customData'

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

export async function addGame(userId: string, data: Omit<GameBase, 'userId'>) {
  const newEntry = new UserInventory({ userId, ...data })
  await newEntry.save()
  return newEntry
}

export async function getUserInventory(userId: string, filters: Record<string, string> = {}) {
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

  return UserInventory.find(finalQuery).populate({
    path: 'gameId',
    select: 'name categories mechanics yearPublished minPlayers maxPlayers'
  })
}




export async function getGameById(userId: string, gameId: string) {
  return await UserInventory.findOne({ _id: gameId, userId })
}

export async function deleteGame(userId: string, gameId: string): Promise<boolean> {
  const deleted = await UserInventory.findOneAndDelete({ _id: gameId, userId })
  return !!deleted
}

export async function updateGame(userId: string, gameId: string, updates: UpdateGame) {
  const existing = await UserInventory.findOne({ _id: gameId, userId })
  if (!existing) return null

  if (updates.customData) {
    existing.customData = {
      ...existing.customData,
      ...updates.customData,
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
