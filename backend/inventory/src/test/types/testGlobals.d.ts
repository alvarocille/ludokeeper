// Para soporte global de MongoDB in-memory en los tests
declare var __MONGO_URI__: string

declare namespace NodeJS {
  interface Global {
    __MONGO_URI__?: string
  }
}