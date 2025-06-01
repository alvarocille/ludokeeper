import { JsonSchema7Type, zodToJsonSchema } from 'zod-to-json-schema';
import * as catalogController from '../controllers/catalogController';
import {
    addCatalogGameSchema,
    catalogGameQuerySchema,
    catalogGameResponseSchema,
    idParamSchema,
    updateCatalogGameSchema
} from '../schemas/catalogSchemas';

export async function catalogRoutes(
  app: { get: (arg0: string, arg1: { preHandler: any; schema: { tags: string[]; summary: string; querystring: JsonSchema7Type & { $schema?: string | undefined; definitions?: { [key: string]: JsonSchema7Type; } | undefined; }; response: { 200: { type: string; properties: { data: { type: string; items: { type: string; properties: { _id: { type: string; }; name: { type: string; }; description: { type: string; }; minPlayers: { type: string; }; maxPlayers: { type: string; }; playTime: { type: string; }; yearPublished: { type: string; }; categories: { type: string; items: { type: string; }; }; mechanics: { type: string; items: { type: string; }; }; publisher: { type: string; }; imageUrl: { type: string; format: string; }; source: { type: string; enum: string[]; }; createdAt: { type: string; format: string; }; updatedAt: { type: string; format: string; }; }; }; }; }; }; }; } | { tags: string[]; summary: string; params: JsonSchema7Type & { $schema?: string | undefined; definitions?: { [key: string]: JsonSchema7Type; } | undefined; }; response: { 200: { type: string; properties: { data: { type: string; properties: { _id: { type: string; }; name: { type: string; }; description: { type: string; }; minPlayers: { type: string; }; maxPlayers: { type: string; }; playTime: { type: string; }; yearPublished: { type: string; }; categories: { type: string; items: { type: string; }; }; mechanics: { type: string; items: { type: string; }; }; publisher: { type: string; }; imageUrl: { type: string; format: string; }; source: { type: string; enum: string[]; }; createdAt: { type: string; format: string; }; updatedAt: { type: string; format: string; }; }; }; }; }; 404: { type: string; properties: { error: { type: string; }; }; }; }; }; }, arg2: { (request: any, reply: any): Promise<void>; (request: any, reply: any): Promise<any>; }) => void; post: (arg0: string, arg1: { preHandler: any[]; schema: { tags: string[]; summary: string; body: JsonSchema7Type & { $schema?: string | undefined; definitions?: { [key: string]: JsonSchema7Type; } | undefined; }; response: { 201: { type: string; properties: { message: { type: string; }; data: { type: string; properties: { _id: { type: string; }; name: { type: string; }; description: { type: string; }; minPlayers: { type: string; }; maxPlayers: { type: string; }; playTime: { type: string; }; yearPublished: { type: string; }; categories: { type: string; items: { type: string; }; }; mechanics: { type: string; items: { type: string; }; }; publisher: { type: string; }; imageUrl: { type: string; format: string; }; source: { type: string; enum: string[]; }; createdAt: { type: string; format: string; }; updatedAt: { type: string; format: string; }; }; }; }; }; 400: { type: string; properties: { error: { type: string; }; }; }; }; }; }, arg2: (request: any, reply: any) => Promise<any>) => void; put: (arg0: string, arg1: { preHandler: any[]; schema: { tags: string[]; summary: string; params: JsonSchema7Type & { $schema?: string | undefined; definitions?: { [key: string]: JsonSchema7Type; } | undefined; }; body: JsonSchema7Type & { $schema?: string | undefined; definitions?: { [key: string]: JsonSchema7Type; } | undefined; }; response: { 200: { type: string; properties: { message: { type: string; }; data: { type: string; properties: { _id: { type: string; }; name: { type: string; }; description: { type: string; }; minPlayers: { type: string; }; maxPlayers: { type: string; }; playTime: { type: string; }; yearPublished: { type: string; }; categories: { type: string; items: { type: string; }; }; mechanics: { type: string; items: { type: string; }; }; publisher: { type: string; }; imageUrl: { type: string; format: string; }; source: { type: string; enum: string[]; }; createdAt: { type: string; format: string; }; updatedAt: { type: string; format: string; }; }; }; }; }; 400: { type: string; properties: { error: { type: string; }; }; }; 404: { type: string; properties: { error: { type: string; }; }; }; }; }; }, arg2: (request: any, reply: any) => Promise<any>) => void; delete: (arg0: string, arg1: { preHandler: any[]; schema: { tags: string[]; summary: string; params: JsonSchema7Type & { $schema?: string | undefined; definitions?: { [key: string]: JsonSchema7Type; } | undefined; }; response: { 200: { type: string; properties: { message: { type: string; }; }; }; 404: { type: string; properties: { error: { type: string; }; }; }; }; }; }, arg2: (request: any, reply: any) => Promise<any>) => void; },
  opts: { authenticate: any; requireAdmin: any }
) {
  const { authenticate, requireAdmin } = opts

  app.get('/', {
    preHandler: authenticate,
    schema: {
      tags: ['Catálogo'],
      summary: 'Buscar juegos en el catálogo',
      querystring: zodToJsonSchema(catalogGameQuerySchema),
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: catalogGameResponseSchema
            }
          }
        }
      }
    }
  }, catalogController.listCatalogGames)

  app.get('/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Catálogo'],
      summary: 'Obtener juego de catálogo por ID',
      params: zodToJsonSchema(idParamSchema),
      response: {
        200: { type: 'object', properties: { data: catalogGameResponseSchema } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, catalogController.getCatalogGameById)

  app.post('/', {
    preHandler: [authenticate, requireAdmin],
    schema: {
      tags: ['Catálogo'],
      summary: 'Crear un nuevo juego de catálogo (admin)',
      body: zodToJsonSchema(addCatalogGameSchema),
      response: {
        201: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: catalogGameResponseSchema
          }
        },
        400: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, catalogController.addCatalogGame)

  app.put('/:id', {
    preHandler: [authenticate, requireAdmin],
    schema: {
      tags: ['Catálogo'],
      summary: 'Actualizar juego de catálogo (admin)',
      params: zodToJsonSchema(idParamSchema),
      body: zodToJsonSchema(updateCatalogGameSchema),
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: catalogGameResponseSchema
          }
        },
        400: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, catalogController.updateCatalogGame)

  app.delete('/:id', {
    preHandler: [authenticate, requireAdmin],
    schema: {
      tags: ['Catálogo'],
      summary: 'Eliminar juego de catálogo (admin)',
      params: zodToJsonSchema(idParamSchema),
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, catalogController.deleteCatalogGame)
}
