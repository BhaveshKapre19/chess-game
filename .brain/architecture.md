# Project Architecture: React Chess

## Overview
This document outlines the high-level architecture, dependencies, and file structure of the **React Chess** project, generated from the codebase knowledge graph.

### Metrics
- **Total Nodes:** 3242
- **Total Edges:** 5092
- **Primary Languages:** JavaScript, Python, TypeScript, HTML, CSS

---

## High-Level Architecture & Layers

The project is structured into several architectural layers, which organize the flow of dependencies and data:

1. **`App` (Entry Layer)**: The main React entry points. Makes outbound calls to hooks and utilities.
2. **`hooks` (Leaf Layer)**: Contains custom React hooks (e.g., `useChessGame.js`). These only receive inbound calls and do not depend on other complex internal services.
3. **`utils` (Core Layer)**: Core logic and utilities (e.g., `engine.js` for chess logic). High fan-in (called by many modules), but zero or low fan-out.
4. **`stockfish-18-lite-single` (Entry Layer)**: The web worker or engine script located in `public/`.
5. **`agents` (Core Layer)**: A backend/tooling layer located in `.agents/` (e.g., `ui-ux-pro-max-skill`), which has high fan-in from various utility scripts.

---

## Component Boundaries & Data Flow

Key interactions across major components (module boundaries):
- **`App`** → **`utils`** (3 calls)
- **`App`** → **`hooks`** (1 call)
- **`stockfish-18-lite-single`** → **`utils`** (1 call)
- **`stockfish-18-lite-single`** → **`agents`** (5 calls)

---

## Directory Structure

### `src/` (Main Application Code)
The main frontend source code for the chess application.
- **`App.jsx`, `main.jsx`**: Application entry points.
- **`components/`**: React UI components.
  - `ChessBoardComponent.jsx`
  - `GameControls.jsx`
  - `GameStatus.jsx`
  - `MoveHistory.jsx`
- **`hooks/`**: Custom React hooks.
  - `useChessGame.js`
- **`utils/`**: Helper functions and non-React logic.
  - `engine.js`
- **`index.css`**: Global styles.

### `public/` (Static Assets)
- `stockfish-18-lite-single.js`: The Stockfish chess engine compiled to JavaScript/WebAssembly.

### Root Configs
- `vite.config.js`: Vite build configuration.
- `eslint.config.js`: Linting setup.
- `netlify.toml` / `vercel.json`: Deployment configurations.

### `.agents/`
Contains an embedded AI skill (`ui-ux-pro-max-skill`) that provides UI/UX generating scripts in Python, JS, and TS, alongside CLI utilities and documentation.

---

## Important Hotspots
The following functions/modules are frequently depended upon across the codebase (high fan-in):
- `exists` in `.agents/.../cli/src/utils/extract.ts`
- `error` / `warn` in `.agents/.../cli/src/utils/logger.ts`
- Functions within the `stockfish` public asset.
