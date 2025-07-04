# Étape de construction
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install && npm cache clean --force

# Copie du code source
COPY . .
COPY init-keycloak.js ./

# Création du dossier proto et copie du fichier service.proto
RUN mkdir -p ./proto
COPY ./proto ./proto

# Construction de l'application
RUN npm run build

# Étape de production
FROM node:20-alpine AS production

# Installer netcat pour la vérification de connectivité
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances de production uniquement
RUN npm install --only=production && npm cache clean --force

# Copie du code compilé depuis l'étape de construction
COPY --from=builder /app/dist ./dist

# Copie du fichier proto depuis l'étape de construction
COPY --from=builder /app/proto ./proto

COPY --from=builder /app/init-keycloak.js ./init-keycloak.js

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["node", "dist/main"] 