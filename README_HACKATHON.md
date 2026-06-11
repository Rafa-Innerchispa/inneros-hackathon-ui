# InnerOS / Swarm-OS — Google Cloud Rapid Agent Hackathon

**Track:** MongoDB  
**Deadline:** 11 jun 2026, 4:00 PM GMT-5  
**AI Studio:** https://ai.studio/apps/a2d230ce-a60c-431a-a56f-f24a6aa14989

## Problema real (Ecuador)

PYME técnica de seguridad electrónica (PC Doctor) necesita automatizar: dictado de campo → inspección MongoDB → RUC/SRI → cotización IVA → informe → WhatsApp al cliente. **8 agentes** (Droides) orquestados con CrewAI, no un chatbot.

## Arquitectura

```
UI Google AI Studio (:5180)  ──proxy──►  Swarm-OS FastAPI (:8100)
                                              ├── MongoDB pcdoctor_swarm
                                              ├── CrewAI + Ollama
                                              ├── Evolution WhatsApp
                                              └── API SRI/RUC Ecuador
```

## Demo rápida

```bash
./scripts/start_all.sh
curl http://127.0.0.1:8100/api/v1/hackathon/compliance
curl -X POST http://127.0.0.1:8100/api/v1/hackathon/tour/run \
  -H "Content-Type: application/json" \
  -d '{"voice_text":"Cotizar switch PoE 16 puertos Torres de la Merced, cámaras sin energía"}'
```

## Integraciones hackathon

| Requisito | Evidencia |
|-----------|-----------|
| Agente multi-paso | `POST /api/v1/hackathon/tour/run` |
| Gemini | UI `server.ts` + `GEMINI_API_KEY` → ver `GEMINI_SETUP.md` |
| MongoDB | 71+ colecciones, tour crea inspecciones reales |
| MongoDB MCP | `.cursor/mcp.json` → ver backend `docs/MONGODB_MCP_SETUP.md` |
| Google AI Studio | App exportada (enlace arriba) |

## Repos

| Componente | Ruta local | GitHub |
|------------|------------|--------|
| UI hackathon | `swarm-os-google_ai_studio` | `inneros-hackathon-ui` (público) |
| Backend Swarm-OS | `innerspark-swarm-os-cursor-local` | [Rafa-Innerchispa/innerspark-swarm-os-cursor-local](https://github.com/Rafa-Innerchispa/innerspark-swarm-os-cursor-local) |

> Hacer **público** el repo backend en GitHub Settings antes de Devpost, o usar solo el repo UI con README que enlace al backend.

## URL pública (Devpost)

```bash
./scripts/start_demo_tunnel.sh   # ngrok http 5180
```

## Documentación

- `GEMINI_SETUP.md` — API key Gemini
- `DEVPOST_CHECKLIST.md` — checklist final
- `DEVPOST_VIDEO_SCRIPT.md` — guion 3 min
- Backend: `docs/MONGODB_MCP_SETUP.md`

## Licencia

MIT — ver `LICENSE`
