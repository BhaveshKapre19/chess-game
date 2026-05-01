import { Chessboard } from 'react-chessboard';

export function ChessBoardComponent({ fen, onDrop, boardOrientation, isThinking, lastMove }) {
  const handlePieceDrop = ({ sourceSquare, targetSquare }) => {
    if (isThinking || !targetSquare) return false;

    return onDrop(sourceSquare, targetSquare, 'q');
  };

  const lastMoveStyles = lastMove
    ? {
        [lastMove.from]: {
          background: 'radial-gradient(circle, rgba(250, 204, 21, 0.36) 35%, rgba(250, 204, 21, 0.15) 36%)',
        },
        [lastMove.to]: {
          background: 'radial-gradient(circle, rgba(250, 204, 21, 0.48) 35%, rgba(250, 204, 21, 0.18) 36%)',
        },
      }
    : {};

  return (
    <div className={`board-container ${isThinking ? 'opacity-80' : ''}`}>
      <Chessboard
        options={{
          position: fen,
          onPieceDrop: handlePieceDrop,
          boardOrientation,
          animationDurationInMs: 200,
          allowDragging: !isThinking,
          canDragPiece: ({ piece }) => piece?.pieceType?.startsWith('w') ?? false,
          darkSquareStyle: { backgroundColor: '#779556' },
          lightSquareStyle: { backgroundColor: '#ebecd0' },
          dropSquareStyle: { boxShadow: 'inset 0 0 1px 6px rgba(255,255,255,0.75)' },
          squareStyles: lastMoveStyles,
        }}
      />
    </div>
  );
}
