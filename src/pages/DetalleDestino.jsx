import { Link, NavLink, Outlet, useParams } from 'react-router-dom';
import { obtenerDestino } from '../api/rest.js';
import { useAsync } from '../utils/useAsync.js';
import { Cargando, MensajeError } from '../components/Estados.jsx';

const claseTab = ({ isActive }) =>
  `rounded-t-lg px-5 py-2.5 text-sm font-semibold transition ${
    isActive ? 'bg-white text-sky-700 ring-1 ring-slate-200' : 'text-slate-500 hover:text-sky-700'
  }`;

// Detalle del destino seleccionado (API REST) + pestañas con vuelos y hoteles (rutas anidadas, API GraphQL)
export default function DetalleDestino() {
  const { id } = useParams();
  const { datos: destino, cargando, error, recargar } = useAsync(() => obtenerDestino(id), [id]);

  if (cargando) return <Cargando texto="Cargando destino..." />;
  if (error) {
    return (
      <div className="space-y-4">
        <MensajeError error={error} onReintentar={recargar} />
        <Link to="/destinos" className="text-sky-700 underline">Volver a destinos</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/destinos" className="text-sm font-medium text-sky-700 hover:underline">← Todos los destinos</Link>

      <section className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[160px_1fr]">
        <div className="flex aspect-square items-center justify-center rounded-xl bg-sky-50 text-7xl" aria-hidden="true">
          {destino.emoji}
        </div>
        <div>
          <p className="text-sm font-medium text-sky-700">{destino.continente}</p>
          <h1 className="text-3xl font-bold text-slate-800">{destino.ciudad}, {destino.pais}</h1>
          <p className="mt-2 text-slate-600">{destino.descripcion}</p>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
            <div><dt className="text-slate-500">País</dt><dd className="font-medium">{destino.pais}</dd></div>
            <div><dt className="text-slate-500">Clima</dt><dd className="font-medium">{destino.clima}</dd></div>
            <div><dt className="text-slate-500">Moneda</dt><dd className="font-medium">{destino.moneda}</dd></div>
          </dl>
          <p className="mt-4 text-sm font-semibold text-slate-700">Actividades populares</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {destino.actividades.map((a) => (
              <li key={a} className="rounded-full bg-sky-50 px-3 py-1 text-sm text-sky-800 ring-1 ring-sky-100">{a}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <nav className="flex gap-1 border-b border-slate-200">
          <NavLink to="vuelos" className={claseTab}>✈️ Vuelos</NavLink>
          <NavLink to="hoteles" className={claseTab}>🏨 Hoteles</NavLink>
        </nav>
        <div className="pt-5">
          {/* Aquí se renderiza VuelosDestino u HotelesDestino según la sub-ruta */}
          <Outlet context={{ destino }} />
        </div>
      </section>
    </div>
  );
}
