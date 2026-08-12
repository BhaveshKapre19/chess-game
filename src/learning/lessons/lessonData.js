export const lessons = [
  {
    id: "basics",
    title: "What is chess?",
    route: "/learn/basics",
    summary: "Meet the board, the armies, and the goal of the game.",
    fen: "8/8/8/3k4/8/8/4K3/8 w - - 0 1",
    explanation: "Chess is a turn-based game between White and Black. The goal is to trap the enemy king so it cannot escape.",
    prompt: "Click the white king, then move it one square to e3.",
    highlights: [{ square: "e3", kind: "target" }],
    challenge: { type: "move", from: "e2", to: "e3" },
    hints: ["Kings move one square at a time.", "The target square is directly above the white king."],
    success: "Correct. A king can step one square in any direction."
  },
  {
    id: "pieces",
    title: "The pieces",
    route: "/learn/pieces",
    summary: "Learn the six piece types by moving a queen.",
    fen: "4k3/8/8/8/3Q4/8/8/4K3 w - - 0 1",
    explanation: "Each side starts with a king, queen, rooks, bishops, knights, and pawns. The queen is the most flexible piece.",
    prompt: "Move the queen from d4 to h4 along the rank.",
    highlights: [{ square: "h4", kind: "target" }],
    challenge: { type: "move", from: "d4", to: "h4" },
    hints: ["A rank is a horizontal row.", "The queen can move straight across an open row."],
    success: "Nice. Queens can move horizontally, vertically, and diagonally."
  },
  {
    id: "movement",
    title: "Board movement",
    route: "/learn/movement",
    summary: "Understand files, ranks, and diagonals.",
    fen: "4k3/8/8/8/3B4/8/8/4K3 w - - 0 1",
    explanation: "Files go up and down. Ranks go left and right. Diagonals connect same-colored squares.",
    prompt: "Move the bishop diagonally from d4 to g7.",
    highlights: [{ square: "g7", kind: "target" }],
    challenge: { type: "move", from: "d4", to: "g7" },
    hints: ["Bishops stay on diagonals.", "g7 is three diagonal steps away."],
    success: "Correct. Bishops are diagonal pieces."
  },
  {
    id: "capturing",
    title: "Capturing",
    route: "/learn/capturing",
    summary: "Take an opponent piece by moving onto its square.",
    fen: "4k3/8/8/4p3/3Q4/8/8/4K3 w - - 0 1",
    explanation: "A capture happens when your piece legally moves onto a square occupied by an enemy piece.",
    prompt: "Capture the black pawn on e5 with the queen.",
    highlights: [{ square: "e5", kind: "target" }],
    challenge: { type: "capture", from: "d4", to: "e5" },
    hints: ["The queen can move diagonally one square.", "Move onto the occupied square."],
    success: "Captured. Removing active enemy pieces gives your army more room."
  },
  {
    id: "check",
    title: "Check",
    route: "/learn/check",
    summary: "Attack the king and force a response.",
    fen: "4k3/8/8/8/4R3/8/8/4K3 w - - 0 1",
    explanation: "Check means the king is under attack. A checked player must answer the threat immediately.",
    prompt: "Move the rook to e7 to give check.",
    highlights: [{ square: "e7", kind: "target" }],
    challenge: { type: "check", from: "e4", to: "e7" },
    hints: ["Rooks move in straight lines.", "Put the rook on the same file as the black king."],
    success: "Check. The king is attacked along the open file."
  },
  {
    id: "checkmate",
    title: "Checkmate",
    route: "/learn/checkmate",
    summary: "End the game by trapping the king.",
    fen: "7k/8/5KQ1/8/8/8/8/8 w - - 0 1",
    explanation: "Checkmate is check with no legal escape. That is how a chess game is won.",
    prompt: "Move the queen from g6 to g7 for checkmate.",
    highlights: [{ square: "g7", kind: "target" }],
    challenge: { type: "checkmate", from: "g6", to: "g7" },
    hints: ["This position already demonstrates a mating net.", "The queen protects the escape squares while the king supports nearby."],
    success: "That is checkmate: the black king is trapped."
  },
  {
    id: "castling",
    title: "Castling",
    route: "/learn/castling",
    summary: "Move the king and rook together for safety.",
    fen: "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1",
    explanation: "Castling is a special king move. It tucks the king away and connects a rook when the path is clear and safe.",
    prompt: "Castle kingside by moving the king from e1 to g1.",
    highlights: [{ square: "g1", kind: "target" }],
    challenge: { type: "move", from: "e1", to: "g1" },
    hints: ["Move the king two squares toward the rook.", "The rook moves automatically in chess.js."],
    success: "Castled. The king is safer and the rook is closer to the center."
  },
  {
    id: "en-passant",
    title: "En passant",
    route: "/learn/en-passant",
    summary: "Capture a pawn that just rushed past.",
    fen: "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 2",
    explanation: "En passant is a special pawn capture available immediately after an enemy pawn moves two squares beside your pawn.",
    prompt: "Capture en passant by moving the pawn from e5 to d6.",
    highlights: [{ square: "d6", kind: "target" }],
    challenge: { type: "move", from: "e5", to: "d6" },
    hints: ["The capture square is diagonal and empty.", "The pawn on d5 is removed after the move."],
    success: "Exactly. En passant prevents a pawn from slipping past for free."
  },
  {
    id: "promotion",
    title: "Promotion",
    route: "/learn/promotion",
    summary: "Turn a pawn into a stronger piece.",
    fen: "4k3/6P1/8/8/8/8/8/4K3 w - - 0 1",
    explanation: "When a pawn reaches the final rank, it promotes to a queen, rook, bishop, or knight.",
    prompt: "Move the pawn from g7 to g8 and promote it.",
    highlights: [{ square: "g8", kind: "target" }],
    challenge: { type: "move", from: "g7", to: "g8" },
    hints: ["Push the pawn to the back rank.", "Queen is usually the strongest promotion."],
    success: "Promoted. A passed pawn can become a new queen."
  },
  {
    id: "tactics",
    title: "Basic tactics",
    route: "/learn/tactics",
    summary: "Use a knight fork to win material.",
    fen: "4k3/8/8/3q4/8/2N5/8/4K3 w - - 0 1",
    explanation: "A tactic is a short forcing idea. Knights are famous for forks: one move attacks two valuable targets.",
    prompt: "Move the knight from c3 to b5 to attack the queen and king side squares.",
    highlights: [{ square: "b5", kind: "target" }],
    challenge: { type: "move", from: "c3", to: "b5" },
    hints: ["Knights move in an L shape.", "Look for a square two left and one up from c3."],
    success: "Good tactical eye. Knights create threats from surprising angles."
  }
];

const extraTitles = ["The king", "The queen", "The rook", "The bishop", "The knight", "Pawns", "Opening principles", "Piece development", "Center control", "Putting it all together"];

export const fullCurriculum = [
  ...lessons,
  ...extraTitles.map((title, index) => ({
    id: `academy-${index + 1}`,
    title,
    route: `/learn/${lessons[index % lessons.length].id}`,
    summary: "Included in the guided course path through the interactive lessons.",
    linked: true
  }))
];

export function getLesson(id) {
  return lessons.find((lesson) => lesson.id === id) || lessons[0];
}

export function getNextLesson(id) {
  const index = lessons.findIndex((lesson) => lesson.id === id);
  return lessons[index + 1] || null;
}

