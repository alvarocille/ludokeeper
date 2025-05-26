import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

// 🔒 Esquema Zod para creación
export const addGameSchema = z
  .object({
    source: z.enum(['catalog', 'custom']),
    gameId: z.string().optional(),
    customData: z
      .object({
        name: z.string(),
        description: z.string().optional()
      })
      .optional(),
    acquisitionDate: z.string().optional(),
    notes: z.string().optional()
  })
  .refine(data => {
    if (data.source === 'custom' && !data.customData?.name) return false
    if (data.source === 'catalog' && !data.gameId) return false
    return true
  }, {
    message: 'customData.name o gameId requerido según el tipo de fuente',
    path: ['customData']
  })

// 🛠 Esquema Zod para actualización
export const updateGameSchema = z.object({
  notes: z.string().optional(),
  acquisitionDate: z.string().datetime({ message: 'Debe ser un datetime ISO válido' }).optional(),
  customData: z
    .object({
      name: z.string(),
      description: z.string().optional()
    })
    .optional()
})

// 🔑 Esquema Zod para IDs
export const idParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'ID inválido')
})

// 📦 JSON Schema para validación en Fastify (usado en las rutas)
export const addGameJsonSchema = {
  body: zodToJsonSchema(addGameSchema)
}

export const updateGameJsonSchema = {
  body: zodToJsonSchema(updateGameSchema)
}

export const getOneJsonSchema = {
  params: zodToJsonSchema(idParamSchema)
}

export const deleteGameJsonSchema = getOneJsonSchema

// 📘 Esquema de respuesta
export const gameResponseSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    userId: { type: 'string' },
    source: { type: 'string', enum: ['catalog', 'custom'] },
    gameId: { type: 'string' },
    customData: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' }
      }
    },
    acquisitionDate: { type: 'string', format: 'date-time' },
    notes: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    __v: { type: 'number' }
  }
}

// 🧩 Para Swagger (components.schemas)
export const addGameSchemaRef = zodToJsonSchema(addGameSchema, { name: 'AddGame' })
export const updateGameSchemaRef = zodToJsonSchema(updateGameSchema, { name: 'UpdateGame' })
export const idParamSchemaRef = zodToJsonSchema(idParamSchema, { name: 'IdParam' })
