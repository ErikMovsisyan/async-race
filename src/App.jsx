import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Garage from './pages/Garage';
import Winners from './pages/Winners';

export default function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <h1 className="app-title">🏎 Async Race</h1>
        <nav className="app-nav">
          <NavLink to="/garage" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Garage
          </NavLink>
          <NavLink to="/winners" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Winners
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/garage" element={<Garage />} />
          <Route path="/winners" element={<Winners />} />
          <Route path="*" element={<Navigate to="/garage" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
