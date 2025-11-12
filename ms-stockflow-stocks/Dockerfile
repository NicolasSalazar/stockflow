## Multi-stage Dockerfile for NestJS Stocks microservice
FROM node:22.0.0-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
# Set dummy DATABASE_URL for prisma generate (it doesn't need to connect)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
RUN npx prisma generate
RUN npm run build

# Runtime image
FROM node:22.0.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy Prisma client generated in builder stage and schema
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY prisma ./prisma

# Copy built dist
COPY --from=builder /app/dist ./dist

# Copy entrypoint script
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/app/docker-entrypoint.sh"]