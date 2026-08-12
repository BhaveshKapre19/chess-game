import { Lightbulb } from "lucide-react";

export default function HintPanel({ hints, count, onHint }) {
  const visible = hints.slice(0, Math.min(count, hints.length));
  return (
    <section className="hint-panel">
      <button type="button" onClick={onHint} disabled={count >= hints.length}><Lightbulb size={17} /> Need a hint?</button>
      {visible.map((hint, index) => <p key={hint}><strong>Hint {index + 1}:</strong> {hint}</p>)}
    </section>
  );
}
