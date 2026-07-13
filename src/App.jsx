import { useCallback, useEffect, useRef, useState } from 'react';
import { useChessGame } from './hooks/useChessGame';
import { Engine } from './utils/engine';
import { ChessBoardComponent } from './components/ChessBoardComponent';
import { GameControls } from './components/GameControls';
import { MoveHistory } from './components/MoveHistory';
import { GameStatus } from './components/GameStatus';
import { GameSetupModal } from './components/GameSetupModal';
import './index.css';

/* ── Icons (inline SVG) ── */
const IconPlay     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
const IconCpu      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>;
const IconDownload = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IconShare    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;

function App() {
  /* ── Setup state ── */
  const [gameSettings, setGameSettings] = useState(null); // null = show setup screen

  const {
    chess, fen, history, pgn, lastMove,
    makeMove, resetGame, undoMoves,
    statusMessage, statusPrompt, isGameOver, turn,
  } = useChessGame();

  const engineRef           = useRef(null);
  const isThinkingRef       = useRef(false);
  const activeEngineTurnRef = useRef(null);

  const [isThinking, setIsThinking]   = useState(false);
  const [engineError, setEngineError] = useState('');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [moveHints, setMoveHints]     = useState([]);

  // Derived from settings
  const playerSide  = gameSettings?.side       ?? 'white';
  const difficulty  = gameSettings?.difficulty ?? { depth: 8, label: 'Medium' };
  const playerName  = gameSettings?.playerName ?? 'You';

  // The "engine color" is the opposite of the player's color
  const engineColor = playerSide === 'white' ? 'b' : 'w';

  // Board orientation matches player's side
  const [boardOrientation, setBoardOrientation] = useState('white');

  const canUndo = history.length > 0;

  /* ── Move hints ── */
  const clearMoveHints = useCallback(() => {
    setSelectedSquare(null);
    setMoveHints([]);
  }, []);

  const updateMoveHints = useCallback((square) => {
    if (!square) { clearMoveHints(); return []; }
    const moves = chess.moves({ square, verbose: true });
    setSelectedSquare(square);
    setMoveHints(moves.map(m => ({ square: m.to, isCapture: m.flags.includes('c') || m.flags.includes('e') })));
    return moves;
  }, [chess, clearMoveHints]);

  useEffect(() => { isThinkingRef.current = isThinking; }, [isThinking]);

  /* ── Engine init ── */
  useEffect(() => {
    let errorTimer = null;
    try { engineRef.current = new Engine(); }
    catch { errorTimer = window.setTimeout(() => setEngineError('Failed to load the Stockfish engine.'), 0); }
    return () => {
      if (errorTimer) window.clearTimeout(errorTimer);
      engineRef.current?.terminate();
    };
  }, []);

  /* ── Engine turn: fires when it's the engine's color ── */
  useEffect(() => {
    // Only run if game has started and it's the engine's turn
    if (!gameSettings) return;
    if (turn !== engineColor || isGameOver || engineError || !engineRef.current || isThinkingRef.current) return;

    const turnKey = `${fen}:${difficulty.depth}`;
    activeEngineTurnRef.current = turnKey;
    setIsThinking(true);

    const go = async () => {
      try {
        const move = await engineRef.current.getBestMove(fen, difficulty.depth);
        if (activeEngineTurnRef.current !== turnKey) return;
        if (move && move !== '(none)' && move !== '0000') {
          clearMoveHints();
          makeMove({ from: move.substring(0, 2), to: move.substring(2, 4), promotion: move.length > 4 ? move[4] : undefined });
        } else {
          setEngineError('Stockfish did not return a valid move.');
        }
      } catch (err) {
        const msg = err.message || 'Stockfish could not calculate a move.';
        if (msg !== 'Engine request cancelled.') setEngineError(msg);
      } finally {
        if (activeEngineTurnRef.current === turnKey) { activeEngineTurnRef.current = null; setIsThinking(false); }
      }
    };
    go();
    return () => {
      if (activeEngineTurnRef.current === turnKey) {
        activeEngineTurnRef.current = null;
        engineRef.current?.terminate();
        setIsThinking(false);
      }
    };
  }, [clearMoveHints, fen, turn, engineColor, isGameOver, engineError, difficulty, makeMove, gameSettings]);

  /* ── Drag/click: only active on player's color ── */
  const onDrop = useCallback((src, tgt, promo) => {
    if (isThinking || isGameOver || turn !== (playerSide === 'white' ? 'w' : 'b')) return false;
    const res = makeMove({ from: src, to: tgt, promotion: promo });
    if (res) { setEngineError(''); clearMoveHints(); }
    return Boolean(res);
  }, [clearMoveHints, isGameOver, isThinking, makeMove, turn, playerSide]);

  const handleSquareClick = useCallback((square) => {
    const playerColor = playerSide === 'white' ? 'w' : 'b';
    if (isThinking || isGameOver || turn !== playerColor) return;
    if (selectedSquare && moveHints.some(h => h.square === square)) {
      if (!onDrop(selectedSquare, square, 'q')) updateMoveHints(square);
      return;
    }
    const piece = chess.get(square);
    if (!piece || piece.color !== playerColor) { clearMoveHints(); return; }
    if (updateMoveHints(square).length === 0) clearMoveHints();
  }, [chess, clearMoveHints, isGameOver, isThinking, moveHints, onDrop, playerSide, selectedSquare, turn, updateMoveHints]);

  /* ── New game: go back to setup screen ── */
  const handleNewGame = useCallback(() => {
    activeEngineTurnRef.current = null;
    engineRef.current?.terminate();
    engineRef.current = new Engine();
    setIsThinking(false);
    clearMoveHints();
    resetGame();
    setEngineError('');
    setGameSettings(null); // back to setup
  }, [clearMoveHints, resetGame]);

  const handleUndo = useCallback(() => {
    activeEngineTurnRef.current = null;
    engineRef.current?.terminate();
    engineRef.current = new Engine();
    setIsThinking(false);
    setEngineError('');
    clearMoveHints();
    undoMoves(turn === engineColor ? 1 : 2);
  }, [clearMoveHints, turn, engineColor, undoMoves]);

  const handleFlipBoard = () => setBoardOrientation(p => p === 'white' ? 'black' : 'white');

  /* ── Handle setup complete ── */
  const handleSetupStart = useCallback((settings) => {
    resetGame();
    setEngineError('');
    clearMoveHints();
    setIsThinking(false);
    setBoardOrientation(settings.side); // auto-orient to player's side
    setGameSettings(settings);
  }, [resetGame, clearMoveHints]);

  /* ── Show setup screen before game starts ── */
  if (!gameSettings) {
    return <GameSetupModal onStart={handleSetupStart} />;
  }

  /* ── Turn state for UI ── */
  const isPlayerTurn = turn === (playerSide === 'white' ? 'w' : 'b');
  const playerPiece  = playerSide === 'white' ? '♔' : '♚';
  const playerPieceStyle = playerSide === 'black' ? { color: '#1a1a1a' } : {};

  return (
    <div className="app-shell">

      {/* ═══ LEFT SIDEBAR ═══ */}
      <nav className="sidebar-nav">
        <div className="sidebar-brand">
          <h1>Chess Connect</h1>
          <p className="sidebar-tagline">vs Stockfish AI</p>
        </div>

        <div className="sidebar-player-card">
          <div className="sidebar-player-icon" style={playerPieceStyle}>{playerPiece}</div>
          <div>
            <div className="sidebar-player-name">{playerName}</div>
            <div className="sidebar-player-elo">Playing {playerSide === 'white' ? 'White' : 'Black'}</div>
          </div>
        </div>

        <div className="sidebar-links">
          <button className="sidebar-link active">
            <IconPlay /> Play
          </button>
        </div>

        <div className="sidebar-mode-info">
          <div className="sidebar-mode-label">Mode</div>
          <div className="sidebar-mode-value">AI Challenge</div>
          <div className="sidebar-mode-label" style={{ marginTop: 8 }}>Difficulty</div>
          <div className="sidebar-mode-value">{difficulty.label}</div>
          <div className="sidebar-mode-label" style={{ marginTop: 8 }}>Engine</div>
          <div className="sidebar-mode-value">Stockfish 18</div>
        </div>
      </nav>

      {/* ═══ MAIN AREA ═══ */}
      <div className="main-area">

        {/* ── CENTER: Board ── */}
        <div className="board-area">

          {/* Opponent (AI) card — always top */}
          <div className="player-card">
            <div className="player-info">
              <div className="player-avatar" style={{ fontSize: '1.6rem' }}>
                {playerSide === 'white' ? '♜' : '♖'}
                <span className="status-dot" />
              </div>
              <div>
                <div className="player-name">DeepThought AI</div>
                <div className="ai-badge">
                  <span className="ai-dot" />
                  AI · Depth {difficulty.depth} · {difficulty.label}
                </div>
              </div>
            </div>
            <div className={`clock-box ${!isPlayerTurn && !isGameOver ? 'active-clock' : ''}`}>
              <span className="clock-icon">⏱</span>
              {isThinking ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="spin" style={{ display: 'inline-block' }}><IconCpu /></span>
                  Thinking…
                </span>
              ) : (!isPlayerTurn && !isGameOver ? 'My move' : 'Waiting')}
            </div>
          </div>

          {/* Turn strip */}
          <div className="turn-strip">
            <span className={`turn-dot ${isPlayerTurn ? (playerSide === 'white' ? 'white' : 'black-player') : 'engine-dot'}`} />
            <span className="turn-label">
              {isGameOver
                ? statusMessage
                : isPlayerTurn
                  ? `Your move — ${playerSide === 'white' ? 'White' : 'Black'}`
                  : 'Engine calculating…'}
            </span>
            {isThinking && (
              <span className="thinking-badge">
                <span className="spin" style={{ display: 'inline-flex' }}><IconCpu /></span>
                Calculating…
              </span>
            )}
          </div>

          {/* Board */}
          <div className="board-wrap">
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
          </div>

          {/* Player card — always bottom */}
          <div className="player-card bottom">
            <div className="player-info">
              <div className="player-avatar" style={{ fontSize: '1.6rem', borderColor: 'rgba(233,193,118,0.4)', boxShadow: '0 0 12px rgba(233,193,118,0.15)', ...playerPieceStyle }}>
                {playerPiece}
              </div>
              <div>
                <div className="player-name" style={{ color: 'var(--gold)' }}>{playerName}</div>
                <div className="player-title">{playerSide === 'white' ? 'White' : 'Black'} · Human</div>
              </div>
            </div>
            <div className={`clock-box ${isPlayerTurn && !isGameOver ? 'active-clock' : ''}`}>
              <span className="clock-icon">⏱</span>
              {isPlayerTurn && !isGameOver ? 'Your turn' : 'Waiting'}
            </div>
          </div>

        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">

          <div className="panel-header">
            <span className="panel-title">Move History</span>
            <div className="panel-actions">
              <button className="icon-btn" title="Download PGN"><IconDownload /></button>
              <button className="icon-btn" title="Share"><IconShare /></button>
            </div>
          </div>

          <MoveHistory history={history} pgn={pgn} />

          <GameStatus
            statusMessage={statusMessage}
            statusPrompt={statusPrompt}
            isGameOver={isGameOver}
            isThinking={isThinking}
          />

          {engineError && (
            <div className="error-banner">⚠ {engineError}</div>
          )}

          <GameControls
            difficulty={difficulty}
            onNewGame={handleNewGame}
            onUndo={handleUndo}
            onFlipBoard={handleFlipBoard}
            isThinking={isThinking}
            canUndo={canUndo}
          />

        </div>
      </div>
    </div>
  );
}

export default App;
