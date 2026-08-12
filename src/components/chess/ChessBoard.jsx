import { FILES } from "../../chess/constants.js";
import { getBoardSquares, squareColor } from "../../chess/moveUtils.js";
import ChessPiece from "./ChessPiece.jsx";

export default function ChessBoard({
  pieceMap,
  orientation = "white",
  selected,
  legalMoves = [],
  lastMove,
  inCheckSquare,
  onSquareClick,
  showCoordinates = true,
  highlights = [],
  disabled = false,
  label = "Chess board"
}) {
  const squares = getBoardSquares(orientation);
  const legalTargets = new Set(legalMoves.map((move) => move.to || move));
  const highlightMap = new Map(highlights.map((item) => [item.square, item.kind || "target"]));

  return (
    <div className="board-wrap" role="group" aria-label={label}>
      <div className="chess-board">
        {squares.map((square) => {
          const piece = pieceMap[square];
          const isLast = lastMove && (lastMove.from === square || lastMove.to === square);
          const highlight = highlightMap.get(square);
          const file = square[0];
          const rank = square[1];
          return (
            <button
              key={square}
              type="button"
              className={`square ${squareColor(square)} ${piece ? "occupied" : ""} ${selected === square ? "selected" : ""} ${legalTargets.has(square) ? "legal" : ""} ${isLast ? "last" : ""} ${inCheckSquare === square ? "check" : ""} ${highlight ? `hint-${highlight}` : ""}`}
              onClick={() => onSquareClick?.(square)}
              disabled={disabled}
              aria-label={`${square}${piece ? ` ${piece.color === "w" ? "white" : "black"} ${piece.type}` : " empty"}`}
            >
              {showCoordinates && file === (orientation === "white" ? "a" : "h") && <span className="coord rank">{rank}</span>}
              {showCoordinates && rank === (orientation === "white" ? "1" : "8") && <span className="coord file">{FILES[FILES.indexOf(file)]}</span>}
              {piece && <ChessPiece piece={piece} />}
              {legalTargets.has(square) && <span className="move-dot" />}
              {highlight && <span className="target-ring" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
