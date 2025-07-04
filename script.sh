#!/usr/bin/env bash
set -euo pipefail

# --- variables ----------------------------------------------------------------
KEYCLOAK_VERSION="26.2"
CONTAINER_NAME="eval-webservice-clement-deguelle-keycloak-1"
ADMIN_USER="admin"
ADMIN_PWD="admin"

# --- fonctions utilitaires ----------------------------------------------------
cleanup() {
  echo -e "\nArrêt du conteneur…"
  docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
}
trap cleanup INT TERM



# --- désactivation du SSL sur le realm master ---------------------------------
docker exec "$CONTAINER_NAME" /opt/keycloak/bin/kcadm.sh \
  config credentials --server http://localhost:8080 \
  --realm master --user "$ADMIN_USER" --password "$ADMIN_PWD"

docker exec "$CONTAINER_NAME" /opt/keycloak/bin/kcadm.sh \
  update realms/master --set sslRequired=NONE
  

docker exec "$CONTAINER_NAME" /opt/keycloak/bin/kcadm.sh \
  update realms/reservation-realm --set sslRequired=NONE
  

echo -e "\n✅  SSL désactivé pour le realm 'master'."
echo "➡️  Ouvre maintenant http://localhost:8080/ dans ton navigateur."
echo "ℹ️  Laisse ce script tourner tant que tu veux garder Keycloak actif."
wait
 