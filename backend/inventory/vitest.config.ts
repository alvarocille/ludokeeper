import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,                      // Habilita uso directo de `describe`, `it`, etc.
    environment: 'node',                // Ejecutar entorno Node.js para tests backend
    testTimeout: 10000,                 // Timeout amplio para evitar falsos negativos
    setupFiles: ['./setup.ts'],         // Ejecutar entorno MongoDB en memoria
    include: ['src/test/**/*.test.ts']  // Asegura que solo se incluyan tests en esa ruta
  }
})
