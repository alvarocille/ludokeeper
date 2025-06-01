import { describe, it, expect, beforeEach } from 'vitest'
import * as service from '../../src/services/catalogService'
import { CatalogGame } from '../../src/models/catalogGame'
import '../helpers/db'

describe('catalogService', () => {
  beforeEach(async () => {
    await CatalogGame.deleteMany({})
  })

  it('debería crear un juego en el catálogo', async () => {
    const gameData = {
      name: 'Catan',
      description: 'Juego de comercio y colonización',
      minPlayers: 3,
      maxPlayers: 4,
      playTime: 90,
      yearPublished: 1995,
      categories: ['Estrategia'],
      mechanics: ['Intercambio', 'Colocación de losetas'],
      publisher: 'Kosmos',
      imageUrl: 'https://example.com/catan.jpg',
      source: 'manual'
    }

    const result = await service.createCatalogGame(gameData)
    expect(result).toHaveProperty('_id')
    expect(result.name).toBe('Catan')
    expect(result.source).toBe('manual')
    expect(result.minPlayers).toBe(3)
  })

  it('debería lanzar error si el juego ya existe', async () => {
    await service.createCatalogGame({ name: 'Catan' })
    await expect(service.createCatalogGame({ name: 'Catan' })).rejects.toThrow('El juego ya existe')
  })

  it('debería listar juegos del catálogo', async () => {
    await service.createCatalogGame({ name: 'Carcassonne' })
    const result = await service.listCatalogGames({})
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
    expect(result[0].name).toBe('Carcassonne')
  })

  it('debería obtener un juego por ID', async () => {
    const created = await service.createCatalogGame({ name: 'Azul' })
    const found = await service.getCatalogGameById(String(created._id))
    expect(found).not.toBeNull()
    expect(found?.name).toBe('Azul')
  })

  it('debería devolver null si no encuentra un juego por ID', async () => {
    const result = await service.getCatalogGameById('000000000000000000000000')
    expect(result).toBeNull()
  })

  it('debería actualizar un juego por ID', async () => {
    const created = await service.createCatalogGame({ name: 'Splendor' })
    const updated = await service.updateCatalogGame(String(created._id), { description: 'Juego de gemas' })
    expect(updated).not.toBeNull()
    expect(updated?.description).toBe('Juego de gemas')
  })

  it('debería devolver null al intentar actualizar un ID inexistente', async () => {
    const updated = await service.updateCatalogGame('000000000000000000000000', { name: 'Ghost' })
    expect(updated).toBeNull()
  })

  it('debería eliminar un juego por ID', async () => {
    const created = await service.createCatalogGame({ name: '7 Wonders' })
    const result = await service.deleteCatalogGame(String(created._id))
    expect(result).toBe(true)

    const exists = await service.getCatalogGameById(String(created._id))
    expect(exists).toBeNull()
  })

  it('debería devolver false al intentar eliminar un ID inexistente', async () => {
    const result = await service.deleteCatalogGame('000000000000000000000000')
    expect(result).toBe(false)
  })
})
