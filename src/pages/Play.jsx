import ChessBoard from "../components/chess/ChessBoard.jsx";
import PromotionDialog from "../components/chess/PromotionDialog.jsx";
import GamePanel from "../components/game/GamePanel.jsx";
import GameResult from "../components/game/GameResult.jsx";
import { useChessGame } from "../hooks/useChessGame.js";

export default function Play() {
  const game = useChessGame();
  const inCheckSquare = game.chess.isCheck() ? Object.entries(game.pieceMap).find(([, piece]) => piece.type === "k" && piece.color === game.chess.turn())?.[0] : null;

  return (
    <div className="play-page">
      <section className="play-board-area">
        <div className="player-strip top"><span>Stockfish</span><strong>{game.playerSide === "white" ? "Black" : "White"}</strong></div>
        <ChessBoard
          pieceMap={game.pieceMap}
          orientation={game.orientation}
          selected={game.selected}
          legalMoves={game.settings.showLegalMoves ? game.legalMoves : []}
          lastMove={game.lastMove}
          inCheckSquare={inCheckSquare}
          onSquareClick={game.handleSquare}
          showCoordinates={game.settings.showCoordinates}
          disabled={game.gameOver}
        />
        <div className="player-strip bottom"><span>You</span><strong>{game.playerSide}</strong></div>
      </section>
      <GamePanel game={game} />
      {game.promotion && <PromotionDialog color={game.playerColor} onPromote={game.promote} />}
      <GameResult game={game} onPlayAgain={() => game.newGame()} />
    </div>
  );
}
