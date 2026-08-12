import ChessPiece from "./ChessPiece.jsx";

const OPTIONS = [
  ["q", "Queen"],
  ["r", "Rook"],
  ["b", "Bishop"],
  ["n", "Knight"]
];

export default function PromotionDialog({ color = "w", onPromote }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="promotion-dialog" role="dialog" aria-modal="true" aria-label="Choose promotion piece">
        <h2>Promote pawn</h2>
        <div className="promotion-options">
          {OPTIONS.map(([piece, label]) => (
            <button key={piece} type="button" onClick={() => onPromote(piece)}>
              <ChessPiece piece={{ color, type: piece }} compact />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
