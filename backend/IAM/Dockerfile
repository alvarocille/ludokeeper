FROM node:24-slim

# Crear directorio de trabajo
WORKDIR /app

# Copiar solo archivos de dependencias primero
COPY package*.json ./

# Instalar solo dependencias de producción si NODE_ENV lo indica
RUN npm install --omit=dev

# Copiar el resto del proyecto
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando por defecto
CMD ["node", "src/server.js"]
