# Decisions

## Decision: Use chess.js
Date: 2026-08-12
Reason: Standard chess rules are subtle and should not be hand-rolled.
Alternatives: custom movement logic.
Why selected: chess.js supports legal moves, FEN, PGN, SAN, check, mate, castling, en passant, promotion, and draw detection.

## Decision: Use Stockfish in a worker
Date: 2026-08-12
Reason: Engine calculation should not block React rendering.
Alternatives: fake AI, random moves, main-thread engine.
Why selected: Stockfish is required and a worker keeps the UI responsive.

## Decision: Use localStorage
Date: 2026-08-12
Reason: No login or backend is needed for settings and course progress.
Alternatives: backend database, session-only state.
Why selected: simple, private, and enough for an initial client-side app.

## Decision: JavaScript/JSX only
Date: 2026-08-12
Reason: The spec explicitly forbids TypeScript.
Alternatives: TypeScript.
Why selected: requirement compliance.
