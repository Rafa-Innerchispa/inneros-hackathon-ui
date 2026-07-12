# Swarm-OS Google AI Studio Interface

**Gemini API Integration Sandbox & Interface**

Este proyecto expone una interfaz integrada para el procesamiento rápido de prompts y generación mediante la API de Gemini (Google AI Studio) dentro de Swarm-OS.

## 📊 Arquitectura y Recursos
* **Puerto del Servidor:** `5180` (Vite / Node.js development server)
* **Servicio systemd:** `swarm-os-google-ai-studio.service`
* **Directorio Base:** `/home/rlopez/projects/swarm-os-google_ai_studio`

## 🚀 Arranque Rápido
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Ejecutar de forma local:
   ```bash
   npm run dev
   ```
3. Ejecutar mediante systemd:
   ```bash
   sudo systemctl restart swarm-os-google-ai-studio
   ```
