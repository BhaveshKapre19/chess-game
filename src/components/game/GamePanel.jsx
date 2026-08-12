import { Activity, BadgeInfo } from "lucide-react";
import CapturedPieces from "./CapturedPieces.jsx";
import GameControls from "./GameControls.jsx";
import MoveHistory from "./MoveHistory.jsx";

export default function GamePanel({ game }) {
  return (
    <aside className="game-panel">
      <section className="status-card">
        <div className="micro-label">Game status</div>
        <h2>{game.status}</h2>
        <dl className="status-grid">
          <div><dt>You</dt><dd>{game.playerSide}</dd></div>
          <div><dt>Stockfish</dt><dd>{game.playerSide === "white" ? "black" : "white"}</dd></div>
          <div><dt>Difficulty</dt><dd>{game.difficulty.label}</dd></div>
          <div><dt>Turn</dt><dd>{game.chess.turn() === "w" ? "White" : "Black"}</dd></div>
        </dl>
        <p className="engine-line"><Activity size={16} /> {game.engineStatus}</p>
        {game.engineError && <p className="error-line"><BadgeInfo size={16} /> {game.engineError}</p>}
        {game.lastMove && <p className="last-move">Last move: <strong>{game.lastMove.san}</strong></p>}
      </section>
      <MoveHistory history={game.history} />
      <CapturedPieces captured={game.captured} />
      <GameControls {...game} disabled={game.engineThinking || game.gameOver} />
    </aside>
  );
}
