import { FlipVertical, RotateCcw, Undo2 } from 'lucide-react';

const LEVELS = [
  { label: 'Easy', depth: 2 },
  { label: 'Medium', depth: 8 },
  { label: 'Hard', depth: 15 },
];

export function GameControls({
  difficulty,
  setDifficulty,
  onNewGame,
  onUndo,
  onFlipBoard,
  isThinking,
  canUndo,
}) {
  return (
    <div className="game-controls">
      <div className="controls-heading">
        <span className="section-kicker">Controls</span>
        <p>Tune the engine strength, reset the board, or flip your view.</p>
      </div>

      <div className="control-group">
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(parseInt(e.target.value, 10))}
          disabled={isThinking}
          className="difficulty-select"
        >
          {LEVELS.map((level) => (
            <option value={level.depth} key={level.depth}>
              {level.label} - depth {level.depth}
            </option>
          ))}
        </select>
      </div>

      <div className="button-group">
        <button onClick={onNewGame} disabled={isThinking} className="control-btn primary">
          <RotateCcw size={16} /> New Game
        </button>
        <button onClick={onUndo} disabled={!canUndo} className="control-btn secondary">
          <Undo2 size={16} /> Undo
        </button>
        <button onClick={onFlipBoard} disabled={isThinking} className="control-btn secondary">
          <FlipVertical size={16} /> Flip Board
        </button>
      </div>
    </div>
  );
}
