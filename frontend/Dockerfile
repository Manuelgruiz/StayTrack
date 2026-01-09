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

# Nginx config with Proxy to Gateway
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Proxy API requests to the gateway container \
    # This avoids CORS issues and keeps everything on port 80 \
    location /v1 { \
        resolver RENDER_RESOLVER_IP valid=30s; \
        set $backend_service http://staytrack-gateway:8000; \
        proxy_pass $backend_service; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

# Buscamos el nameserver del sistema y lo inyectamos en la config de Nginx
CMD ["sh", "-c", "DNS_IP=$(grep nameserver /etc/resolv.conf | awk '{print $2}' | head -n1); DNS_IP=${DNS_IP:-8.8.8.8}; sed -i \"s|RENDER_RESOLVER_IP|$DNS_IP|g\" /etc/nginx/conf.d/default.conf && echo \"Using resolver $DNS_IP\" && nginx -g 'daemon off;'"]
