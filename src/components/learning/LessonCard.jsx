import { Link } from "react-router-dom";

export default function LessonCard({ lesson, complete, locked }) {
  return (
    <Link className={`lesson-card ${complete ? "complete" : ""} ${locked ? "locked" : ""}`} to={lesson.route} aria-disabled={locked}>
      <span className="lesson-state">{complete ? "Done" : locked ? "Soon" : "Start"}</span>
      <h3>{lesson.title}</h3>
      <p>{lesson.summary}</p>
    </Link>
  );
}
