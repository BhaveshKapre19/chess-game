import { DIFFICULTIES } from "../constants.js";

export class StockfishEngine {
  constructor() {
    this.worker = null;
    this.ready = false;
    this.pendingBestMove = null;
    this.listeners = new Set();
  }

  start() {
    if (this.worker) return Promise.resolve();

    return new Promise((resolve, reject) => {
      try {
        this.worker = new Worker("/stockfish/stockfish-nnue-16-single.js");
        const timeout = window.setTimeout(() => {
          this.emit({ type: "error", message: "Stockfish took too long to start." });
          reject(new Error("Stockfish startup timed out"));
        }, 9000);

        this.worker.onmessage = (event) => {
          const line = String(event.data || "");
          this.emit({ type: "line", line });

          if (line === "uciok") this.worker.postMessage("isready");

          if (line === "readyok" && !this.ready) {
            this.ready = true;
            window.clearTimeout(timeout);
            resolve();
          }

          if (line.startsWith("bestmove") && this.pendingBestMove) {
            const bestMove = line.split(" ")[1];
            const pending = this.pendingBestMove;
            this.pendingBestMove = null;
            pending.resolve(bestMove && bestMove !== "(none)" ? bestMove : null);
          }
        };

        this.worker.onerror = (error) => {
          this.emit({ type: "error", message: "The chess engine crashed." });
          reject(error);
        };

        this.worker.postMessage("uci");
      } catch (error) {
        reject(error);
      }
    });
  }

  on(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(event) {
    this.listeners.forEach((listener) => listener(event));
  }

  setDifficulty(level) {
    const difficulty = DIFFICULTIES[level] || DIFFICULTIES.medium;
    this.worker?.postMessage(`setoption name Skill Level value ${difficulty.skill}`);
    this.worker?.postMessage("setoption name UCI_LimitStrength value true");
    this.worker?.postMessage(`setoption name UCI_Elo value ${difficulty.elo}`);
  }

  setPosition(fen) {
    this.worker?.postMessage(`position fen ${fen}`);
  }

  async getBestMove(fen, level = "medium") {
    await this.start();
    const difficulty = DIFFICULTIES[level] || DIFFICULTIES.medium;
    this.setDifficulty(level);
    this.setPosition(fen);

    return new Promise((resolve, reject) => {
      this.pendingBestMove = { resolve, reject };
      this.worker.postMessage(`go depth ${difficulty.depth} movetime ${difficulty.moveTime}`);
    });
  }

  stop() {
    if (this.worker) {
      this.worker.postMessage("quit");
      this.worker.terminate();
    }
    this.worker = null;
    this.ready = false;
    this.pendingBestMove = null;
  }
}
