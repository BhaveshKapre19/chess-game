import { useLocalStorage } from "../hooks/useLocalStorage.js";

export function useLearningProgress() {
  const [progress, setProgress] = useLocalStorage("chess_learning_progress", {
    completed: [],
    attempts: {},
    hintsUsed: {},
    currentLesson: "basics"
  });

  const completeLesson = (id) => setProgress((current) => ({
    ...current,
    completed: current.completed.includes(id) ? current.completed : [...current.completed, id],
    currentLesson: id
  }));

  const recordAttempt = (id) => setProgress((current) => ({
    ...current,
    attempts: { ...current.attempts, [id]: (current.attempts[id] || 0) + 1 }
  }));

  const recordHint = (id) => setProgress((current) => ({
    ...current,
    hintsUsed: { ...current.hintsUsed, [id]: (current.hintsUsed[id] || 0) + 1 }
  }));

  return { progress, completeLesson, recordAttempt, recordHint };
}
