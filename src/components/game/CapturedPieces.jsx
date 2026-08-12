import ChessPiece from "../chess/ChessPiece.jsx";
import { materialScore } from "../../chess/moveUtils.js";

function CapturedGroup({ color, pieces }) {
  const nodes = Object.entries(pieces).flatMap(([piece, count]) => Array.from({ length: Math.max(0, count) }, (_, index) => (
    <ChessPiece key={`${piece}-${index}`} piece={{ color, type: piece }} compact />
  )));
  return <div className="captured-line">{nodes.length ? nodes : <span className="muted">None</span>}</div>;
}

export default function CapturedPieces({ captured }) {
  const score = materialScore(captured);
  return (
    <section className="panel-section">
      <div className="panel-title">Captured pieces <span className="score-pill">{score > 0 ? `White +${score}` : score < 0 ? `Black +${Math.abs(score)}` : "Even"}</span></div>
      <div className="captured-grid">
        <div><span className="micro-label">White captured</span><CapturedGroup color="b" pieces={captured.b} /></div>
        <div><span className="micro-label">Black captured</span><CapturedGroup color="w" pieces={captured.w} /></div>
      </div>
    </section>
  );
}
