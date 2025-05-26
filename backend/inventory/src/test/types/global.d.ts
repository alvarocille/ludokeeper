// Define la estructura del usuario autenticado accesible en Fastify
export type AuthenticatedUser = {
  sub: string            // ID único del usuario (Keycloak sub)
  email?: string         // Email opcional
  name?: string          // Nombre opcional
}

// Añade el tipo de usuario autenticado a FastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    user: AuthenticatedUser
  }
}
