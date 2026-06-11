# Devpost — Checklist final (Google Cloud Rapid Agent Hackathon)

**Track MongoDB · Deadline: 11 jun 2026 4:00 PM GMT-5**

Consulta compliance en vivo:

```bash
curl -s http://127.0.0.1:8100/api/v1/hackathon/compliance | python3 -m json.tool
```

---

## ✅ Hecho (técnico ~85%)

- [x] UI InnerOS 8 Droides en `:5180` (Google AI Studio)
- [x] Backend Swarm-OS real en `:8100` con bridge proxy
- [x] Tour paso 1 crea inspección real en MongoDB `pcdoctor_swarm`
- [x] 7/8 droids live (D7 Signer = demo XAdES)
- [x] CrewAI multi-agente + WhatsApp Evolution + SRI/RUC
- [x] CORS ngrok + LAN configurado en FastAPI
- [x] Scripts `start_all.sh`, `start_demo_tunnel.sh`
- [x] MongoDB MCP config (`.cursor/mcp.json`)
- [x] Documentación GEMINI, MCP, video script

---

## 🔴 Solo Rafael (formal Devpost ~45 min + grabación)

### P0 — Antes de grabar (15 min)

- [ ] **GEMINI_API_KEY** → pegar en `.env` ([GEMINI_SETUP.md](GEMINI_SETUP.md))
- [ ] Reiniciar UI: `./scripts/start_all.sh`
- [ ] Verificar: compliance muestra `gemini_configured: true`

### P1 — URL pública (10 min)

- [ ] Crear cuenta ngrok si no existe
- [ ] Pegar `NGROK_AUTHTOKEN` en `.env` o `ngrok config add-authtoken ...`
- [ ] `./scripts/start_demo_tunnel.sh` → copiar URL `https://xxxx.ngrok-free.app`

### P2 — GitHub público (10 min)

- [ ] Backend ya en GitHub → **Settings → Make public**
- [ ] UI: `./scripts/push_hackathon_repo.sh` (con `GITHUB_TOKEN`)
- [ ] Verificar que `.env` NO está en el repo

### P3 — Video 3 min (30–45 min)

- [ ] Seguir [DEVPOST_VIDEO_SCRIPT.md](DEVPOST_VIDEO_SCRIPT.md)
- [ ] Subir a YouTube (unlisted OK)
- [ ] Screenshot MCP listando colecciones MongoDB

### P4 — Formulario Devpost (15 min)

- [ ] Título: *InnerOS Swarm-OS — Agentes para PYME técnica Ecuador*
- [ ] Track: **MongoDB**
- [ ] Project URL: URL ngrok
- [ ] GitHub: repo público
- [ ] Video URL: YouTube
- [ ] AI Studio link: https://ai.studio/apps/a2d230ce-a60c-431a-a56f-f24a6aa14989
- [ ] Descripción: copiar de `README_HACKATHON.md`

---

## Orden de prioridad (horas restantes)

| Hora | Acción |
|------|--------|
| T+0 | GEMINI key + restart |
| T+15 | ngrok + probar URL desde móvil |
| T+30 | Grabar video (1 toma, script fijo) |
| T+75 | Push repo + Devpost submit |
| T+90 | Buffer / re-grabar si falla WhatsApp |

---

## ¿Ganar es imposible al 55%?

**No.** El 55% es score **formal Devpost**, no calidad técnica. Tienes:

- Sistema multi-agente **real** (no mock)
- Track MongoDB con datos reales ecuatorianos (SRI, WhatsApp)
- Problema de impacto (PYME técnica)
- Demo reproducible con un `curl`

Al cerrar GEMINI + ngrok + video + repo público → **~85–92% compliance** y submission completa.

---

## Comandos de verificación final

```bash
./scripts/start_all.sh
curl -s http://127.0.0.1:8100/api/v1/hackathon/droids/status | python3 -m json.tool
curl -s http://127.0.0.1:8100/api/v1/hackathon/compliance | python3 -m json.tool
curl -X POST http://127.0.0.1:8100/api/v1/hackathon/tour/step/1 \
  -H "Content-Type: application/json" \
  -d '{"voice_text":"Cotizar switch PoE 16 puertos Torres de la Merced"}'
```
