## Multi-stage Dockerfile for React/Vite frontend
FROM node:22.0.0-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Runtime image with Nginx
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built static files
COPY --from=builder /app/dist .

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create initial env-config.js
RUN echo 'window.ENV = { VITE_PRODUCTS_API_URL: "", VITE_STOCKS_API_URL: "" };' > /usr/share/nginx/html/env-config.js

# Copy environment variables script
COPY env.sh /docker-entrypoint.d/40-env.sh
RUN chmod +x /docker-entrypoint.d/40-env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
