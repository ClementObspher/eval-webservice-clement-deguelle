# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json /app

# Install npm and dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package.json /app

# Install npm and production dependencies only
RUN npm install --legacy-peer-deps --production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership of the app directory to nestjs user
RUN chown -R nestjs:nodejs /app

USER nestjs

# Expose port
EXPOSE 4000

# Health check (GraphQL endpoint)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/graphql || exit 1

# Start the application
CMD ["node", "dist/main"] 