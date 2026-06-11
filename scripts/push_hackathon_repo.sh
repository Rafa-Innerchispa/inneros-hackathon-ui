#!/usr/bin/env bash
# Primer push del repo hackathon UI (requiere credenciales Rafael)
set -euo pipefail
cd "$(dirname "$0")/.."

REPO_NAME="${GITHUB_REPO:-inneros-hackathon-ui}"
GITHUB_USER="${GITHUB_USER:-Rafa-Innerchispa}"

if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  echo "=== Preparación sin push (sin GITHUB_TOKEN) ==="
  echo ""
  echo "Comandos para Rafael:"
  echo ""
  echo "  cd $(pwd)"
  echo "  git init"
  echo "  git add ."
  echo "  git commit -m \"InnerOS hackathon submission — MongoDB track\""
  echo "  gh repo create ${GITHUB_USER}/${REPO_NAME} --public --source=. --remote=origin --push"
  echo ""
  echo "O con token:"
  echo "  export GITHUB_TOKEN=ghp_xxxx"
  echo "  export GITHUB_USER=${GITHUB_USER}"
  echo "  ./scripts/push_hackathon_repo.sh"
  exit 0
fi

if [[ ! -d .git ]]; then
  git init
  git branch -M main
fi

git add .
git diff --cached --name-only | grep -iE '^\.env$' && { echo "ERROR: .env en staging"; exit 1; }

git commit -m "InnerOS hackathon submission — MongoDB track" || true

gh repo create "${GITHUB_USER}/${REPO_NAME}" --public --source=. --remote=origin --push 2>/dev/null || \
  git push -u origin main

echo "OK: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo "En GitHub: Settings → cambiar a Public si quedó privado"
