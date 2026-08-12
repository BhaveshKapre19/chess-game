import { NavLink, Route, Routes } from "react-router-dom";
import { BookOpen, Crown, Swords } from "lucide-react";
import Home from "../pages/Home.jsx";
import Play from "../pages/Play.jsx";
import Learn from "../pages/Learn.jsx";
import Lesson from "../pages/Lesson.jsx";
import NotFound from "../pages/NotFound.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="Chess Academy home">
          <Crown size={24} />
          <span>Chess Academy</span>
        </NavLink>
        <nav className="main-nav" aria-label="Primary navigation">
          <NavLink to="/play">
            <Swords size={18} />
            Play
          </NavLink>
          <NavLink to="/learn">
            <BookOpen size={18} />
            Learn
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:lessonId" element={<Lesson />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
