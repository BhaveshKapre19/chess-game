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
    let statusPrompt = 'Pick up a white piece or tap one to preview its legal moves.';

    if (chess.isCheckmate()) {
      status = `Checkmate! ${chess.turn() === 'w' ? 'Black' : 'White'} wins.`;
      isGameOver = true;
      statusPrompt = 'Checkmate on the board. Start a new game or undo the last turn.';
    } else if (chess.isDraw()) {
      status = 'Draw';
      if (chess.isStalemate()) status += ' (Stalemate)';
      if (chess.isThreefoldRepetition()) status += ' (Repetition)';
      if (chess.isInsufficientMaterial()) status += ' (Insufficient Material)';
      isGameOver = true;
      statusPrompt = 'This game ended in a draw. You can review the line or begin another round.';
    } else if (chess.isCheck()) {
      status = 'Check!';
      statusPrompt = `${chess.turn() === 'w' ? 'White' : 'Black'} is in check. Look for forcing replies.`;
    }

    return {
      statusMessage: status,
      statusPrompt,
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

  const undoMoves = useCallback((count = 1) => {
    let undone = 0;

    for (let index = 0; index < count; index += 1) {
      const result = chess.undo();
      if (!result) {
        break;
      }

      undone += 1;
    }

    if (undone > 0) {
      syncGameState();
    }

    return undone;
  }, [chess, syncGameState]);

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
    undoMoves,
    ...getGameStatus(),
  };
}
