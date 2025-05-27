import { beforeEach, describe, expect, it } from 'vitest'
import { buildTestApp } from '../helpers/setupTestApp'

let app: Awaited<ReturnType<typeof buildTestApp>>

// Construye la app antes de cada test
beforeEach(async () => {
  app = await buildTestApp()
})

// Pruebas de integración sobre las rutas de inventario
describe('Inventory routes', () => {
  it('POST /inventory - añade un juego', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/inventory',
      payload: {
        source: 'custom',
        customData: { name: 'Catan' },
        acquisitionDate: '2023-05-01'
      },
      headers: { authorization: 'Bearer test-token' }
    })
    expect(response.statusCode).toBe(201)
    expect(response.json().data?.customData?.name).toBe('Catan')
  })

  it('POST /inventory - body inválido', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/inventory',
      payload: {}, // Body sin campos obligatorios
      headers: { authorization: 'Bearer test-token' }
    })
    expect(response.statusCode).toBe(400)
  })

  it('GET /inventory - obtiene juegos', async () => {
    // Prepara juego previo para que GET devuelva al menos uno
    await app.inject({
      method: 'POST',
      url: '/inventory',
      payload: {
        source: 'custom',
        customData: { name: 'Azul' },
        acquisitionDate: '2023-01-01'
      },
      headers: { authorization: 'Bearer test-token' }
    })

    const response = await app.inject({
      method: 'GET',
      url: '/inventory',
      headers: { authorization: 'Bearer test-token' }
    })
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.json().data)).toBe(true)
  })

  it('GET /inventory/:id - juego no encontrado', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/inventory/000000000000000000000000',
      headers: { authorization: 'Bearer test-token' }
    })
    expect(response.statusCode).toBe(404)
  })

  it('PUT /inventory/:id - actualiza juego', async () => {
    const create = await app.inject({
      method: 'POST',
      url: '/inventory',
      payload: {
        source: 'custom',
        customData: { name: 'Patchwork' },
        acquisitionDate: '2022-12-12'
      },
      headers: { authorization: 'Bearer test-token' }
    })

    const id = create.json().data._id
    const update = await app.inject({
      method: 'PUT',
      url: `/inventory/${id}`,
      payload: { notes: 'Juego de pareja favorito' },
      headers: { authorization: 'Bearer test-token' }
    })
    expect(update.statusCode).toBe(200)
    expect(update.json().data.notes).toBe('Juego de pareja favorito')
  })

  it('PUT /inventory/:id - ID inválido', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/inventory/invalid-id',
      payload: { notes: 'No válido' },
      headers: { authorization: 'Bearer test-token' }
    })
    expect(response.statusCode).toBe(400)
  })

  it('DELETE /inventory/:id - elimina juego', async () => {
    const create = await app.inject({
      method: 'POST',
      url: '/inventory',
      payload: {
        source: 'custom',
        customData: { name: '7 Wonders' },
        acquisitionDate: '2022-10-10'
      },
      headers: { authorization: 'Bearer test-token' }
    })

    const id = create.json().data._id
    const response = await app.inject({
      method: 'DELETE',
      url: `/inventory/${id}`,
      headers: { authorization: 'Bearer test-token' }
    })
    expect(response.statusCode).toBe(200)
  })

  it('DELETE /inventory/:id - ID no existente', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/inventory/000000000000000000000000',
      headers: { authorization: 'Bearer test-token' }
    })
    expect(response.statusCode).toBe(404)
  })

  it('POST /inventory - añade juego con metadata extendida', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/inventory',
    payload: {
      source: 'custom',
      customData: {
        name: 'Root',
        description: 'Control de áreas con animales',
        minPlayers: 2,
        maxPlayers: 4,
        playTime: 90,
        imageUrl: 'https://example.com/root.jpg'
      },
      acquisitionDate: '2024-01-01',
      notes: 'Muy temático'
    },
    headers: { authorization: 'Bearer test-token' }
  })
  expect(response.statusCode).toBe(201)
  expect(response.json().data.customData.minPlayers).toBe(2)
  expect(response.json().data.customData.imageUrl).toBe('https://example.com/root.jpg')
})

})
