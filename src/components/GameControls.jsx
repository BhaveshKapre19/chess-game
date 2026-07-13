const IconNew  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>;
const IconUndo = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>;
const IconFlip = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;

export function GameControls({
  difficulty,
  onNewGame, onUndo, onFlipBoard,
  isThinking, canUndo,
}) {
  return (
    <div className="controls-section">
      <div className="controls-label">Controls</div>

      {/* Difficulty info (read-only — change via New Game) */}
      <div className="difficulty-info-row">
        <span className="difficulty-label">Difficulty</span>
        <span className="difficulty-badge">{difficulty?.label ?? 'Medium'} · depth {difficulty?.depth ?? 8}</span>
      </div>

      <div className="action-grid">
        <button
          onClick={onNewGame}
          disabled={isThinking}
          className="action-btn primary-action"
          title="New Game — returns to setup"
        >
          <IconNew />
          <span className="action-btn-label">New</span>
        </button>

        <button
          onClick={onUndo}
          disabled={!canUndo || isThinking}
          className="action-btn"
          title="Undo last move"
        >
          <IconUndo />
          <span className="action-btn-label">Undo</span>
        </button>

        <button
          onClick={onFlipBoard}
          disabled={isThinking}
          className="action-btn"
          title="Flip board view"
        >
          <IconFlip />
          <span className="action-btn-label">Flip</span>
        </button>
      </div>
    </div>
  );
}
