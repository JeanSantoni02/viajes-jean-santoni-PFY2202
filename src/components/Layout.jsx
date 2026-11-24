import { Link, NavLink, Outlet } from 'react-router-dom';
import { useViaje } from '../context/ViajeContext.jsx';

const claseEnlace = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-white text-sky-700 shadow' : 'text-sky-50 hover:bg-sky-500'
  }`;

// Estructura común: barra de navegación, contenido de la ruta y pie de página
export default function Layout() {
  const { vuelo, hotel } = useViaje();
  const seleccionados = (vuelo ? 1 : 0) + (hotel ? 1 : 0);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-sky-600 shadow-md">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <span aria-hidden="true">✈️</span> Viajes Santoni
          </Link>
          <ul className="flex flex-wrap items-center gap-2">
            <li>
              <NavLink to="/" end className={claseEnlace}>Inicio</NavLink>
            </li>
            <li>
              <NavLink to="/destinos" className={claseEnlace}>Destinos</NavLink>
            </li>
            <li>
              <NavLink to="/mi-viaje" className={claseEnlace}>
                Mi viaje
                <span className="ml-2 inline-flex min-w-6 justify-center rounded-full bg-amber-400 px-2 text-xs font-bold text-slate-900">
                  {seleccionados}
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-slate-800 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Viajes Santoni · PFY2202 · Datos servidos por backend mock (REST + GraphQL)
      </footer>
    </div>
  );
}
