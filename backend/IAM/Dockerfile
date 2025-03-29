FROM node:20

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos del proyecto
COPY . .

# Instalar dependencias
RUN npm install

# Puerto expuesto (opcional pero recomendable)
EXPOSE 3000

# Comando que ejecuta tu app
CMD ["node", "src/server.js"]
