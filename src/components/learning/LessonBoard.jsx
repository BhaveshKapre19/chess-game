import { useMemo, useState } from "react";
import { Chess } from "chess.js";
import ChessBoard from "../chess/ChessBoard.jsx";
import PromotionDialog from "../chess/PromotionDialog.jsx";
import { getPieceMap } from "../../chess/moveUtils.js";
import { evaluateChallenge } from "../../learning/lessons/lessonEngine.js";

export default function LessonBoard({ lesson, onSuccess, onAttempt }) {
  const [chess, setChess] = useState(() => new Chess(lesson.fen));
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("Make the lesson move on the board.");
  const [promotion, setPromotion] = useState(null);
  const legalMoves = useMemo(() => selected ? chess.moves({ square: selected, verbose: true }) : [], [chess, selected]);

  function reset() {
    setChess(new Chess(lesson.fen));
    setSelected(null);
    setPromotion(null);
    setFeedback("Board reset. Try the challenge again.");
  }

  function submitMove(from, to, promotionPiece = "q") {
    const next = new Chess(chess.fen());
    const move = next.move({ from, to, promotion: promotionPiece });
    if (!move) {
      setFeedback("That move is not legal in this position.");
      onAttempt?.();
      return;
    }
    const result = evaluateChallenge(lesson, move, next);
    setChess(next);
    setSelected(null);
    setFeedback(result.message);
    onAttempt?.();
    if (result.ok) onSuccess?.();
  }

  function handleSquare(square) {
    const piece = chess.get(square);
    if (selected) {
      const move = legalMoves.find((candidate) => candidate.to === square);
      if (move) {
        if (move.flags.includes("p")) {
          setPromotion({ from: selected, to: square });
          return;
        }
        submitMove(selected, square);
        return;
      }
    }
    if (piece && piece.color === "w") setSelected(square);
    else setSelected(null);
  }

  return (
    <div className="lesson-board-panel">
      <ChessBoard
        pieceMap={getPieceMap(chess)}
        selected={selected}
        legalMoves={legalMoves}
        highlights={lesson.highlights}
        onSquareClick={handleSquare}
        showCoordinates
        label={`${lesson.title} board`}
      />
      <div className="lesson-feedback" role="status">{feedback}</div>
      <button type="button" className="secondary" onClick={reset}>Reset board</button>
      {promotion && <PromotionDialog color="w" onPromote={(piece) => submitMove(promotion.from, promotion.to, piece)} />}
    </div>
  );
}
