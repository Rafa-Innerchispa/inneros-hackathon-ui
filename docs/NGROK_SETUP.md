# ngrok — URL pública para Devpost

Devpost exige una **URL accesible desde internet** para la demo UI (`:5180`).

## 1. Instalar ngrok (Linux)

```bash
# Opción A — snap
sudo snap install ngrok

# Opción B — descarga directa
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
  | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
  | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

Verificar: `ngrok version`

## 2. Authtoken (cuenta gratuita)

1. Registro: https://dashboard.ngrok.com/signup  
2. Copiar token: https://dashboard.ngrok.com/get-started/your-authtoken  
3. Configurar **una** de estas opciones:

```bash
# A) CLI (persiste en ~/.config/ngrok/ngrok.yml)
ngrok config add-authtoken TU_TOKEN_AQUI

# B) Variable en .env de la UI
echo 'NGROK_AUTHTOKEN=TU_TOKEN_AQUI' >> /home/rlopez/projects/swarm-os-google_ai_studio/.env
```

## 3. Levantar túnel

```bash
cd /home/rlopez/projects/swarm-os-google_ai_studio
./scripts/start_all.sh          # UI + API
./scripts/start_demo_tunnel.sh  # ngrok http 5180
```

Copia la URL `https://xxxx.ngrok-free.app` → **Devpost → Project Website**.

## 4. Windows (alternativa)

Si la UI corre en Windows (`H:\Mi unidad\Proyectos\swarm-os-google_ai_studio`):

```powershell
ngrok http 5180
```

El backend puede seguir en Linux `192.168.1.4:8100` — CORS ya permite ngrok.

## Verificación compliance

```bash
curl -s http://127.0.0.1:8100/api/v1/hackathon/compliance | grep -E 'hosted_url|ngrok'
```

Debe mostrar `"met": true` cuando token + binario están OK.
