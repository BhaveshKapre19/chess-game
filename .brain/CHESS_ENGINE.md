# Chess Engine

Rules: chess.js is the source of truth for legal moves, FEN, PGN, SAN, check, checkmate, stalemate, draw conditions, castling, en passant, and promotion.

Stockfish package: npm package `stockfish` version 16.0.0.

Worker architecture:
- The app copies stockfish-nnue-16-single.js and stockfish-nnue-16-single.wasm into public/stockfish.
- src/chess/engine/stockfishEngine.js creates a classic Worker from /stockfish/stockfish-nnue-16-single.js.
- UI code calls the StockfishEngine abstraction and does not send scattered UCI commands.

Difficulty mapping is in src/chess/constants.js and maps Beginner/Easy/Medium/Hard/Expert to Skill Level, UCI_Elo, depth, and movetime.

Lifecycle:
- start sends uci and waits for readyok.
- getBestMove sends position fen and go depth/movetime.
- stop sends quit and terminates the worker.

Error handling: startup timeout and worker errors are surfaced to the Play panel.
