export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export const PIECE_VALUES = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0
};

export const PIECE_NAMES = {
  p: "Pawn",
  n: "Knight",
  b: "Bishop",
  r: "Rook",
  q: "Queen",
  k: "King"
};

export const PIECE_GLYPHS = {
  wp: "♙",
  wn: "♘",
  wb: "♗",
  wr: "♖",
  wq: "♕",
  wk: "♔",
  bp: "♟",
  bn: "♞",
  bb: "♝",
  br: "♜",
  bq: "♛",
  bk: "♚"
};

export const STARTING_COUNTS = {
  p: 8,
  n: 2,
  b: 2,
  r: 2,
  q: 1,
  k: 1
};

export const DIFFICULTIES = {
  beginner: {
    label: "Beginner",
    skill: 1,
    elo: 900,
    depth: 3,
    moveTime: 250
  },
  easy: {
    label: "Easy",
    skill: 4,
    elo: 1200,
    depth: 5,
    moveTime: 450
  },
  medium: {
    label: "Medium",
    skill: 9,
    elo: 1600,
    depth: 8,
    moveTime: 700
  },
  hard: {
    label: "Hard",
    skill: 15,
    elo: 2100,
    depth: 11,
    moveTime: 1000
  },
  expert: {
    label: "Expert",
    skill: 20,
    elo: 2850,
    depth: 14,
    moveTime: 1400
  }
};
