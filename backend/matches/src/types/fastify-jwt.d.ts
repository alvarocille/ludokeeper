import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string }
    user: {
      sub: string
      id: string
      email?: string
      roles?: string[]
    }
  }
}
