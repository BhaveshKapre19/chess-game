import { useCallback, useState } from 'react';
import { Chess } from 'chess.js';

export function useChessGame() {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [history, setHistory] = useState([]);

  const syncGameState = useCallback(() => {
    setFen(chess.fen());
    setHistory(chess.history({ verbose: true }));
  }, [chess]);

  const getGameStatus = () => {
    let status = `${chess.turn() === 'w' ? 'White' : 'Black'} to move`;
    let isGameOver = false;

    if (chess.isCheckmate()) {
      status = `Checkmate! ${chess.turn() === 'w' ? 'Black' : 'White'} wins.`;
      isGameOver = true;
    } else if (chess.isDraw()) {
      status = 'Draw';
      if (chess.isStalemate()) status += ' (Stalemate)';
      if (chess.isThreefoldRepetition()) status += ' (Repetition)';
      if (chess.isInsufficientMaterial()) status += ' (Insufficient Material)';
      isGameOver = true;
    } else if (chess.isCheck()) {
      status = 'Check!';
    }

    return {
      statusMessage: status,
      isGameOver,
      turn: chess.turn(),
    };
  };

  const makeMove = useCallback((move) => {
    try {
      const result = chess.move(move);
      if (result) {
        syncGameState();
        return result;
      }
    } catch {
      return null;
    }
    return null;
  }, [chess, syncGameState]);

  const resetGame = useCallback(() => {
    chess.reset();
    setFen(chess.fen());
    setHistory([]);
  }, [chess]);

  const pgn = chess.pgn();
  const lastMove = history.length > 0 ? history[history.length - 1] : null;

  return {
    chess,
    fen,
    history,
    pgn,
    lastMove,
    makeMove,
    resetGame,
    ...getGameStatus(),
  };
}
