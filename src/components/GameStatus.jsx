export function GameStatus({ statusMessage, statusPrompt, isGameOver, isThinking }) {
  return (
    <div className="status-section">
      <div className="status-label">Match Status</div>
      <div className={`status-text${isGameOver ? ' game-over-text' : ''}`}>
        {statusMessage}
      </div>
      {statusPrompt && (
        <div className="status-sub">{statusPrompt}</div>
      )}
    </div>
  );
}
