import { Cpu } from 'lucide-react';

export function GameStatus({ statusMessage, statusPrompt, isGameOver, isThinking }) {
  const promptLabel = isGameOver
    ? 'Game Over Prompt'
    : statusMessage === 'Check!'
      ? 'Check Prompt'
      : 'Move Prompt';

  return (
    <div className={`game-status ${isGameOver ? 'game-over' : ''}`}>
      <span className="section-kicker">Match Status</span>
      <h2 className="status-message">{statusMessage}</h2>
      <p className="status-subtext">{statusPrompt}</p>
      
      {isThinking && (
        <div className="thinking-indicator">
          <Cpu className="spin-icon" size={20} />
          <span>Stockfish is thinking...</span>
        </div>
      )}

      {!isThinking && <div className={`status-prompt ${isGameOver ? 'status-prompt-strong' : ''}`}>{promptLabel}</div>}
    </div>
  );
}
