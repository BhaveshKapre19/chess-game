export default function LessonProgress({ completed, total }) {
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="progress-wrap" aria-label={`${percent}% complete`}>
      <div className="progress-label"><span>Chess Fundamentals</span><strong>{completed} / {total}</strong></div>
      <div className="progress-track"><span style={{ width: `${percent}%` }} /></div>
    </div>
  );
}
