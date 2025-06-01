import * as inventoryController from '../controllers/inventoryController'
import { authenticate as realAuthenticate } from '../middlewares/auth'
import {
  addGameSchema,
  updateGameSchema,
  idParamSchema,
  gameResponseSchema,
  inventoryQueryJsonSchema
} from '../schemas/inventorySchemas'
import { isValidObjectId } from '../utils/isValidObjectId'
import { zodToJsonSchema } from 'zod-to-json-schema'

// Registra todas las rutas del inventario con validación y Swagger
export async function inventoryRoutes(app, authenticate = realAuthenticate) {
  // Valida que el ID tenga formato Mongo antes de llegar al controlador
  const validateId = (request, reply, done) => {
    if (!isValidObjectId(request.params.id)) {
      return reply.code(400).send({ error: 'ID inválido' })
    }
    done()
  }

  // Crear un juego en el inventario
  app.post('/inventory', {
    preHandler: authenticate,
    schema: {
      tags: ['Inventario'],
      summary: 'Agregar juego al inventario',
      body: zodToJsonSchema(addGameSchema),
      response: {
        201: {
          description: 'Juego creado',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: gameResponseSchema
          }
        },
        400: {
          description: 'Datos inválidos',
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'object' }
          }
        }
      }
    }
  }, inventoryController.addGame)

  // Listar todos los juegos del usuario autenticado
  app.get('/inventory', {
    preHandler: authenticate,
    schema: {
      tags: ['Inventario'],
      summary: 'Listar juegos del usuario con filtros',
      querystring: inventoryQueryJsonSchema.querystring,
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: gameResponseSchema
            }
          }
        }
      }
    }
  }, inventoryController.getUserInventory)


  // Obtener un juego específico por su ID
  app.get('/inventory/:id', {
    preHandler: [authenticate, validateId],
    schema: {
      tags: ['Inventario'],
      summary: 'Obtener juego por ID',
      params: zodToJsonSchema(idParamSchema),
      response: {
        200: {
          type: 'object',
          properties: {
            data: gameResponseSchema
          }
        },
        404: {
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, inventoryController.getGameById)

  // Actualizar información de un juego por su ID
  app.put('/inventory/:id', {
    preHandler: [authenticate, validateId],
    schema: {
      tags: ['Inventario'],
      summary: 'Actualizar juego por ID',
      params: zodToJsonSchema(idParamSchema),
      body: zodToJsonSchema(updateGameSchema),
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: gameResponseSchema
          }
        },
        400: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, inventoryController.updateGame)

  // Eliminar un juego por su ID
  app.delete('/inventory/:id', {
    preHandler: [authenticate, validateId],
    schema: {
      tags: ['Inventario'],
      summary: 'Eliminar juego por ID',
      params: zodToJsonSchema(idParamSchema),
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, inventoryController.deleteGame)
}
