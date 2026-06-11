#!/usr/bin/env bash
# Levanta backend Swarm-OS (:8100) + UI hackathon (:5180)
set -euo pipefail

BACKEND_ROOT="${BACKEND_ROOT:-/home/rlopez/projects/innerspark-swarm-os-cursor-local}"
UI_ROOT="${UI_ROOT:-/home/rlopez/projects/swarm-os-google_ai_studio}"
API_PORT="${API_PORT:-8100}"
UI_PORT="${PORT:-5180}"

echo "=== InnerOS Hackathon — start_all ==="
echo "Backend: $BACKEND_ROOT"
echo "UI:      $UI_ROOT"

# Backend
if curl -sf "http://127.0.0.1:${API_PORT}/docs" >/dev/null 2>&1; then
  echo "Backend ya corre en :${API_PORT}"
else
  echo "Iniciando FastAPI :${API_PORT}..."
  cd "$BACKEND_ROOT"
  if [[ -d venv ]]; then source venv/bin/activate; fi
  nohup python -m uvicorn api.main:app --host 0.0.0.0 --port "$API_PORT" \
    > /tmp/swarm-os-api.log 2>&1 &
  sleep 2
fi

# UI
if curl -sf "http://127.0.0.1:${UI_PORT}/" >/dev/null 2>&1; then
  echo "UI ya corre en :${UI_PORT}"
else
  echo "Iniciando UI :${UI_PORT}..."
  cd "$UI_ROOT"
  if [[ ! -d node_modules ]]; then npm install; fi
  nohup npm run dev > /tmp/swarm-os-ui.log 2>&1 &
  sleep 4
fi

echo ""
echo "URLs:"
echo "  UI:         http://127.0.0.1:${UI_PORT}"
echo "  API:        http://127.0.0.1:${API_PORT}/docs"
echo "  Compliance: http://127.0.0.1:${API_PORT}/api/v1/hackathon/compliance"
echo ""
curl -sf "http://127.0.0.1:${API_PORT}/api/v1/hackathon/compliance" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(f\"Compliance: {d.get('estimated_compliance_pct', '?')}%\")
" 2>/dev/null || echo "Compliance: (API aún arrancando)"
