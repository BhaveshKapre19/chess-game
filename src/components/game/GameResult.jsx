export default function GameResult({ game, onPlayAgain }) {
  if (!game.gameOver) return null;
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="result-dialog" role="dialog" aria-modal="true" aria-label="Game result">
        <span className="micro-label">Game over</span>
        <h2>{game.status}</h2>
        <p>White: {game.playerSide === "white" ? "You" : "Stockfish"}</p>
        <p>Black: {game.playerSide === "black" ? "You" : "Stockfish"}</p>
        <p>Moves: {game.history.length}</p>
        <button type="button" onClick={onPlayAgain}>Play again</button>
      </div>
    </div>
  );
}
