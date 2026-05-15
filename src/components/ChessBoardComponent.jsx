import { Chessboard } from 'react-chessboard';

export function ChessBoardComponent({
  fen,
  onDrop,
  onSquareClick,
  boardOrientation,
  isThinking,
  lastMove,
  selectedSquare,
  moveHints,
}) {
  const handlePieceDrop = ({ sourceSquare, targetSquare }) => {
    if (isThinking || !targetSquare) return false;

    return onDrop(sourceSquare, targetSquare, 'q');
  };

  const squareStyles = {
    ...(lastMove
      ? {
          [lastMove.from]: {
            background: 'radial-gradient(circle, rgba(250, 204, 21, 0.36) 35%, rgba(250, 204, 21, 0.15) 36%)',
          },
          [lastMove.to]: {
            background: 'radial-gradient(circle, rgba(250, 204, 21, 0.48) 35%, rgba(250, 204, 21, 0.18) 36%)',
          },
        }
      : {}),
    ...(selectedSquare
      ? {
          [selectedSquare]: {
            background:
              'radial-gradient(circle, rgba(58, 191, 255, 0.48) 35%, rgba(58, 191, 255, 0.22) 36%)',
          },
        }
      : {}),
  };

  for (const hint of moveHints) {
    squareStyles[hint.square] = {
      background: hint.isCapture
        ? 'radial-gradient(circle, rgba(255, 111, 111, 0.58) 30%, rgba(255, 111, 111, 0.18) 31%)'
        : 'radial-gradient(circle, rgba(97, 226, 161, 0.7) 20%, rgba(97, 226, 161, 0.18) 21%)',
    };
  }

  return (
    <div className={`board-container ${isThinking ? 'opacity-80' : ''}`}>
      <Chessboard
        options={{
          position: fen,
          onPieceDrop: handlePieceDrop,
          onSquareClick: ({ square }) => onSquareClick(square),
          onPieceClick: ({ square }) => onSquareClick(square),
          boardOrientation,
          animationDurationInMs: 200,
          allowDragging: !isThinking,
          canDragPiece: ({ piece }) => piece?.pieceType?.startsWith('w') ?? false,
          darkSquareStyle: { backgroundColor: '#779556' },
          lightSquareStyle: { backgroundColor: '#ebecd0' },
          dropSquareStyle: { boxShadow: 'inset 0 0 1px 6px rgba(255,255,255,0.75)' },
          squareStyles,
        }}
      />
    </div>
  );
}
