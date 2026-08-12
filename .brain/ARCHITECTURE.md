# Architecture

Source layout:
- src/app: top-level app and routing shell
- src/pages: route pages
- src/components/chess: reusable board and promotion UI
- src/components/game: play-mode panels, controls, history, captures, result modal
- src/components/learning: lesson cards, progress, hints, lesson board
- src/chess: constants, board utilities, Stockfish engine abstraction
- src/hooks: reusable game and localStorage hooks
- src/learning: lesson data, lesson validation, progress state
- src/styles: global design system

State boundaries:
- useChessGame owns game FEN/PGN state, player color, selection, promotion, engine state, settings, and result state.
- chess.js remains the legal-move source of truth.
- Stockfish commands are isolated in src/chess/engine/stockfishEngine.js.
- Learning progress lives in localStorage through src/learning/progress.js.

Routing is handled with react-router-dom BrowserRouter and route components in src/pages.
