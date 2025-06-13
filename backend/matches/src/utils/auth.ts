import { FastifyReply, FastifyRequest } from "fastify";

/**
 * Middleware de autenticación para Fastify.
 * Verifica el token JWT y, si es inválido o ausente, devuelve 401.
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();

    if (!request.user?.id && request.user?.sub) {
      request.user.id = request.user.sub;
    }

    if (!request.user?.id) {
      return reply.code(401).send({ message: 'Token inválido o sin ID' });
    }

  } catch (error) {
    request.log.error('❌ JWT inválido:', error);
    return reply.code(401).send({ message: 'Token inválido' });
  }
}
