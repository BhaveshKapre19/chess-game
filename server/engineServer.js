import http from 'node:http';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const initStockfish = require('stockfish');

const HOST = process.env.ENGINE_HOST || '127.0.0.1';
const PORT = Number(process.env.ENGINE_PORT || 8787);
const MAX_DEPTH = 18;
const SEARCH_TIMEOUT_MS = 8000;
const CORS_ORIGIN = process.env.ENGINE_CORS_ORIGIN || '*';
const SEARCH_TIME_BY_DEPTH = {
  2: 250,
  8: 900,
  15: 1800,
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 10000) {
        req.destroy();
        reject(new Error('Request body is too large.'));
      }
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body.'));
      }
    });
  });
}

class StockfishService {
  constructor() {
    this.engine = null;
    this.ready = this.createEngine();
    this.searchQueue = Promise.resolve();
    this.activeSearch = null;
  }

  async createEngine() {
    this.engine = await initStockfish('lite-single');
    this.engine.listener = (line) => this.handleLine(line);
    this.send('uci');
    this.send('isready');
    this.send('ucinewgame');
  }

  handleLine(line) {
    if (!this.activeSearch || !line.startsWith('bestmove')) {
      return;
    }

    const bestmove = line.split(' ')[1];
    const { resolve, timeout } = this.activeSearch;
    clearTimeout(timeout);
    this.activeSearch = null;
    resolve(bestmove);
  }

  send(command) {
    this.engine.sendCommand(command);
  }

  newGame() {
    return this.ready.then(() => {
      this.cancelActiveSearch('Search cancelled for a new game.');
      this.send('ucinewgame');
      this.send('isready');
    });
  }

  bestMove(fen, depth) {
    this.searchQueue = this.searchQueue
      .catch(() => null)
      .then(() => this.runSearch(fen, depth));

    return this.searchQueue;
  }

  async runSearch(fen, depth) {
    await this.ready;
    const safeDepth = Math.max(1, Math.min(MAX_DEPTH, Number(depth) || 8));
    const moveTime = SEARCH_TIME_BY_DEPTH[safeDepth] || Math.min(2200, safeDepth * 160);

    this.cancelActiveSearch('Search interrupted by a new request.');

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.cancelActiveSearch('Stockfish timed out while searching.');
      }, SEARCH_TIMEOUT_MS);

      this.activeSearch = { resolve, reject, timeout };
      this.send(`position fen ${fen}`);
      this.send(`go depth ${safeDepth} movetime ${moveTime}`);
    });
  }

  cancelActiveSearch(message) {
    if (!this.activeSearch) {
      return;
    }

    const { reject, timeout } = this.activeSearch;
    clearTimeout(timeout);
    this.activeSearch = null;
    this.send('stop');
    reject(new Error(message));
  }
}

const stockfish = new StockfishService();

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  try {
    if (req.method === 'GET' && req.url === '/') {
      await stockfish.ready;
      sendJson(res, 200, { ok: true, service: 'stockfish-engine' });
      return;
    }

    if (req.method === 'GET' && req.url === '/health') {
      await stockfish.ready;
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === 'POST' && req.url === '/newgame') {
      await stockfish.newGame();
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === 'POST' && req.url === '/bestmove') {
      const { fen, depth } = await readJson(req);

      if (typeof fen !== 'string' || fen.trim() === '') {
        sendJson(res, 400, { message: 'A valid FEN string is required.' });
        return;
      }

      const bestmove = await stockfish.bestMove(fen, depth);
      sendJson(res, 200, { bestmove });
      return;
    }

    sendJson(res, 404, { message: 'Route not found.' });
  } catch (error) {
    sendJson(res, 500, { message: error.message || 'Engine server error.' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Stockfish engine server listening at http://${HOST}:${PORT}`);
});
