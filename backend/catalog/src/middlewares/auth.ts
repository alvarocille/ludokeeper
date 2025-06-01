import '@fastify/jwt'

/**
 * Middleware para requerir el rol admin de Keycloak.
 */
export function requireAdmin(request: { user: { realm_access: { roles: never[] } } }, reply: { code: (arg0: number) => { (): any; new(): any; send: { (arg0: { error: string }): void; new(): any } } }, done: () => void) {
  // Accede a los roles desde el objeto user inyectado por fastify-jwt
  const roles: string[] = request.user?.realm_access?.roles || []
  if (roles.includes('admin')) {
    done()
  } else {
    reply.code(403).send({ error: 'Acceso denegado: se requiere rol admin' })
  }
}

/**
 * Middleware de autenticación con JWT (Fastify).
 * Llama a request.jwtVerify() e inyecta el usuario decodificado en request.user
 */
export const authenticate = async (request: { jwtVerify: () => any }, reply: { code: (arg0: number) => { (): any; new(): any; send: { (arg0: { message: string }): void; new(): any } } }) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.code(401).send({ message: 'Unauthorized' })
  }
}
