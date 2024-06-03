FROM nginx:alpine

# Copiamos los archivos de configuración para Nginx
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

# Copiamos el build de React al directorio de trabajo de Nginx
COPY ./build/ /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 8083