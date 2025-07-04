#!/bin/bash

echo "🔑 Configuration de Keycloak pour les tests..."

# Attendre que Keycloak soit complètement prêt
echo "⏳ Attente de Keycloak..."
timeout 120 bash -c 'until curl -s http://localhost:8080/health/ready > /dev/null 2>&1; do sleep 5; done'

# Variables
KEYCLOAK_URL="http://localhost:8080"
ADMIN_USER="admin"
ADMIN_PASS="admin"
REALM_NAME="reservation-realm"
CLIENT_ID="myclient"
CLIENT_SECRET="mysecret"

# Obtenir le token admin
echo "📍 Obtention du token administrateur..."
ADMIN_TOKEN=$(curl -s -X POST \
  "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=${ADMIN_USER}" \
  -d "password=${ADMIN_PASS}" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | jq -r '.access_token')

if [ "$ADMIN_TOKEN" == "null" ] || [ -z "$ADMIN_TOKEN" ]; then
  echo "❌ Impossible d'obtenir le token administrateur"
  exit 1
fi

echo "✅ Token administrateur obtenu"

# Créer le realm
echo "📍 Création du realm ${REALM_NAME}..."
curl -s -X POST \
  "${KEYCLOAK_URL}/admin/realms" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "realm": "'${REALM_NAME}'",
    "enabled": true,
    "accessTokenLifespan": 3600,
    "refreshTokenMaxReuse": 0,
    "offlineSessionIdleTimeout": 2592000
  }'

echo "✅ Realm créé"

# Créer le client
echo "📍 Création du client ${CLIENT_ID}..."
curl -s -X POST \
  "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "'${CLIENT_ID}'",
    "enabled": true,
    "secret": "'${CLIENT_SECRET}'",
    "directAccessGrantsEnabled": true,
    "serviceAccountsEnabled": true,
    "authorizationServicesEnabled": false,
    "publicClient": false,
    "protocol": "openid-connect"
  }'

echo "✅ Client créé"

# Créer les utilisateurs de test
echo "📍 Création des utilisateurs de test..."

# Utilisateur normal (test1)
curl -s -X POST \
  "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test1",
    "email": "test1@example.com",
    "firstName": "Test",
    "lastName": "User",
    "enabled": true,
    "credentials": [{
      "type": "password",
      "value": "password",
      "temporary": false
    }]
  }'

# Utilisateur admin (test2)
curl -s -X POST \
  "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test2",
    "email": "test2@example.com",
    "firstName": "Test",
    "lastName": "Admin",
    "enabled": true,
    "credentials": [{
      "type": "password",
      "value": "password",
      "temporary": false
    }]
  }'

echo "✅ Utilisateurs de test créés"

# Test de connexion
echo "📍 Test de connexion..."
TEST_TOKEN=$(curl -s -X POST \
  "${KEYCLOAK_URL}/realms/${REALM_NAME}/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test1" \
  -d "password=password" \
  -d "grant_type=password" \
  -d "client_id=${CLIENT_ID}" \
  -d "client_secret=${CLIENT_SECRET}" | jq -r '.access_token')

if [ "$TEST_TOKEN" != "null" ] && [ -n "$TEST_TOKEN" ]; then
  echo "✅ Configuration Keycloak terminée avec succès!"
else
  echo "❌ Erreur lors du test de connexion"
  exit 1
fi 