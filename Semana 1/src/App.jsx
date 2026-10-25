import { Navigate, Route, Routes } from 'react-router';
import BrandMark from './components/BrandMark.jsx';
import BottomNav from './components/BottomNav.jsx';
import Home from './pages/Home.jsx';
import Stores from './pages/Stores.jsx';
import FAQ from './pages/FAQ.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand" aria-label="Supermercados Valkora">
            <BrandMark className="brand-emblem" />
            <span className="brand-wordmark">
              <strong className="brand-name">VALKORA</strong>
              <span className="brand-subtitle">SUPERMERCADOS</span>
            </span>
          </div>
          <span className="header-caption">Calidad que nos distingue</span>
        </div>
      </header>

      <main className="container site-main" id="contenido">
        {/* La cabecera y el menú son compartidos; cambia solo la página central. */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tiendas" element={<Stores />} />
          <Route path="/preguntas-frecuentes" element={<FAQ />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}
