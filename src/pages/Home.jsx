import { Link } from "react-router-dom";
import { BookOpen, Brain, MonitorSmartphone, ShieldCheck, Swords } from "lucide-react";

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero-grid">
        <div className="hero-copy">
          <span className="micro-label">Stockfish chess and beginner lessons</span>
          <h1>Play Chess. Learn Chess. Get Better.</h1>
          <p>Play against Stockfish or learn chess interactively from the ground up.</p>
          <div className="hero-actions">
            <Link className="button primary" to="/play"><Swords size={18} /> Play Chess</Link>
            <Link className="button secondary" to="/learn"><BookOpen size={18} /> Learn Chess</Link>
          </div>
        </div>
        <div className="hero-board" aria-hidden="true">
          {Array.from({ length: 64 }, (_, index) => <span key={index} className={(Math.floor(index / 8) + index) % 2 ? "dark" : "light"} />)}
          <strong>♔</strong><b>♞</b><em>♛</em>
        </div>
      </section>
      <section className="feature-band" aria-label="Features">
        <article><ShieldCheck size={22} /><h2>Legal rules</h2><p>Moves, check, mate, castling, promotion, and draws are validated by chess.js.</p></article>
        <article><Brain size={22} /><h2>Stockfish opponent</h2><p>Choose approachable or serious difficulty levels backed by a worker engine.</p></article>
        <article><BookOpen size={22} /><h2>Interactive academy</h2><p>Lessons use a board, hints, feedback, and local progress tracking.</p></article>
        <article><MonitorSmartphone size={22} /><h2>Responsive board</h2><p>The board stays first and playable from phone to desktop.</p></article>
      </section>
    </div>
  );
}
