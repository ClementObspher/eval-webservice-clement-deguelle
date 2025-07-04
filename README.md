# Service Web - Évaluation Clément Deguelle - Thomas Fourties

Ce projet contient trois services web : une API REST, une API GraphQL et un service gRPC, avec un système d'authentification Keycloak et des tests automatisés.

## Prérequis

- Docker et Docker Compose
- Node.js (version 18 ou supérieure)
- npm ou pnpm

## Architecture

Le projet comprend :
- **API REST** : Service NestJS avec authentification JWT via Keycloak
- **API GraphQL** : Service GraphQL avec résolveurs
- **Service gRPC** : Service de notifications et d'export
- **Base de données** : PostgreSQL
- **Authentification** : Keycloak
- **Stockage** : MinIO (compatible S3)

## Instructions pour faire passer les tests

### 1. Démarrer les services avec Docker Compose

```bash
docker compose up -d
```

Cette commande démarre :
- PostgreSQL sur le port 5432
- Keycloak sur le port 8080
- MinIO sur les ports 9000 et 9090

**Vérification** : Attendez que tous les services soient démarrés (environ 30-60 secondes).

### 2. Désactiver SSL sur Keycloak (si nécessaire)

Si Keycloak est configuré en mode SSL uniquement, exécutez :

```bash
./script.sh
```

Ce script :
- Désactive SSL sur le realm `master`
- Désactive SSL sur le realm `reservation-realm`
- Garde le conteneur Keycloak actif

### 3. Initialiser Keycloak

```bash
cd api-rest
node init-keycloak.js
```

Ce script configure :
- Un realm `reservation-realm`
- Un client `myclient` avec le secret `mysecret`
- Deux utilisateurs de test :
  - `test1` (rôle user) : testuser1@example.com / password
  - `test2` (rôle admin) : testuser2@example.com / password
- Les rôles `user` et `admin`

**Vérification** : Vous devriez voir des messages de confirmation pour chaque étape.

### 4. Installer les dépendances

```bash
# À la racine du projet
npm install

# Pour l'API REST
cd api-rest
npm install

# Pour l'API GraphQL
cd ../api-graphql
npm install

# Pour le service gRPC
cd ../grpc-service
npm install
```

### 5. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=reservation-realm
KEYCLOAK_CLIENT_ID=myclient
KEYCLOAK_CLIENT_SECRET=mysecret
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin
KEYCLOAK_TEST_USR_USERNAME=test1
KEYCLOAK_TEST_USR_PASSWORD=password
KEYCLOAK_TEST_ADM_USERNAME=test2
KEYCLOAK_TEST_ADM_PASSWORD=password

API_REST_URL="http://localhost:3000"
API_GRAPHQL_URL="http://localhost:4000/graphql"
PROTO_PATH="../../../../eval-webservice-clement-deguelle/grpc-service/src/proto/service.proto"
PROTO_URL="localhost:50051"

DB_HOST=localhost
DB_PORT=5432
DB_USER=pguser
DB_PASSWORD=pgpass
DB_NAME=pgdb
```

### 6. Démarrer les services

Dans des terminaux séparés :

```bash
# API REST
cd api-rest
npm run start:dev

# API GraphQL
cd api-graphql
npm run start:dev

# Service gRPC
cd grpc-service
npm run start:dev
```

### 7. Lancer les tests

```bash
# À la racine du projet
npm test
```

## Accès aux interfaces

- **Keycloak Admin Console** : http://localhost:8080 (admin/admin)
- **MinIO Console** : http://localhost:9090 (minioadmin/minioadmin)
- **API REST Swagger** : http://localhost:3000/api (après démarrage)
- **API GraphQL Playground** : http://localhost:3001/graphql (après démarrage)

## Lancer les tests directement depuis votre repo

Configurer les variables d'environnement dans le fichier .env

```env
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=reservation-realm
KEYCLOAK_CLIENT_ID=myclient
KEYCLOAK_CLIENT_SECRET=mysecret
KEYCLOAK_TEST_USR_USERNAME=testuser1@example.com
KEYCLOAK_TEST_USR_PASSWORD=password
KEYCLOAK_TEST_ADM_USERNAME=testuser2@example.com
KEYCLOAK_TEST_ADM_PASSWORD=password
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin

API_REST_URL="http://localhost:3000"
API_GRAPHQL_URL="http://localhost:4000/graphql"
PROTO_PATH="../../../../eval-webs/proto/service.proto"
PROTO_URL="localhost:50051"

DB_HOST=localhost
DB_PORT=5432
DB_USER=pguser
DB_PASSWORD=pgpass
DB_NAME=pgdb
```

Et importer le dossier proto (./grpc-service/src/proto/service.proto) à la racine de votre repo
