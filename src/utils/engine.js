export class Engine {
  constructor(baseUrl = import.meta.env.VITE_ENGINE_URL || 'http://127.0.0.1:8787') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.abortController = null;
    this.abortReason = null;
  }

  getBestMove(fen, depth = 8) {
    this.abortPendingRequest();
    return this.post('/bestmove', { fen, depth }).then(({ bestmove }) => bestmove);
  }

  newGame() {
    this.abortPendingRequest();
    return this.post('/newgame', {});
  }

  async post(path, body) {
    this.abortController = new AbortController();
    this.abortReason = null;
    const timeoutId = window.setTimeout(() => {
      this.abortReason = 'timeout';
      this.abortController?.abort();
    }, 12000);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Engine server returned ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error?.name === 'AbortError' && this.abortReason === 'cancelled') {
        throw new Error('Engine request cancelled.', { cause: error });
      }

      if (error?.name === 'AbortError' || this.abortReason === 'timeout') {
        throw new Error('Stockfish took too long to respond.', { cause: error });
      }

      throw error;
    } finally {
      window.clearTimeout(timeoutId);
      this.abortController = null;
    }
  }

  abortPendingRequest() {
    if (this.abortController) {
      this.abortReason = 'cancelled';
      this.abortController.abort();
      this.abortController = null;
    }
  }

  terminate() {
    this.abortPendingRequest();
  }
}
