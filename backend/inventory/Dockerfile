# Etapa de construcción
FROM node:24-slim AS builder
WORKDIR /app

# Instala solo dependencias necesarias para la build
COPY package*.json ./
RUN npm ci

# Copia el resto del código y compila
COPY . .
RUN npm run build

# Etapa final optimizada para producción
FROM node:24-slim
WORKDIR /app

# Copiar artefactos de la build y la clave pública
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public_key.pem ./public_key.pem

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

ENV NODE_ENV=production

# Exponer puerto si lo deseas explícitamente
EXPOSE 3002

CMD ["node", "dist/index.js"]
