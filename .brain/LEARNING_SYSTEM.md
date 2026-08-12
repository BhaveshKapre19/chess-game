# Learning System

Lessons are data-driven in src/learning/lessons/lessonData.js.

Lesson schema:
```js
{
  id,
  title,
  route,
  summary,
  fen,
  explanation,
  prompt,
  highlights: [{ square, kind }],
  challenge: { type, from, to },
  hints,
  success
}
```

Challenge validation lives in lessonEngine.js. Supported challenge types include move, capture, check, and checkmate.

LessonBoard uses chess.js for legal moves and renders the same reusable ChessBoard component with lesson-specific highlights.

Progress tracking:
- localStorage key chess_learning_progress
- Tracks completed lesson IDs, attempts, hints used, and currentLesson

Current limitation: the dashboard shows a 20-item curriculum, but 10 unique interactive lessons are implemented in this first version.
