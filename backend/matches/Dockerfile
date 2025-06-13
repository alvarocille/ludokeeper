# Etapa de construcción
FROM node:24-slim AS builder
WORKDIR /app

# Copiar dependencias e instalar todo
COPY package*.json ./
RUN npm ci

# Instalar TypeScript globalmente solo para compilar (no afecta producción)
RUN npm install -g typescript

# Copiar código y compilar
COPY . .
RUN npm run build

# Etapa final optimizada
FROM node:24-slim
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public_key.pem ./public_key.pem

RUN npm ci --omit=dev

ENV NODE_ENV=production

EXPOSE 3003

CMD ["node", "dist/index.js"]
