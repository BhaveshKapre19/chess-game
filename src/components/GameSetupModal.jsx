import { useState } from 'react';

const RANDOM_NAMES = [
  'The Gambit King', 'Iron Rook', 'Shadow Bishop', 'Night Knight',
  'Silent Pawn', 'Golden Queen', 'The Endgame', 'Dark Horse',
  'Checkmate Lord', 'The Tactician', 'Steel Fortress', 'Phantom Knight',
];

const DIFFICULTIES = [
  { label: 'Very Easy', sublabel: 'Perfect for beginners',  depth: 1,  icon: '○' },
  { label: 'Easy',      sublabel: 'Casual & forgiving',     depth: 3,  icon: '◔' },
  { label: 'Medium',    sublabel: 'Balanced challenge',     depth: 8,  icon: '◑' },
  { label: 'Hard',      sublabel: 'Serious opponent',       depth: 15, icon: '◕' },
  { label: 'Expert',    sublabel: 'Near-perfect play',      depth: 20, icon: '●' },
];

function randomName() {
  return RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
}

export function GameSetupModal({ onStart }) {
  const [name, setName]           = useState('');
  const [side, setSide]           = useState('white');
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[2]); // Medium default

  const handleStart = () => {
    onStart({
      playerName:  name.trim() || randomName(),
      side,
      difficulty,
    });
  };

  return (
    <div className="setup-overlay">
      {/* Background ambient glow */}
      <div className="setup-bg-glow" />

      <div className="setup-card">
        {/* Brand header */}
        <div className="setup-brand">
          <span className="setup-chess-icon">♟</span>
          <div>
            <h1 className="setup-title">Chess Connect</h1>
            <p className="setup-subtitle">vs Stockfish AI Engine</p>
          </div>
        </div>

        <div className="setup-divider" />

        {/* Player name */}
        <div className="setup-field">
          <label className="setup-label" htmlFor="player-name">Your Name</label>
          <input
            id="player-name"
            className="setup-input"
            type="text"
            placeholder="Leave blank for a random name…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />
        </div>

        {/* Side selection */}
        <div className="setup-field">
          <label className="setup-label">Play As</label>
          <div className="setup-side-row">
            <button
              className={`setup-side-btn${side === 'white' ? ' selected' : ''}`}
              onClick={() => setSide('white')}
              type="button"
            >
              <span className="setup-side-piece">♔</span>
              <span className="setup-side-name">White</span>
              <span className="setup-side-note">Moves first</span>
            </button>
            <button
              className={`setup-side-btn${side === 'black' ? ' selected' : ''}`}
              onClick={() => setSide('black')}
              type="button"
            >
              <span className="setup-side-piece" style={{ color: '#808080' }}>♚</span>
              <span className="setup-side-name">Black</span>
              <span className="setup-side-note">Responds first</span>
            </button>
          </div>
        </div>

        {/* Difficulty */}
        <div className="setup-field">
          <label className="setup-label">Difficulty</label>
          <div className="setup-diff-grid">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.depth}
                className={`setup-diff-btn${difficulty.depth === d.depth ? ' selected' : ''}`}
                onClick={() => setDifficulty(d)}
                type="button"
              >
                <span className="setup-diff-icon">{d.icon}</span>
                <span className="setup-diff-label">{d.label}</span>
                <span className="setup-diff-sub">{d.sublabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button className="setup-start-btn" onClick={handleStart} type="button">
          Start Game
          <span className="setup-start-arrow">→</span>
        </button>

        <p className="setup-footer-note">
          You are playing against Stockfish 18 · Depth {difficulty.depth}
        </p>
      </div>
    </div>
  );
}
