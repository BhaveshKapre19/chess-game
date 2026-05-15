const SEARCH_TIMEOUT_MS = 10000;
const SEARCH_TIME_BY_DEPTH = {
  2: 250,
  8: 900,
  15: 1800,
};

export class Engine {
  constructor() {
    const workerPath = new URL(
      `${import.meta.env.BASE_URL}stockfish-18-lite-single.js`,
      window.location.href,
    );

    this.stockfish = new Worker(workerPath);
    this.activeSearch = null;
    this.handleMessage = this.handleMessage.bind(this);
    this.stockfish.addEventListener('message', this.handleMessage);
    this.sendMessage('uci');
    this.sendMessage('isready');
    this.sendMessage('ucinewgame');
  }

  handleMessage(event) {
    const line = String(event.data ?? '');

    if (!this.activeSearch || !line.startsWith('bestmove')) {
      return;
    }

    const move = line.split(' ')[1];
    const { resolve, timeoutId } = this.activeSearch;
    window.clearTimeout(timeoutId);
    this.activeSearch = null;
    resolve(move);
  }

  sendMessage(message) {
    this.stockfish.postMessage(message);
  }

  getBestMove(fen, depth = 8) {
    this.stopSearch('Engine request cancelled.');

    return new Promise((resolve, reject) => {
      const safeDepth = Number(depth) || 8;
      const moveTime = SEARCH_TIME_BY_DEPTH[safeDepth] || Math.min(2200, safeDepth * 160);
      const timeoutId = window.setTimeout(() => {
        this.stopSearch('Stockfish took too long to respond.');
      }, SEARCH_TIMEOUT_MS);

      this.activeSearch = {
        resolve,
        reject,
        timeoutId,
      };

      this.sendMessage(`position fen ${fen}`);
      this.sendMessage(`go depth ${safeDepth} movetime ${moveTime}`);
    });
  }

  newGame() {
    this.stopSearch('Engine request cancelled.');
    this.sendMessage('ucinewgame');
    this.sendMessage('isready');
  }

  stopSearch(message) {
    if (!this.activeSearch) {
      return;
    }

    const { reject, timeoutId } = this.activeSearch;
    window.clearTimeout(timeoutId);
    this.activeSearch = null;
    this.sendMessage('stop');
    reject(new Error(message));
  }

  terminate() {
    this.stopSearch('Engine request cancelled.');
    this.stockfish.removeEventListener('message', this.handleMessage);
    this.stockfish.terminate();
  }
}
