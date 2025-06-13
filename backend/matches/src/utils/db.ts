import mongoose from 'mongoose'

/**
 * Conecta a la base de datos MongoDB usando la URI definida en variables de entorno.
 * Lanza error crítico si la conexión falla.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('❌ MONGODB_URI no definida en .env')
  }

  try {
    await mongoose.connect(uri, {
        // Configuración recomendada para evitar deprecaciones futuras
        autoIndex: true, // útil en desarrollo
        serverSelectionTimeoutMS: 5000,
        allowPartialTrustChain: undefined,
        ALPNProtocols: undefined,
        ca: undefined,
        cert: undefined,
        checkServerIdentity: undefined,
        ciphers: undefined,
        crl: undefined,
        ecdhCurve: undefined,
        key: undefined,
        minDHSize: undefined,
        passphrase: undefined,
        pfx: undefined,
        rejectUnauthorized: undefined,
        secureContext: undefined,
        secureProtocol: undefined,
        servername: undefined,
        session: undefined,
        autoSelectFamily: undefined,
        autoSelectFamilyAttemptTimeout: undefined,
        family: undefined,
        hints: undefined,
        localAddress: undefined,
        localPort: undefined,
        lookup: undefined
    })
    console.log('✅ MongoDB conectado correctamente')
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error)
    process.exit(1)
  }
}
