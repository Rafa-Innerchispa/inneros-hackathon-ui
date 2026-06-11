# GEMINI_API_KEY — InnerOS Hackathon

La UI de Google AI Studio usa Gemini para el flujo estrella (chat, visión, orquestación en `server.ts`).

## Dónde pegar la clave (UN solo lugar)

**Archivo:** `/home/rlopez/projects/swarm-os-google_ai_studio/.env`

```bash
GEMINI_API_KEY=AIzaSy...tu_clave_aqui
```

> En Windows (Google Drive): `H:\Mi unidad\Proyectos\swarm-os-google_ai_studio\.env`

## Obtener la clave

1. [Google AI Studio → API Keys](https://aistudio.google.com/apikey)
2. Crear clave para el proyecto GCP del hackathon
3. Pegar en `.env` (línea `GEMINI_API_KEY=`)

## Verificar (sin mostrar la clave)

```bash
cd /home/rlopez/projects/swarm-os-google_ai_studio
grep -q '^GEMINI_API_KEY=.\+' .env && echo "OK: clave presente" || echo "FALTA: pegar clave"
npm run dev
# Abrir http://localhost:5180 — probar chat Gemini en la UI
```

## ¿Compartir desde otro proyecto?

No hay `GEMINI_API_KEY` en `innerspark-swarm-os-cursor-local/.env` hoy. Si tienes la clave en otro `.env` local:

```bash
# Copiar solo la línea (ajusta la ruta origen)
grep '^GEMINI_API_KEY=' /ruta/al/.env.origen >> /home/rlopez/projects/swarm-os-google_ai_studio/.env
```

## Compliance

Tras pegar la clave y reiniciar la UI:

```bash
curl -s http://127.0.0.1:8100/api/v1/hackathon/compliance | python3 -m json.tool | grep gemini
```

Debe mostrar `"gemini_configured": true` y subir `estimated_compliance_pct`.

## Seguridad

- `.env` está en `.gitignore` — **nunca** hacer commit de la clave
- Rotar la clave si se filtró accidentalmente
