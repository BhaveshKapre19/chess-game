import LessonCard from "../components/learning/LessonCard.jsx";
import LessonProgress from "../components/learning/LessonProgress.jsx";
import { fullCurriculum, lessons } from "../learning/lessons/lessonData.js";
import { useLearningProgress } from "../learning/progress.js";

export default function Learn() {
  const { progress } = useLearningProgress();
  const completed = progress.completed.length;
  return (
    <div className="learn-page">
      <section className="learn-intro">
        <div>
          <span className="micro-label">Interactive Chess Academy</span>
          <h1>Start from zero and learn by moving pieces.</h1>
          <p>Each lesson gives you a small board position, a clear challenge, hints, and feedback.</p>
        </div>
        <LessonProgress completed={completed} total={lessons.length} />
      </section>
      <section className="lesson-grid" aria-label="Learning path">
        {fullCurriculum.map((lesson, index) => {
          const complete = progress.completed.includes(lesson.id) || (lesson.linked && index < completed);
          const locked = lesson.linked;
          return <LessonCard key={`${lesson.id}-${index}`} lesson={lesson} complete={complete} locked={locked} />;
        })}
      </section>
    </div>
  );
}
