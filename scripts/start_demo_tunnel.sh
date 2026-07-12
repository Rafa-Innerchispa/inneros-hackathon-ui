#!/usr/bin/env bash
# Túnel ngrok para URL pública Devpost
# Recomendado: ADMIN_PORT=5173 (Ralphi IA real + InnerOS /inneros)
# Alternativo: PORT=5180 (solo UI AI Studio — muchos bugs)
set -euo pipefail

UI_PORT="${ADMIN_PORT:-${PORT:-5173}}"
UI_ROOT="${UI_ROOT:-/home/rlopez/projects/swarm-os-google_ai_studio}"

# Cargar token desde .env si existe
if [[ -f "$UI_ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source <(grep -E '^(NGROK_AUTHTOKEN|PORT)=' "$UI_ROOT/.env" | sed 's/\r$//')
  set +a
fi

if ! command -v ngrok >/dev/null 2>&1; then
  echo "ERROR: ngrok no instalado."
  echo "Instalar: https://ngrok.com/download"
  echo "  snap install ngrok   # o descargar binario"
  exit 1
fi

if [[ -z "${NGROK_AUTHTOKEN:-}" ]]; then
  if [[ -f "$HOME/.config/ngrok/ngrok.yml" ]] && grep -q authtoken "$HOME/.config/ngrok/ngrok.yml"; then
    echo "Usando authtoken de ~/.config/ngrok/ngrok.yml"
  else
    echo "ERROR: Falta NGROK_AUTHTOKEN"
    echo ""
    echo "1. Crear cuenta: https://dashboard.ngrok.com/signup"
    echo "2. Copiar authtoken: https://dashboard.ngrok.com/get-started/your-authtoken"
    echo "3. Añadir a $UI_ROOT/.env:"
    echo "   NGROK_AUTHTOKEN=tu_token_aqui"
    echo "4. O ejecutar: ngrok config add-authtoken TU_TOKEN"
    exit 1
  fi
else
  ngrok config add-authtoken "$NGROK_AUTHTOKEN" 2>/dev/null || true
fi

# Verificar que la UI responde
if ! curl -sf "http://127.0.0.1:${UI_PORT}/" >/dev/null 2>&1; then
  echo "AVISO: UI no responde en :${UI_PORT}. Ejecuta primero: ./scripts/start_all.sh"
fi

echo "Iniciando ngrok http ${UI_PORT} ..."
echo "Copia la URL https://xxxx.ngrok-free.app en Devpost → Project Website"
exec ngrok http "$UI_PORT"
