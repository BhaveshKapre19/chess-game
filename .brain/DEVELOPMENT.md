# Development

Install:
```bash
npm install
```

Run dev server:
```bash
npm run dev
```

Build:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

Stockfish assets:
- public/stockfish/stockfish-nnue-16-single.js
- public/stockfish/stockfish-nnue-16-single.wasm

Browser requirements: modern browser with Web Worker and WASM support.

Deployment: Vite static build in dist. Ensure public/stockfish assets are deployed with the app.
