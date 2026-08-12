import { RotateCcw, Flag, FlipHorizontal2, Undo2, SlidersHorizontal } from "lucide-react";
import { DIFFICULTIES } from "../../chess/constants.js";

export default function GameControls({ settings, setSettings, newGame, undo, resign, boardFlipped, setBoardFlipped, disabled }) {
  const updateSetting = (key, value) => setSettings({ ...settings, [key]: value });

  return (
    <section className="panel-section controls-section" aria-label="Game controls">
      <div className="panel-title"><SlidersHorizontal size={18} /> Controls</div>
      <div className="control-grid">
        <button type="button" onClick={() => newGame()}><RotateCcw size={17} /> New game</button>
        <button type="button" onClick={undo} disabled={disabled}><Undo2 size={17} /> Undo</button>
        <button type="button" onClick={() => setBoardFlipped(!boardFlipped)}><FlipHorizontal2 size={17} /> Flip</button>
        <button type="button" className="danger" onClick={resign} disabled={disabled}><Flag size={17} /> Resign</button>
      </div>
      <div className="settings-grid">
        <label>
          Difficulty
          <select value={settings.difficulty} onChange={(event) => updateSetting("difficulty", event.target.value)}>
            {Object.entries(DIFFICULTIES).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
          </select>
        </label>
        <label>
          Play as
          <select value={settings.playerColor} onChange={(event) => newGame({ playerColor: event.target.value })}>
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="random">Random</option>
          </select>
        </label>
      </div>
      <div className="toggle-row">
        <label><input type="checkbox" checked={settings.showLegalMoves} onChange={(e) => updateSetting("showLegalMoves", e.target.checked)} /> Legal moves</label>
        <label><input type="checkbox" checked={settings.showCoordinates} onChange={(e) => updateSetting("showCoordinates", e.target.checked)} /> Coordinates</label>
      </div>
    </section>
  );
}
