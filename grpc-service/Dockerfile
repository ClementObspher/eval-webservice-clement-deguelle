# Étape de construction
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Copie du code source
COPY . .

# Construction de l'application
RUN npm run build

# Étape de production
FROM node:20-alpine AS production

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances de production uniquement
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Copie du code compilé depuis l'étape de construction
COPY --from=builder /app/dist ./dist

# Copie des fichiers proto nécessaires
COPY --from=builder /app/src/proto ./src/proto

# Exposition du port gRPC
EXPOSE 50051

# Commande de démarrage
CMD ["node", "dist/main"] 