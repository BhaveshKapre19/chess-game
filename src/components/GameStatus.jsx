import { Cpu } from 'lucide-react';

export function GameStatus({ statusMessage, isGameOver, isThinking }) {
  return (
    <div className={`game-status ${isGameOver ? 'game-over' : ''}`}>
      <h2 className="status-message">{statusMessage}</h2>
      
      {isThinking && (
        <div className="thinking-indicator">
          <Cpu className="spin-icon" size={20} />
          <span>Stockfish is thinking...</span>
        </div>
      )}
    </div>
  );
}
