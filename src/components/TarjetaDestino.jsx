import { Link } from 'react-router-dom';

// Tarjeta de un destino obtenido desde la API REST
export default function TarjetaDestino({ destino }) {
  return (
    <Link
      to={`/destinos/${destino.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-28 items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-50 text-6xl" aria-hidden="true">
        {destino.emoji}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-sky-700">{destino.continente}</p>
        <h3 className="mt-1 text-xl font-bold text-slate-800">{destino.ciudad}</h3>
        <p className="text-sm text-slate-500">{destino.pais}</p>
        <p className="mt-3 text-sm font-medium text-slate-600">Actividades populares:</p>
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {destino.actividades.slice(0, 3).map((a) => (
            <li key={a} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">{a}</li>
          ))}
        </ul>
        <span className="mt-auto pt-4 text-sm font-semibold text-sky-700 group-hover:underline">
          Ver vuelos y hoteles →
        </span>
      </div>
    </Link>
  );
}
