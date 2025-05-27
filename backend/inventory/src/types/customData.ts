export type CustomDataBase = {
  description?: string
  minPlayers?: number
  maxPlayers?: number
  playTime?: number
  imageUrl?: string
  players?: { min: number; max: number }
  duration?: number
}

// Para creación (name obligatorio)
export type CustomDataCreate = CustomDataBase & {
  name: string
}

// Para update (name opcional)
export type CustomDataUpdate = CustomDataBase & {
  name?: string
}
