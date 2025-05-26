import { describe, expect, it } from 'vitest'
import * as service from '../../../src/services/inventoryService'

// Pruebas unitarias de la lógica del servicio de inventario
describe('inventoryService', () => {
  it('debería añadir un juego personalizado', async () => {
    const data = {
      source: 'custom' as const,
      customData: { name: 'Carcassonne', description: 'Coloca losetas y haz puntos' },
      acquisitionDate: '2024-01-01',
      notes: 'Muy divertido'
    }
    const result = await service.addGame('test-user-id', data)
    expect(result).toMatchObject({
      userId: 'test-user-id',
      source: 'custom',
      customData: { name: 'Carcassonne' }
    })
  })

  it('debería listar inventario del usuario', async () => {
    const games = await service.getUserInventory('test-user-id')
    expect(Array.isArray(games)).toBe(true)
  })

  it('debería obtener un juego por ID', async () => {
    const newGame = await service.addGame('test-user-id', {
      source: 'custom',
      customData: { name: 'Splendor' },
      acquisitionDate: '2023-03-03'
    })
    const found = await service.getGameById('test-user-id', String(newGame._id))
    expect(found).toBeDefined()
    expect(found?.customData?.name).toBe('Splendor')
  })

  it('debería retornar null si juego no existe', async () => {
    const found = await service.getGameById('test-user-id', '000000000000000000000000')
    expect(found).toBeNull()
  })

  it('debería actualizar un juego', async () => {
    const game = await service.addGame('test-user-id', {
      source: 'custom',
      customData: { name: 'Dominion' },
      acquisitionDate: '2021-11-11'
    })
    const updated = await service.updateGame('test-user-id', String(game._id), { notes: 'Juego clásico' })
    expect(updated?.notes).toBe('Juego clásico')
  })

  it('debería eliminar un juego', async () => {
    const game = await service.addGame('test-user-id', {
      source: 'custom',
      customData: { name: 'Kingdomino' },
      acquisitionDate: '2020-01-01'
    })
    const deleted = await service.deleteGame('test-user-id', String(game._id))
    expect(deleted).toBe(true)
  })
})
