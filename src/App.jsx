import { useCallback, useEffect, useRef, useState } from 'react';
import { useChessGame } from './hooks/useChessGame';
import { Engine } from './utils/engine';
import { ChessBoardComponent } from './components/ChessBoardComponent';
import { GameControls } from './components/GameControls';
import { MoveHistory } from './components/MoveHistory';
import { GameStatus } from './components/GameStatus';
import './index.css';

function App() {
  const logoUrl = `${import.meta.env.BASE_URL}chess-connect-logo.png`;

  const {
    chess,
    fen,
    history,
    pgn,
    lastMove,
    makeMove,
    resetGame,
    undoMoves,
    statusMessage,
    statusPrompt,
    isGameOver,
    turn
  } = useChessGame();

  const engineRef = useRef(null);
  const isThinkingRef = useRef(false);
  const activeEngineTurnRef = useRef(null);
  const [isThinking, setIsThinking] = useState(false);
  const [difficulty, setDifficulty] = useState(8);
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [engineError, setEngineError] = useState('');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [moveHints, setMoveHints] = useState([]);
  const canUndo = history.length > 0;

  const clearMoveHints = useCallback(() => {
    setSelectedSquare(null);
    setMoveHints([]);
  }, []);

  const updateMoveHints = useCallback((square) => {
    if (!square) {
      clearMoveHints();
      return [];
    }

    const moves = chess.moves({ square, verbose: true });
    const hints = moves.map((move) => ({
      square: move.to,
      isCapture: move.flags.includes('c') || move.flags.includes('e'),
    }));

    setSelectedSquare(square);
    setMoveHints(hints);
    return moves;
  }, [chess, clearMoveHints]);

  useEffect(() => {
    isThinkingRef.current = isThinking;
  }, [isThinking]);

  useEffect(() => {
    let errorTimer = null;

    try {
      engineRef.current = new Engine();
    } catch {
      errorTimer = window.setTimeout(() => {
        setEngineError('Failed to load the Stockfish engine.');
      }, 0);
    }

    return () => {
      if (errorTimer) {
        window.clearTimeout(errorTimer);
      }

      if (engineRef.current) {
        engineRef.current.terminate();
      }
    };
  }, []);

  // Handle engine turn
  useEffect(() => {
    if (turn !== 'b' || isGameOver || engineError || !engineRef.current || isThinkingRef.current) {
      return undefined;
    }

    const turnKey = `${fen}:${difficulty}`;
    activeEngineTurnRef.current = turnKey;
    setIsThinking(true);

    const getEngineMove = async () => {
      try {
        const move = await engineRef.current.getBestMove(fen, difficulty);

        if (activeEngineTurnRef.current !== turnKey) {
          return;
        }

        if (move && move !== '(none)' && move !== '0000') {
          const sourceSquare = move.substring(0, 2);
          const targetSquare = move.substring(2, 4);
          const promotion = move.length > 4 ? move[4] : undefined;

          clearMoveHints();
          makeMove({
            from: sourceSquare,
            to: targetSquare,
            promotion,
          });
        } else {
          setEngineError('Stockfish did not return a valid move.');
        }
      } catch (error) {
        const message = error.message || 'Stockfish could not calculate a move.';
        if (message !== 'Engine request cancelled.') {
          setEngineError(message);
        }
      } finally {
        if (activeEngineTurnRef.current === turnKey) {
          activeEngineTurnRef.current = null;
          setIsThinking(false);
        }
      }
    };

    getEngineMove();

    return () => {
      if (activeEngineTurnRef.current === turnKey) {
        activeEngineTurnRef.current = null;
        engineRef.current?.terminate();
        setIsThinking(false);
      }
    };
  }, [clearMoveHints, fen, turn, isGameOver, engineError, difficulty, makeMove]);

  const onDrop = useCallback((sourceSquare, targetSquare, promotion) => {
    if (isThinking || isGameOver) return false;
    if (turn !== 'w') return false;

    const moveResult = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: promotion,
    });

    if (moveResult) {
      setEngineError('');
      clearMoveHints();
    }

    return Boolean(moveResult);
  }, [clearMoveHints, isGameOver, isThinking, makeMove, turn]);

  const handleSquareClick = useCallback((square) => {
    if (isThinking || isGameOver || turn !== 'w') {
      return;
    }

    if (selectedSquare && moveHints.some((hint) => hint.square === square)) {
      const moved = onDrop(selectedSquare, square, 'q');
      if (!moved) {
        updateMoveHints(square);
      }
      return;
    }

    const piece = chess.get(square);
    if (!piece || piece.color !== 'w') {
      clearMoveHints();
      return;
    }

    const moves = updateMoveHints(square);
    if (moves.length === 0) {
      clearMoveHints();
    }
  }, [chess, clearMoveHints, isGameOver, isThinking, moveHints, onDrop, selectedSquare, turn, updateMoveHints]);

  const handleNewGame = useCallback(() => {
    activeEngineTurnRef.current = null;
    engineRef.current?.terminate();
    engineRef.current = new Engine();
    setIsThinking(false);
    clearMoveHints();
    resetGame();
    setEngineError('');
  }, [clearMoveHints, resetGame]);

  const handleUndo = useCallback(() => {
    activeEngineTurnRef.current = null;
    engineRef.current?.terminate();
    engineRef.current = new Engine();
    setIsThinking(false);
    setEngineError('');
    clearMoveHints();

    if (turn === 'w') {
      undoMoves(2);
      return;
    }

    undoMoves(1);
  }, [clearMoveHints, turn, undoMoves]);

  const handleFlipBoard = () => {
    setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand-lockup">
          <img className="brand-logo" src={logoUrl} alt="Chess Connect logo" />
          <div className="brand-copy">
            <span className="brand-eyebrow">React x Stockfish</span>
            <h1>Chess Connect</h1>
            <p>
              A clean, fast chess board for casual play against Stockfish, built to feel crisp on
              desktop and mobile.
            </p>
          </div>
        </div>

        <div className="hero-tags" aria-label="Application highlights">
          <span className="hero-tag">You play White</span>
          <span className="hero-tag">Drag and drop board</span>
          <span className="hero-tag">{isThinking ? 'Stockfish thinking' : 'Stockfish ready'}</span>
        </div>
      </header>

      {engineError && (
        <div className="error-banner">
          {engineError}
        </div>
      )}

      <main className="main-content">
        <div className="board-section">
          <section className="board-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-label">Live Board</span>
                <h2>Play against the engine</h2>
              </div>
              <div className="turn-indicator">
                <span className={`turn-dot ${turn === 'w' ? 'white-turn' : 'black-turn'}`} />
                <span>{turn === 'w' ? 'Your move' : 'Computer move'}</span>
              </div>
            </div>

            <ChessBoardComponent
              fen={fen}
              onDrop={onDrop}
              onSquareClick={handleSquareClick}
              boardOrientation={boardOrientation}
              isThinking={isThinking}
              lastMove={lastMove}
              selectedSquare={selectedSquare}
              moveHints={moveHints}
            />
          </section>
        </div>

        <aside className="sidebar">
          <GameStatus 
            statusMessage={statusMessage} 
            statusPrompt={statusPrompt}
            isGameOver={isGameOver} 
            isThinking={isThinking} 
          />
          
          <GameControls
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            onNewGame={handleNewGame}
            onUndo={handleUndo}
            onFlipBoard={handleFlipBoard}
            isThinking={isThinking}
            canUndo={canUndo}
          />

          <MoveHistory history={history} pgn={pgn} />
        </aside>
      </main>

      <footer className="app-footer">
        <p>This game was developed for fun with React and Stockfish.</p>
        <p>Developed by Bhavesh.</p>
      </footer>
    </div>
  );
}

export default App;
