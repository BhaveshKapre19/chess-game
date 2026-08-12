import { FILES, PIECE_VALUES, STARTING_COUNTS } from "./constants.js";

export function squareColor(square) {
  const fileIndex = FILES.indexOf(square[0]);
  const rank = Number(square[1]);
  return (fileIndex + rank) % 2 === 0 ? "dark" : "light";
}

export function getBoardSquares(orientation = "white") {
  const ranks = orientation === "white" ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
  const files = orientation === "white" ? FILES : [...FILES].reverse();
  return ranks.flatMap((rank) => files.map((file) => `${file}${rank}`));
}

export function getPieceMap(chess) {
  const map = {};
  chess.board().forEach((rank) => {
    rank.forEach((piece) => {
      if (piece) {
        map[piece.square] = piece;
      }
    });
  });
  return map;
}

export function getCapturedPieces(chess) {
  const counts = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 }
  };

  chess.board().forEach((rank) => {
    rank.forEach((piece) => {
      if (piece) {
        counts[piece.color][piece.type] += 1;
      }
    });
  });

  return {
    w: Object.fromEntries(Object.entries(STARTING_COUNTS).map(([piece, count]) => [piece, count - counts.w[piece]])),
    b: Object.fromEntries(Object.entries(STARTING_COUNTS).map(([piece, count]) => [piece, count - counts.b[piece]]))
  };
}

export function materialScore(captured) {
  const whiteScore = Object.entries(captured.b).reduce((sum, [piece, count]) => sum + PIECE_VALUES[piece] * count, 0);
  const blackScore = Object.entries(captured.w).reduce((sum, [piece, count]) => sum + PIECE_VALUES[piece] * count, 0);
  return whiteScore - blackScore;
}

export function groupedHistory(history) {
  const rows = [];
  for (let index = 0; index < history.length; index += 2) {
    rows.push({
      move: index / 2 + 1,
      white: history[index],
      black: history[index + 1]
    });
  }
  return rows;
}

export function gameStatus(chess, playerColor, engineThinking, resigned) {
  if (resigned) return "You resigned";
  if (chess.isCheckmate()) {
    const winner = chess.turn() === "w" ? "Black" : "White";
    return `${winner} wins by checkmate`;
  }
  if (chess.isStalemate()) return "Draw by stalemate";
  if (chess.isThreefoldRepetition()) return "Draw by repetition";
  if (chess.isInsufficientMaterial()) return "Draw by insufficient material";
  if (chess.isDraw()) return "Draw";
  if (chess.isCheck()) return chess.turn() === playerColor ? "Check: your king is under attack" : "Stockfish is in check";
  if (engineThinking) return "Stockfish is thinking...";
  return chess.turn() === playerColor ? "Your turn" : "Stockfish to move";
}

export function isGameOver(chess, resigned) {
  return resigned || chess.isGameOver();
}
