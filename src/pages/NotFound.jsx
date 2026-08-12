import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found page-pad">
      <h1>That square is off the board.</h1>
      <p>The page you asked for does not exist.</p>
      <Link className="button primary" to="/">Go home</Link>
    </div>
  );
}
