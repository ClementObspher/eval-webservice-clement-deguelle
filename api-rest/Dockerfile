<<<<<<< Updated upstream
# Build stage
FROM node:18-alpine AS builder
=======
    FROM node:18-alpine
>>>>>>> Stashed changes

    WORKDIR /app

    COPY package*.json ./
    COPY pnpm-lock.yaml* ./

    RUN npm install -g pnpm
    RUN pnpm install

    COPY src/tests ./src/tests

    ENV NODE_ENV=test

    WORKDIR /app/src/tests

    CMD ["sh", "-c", "sleep 15 && pnpm test api-rest/"] 
