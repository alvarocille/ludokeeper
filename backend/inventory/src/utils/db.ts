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
      serverSelectionTimeoutMS: 5000
    })
    console.log('✅ MongoDB conectado correctamente')
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error)
    process.exit(1)
  }
}
