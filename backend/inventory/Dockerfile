# 🔧 Etapa de construcción
FROM node:24-slim AS builder
WORKDIR /app

# Solo instala dependencias necesarias para la build
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 🚀 Etapa final optimizada para producción
FROM node:24-slim
WORKDIR /app

# Copiar artefactos de la build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public_key.pem ./public_key.pem

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
