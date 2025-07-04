# Plateforme de Réservation de Salles

## Description
Plateforme de réservation de salles avec architecture multi-services comprenant :
- API REST (port 3000)
- API GraphQL (port 3001)  
- Service gRPC (port 50051)
- Base de données PostgreSQL (port 5432)
- Keycloak pour l'authentification (port 8080)
- MinIO pour le stockage d'objets (port 9000/9090)

## Prérequis
- Docker et Docker Compose installés
- Ports 3000, 3001, 5432, 8080, 9000, 9090, 50051 disponibles

## Démarrage

### Lancer tous les services
```bash
docker compose up
```

### Lancer en arrière-plan
```bash
docker compose up -d
```

### Arrêter tous les services
```bash
docker compose down
```

### Reconstruire les images
```bash
docker compose up --build
```

## Configuration

Tous les identifiants et mots de passe sont configurés dans le `docker-compose.yml` :

- **PostgreSQL** : pguser/pgpass (base: pgdb)
- **Keycloak** : admin/admin
- **MinIO** : minioadmin/minioadmin

## Accès aux services

- **API REST** : http://localhost:3000
- **API GraphQL** : http://localhost:3001/graphql
- **Keycloak** : http://localhost:8080
- **MinIO Console** : http://localhost:9090
- **PostgreSQL** : localhost:5432

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    API REST     │    │   API GraphQL   │    │   gRPC Service  │
│    (port 3000)  │    │   (port 3001)   │    │   (port 50051)  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   (port 5432)   │
                    └─────────────────┘
```

## Développement

Pour modifier un service :
1. Effectuer les modifications dans le code source
2. Reconstruire le service : `docker compose up --build <service-name>`
3. Ou reconstruire tous les services : `docker compose up --build`

## Tests

Les tests sont disponibles dans le dossier `src/tests/` et peuvent être exécutés avec :
```bash
npm test
``` 