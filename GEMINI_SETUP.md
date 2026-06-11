# GEMINI_API_KEY — InnerOS Hackathon

La UI de Google AI Studio usa Gemini para el flujo estrella (chat, visión, orquestación en `server.ts`).

## Dónde pegar la clave (UN solo lugar)

**Archivo:** `/home/rlopez/projects/swarm-os-google_ai_studio/.env`

```bash
# Formato nuevo AI Studio (2026) — empieza con AQ.
GEMINI_API_KEY=AQ.Ab8R...

# Formato legacy (también válido)
# GEMINI_API_KEY=AIzaSy...

# Modelo (opcional; por defecto gemini-2.0-flash)
GEMINI_MODEL=gemini-2.0-flash
```

> **Nota:** Google migró de claves `AIzaSy` a **auth keys** `AQ.` en AI Studio (jun 2026). **Tu clave AQ. es el formato correcto.**

### Si ves error 401 (invalid authentication)

1. En [AI Studio → API Keys](https://aistudio.google.com/apikey): verifica que la clave **no esté Blocked**
2. Clic en **Add restrictions** → **Restrict to Gemini API only**
3. Si tienes restricción de IP: añade la IP pública de tu servidor o quita la restricción para la demo
4. En [GCP Console → APIs](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com): habilita **Generative Language API**
5. **Alternativa:** crea clave `AIzaSy` en [GCP Credentials](https://console.cloud.google.com/apis/credentials) del mismo proyecto

### Modelo recomendado

```bash
GEMINI_MODEL=gemini-2.5-flash
```

Mientras Gemini da 401, el chat usa **Ollama local** (`:8100`) automáticamente para la demo.

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
