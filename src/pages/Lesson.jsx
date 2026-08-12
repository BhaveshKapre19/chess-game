import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import HintPanel from "../components/learning/HintPanel.jsx";
import LessonBoard from "../components/learning/LessonBoard.jsx";
import { getLesson, getNextLesson } from "../learning/lessons/lessonData.js";
import { useLearningProgress } from "../learning/progress.js";

export default function Lesson() {
  const { lessonId } = useParams();
  const lesson = getLesson(lessonId);
  const next = getNextLesson(lesson.id);
  const { progress, completeLesson, recordAttempt, recordHint } = useLearningProgress();
  const hintCount = progress.hintsUsed[lesson.id] || 0;
  const done = progress.completed.includes(lesson.id);

  return (
    <div className="lesson-page">
      <Link className="text-link" to="/learn"><ArrowLeft size={17} /> Learning path</Link>
      <section className="lesson-layout">
        <article className="lesson-copy">
          <span className="micro-label">Lesson</span>
          <h1>{lesson.title}</h1>
          <p>{lesson.explanation}</p>
          <div className="challenge-card">
            <h2>Challenge</h2>
            <p>{lesson.prompt}</p>
            {done && <strong className="success-text">Completed</strong>}
          </div>
          <HintPanel hints={lesson.hints} count={hintCount} onHint={() => recordHint(lesson.id)} />
          {next && done && <Link className="button primary" to={next.route}>Next lesson <ArrowRight size={17} /></Link>}
        </article>
        <LessonBoard lesson={lesson} onAttempt={() => recordAttempt(lesson.id)} onSuccess={() => completeLesson(lesson.id)} />
      </section>
    </div>
  );
}
