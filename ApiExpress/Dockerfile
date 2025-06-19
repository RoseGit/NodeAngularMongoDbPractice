# Usa una imagen base de Node.js. Es buena práctica usar versiones LTS
FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

COPY package*.json ./

# Instala las dependencias de la aplicación
# Si tienes dependencias de desarrollo que no necesitas en producción, usa --omit=dev
RUN npm install --omit=dev

# Copia el resto del código de tu aplicación al directorio de trabajo
COPY . .

# Expone el puerto en el que tu API escucha
# Asegúrate de que esto coincida con el puerto que tu Express.js usa (ej: app.listen(3000))
EXPOSE 3977

# Define el comando para iniciar tu aplicación cuando el contenedor se ejecute
# Si usas nodemon para desarrollo, aquí usarías `node index.js` para producción
CMD [ "node", "index.js" ]