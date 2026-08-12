import { Chess } from "chess.js";

export function evaluateChallenge(lesson, move, chess) {
  if (!move && lesson.challenge.alreadySolved) return { ok: true, message: lesson.success };
  if (!move) return { ok: false, message: "Choose a legal move on the board." };

  const { challenge } = lesson;
  const targetMatch = move.from === challenge.from && move.to === challenge.to;
  if (!targetMatch) return { ok: false, message: "Not quite. Try the highlighted target and use the hint if you need it." };

  if (challenge.type === "capture" && !move.captured) return { ok: false, message: "That move is legal, but the lesson is asking for a capture." };
  if (challenge.type === "check" && !chess.isCheck()) return { ok: false, message: "That move should put the king in check. Try again." };
  if (challenge.type === "checkmate" && !chess.isCheckmate()) return { ok: false, message: "That move should end the game with checkmate." };
  return { ok: true, message: lesson.success };
}

export function chessFromFen(fen) {
  return new Chess(fen);
}
