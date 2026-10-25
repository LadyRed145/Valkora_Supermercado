import { NavLink } from 'react-router';

const links = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/tiendas', label: 'Nuestras tiendas', icon: 'store' },
  { to: '/preguntas-frecuentes', label: 'Preguntas frecuentes', icon: 'help' },
];

function NavIcon({ icon }) {
  return (
    <svg className="nav-icon" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icon === 'home' && <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-7h6v7"/></>}
      {icon === 'store' && <><path d="M3 10h18l-2-6H5l-2 6ZM5 10v11h14V10M9 21v-7h6v7"/><path d="M3 10c0 3 3 3 4.5 0 0 3 3 3 4.5 0 0 3 3 3 4.5 0C18 13 21 13 21 10"/></>}
      {icon === 'help' && <><circle cx="12" cy="12" r="9"/><path d="M9.4 9a2.7 2.7 0 1 1 4.7 1.8c-.8.8-2.1 1.3-2.1 2.7v.4M12 17.5h.01"/></>}
    </svg>
  );
}

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Menú principal inferior">
      <div className="bottom-nav-inner">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
          >
            <NavIcon icon={icon} />
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
