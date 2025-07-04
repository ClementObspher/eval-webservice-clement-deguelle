# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json /app

# Install npm and dependencies
RUN npm install --legacy-peer-deps

# Copy source code including proto files
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
# Copy proto files needed at runtime
COPY --from=builder /app/src/proto ./src/proto

# Change ownership of the app directory to nestjs user
RUN chown -R nestjs:nodejs /app

USER nestjs

# Expose gRPC port
EXPOSE 50051

# Health check for gRPC service (using grpc_health_probe if available)
# For now, we'll just check if the process is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD pgrep node || exit 1

# Start the application
CMD ["node", "dist/main"] 