#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Jalankan script ini sebagai root: sudo bash scripts/setup-vps.sh"
  exit 1
fi

if [ ! -f "docker-compose.yml" ]; then
  echo "Script harus dijalankan dari folder project yang berisi docker-compose.yml"
  exit 1
fi

echo "=== Setup Website MLM VPS ==="

read -r -p "Masukkan alamat website sementara/domain (contoh http://123.45.67.89 atau https://domain.com): " PUBLIC_URL
PUBLIC_URL="${PUBLIC_URL%/}"

if [[ "$PUBLIC_URL" == https://* ]]; then
  DOMAIN_VALUE="${PUBLIC_URL#https://}"
elif [[ "$PUBLIC_URL" == http://* ]]; then
  DOMAIN_VALUE=":80"
else
  echo "Alamat harus diawali http:// atau https://"
  exit 1
fi

read -r -p "ID admin pusat [ADM-001]: " ADMIN_ID
ADMIN_ID="${ADMIN_ID:-ADM-001}"

read -r -p "Nama admin pusat [Admin Pusat]: " ADMIN_NAME
ADMIN_NAME="${ADMIN_NAME:-Admin Pusat}"

read -r -s -p "Password admin pusat minimal 8 karakter: " ADMIN_PASSWORD
echo
if [ "${#ADMIN_PASSWORD}" -lt 8 ]; then
  echo "Password admin pusat minimal 8 karakter."
  exit 1
fi

if ! command -v openssl >/dev/null 2>&1; then
  apt update
  apt install -y openssl
fi

POSTGRES_PASSWORD="$(openssl rand -base64 36 | tr -d '\n')"
AUTH_SECRET="$(openssl rand -base64 48 | tr -d '\n')"

cat > .env <<ENV
POSTGRES_DB=ascendia
POSTGRES_USER=ascendia
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
AUTH_SECRET=${AUTH_SECRET}
AUTH_TOKEN_TTL_SECONDS=43200
DB_POOL_SIZE=20
DOMAIN=${DOMAIN_VALUE}
CORS_ORIGIN=${PUBLIC_URL}
ENV

echo "File .env sudah dibuat."

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker belum ada. Menginstall Docker..."
  apt update
  apt install -y ca-certificates curl gnupg git
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
  apt update
  apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

echo "Menjalankan website..."
docker compose up -d --build

echo "Menunggu aplikasi siap..."
sleep 12

echo "Membuat admin pusat..."
docker compose exec -T app npm --prefix backend run create:admin -- --id="${ADMIN_ID}" --name="${ADMIN_NAME}" --password="${ADMIN_PASSWORD}"

echo "Cek status container:"
docker compose ps

echo
echo "Selesai."
echo "Buka website: ${PUBLIC_URL}"
echo "Login admin:"
echo "ID: ${ADMIN_ID}"
echo "Password: password yang tadi Bapak masukkan"
