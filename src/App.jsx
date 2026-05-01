import { useCallback, useEffect, useRef, useState } from 'react';
import { useChessGame } from './hooks/useChessGame';
import { Engine } from './utils/engine';
import { ChessBoardComponent } from './components/ChessBoardComponent';
import { GameControls } from './components/GameControls';
import { MoveHistory } from './components/MoveHistory';
import { GameStatus } from './components/GameStatus';
import './index.css';

function App() {
  const {
    fen,
    history,
    pgn,
    lastMove,
    makeMove,
    resetGame,
    statusMessage,
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

  useEffect(() => {
    isThinkingRef.current = isThinking;
  }, [isThinking]);

  useEffect(() => {
    let errorTimer = null;

    try {
      engineRef.current = new Engine();
    } catch {
      errorTimer = window.setTimeout(() => {
        setEngineError('Failed to connect to the Stockfish engine server.');
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
  }, [fen, turn, isGameOver, engineError, difficulty, makeMove]);

  const onDrop = (sourceSquare, targetSquare, promotion) => {
    if (isThinking || isGameOver) return false;
    if (turn !== 'w') return false;

    const moveResult = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: promotion,
    });

    if (moveResult) {
      setEngineError('');
    }

    return Boolean(moveResult);
  };

  const handleNewGame = useCallback(() => {
    activeEngineTurnRef.current = null;
    setIsThinking(false);
    resetGame();
    if (engineRef.current) {
      engineRef.current.newGame().catch((error) => {
        setEngineError(error.message || 'Could not reset the Stockfish engine server.');
      });
    }
    setEngineError('');
  }, [resetGame]);

  const handleFlipBoard = () => {
    setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>React Chess</h1>
        <p>Powered by Stockfish WebAssembly</p>
      </header>

      {engineError && (
        <div className="error-banner">
          {engineError}
        </div>
      )}

      <main className="main-content">
        <div className="board-section">
          <ChessBoardComponent
            fen={fen}
            onDrop={onDrop}
            boardOrientation={boardOrientation}
            isThinking={isThinking}
            lastMove={lastMove}
          />
        </div>

        <aside className="sidebar">
          <GameStatus 
            statusMessage={statusMessage} 
            isGameOver={isGameOver} 
            isThinking={isThinking} 
          />
          
          <GameControls
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            onNewGame={handleNewGame}
            onFlipBoard={handleFlipBoard}
            isThinking={isThinking}
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
