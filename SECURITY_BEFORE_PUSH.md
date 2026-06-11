# Seguridad antes de publicar en GitHub

## ✅ NO se sube (protegido por `.gitignore`)

- `.env` → `GEMINI_API_KEY`, `NGROK_AUTHTOKEN`, Evolution, MongoDB
- `node_modules/`, `dist/`

Solo se publica `.env.example` con placeholders.

## ⚠️ Ya estuvo expuesto (commit anterior público)

El primer push incluyó contraseñas de correo y SRI **hardcodeadas en `src/App.tsx`**.

**Acción urgente:** rotar contraseñas IMAP de `contabilidad@` y `rlopez@pcdoctor.com.ec`.

Este commit las elimina del código. El historial de GitHub aún las contiene hasta que forces un rewrite o aceptes rotación.

## Antes de cada `git push`

```bash
git diff --cached --name-only | grep -E '^\.env$' && echo "STOP: .env en staging" && exit 1
git grep -E 'password.*@@|API_KEY=AQ\.|NGROK_AUTHTOKEN=' -- ':!*.example' ':!SECURITY_BEFORE_PUSH.md' && echo "STOP: posible secreto" && exit 1
```

## Publicar de forma segura

```bash
cd /home/rlopez/projects/swarm-os-google_ai_studio
git add server.ts src/App.tsx GEMINI_SETUP.md SECURITY_BEFORE_PUSH.md
git commit -m "security: remove hardcoded credentials before public push"
git push origin master
```
