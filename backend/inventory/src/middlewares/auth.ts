/**
 * Middleware de autenticación para Fastify.
 * Verifica el token JWT y, si es inválido o ausente, devuelve 401.
 */
export async function authenticate(request, reply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ error: 'Token inválido o ausente' })
  }
}
