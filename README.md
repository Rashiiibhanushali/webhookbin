# 🪝 WebhookBin

A personal webhook inspector built for developers. Generate a unique webhook URL instantly and inspect incoming requests in real time.

## Live Demo
🔗 [webhookbin.vercel.app](https://webhookbin-three.vercel.app)

## Features
- Generate a unique webhook URL instantly
- Inspect POST requests in real time via WebSockets
- View headers, body, query params, IP, and timestamps
- Copy any section with one click
- Multiple bins support with New Bin / Clear All

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Real-time | WebSockets (ws) |
| Database | PostgreSQL (Supabase) |
| Deployment | Railway (backend), Vercel (frontend) |

## Local Development

### Backend
cd server
npm install
npm run dev

### Frontend
cd client
npm install
npm run dev

## Architecture
- Each bin is a UUID stored in PostgreSQL
- Incoming webhooks are captured and stored as JSONB
- WebSocket server broadcasts new requests to subscribed clients instantly
- No polling — pure event-driven real-time updates