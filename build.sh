#!/bin/bash

set -e

# Ruta base del proyecto
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

function show_section() {
  echo -e "\n\033[1;36m== $1 ================================\033[0m"
}

function test_command() {
  command -v "$1" &> /dev/null
}

function start_docker_running() {
  echo -e "\033[1;36m🔍 Verificando Docker...\033[0m"
  if ! docker info &> /dev/null; then
    echo -e "\033[1;33m🐳 Docker no está corriendo. Intentando iniciar...\033[0m"
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
      sudo systemctl start docker
    fi

    echo -e "\033[1;33m⏳ Esperando a que Docker se inicie...\033[0m"
    attempts=0
    while ! docker info &> /dev/null && [ $attempts -lt 60 ]; do
      sleep 2
      ((attempts++))
    done

    if [ $attempts -ge 60 ]; then
      echo -e "\033[1;31m❌ Docker no pudo iniciarse tras esperar 2 minutos.\033[0m"
      exit 1
    fi
  fi
  echo -e "\033[1;32m✔ Docker está en ejecución.\033[0m"
}

function rename_env_if_needed() {
  local path="$1"
  local env_path="$path/.env"
  local env_test_path="$path/.env.test"

  if [[ -f "$env_path" ]]; then
    echo -e "\033[1;33m✔ .env ya existe en $path\033[0m"
  elif [[ -f "$env_test_path" ]]; then
    mv "$env_test_path" "$env_path"
    echo -e "\033[1;32m✔ Renombrado .env.test -> .env en $path\033[0m"
  else
    echo -e "\033[1;31m✘ No se encontró .env.test en $path\033[0m"
  fi
}

function start_docker_compose() {
  local path="$1"
  pushd "$path" > /dev/null
  echo -e "\033[1;35m🧹 Ejecutando docker-compose down...\033[0m"
  docker-compose down
  echo -e "\033[1;32m🐳 Ejecutando docker-compose up...\033[0m"
  docker-compose up -d --build
  popd > /dev/null
}

function test_or_exit() {
  local tool="$1"
  local message="$2"
  if ! test_command "$tool"; then
    echo -e "\033[1;31m❌ No se encontró '$tool'. $message\033[0m"
    exit 1
  fi
}

# =========================
# COMPROBACIONES INICIALES
# =========================
show_section "Comprobaciones iniciales"
test_or_exit docker "Instala Docker: https://docs.docker.com/engine/install/"
test_or_exit docker-compose "Instala docker-compose o usa Docker Compose V2."
test_or_exit npm "Instala Node.js desde https://nodejs.org/"
test_or_exit npx "npx es parte de Node.js. Asegúrate de que esté instalado."
start_docker_running

# ====================
# BACKEND: IAM
# ====================
show_section "Configurando backend/IAM"
rename_env_if_needed "$ROOT/backend/IAM"
start_docker_compose "$ROOT/backend/IAM"

# ====================
# BACKEND: INVENTORY
# ====================
show_section "Configurando backend/inventory"
rename_env_if_needed "$ROOT/backend/inventory"
start_docker_compose "$ROOT/backend/inventory"

# ====================
# BACKEND: CATALOG
# ====================
show_section "Configurando backend/catalog"
rename_env_if_needed "$ROOT/backend/catalog"
start_docker_compose "$ROOT/backend/catalog"

# ====================
# BACKEND: MATCH
# ====================
show_section "Configurando backend/match"
rename_env_if_needed "$ROOT/backend/match"
start_docker_compose "$ROOT/backend/match"

# ====================
# KEYCLOAK
# ====================
show_section "Configurando keycloak"
rename_env_if_needed "$ROOT/keycloak"
start_docker_compose "$ROOT/keycloak"

# ====================
# FRONTEND EXPO
# ====================
show_section "Configurando frontend/ludokeeper"
rename_env_if_needed "$ROOT/frontend/ludokeeper"

cd "$ROOT/frontend/ludokeeper"
echo -e "\033[1;32m📦 Verificando dependencias npm...\033[0m"
if [[ ! -d "node_modules" ]]; then
  echo -e "\033[1;33m📦 Instalando dependencias...\033[0m"
  npm install
else
  echo -e "\033[1;32m✔ Dependencias ya instaladas.\033[0m"
fi

echo -e "\033[1;32m🚀 Iniciando cliente Expo...\033[0m"
npx expo start
