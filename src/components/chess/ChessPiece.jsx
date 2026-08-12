const PIECE_LABELS = {
  p: "pawn",
  n: "knight",
  b: "bishop",
  r: "rook",
  q: "queen",
  k: "king"
};

function PieceBase() {
  return (
    <>
      <path className="piece-stroke" d="M27 81h46l5 9H22l5-9Z" />
      <path className="piece-stroke" d="M31 72h38l4 9H27l4-9Z" />
    </>
  );
}

function Pawn() {
  return (
    <>
      <circle className="piece-stroke" cx="50" cy="30" r="14" />
      <path className="piece-stroke" d="M40 43h20l8 29H32l8-29Z" />
      <PieceBase />
    </>
  );
}

function Knight() {
  return (
    <>
      <path className="piece-stroke" d="M29 73c3-12 8-22 16-31l5-6-5-15c13 2 25 8 32 18 5 8 4 17-4 23l-11 8 5 3H29Z" />
      <path className="piece-line" d="M48 32c8 1 15 5 20 12" />
      <path className="piece-cut" d="M49 23l-9 9 12 1" />
      <circle className="piece-eye" cx="63" cy="43" r="3.2" />
      <PieceBase />
    </>
  );
}

function Bishop() {
  return (
    <>
      <circle className="piece-stroke" cx="50" cy="15" r="6" />
      <path className="piece-stroke" d="M50 23c13 9 20 18 20 31 0 11-8 18-20 18s-20-7-20-18c0-13 7-22 20-31Z" />
      <path className="piece-cut" d="M58 34L42 59" />
      <path className="piece-stroke" d="M35 69h30l5 7H30l5-7Z" />
      <PieceBase />
    </>
  );
}

function Rook() {
  return (
    <>
      <path className="piece-stroke" d="M31 20h10v8h8v-8h10v8h8v-8h10v23H31V20Z" />
      <path className="piece-stroke" d="M36 43h28l5 29H31l5-29Z" />
      <PieceBase />
    </>
  );
}

function Queen() {
  return (
    <>
      <circle className="piece-stroke" cx="24" cy="28" r="6" />
      <circle className="piece-stroke" cx="39" cy="20" r="6" />
      <circle className="piece-stroke" cx="50" cy="16" r="6" />
      <circle className="piece-stroke" cx="61" cy="20" r="6" />
      <circle className="piece-stroke" cx="76" cy="28" r="6" />
      <path className="piece-stroke" d="M27 35l10 31h26l10-31-17 15-6-25-6 25-17-15Z" />
      <path className="piece-stroke" d="M35 66h30l5 7H30l5-7Z" />
      <PieceBase />
    </>
  );
}

function King() {
  return (
    <>
      <path className="piece-cut" d="M50 10v23M39 21h22" />
      <path className="piece-stroke" d="M50 28c12 0 20 9 20 22 0 10-6 18-14 21H44c-8-3-14-11-14-21 0-13 8-22 20-22Z" />
      <path className="piece-stroke" d="M36 69h28l5 7H31l5-7Z" />
      <PieceBase />
    </>
  );
}

const SHAPES = { p: Pawn, n: Knight, b: Bishop, r: Rook, q: Queen, k: King };

export default function ChessPiece({ piece, compact = false }) {
  if (!piece) return null;
  const Shape = SHAPES[piece.type] || Pawn;
  const colorName = piece.color === "w" ? "white" : "black";

  return (
    <svg
      className={`chess-piece-svg piece-${colorName} piece-${piece.type} ${compact ? "compact-piece" : ""}`}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${colorName} ${PIECE_LABELS[piece.type]}`}
    >
      <Shape />
    </svg>
  );
}
