import { groupedHistory } from "../../chess/moveUtils.js";

export default function MoveHistory({ history }) {
  const rows = groupedHistory(history);
  return (
    <section className="panel-section history-section">
      <div className="panel-title">Move history</div>
      <div className="move-list" aria-label="Move history">
        {rows.length === 0 ? <p className="muted">Moves will appear here.</p> : rows.map((row) => (
          <div className="move-row" key={row.move}>
            <span className="move-number">{row.move}.</span>
            <span>{row.white}</span>
            <span>{row.black || ""}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
