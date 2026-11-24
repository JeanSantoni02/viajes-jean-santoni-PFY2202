import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerHoteles } from '../api/graphql.js';
import { useAsync } from '../utils/useAsync.js';
import { formatearFecha, formatearPrecio } from '../utils/formato.js';
import { useViaje } from '../context/ViajeContext.jsx';
import { BadgeDisponibilidad, Cargando, MensajeError } from '../components/Estados.jsx';
import FiltroDisponibles from '../components/FiltroDisponibles.jsx';

// Hoteles disponibles en el destino seleccionado (API GraphQL mock)
export default function HotelesDestino() {
  const { id } = useParams();
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const { hotel: hotelSeleccionado, seleccionarHotel } = useViaje();
  const { datos: hoteles, cargando, error, recargar } = useAsync(
    () => obtenerHoteles(id, soloDisponibles),
    [id, soloDisponibles]
  );

  if (error) return <MensajeError error={error} onReintentar={recargar} />;

  return (
    <div>
      <FiltroDisponibles activo={soloDisponibles} onCambiar={setSoloDisponibles} total={hoteles?.length ?? 0} etiqueta="hoteles" />
      {cargando ? (
        <Cargando texto="Consultando hoteles vía GraphQL..." />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hoteles.map((h) => {
            const elegido = hotelSeleccionado?.id === h.id;
            return (
              <li
                key={h.id}
                className={`flex flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ${
                  elegido ? 'ring-2 ring-sky-500' : 'ring-slate-200'
                } ${h.disponible ? '' : 'opacity-70'}`}
              >
                <p className="text-amber-500" aria-label={`${h.estrellas} estrellas`}>
                  {'★'.repeat(h.estrellas)}<span className="text-slate-300">{'★'.repeat(5 - h.estrellas)}</span>
                </p>
                <h3 className="mt-1 text-lg font-bold">{h.nombre}</h3>
                <div className="mt-1">
                  <BadgeDisponibilidad disponible={h.disponible} cantidad={h.habitacionesDisponibles} unidad="habitaciones" />
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  📅 {formatearFecha(h.disponibleDesde)} – {formatearFecha(h.disponibleHasta)}
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {h.servicios.map((s) => (
                    <li key={s} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">{s}</li>
                  ))}
                </ul>
                <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                  <p>
                    <span className="block text-xl font-bold text-sky-700">{formatearPrecio(h.precioPorNoche)}</span>
                    <span className="text-xs text-slate-500">por noche</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => seleccionarHotel(h)}
                    disabled={!h.disponible || elegido}
                    className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {elegido ? '✓ Seleccionado' : h.disponible ? 'Seleccionar' : 'Sin cupo'}
                  </button>
                </div>
              </li>
            );
          })}
          {hoteles.length === 0 && <p className="py-8 text-center text-slate-500 md:col-span-3">No hay hoteles disponibles en este destino.</p>}
        </ul>
      )}
      {hotelSeleccionado && String(hotelSeleccionado.destino.id) === String(id) && (
        <p className="mt-4 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-800 ring-1 ring-sky-100">
          Hotel seleccionado. Revisa el resumen en <Link to="/mi-viaje" className="font-semibold underline">Mi viaje</Link>.
        </p>
      )}
    </div>
  );
}
