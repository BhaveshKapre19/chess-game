# React Stockfish Chess

A React chess app with a static frontend and a separate Stockfish engine server.

## Features

- Drag-and-drop chessboard powered by `react-chessboard`
- Legal move validation and PGN generation from `chess.js`
- Stockfish AI replies automatically through a separate Node engine API
- Easy, Medium, and Hard difficulty levels
- Last-move highlighting
- Game status for turn, check, checkmate, stalemate, repetition, and insufficient material
- New Game and board orientation controls
- Responsive UI with an AI thinking indicator

## Project Structure

```text
react-stockfish-chess/
  public/
  scripts/
    dev.js
  server/
    engineServer.js
  src/
    components/
    hooks/
    utils/
    App.jsx
    index.css
    main.jsx
  .env.example
  netlify.toml
  render.yaml
  vercel.json
  package.json
  vite.config.js
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start both the frontend and the engine server:

```bash
npm run dev
```

3. Open the app:

```text
http://127.0.0.1:5173
```

You can also run each side separately:

```bash
npm run dev:client
npm run dev:engine
```

## Environment Variables

Copy values from `.env.example`.

Frontend:

```bash
VITE_ENGINE_URL=https://your-engine-service.example.com
```

Engine server:

```bash
ENGINE_HOST=0.0.0.0
ENGINE_PORT=8787
ENGINE_CORS_ORIGIN=https://your-frontend-domain.example.com
```

## Deployment

Frontend:

- Vercel is ready via `vercel.json`
- Netlify is ready via `netlify.toml`
- Before building the frontend, set `VITE_ENGINE_URL` to your deployed engine URL

Engine server:

- Deploy `server/engineServer.js` as a separate Node service
- Render is ready via `render.yaml`
- The production start command is:

```bash
npm start
```

Health endpoint:

```text
GET /health
```

Best move endpoint:

```text
POST /bestmove
```

Example request body:

```json
{ "fen": "current FEN", "depth": 8 }
```

## Build

```bash
npm run build
```

Preview the frontend build locally:

```bash
npm run preview
```
