import { useEffect, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';

export function ChessBoardComponent({
  fen, onDrop, onSquareClick,
  boardOrientation, isThinking,
  lastMove, selectedSquare, moveHints,
}) {
  const containerRef = useRef(null);
  const [boardSize, setBoardSize] = useState(0);

  // ResizeObserver: board fills min(width, height) of its container
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBoardSize(Math.floor(Math.min(width, height)));
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const handlePieceDrop = ({ sourceSquare, targetSquare }) => {
    if (isThinking || !targetSquare) return false;
    return onDrop(sourceSquare, targetSquare, 'q');
  };

  // Square highlight styles — Grandmaster Heritage palette
  const squareStyles = {
    ...(lastMove ? {
      [lastMove.from]: { background: 'rgba(233,193,118,0.28)' },
      [lastMove.to]:   { background: 'rgba(233,193,118,0.52)' },
    } : {}),
    ...(selectedSquare ? {
      [selectedSquare]: {
        background: 'rgba(233,193,118,0.55)',
        boxShadow: 'inset 0 0 0 3px rgba(233,193,118,0.9)',
      },
    } : {}),
  };

  for (const hint of moveHints) {
    squareStyles[hint.square] = {
      background: hint.isCapture
        ? 'radial-gradient(circle, rgba(220,80,60,0.82) 28%, rgba(220,80,60,0.2) 30%)'
        : 'radial-gradient(circle, rgba(233,193,118,0.90) 20%, rgba(233,193,118,0.18) 22%)',
    };
  }

  return (
    <div
      ref={containerRef}
      className={`board-container${isThinking ? ' dimmed' : ''}`}
    >
      {boardSize > 0 && (
        <Chessboard
          options={{
            position: fen,
            boardWidth: boardSize,
            onPieceDrop: handlePieceDrop,
            onSquareClick: ({ square }) => onSquareClick(square),
            onPieceClick: ({ square }) => onSquareClick(square),
            boardOrientation,
            animationDurationInMs: 180,
            allowDragging: !isThinking,
            canDragPiece: ({ piece }) => piece?.pieceType?.startsWith('w') ?? false,
            // Grandmaster Heritage board:
            // Dark squares: warm mahogany brown (clearly distinct from black pieces)
            // Light squares: warm parchment ivory
            darkSquareStyle:  { backgroundColor: '#5a3e28' },
            lightSquareStyle: { backgroundColor: '#ede0c8' },
            dropSquareStyle:  { boxShadow: 'inset 0 0 1px 5px rgba(233,193,118,0.7)' },
            squareStyles,
          }}
        />
      )}
    </div>
  );
}
