# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx and Proxy Config
FROM nginx:alpine

# Copy static files
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx config inteligente: se adapta a Local o Render
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    location /v1 { \
        resolver RENDER_RESOLVER_IP valid=30s; \
        proxy_pass ${VITE_API_URL}; \
        proxy_ssl_server_name on; \
        proxy_set_header Host $proxy_host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/conf.d/config.template

EXPOSE 80

# Al arrancar: 
# 1. Busca el DNS del sistema (Docker o Render)
# 2. Inyecta la URL del Gateway
# 3. Inicia Nginx
CMD ["sh", "-c", "export DNS_IP=$(grep nameserver /etc/resolv.conf | awk '{print $2}' | head -n1); sed -i \"s|RENDER_RESOLVER_IP|$DNS_IP|g\" /etc/nginx/conf.d/config.template && envsubst '${VITE_API_URL}' < /etc/nginx/conf.d/config.template > /etc/nginx/conf.d/default.conf && echo \"Using resolver $DNS_IP and proxying to $VITE_API_URL\" && nginx -g 'daemon off;'"]
