import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

// 🎮 Esquema base común para los juegos del catálogo
const baseFields = {
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
  minPlayers: z.number().int().positive().optional(),
  maxPlayers: z.number().int().positive().optional(),
  playTime: z.number().int().positive().optional(),
  yearPublished: z.number().int().optional(),
  categories: z.array(z.string()).optional(),
  mechanics: z.array(z.string()).optional(),
  publisher: z.string().optional(),
  imageUrl: z.string().url('Debe ser una URL válida').optional(),
  source: z.enum(['manual', 'external']).optional()
}

// ✅ Para crear juegos (POST): obligatorio `name`
export const addCatalogGameSchema = z.object({
  ...baseFields,
  name: z.string().min(1, 'El nombre es obligatorio') // refuerzo explícito
})

// 🔁 Para actualizar juegos (PUT): todos opcionales
export const updateCatalogGameSchema = z.object(baseFields).partial()

// 🔎 Búsqueda por query (GET con filtros)
export const catalogGameQuerySchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  mechanic: z.string().optional(),
  publisher: z.string().optional(),
  minPlayers: z.string().regex(/^\d+$/, 'Debe ser un número entero positivo').optional(),
  maxPlayers: z.string().regex(/^\d+$/, 'Debe ser un número entero positivo').optional(),
  yearPublished: z.string().regex(/^\d{4}$/, 'Debe ser un año válido').optional()
})

// 🔑 ID de ruta
export const idParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'ID inválido')
})

// 📘 Respuesta completa para un juego
export const catalogGameResponseSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    minPlayers: { type: 'number' },
    maxPlayers: { type: 'number' },
    playTime: { type: 'number' },
    yearPublished: { type: 'number' },
    categories: { type: 'array', items: { type: 'string' } },
    mechanics: { type: 'array', items: { type: 'string' } },
    publisher: { type: 'string' },
    imageUrl: { type: 'string', format: 'uri' },
    source: { type: 'string', enum: ['manual', 'external'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
}

// 📦 Conversión a JSON Schema para Swagger
export const addCatalogGameSchemaRef = zodToJsonSchema(addCatalogGameSchema, { name: 'AddCatalogGame' })
export const updateCatalogGameSchemaRef = zodToJsonSchema(updateCatalogGameSchema, { name: 'UpdateCatalogGame' })
export const idParamSchemaRef = zodToJsonSchema(idParamSchema, { name: 'IdParam' })
export const catalogQueryJsonSchema = {
  querystring: zodToJsonSchema(catalogGameQuerySchema, { name: 'CatalogQuery' })
}
