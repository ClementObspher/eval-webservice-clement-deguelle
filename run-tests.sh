#!/bin/bash

echo "🚀 Démarrage de l'environnement de test..."

# Arrêter tous les conteneurs existants
echo "📍 Nettoyage des conteneurs existants..."
docker-compose down --remove-orphans

# Démarrer seulement les services de base (sans les tests)
echo "📍 Démarrage des services de base..."
docker-compose up -d db keycloak minio

# Attendre que les services soient prêts
echo "⏳ Attente de la disponibilité des services..."
echo "  - Attente de PostgreSQL..."
timeout 60 bash -c 'until docker-compose exec -T db pg_isready -U pguser -d pgdb; do sleep 2; done'

echo "  - Attente de Keycloak..."
timeout 120 bash -c 'until curl -s http://localhost:8080/health/ready > /dev/null 2>&1; do sleep 5; done'

echo "  - Attente de MinIO..."
timeout 60 bash -c 'until curl -s http://localhost:9000/minio/health/live > /dev/null 2>&1; do sleep 2; done'

# Initialiser Keycloak avec le realm de test
echo "📍 Configuration de Keycloak..."
./init-keycloak-realm.sh

# Démarrer les services API
echo "📍 Démarrage des services API..."
docker-compose up -d api-rest api-graphql grpc-service

echo "⏳ Attente de la disponibilité des APIs..."
timeout 60 bash -c 'until curl -s http://localhost:3000/health > /dev/null 2>&1; do sleep 2; done'
timeout 60 bash -c 'until curl -s http://localhost:3001/health > /dev/null 2>&1; do sleep 2; done'

echo "📍 Exécution des tests..."

# Choix du type de test à exécuter
case "${1:-all}" in
  "rest")
    echo "🧪 Exécution des tests REST API..."
    docker-compose run --rm test-api-rest
    ;;
  "graphql")
    echo "🧪 Exécution des tests GraphQL API..."
    docker-compose run --rm test-api-graphql
    ;;
  "grpc")
    echo "🧪 Exécution des tests gRPC..."
    docker-compose run --rm test-grpc-service
    ;;
  "all"|*)
    echo "🧪 Exécution de tous les tests..."
    echo "  📋 Tests REST API..."
    docker-compose run --rm test-api-rest
    echo "  📋 Tests GraphQL API..."
    docker-compose run --rm test-api-graphql
    echo "  📋 Tests gRPC..."
    docker-compose run --rm test-grpc-service
    ;;
esac

echo "✅ Tests terminés!"

# Optionnel : nettoyer après les tests
if [[ "${2}" == "--cleanup" ]]; then
  echo "🧹 Nettoyage..."
  docker-compose down --remove-orphans
fi 