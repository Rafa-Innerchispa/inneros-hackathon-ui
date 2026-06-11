# Guion video Devpost — 3 minutos exactos

**InnerOS Swarm-OS · Track MongoDB · PC Doctor Ecuador**

Grabar pantalla: UI `:5180` + terminal con curls. Narración en español.

---

## 0:00–0:20 — Hook + problema

**Pantalla:** UI InnerOS, vista Droides / dashboard.

**Narración:**
> "InnerOS automatiza una PYME técnica en Ecuador: desde el dictado en campo hasta la cotización con IVA y el WhatsApp al cliente. Ocho agentes especializados, no un chatbot."

**Acción:** Mostrar los 8 Droides animados.

---

## 0:20–0:45 — Arquitectura

**Pantalla:** Diagrama o README_HACKATHON.md.

**Narración:**
> "La UI está en Google AI Studio con Gemini. El cerebro operativo es Swarm-OS: FastAPI, MongoDB con más de setenta colecciones, CrewAI y Evolution WhatsApp."

**Terminal (opcional en overlay):**

```bash
curl -s http://127.0.0.1:8100/api/v1/hackathon/droids/status
```

---

## 0:45–1:30 — Paso 1: Voz → MongoDB

**Pantalla:** Tour paso 1 en UI o terminal.

**Narración:**
> "El técnico dicta el pedido. D2 Voz y D1 Mail Gatekeeper abren una inspección real en MongoDB."

```bash
curl -X POST http://127.0.0.1:8100/api/v1/hackathon/tour/step/1 \
  -H "Content-Type: application/json" \
  -d '{"voice_text":"Cotizar switch PoE de 16 puertos para Torres de la Merced porque las cámaras están sin energía"}'
```

**Mostrar:** `inspection_id` en respuesta JSON.

---

## 1:30–2:00 — Paso 2–3: SRI + CrewAI

**Narración:**
> "D3 Cosmos y D5 Financial validan RUC en el SRI. D4 y D6 generan cotización con IVA ecuatoriano vía CrewAI."

```bash
curl -X POST http://127.0.0.1:8100/api/v1/hackathon/tour/step/2 \
  -H "Content-Type: application/json" \
  -d '{"tax_id":"1790016919001"}'

curl -X POST http://127.0.0.1:8100/api/v1/hackathon/tour/step/3 \
  -H "Content-Type: application/json" \
  -d '{"voice_text":"Cotizar switch PoE 16 puertos Torres de la Merced"}'
```

---

## 2:00–2:30 — Tour completo + WhatsApp

**Narración:**
> "Un solo endpoint orquesta los cinco pasos. D8 envía WhatsApp real al cliente."

```bash
curl -X POST http://127.0.0.1:8100/api/v1/hackathon/tour/run \
  -H "Content-Type: application/json" \
  -d '{"voice_text":"Cotizar switch PoE 16 puertos Torres de la Merced, cámaras sin energía"}'
```

**Pantalla:** Mensaje WhatsApp recibido (si Evolution conectado) o JSON `"whatsapp": {"status": "sent"}`.

---

## 2:30–2:50 — MongoDB MCP + Gemini

**Pantalla:** Cursor/AI Studio con MCP listando colecciones, o chat Gemini en UI.

**Narración:**
> "Track MongoDB: MCP Server oficial conectado a pcdoctor_swarm. Gemini en AI Studio para la capa de experiencia."

```bash
curl -s http://127.0.0.1:8100/api/v1/hackathon/compliance | python3 -m json.tool
```

---

## 2:50–3:00 — Cierre

**Narración:**
> "InnerOS: agentes soberanos para PYMEs latinoamericanas. Código MIT en GitHub. Gracias."

**Pantalla:** URL ngrok + logo InnerOS + `README_HACKATHON.md`.

---

## Tips de grabación

- Resolución 1080p, una sola toma si es posible
- Terminal con fuente grande (18pt+)
- Si RUC API falla, usar paso 1 + tour/run (no bloquea demo)
- Subir YouTube como **Unlisted** y pegar link en Devpost
