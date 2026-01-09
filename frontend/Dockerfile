# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .

# Configuración de Nginx simplificada y robusta
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /v1 { \
        resolver 8.8.8.8 1.1.1.1 valid=30s; \
        set $backend "${VITE_API_URL}"; \
        proxy_pass $backend; \
        proxy_ssl_server_name on; \
        proxy_set_header Host $proxy_host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/conf.d/config.template

EXPOSE 80

# Usamos envsubst para inyectar la URL real al arrancar
CMD ["sh", "-c", "REAL_URL=${VITE_API_URL}; if ! echo $REAL_URL | grep -q '^http'; then REAL_URL=\"https://$REAL_URL\"; fi; export VITE_API_URL=$REAL_URL; envsubst '${VITE_API_URL}' < /etc/nginx/conf.d/config.template > /etc/nginx/conf.d/default.conf && echo \"Proxying to $VITE_API_URL\" && nginx -g 'daemon off;'"]
