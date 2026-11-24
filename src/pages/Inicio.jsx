import { Link } from 'react-router-dom';
import { obtenerDestinos } from '../api/rest.js';
import { useAsync } from '../utils/useAsync.js';
import TarjetaDestino from '../components/TarjetaDestino.jsx';
import { Cargando, MensajeError } from '../components/Estados.jsx';

const PASOS = [
  { n: 1, titulo: 'Elige tu destino', texto: 'Explora destinos con su país y actividades populares (API REST).' },
  { n: 2, titulo: 'Compara vuelos y hoteles', texto: 'Revisa precios, fechas y disponibilidad (API GraphQL).' },
  { n: 3, titulo: 'Arma tu viaje', texto: 'Selecciona un vuelo y un hotel y revisa el costo total en "Mi viaje".' }
];

export default function Inicio() {
  const { datos: destinos, cargando, error, recargar } = useAsync(() => obtenerDestinos(), []);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 p-8 text-white shadow-lg sm:p-10">
        <h1 className="text-3xl font-bold sm:text-4xl">Planifica tu próximo viaje</h1>
        <p className="mt-3 max-w-2xl text-sky-50">
          En Viajes Santoni encuentras destinos, vuelos y hoteles en un solo lugar. Selecciona un destino y
          descubre las mejores opciones para tu experiencia de viaje.
        </p>
        <Link to="/destinos" className="mt-6 inline-block rounded-lg bg-white px-6 py-2.5 font-semibold text-sky-700 hover:bg-sky-50">
          Explorar destinos
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {PASOS.map((p) => (
          <div key={p.n} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700">{p.n}</span>
            <h2 className="mt-3 font-semibold">{p.titulo}</h2>
            <p className="mt-1 text-sm text-slate-600">{p.texto}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Destinos destacados</h2>
        {cargando && <Cargando texto="Cargando destinos..." />}
        {error && <MensajeError error={error} onReintentar={recargar} />}
        {destinos && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinos.slice(0, 3).map((d) => (
              <TarjetaDestino key={d.id} destino={d} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
