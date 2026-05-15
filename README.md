# React Stockfish Chess

A single-deploy React chess app powered by `chess.js`, `react-chessboard`, and Stockfish running directly in the browser as a Web Worker.

## Features

- Drag-and-drop chessboard powered by `react-chessboard`
- Legal move validation and PGN generation from `chess.js`
- Stockfish AI replies automatically from an in-browser Web Worker
- Easy, Medium, and Hard difficulty levels
- Last-move highlighting
- Game status for turn, check, checkmate, stalemate, repetition, and insufficient material
- New Game and board orientation controls
- Responsive UI with an AI thinking indicator

## Project Structure

```text
react-stockfish-chess/
  public/
    stockfish-18-lite-single.js
    stockfish-18-lite-single.wasm
  src/
    components/
    hooks/
    utils/
    App.jsx
    index.css
    main.jsx
  netlify.toml
  vercel.json
  package.json
  vite.config.js
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open the app:

```text
http://127.0.0.1:5173
```

## Deployment

- Vercel is ready via `vercel.json`
- Netlify is ready via `netlify.toml`
- No separate backend is required
- The Stockfish worker and `.wasm` file are bundled from `public/` and deployed with the frontend

## Build

```bash
npm run build
```

Preview the frontend build locally:

```bash
npm run preview
```
