import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { DIFFICULTIES } from "../chess/constants.js";
import { StockfishEngine } from "../chess/engine/stockfishEngine.js";
import { gameStatus, getCapturedPieces, getPieceMap, isGameOver } from "../chess/moveUtils.js";
import { useLocalStorage } from "./useLocalStorage.js";

const DEFAULT_SETTINGS = {
  difficulty: "medium",
  playerColor: "white",
  showLegalMoves: true,
  showCoordinates: true,
  animations: true,
  sound: false,
  confirmMove: false
};

function cloneChess(source) {
  const next = new Chess();
  const pgn = source.pgn();
  if (pgn) next.loadPgn(pgn);
  return next;
}

function resolveColor(color) {
  if (color === "random") return Math.random() > 0.5 ? "white" : "black";
  return color;
}

function colorCode(color) {
  return color === "white" ? "w" : "b";
}

export function useChessGame() {
  const [settings, setSettings] = useLocalStorage("chess_settings", DEFAULT_SETTINGS);
  const [chess, setChess] = useState(() => new Chess());
  const [playerSide, setPlayerSide] = useState(() => resolveColor(settings.playerColor));
  const [selected, setSelected] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [engineThinking, setEngineThinking] = useState(false);
  const [engineStatus, setEngineStatus] = useState("Starting chess engine...");
  const [engineError, setEngineError] = useState("");
  const [promotion, setPromotion] = useState(null);
  const [resigned, setResigned] = useState(false);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const engineRef = useRef(null);

  const playerColor = colorCode(playerSide);
  const computerColor = playerColor === "w" ? "b" : "w";

  useEffect(() => {
    engineRef.current = new StockfishEngine();
    engineRef.current
      .start()
      .then(() => setEngineStatus("Stockfish ready"))
      .catch(() => {
        setEngineError("The chess engine couldn't be started. You can still review legal moves, then try restarting.");
        setEngineStatus("Engine unavailable");
      });

    return () => engineRef.current?.stop();
  }, []);

  const syncChess = useCallback((nextChess) => {
    setChess(cloneChess(nextChess));
  }, []);

  const makeEngineMove = useCallback(
    async (position) => {
      if (isGameOver(position, resigned) || position.turn() !== computerColor || !engineRef.current) return;
      setEngineThinking(true);
      setEngineError("");
      try {
        const bestMove = await engineRef.current.getBestMove(position.fen(), settings.difficulty);
        if (bestMove) {
          const next = cloneChess(position);
          const move = next.move({
            from: bestMove.slice(0, 2),
            to: bestMove.slice(2, 4),
            promotion: bestMove[4] || "q"
          });
          if (move) {
            setLastMove({ from: move.from, to: move.to, san: move.san });
            syncChess(next);
          }
        }
      } catch {
        setEngineError("Stockfish could not finish that move. Restarting the game usually fixes this.");
      } finally {
        setEngineThinking(false);
      }
    },
    [computerColor, resigned, settings.difficulty, syncChess]
  );

  useEffect(() => {
    if (chess.turn() === computerColor && !engineThinking && !isGameOver(chess, resigned)) {
      makeEngineMove(chess);
    }
  }, [chess, computerColor, engineThinking, makeEngineMove, resigned]);

  const newGame = useCallback(
    (overrides = {}) => {
      const nextSettings = { ...settings, ...overrides };
      if (Object.keys(overrides).length) setSettings(nextSettings);
      setPlayerSide(resolveColor(nextSettings.playerColor));
      setChess(new Chess());
      setSelected(null);
      setLastMove(null);
      setPromotion(null);
      setResigned(false);
      setEngineError("");
    },
    [settings, setSettings]
  );

  const legalMoves = useMemo(() => {
    if (!selected) return [];
    return chess.moves({ square: selected, verbose: true });
  }, [chess, selected]);

  const attemptMove = useCallback(
    (from, to, promotionPiece = "q") => {
      if (engineThinking || resigned || chess.turn() !== playerColor || isGameOver(chess, resigned)) return false;
      const next = cloneChess(chess);
      const moves = next.moves({ square: from, verbose: true }).filter((move) => move.to === to);
      const needsPromotion = moves.some((move) => move.flags.includes("p"));
      if (needsPromotion && !promotionPiece) {
        setPromotion({ from, to });
        return false;
      }
      const move = next.move({ from, to, promotion: promotionPiece });
      if (!move) return false;
      setLastMove({ from: move.from, to: move.to, san: move.san });
      setSelected(null);
      setPromotion(null);
      syncChess(next);
      return true;
    },
    [chess, engineThinking, playerColor, resigned, syncChess]
  );

  const handleSquare = useCallback(
    (square) => {
      if (engineThinking || resigned) return;
      const piece = chess.get(square);
      if (selected) {
        const move = legalMoves.find((candidate) => candidate.to === square);
        if (move) {
          if (move.flags.includes("p")) {
            setPromotion({ from: selected, to: square });
            return;
          }
          attemptMove(selected, square);
          return;
        }
      }
      if (piece && piece.color === playerColor && chess.turn() === playerColor) {
        setSelected(square);
      } else {
        setSelected(null);
      }
    },
    [attemptMove, chess, engineThinking, legalMoves, playerColor, resigned, selected]
  );

  const promote = useCallback((piece) => promotion && attemptMove(promotion.from, promotion.to, piece), [attemptMove, promotion]);

  const undo = useCallback(() => {
    if (engineThinking) return;
    const next = cloneChess(chess);
    next.undo();
    if (next.turn() !== playerColor) next.undo();
    setSelected(null);
    setPromotion(null);
    syncChess(next);
  }, [chess, engineThinking, playerColor, syncChess]);

  const resign = useCallback(() => setResigned(true), []);
  const orientation = boardFlipped ? (playerSide === "white" ? "black" : "white") : playerSide;

  return {
    chess,
    settings,
    setSettings,
    playerSide,
    playerColor,
    computerColor,
    selected,
    legalMoves,
    pieceMap: getPieceMap(chess),
    captured: getCapturedPieces(chess),
    history: chess.history(),
    lastMove,
    promotion,
    engineThinking,
    engineStatus,
    engineError,
    status: gameStatus(chess, playerColor, engineThinking, resigned),
    difficulty: DIFFICULTIES[settings.difficulty],
    orientation,
    resigned,
    gameOver: isGameOver(chess, resigned),
    boardFlipped,
    handleSquare,
    promote,
    newGame,
    undo,
    resign,
    setBoardFlipped
  };
}
