# Cómo borrar secretos de GitHub y volver a subir limpio

## Qué pasó

El **primer push** subió `src/App.tsx` con contraseñas de correo y SRI en el código.
Eso queda en el **historial** de Git aunque borres el archivo después.

**Solución más simple para el hackathon:** borrar el repo en GitHub y crear uno nuevo limpio.

---

## Paso 1 — Borrar el repo viejo (web GitHub)

1. Abre: https://github.com/Rafa-Innerchispa/inneros-hackathon-ui
2. **Settings** (pestaña del repo)
3. Baja hasta **Danger Zone**
4. **Delete this repository**
5. Escribe `Rafa-Innerchispa/inneros-hackathon-ui` para confirmar

> El código en tu servidor **no se borra** — solo desaparece la copia en GitHub.

---

## Paso 2 — Verificar que el código local está limpio

En el servidor:

```bash
cd /home/rlopez/projects/swarm-os-google_ai_studio

# No debe encontrar contraseñas reales
grep -rE 'PCD0ct0r|InnerSparkLopez@@|BXQbDtMt' src/ server.ts || echo "OK: sin secretos en código"

# .env NO debe estar en git
git status
# Si .env aparece en "Changes to be committed" → NO hagas commit
```

---

## Paso 3 — Subir repo nuevo limpio

```bash
cd /home/rlopez/projects/swarm-os-google_ai_studio

# Quitar enlace al repo borrado
git remote remove origin 2>/dev/null || true

# Commit con código limpio (si hay cambios pendientes)
git add server.ts src/App.tsx GEMINI_SETUP.md SECURITY_BEFORE_PUSH.md LIMPIAR_GITHUB.md
git diff --cached --name-only | grep '^\.env$' && echo "ERROR: .env en staging" && exit 1
git commit -m "InnerOS hackathon — MongoDB track (sin secretos)" || true

# Crear repo público nuevo y subir
gh repo create Rafa-Innerchispa/inneros-hackathon-ui --public --source=. --remote=origin --push
```

URL final: https://github.com/Rafa-Innerchispa/inneros-hackathon-ui

---

## Paso 4 — Rotar lo que SÍ estuvo expuesto (obligatorio)

| Qué | Dónde rotar | Acción |
|-----|-------------|--------|
| **Contraseñas correo** IMAP | Panel hosting `mail.pcdoctor.com.ec` o cPanel | Cambiar pass de `contabilidad@` y `rlopez@` |
| **API RUC Intuito** | Si `deuna-ruc` era tuyo | Pedir nueva pass o usar solo `.env` local |
| **Evolution API key** | Evolution manager `:8082` | Opcional: cambiar `swarm_os_evolution_key_2026` |
| **Gemini `AQ.`** | https://aistudio.google.com/apikey | **No estuvo en Git** — solo en `.env` local ✅ |
| **ngrok token** | https://dashboard.ngrok.com/get-started/your-authtoken | **No estuvo en Git** — solo en `.env` local ✅ |

### Gemini y ngrok — NO hace falta borrarlos en GitHub

Nunca entraron al repo (`.gitignore` bloquea `.env`).

---

## Paso 5 — Backend (si lo haces público)

```bash
cd /home/rlopez/projects/innerspark-swarm-os-cursor-local
# .env ya está en .gitignore — verificar:
git ls-files | grep '^\.env$' || echo "OK"

gh repo edit Rafa-Innerchispa/innerspark-swarm-os-cursor-local --visibility public
```

Solo después de limpiar `docs/MAPA_PROYECTO.md` (ya hecho).

---

## Resumen

| Pregunta | Respuesta |
|----------|-----------|
| ¿Borrar en GitHub web? | **Sí** — Delete repository + volver a `gh repo create` |
| ¿Basta con un commit nuevo? | **No** — el historial viejo sigue teniendo las contraseñas |
| ¿Gemini/ngrok en GitHub? | **No** — estaban solo en `.env` |
| ¿Qué rotar sí o sí? | **Contraseñas de correo** que estaban en App.tsx |
