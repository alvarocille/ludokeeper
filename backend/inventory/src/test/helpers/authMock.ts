// Mock de autenticación usado en los tests
export async function mockAuthenticate(request) {
  request.user = {
    sub: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User'
  }

  // Simula middleware asíncrono compatible con Fastify
  return Promise.resolve()
}
