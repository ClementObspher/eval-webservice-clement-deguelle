FROM node:18-alpine

WORKDIR /app

# Copy package files from root
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy test files and utilities
COPY src/tests ./src/tests

# Copy proto files needed for gRPC tests
COPY grpc-service/src/proto ./grpc-service/src/proto

# Set environment variables
ENV NODE_ENV=test

# Set working directory to tests
WORKDIR /app/src/tests

# Wait for services to be ready and run gRPC tests
CMD ["sh", "-c", "sleep 15 && pnpm test api-grpc/"] 