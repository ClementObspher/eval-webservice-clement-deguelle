# Étape de construction
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Installation de pnpm
RUN npm install -g pnpm

# Installation des dépendances
RUN pnpm install --no-frozen-lockfile

# Copie du code source
COPY . .

# Construction de l'application
RUN pnpm run build

# Étape de production
FROM node:20-alpine AS production

WORKDIR /app

# Installation de pnpm
RUN npm install -g pnpm

# Copie des fichiers de dépendances
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Installation des dépendances de production uniquement
RUN pnpm install --no-frozen-lockfile --prod

# Copie du code compilé depuis l'étape de construction
COPY --from=builder /app/dist ./dist

# Exposition du port
EXPOSE 3001

# Commande de démarrage
CMD ["node", "dist/main"] 