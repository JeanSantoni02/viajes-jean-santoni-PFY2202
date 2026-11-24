import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerVuelos } from '../api/graphql.js';
import { useAsync } from '../utils/useAsync.js';
import { formatearFecha, formatearPrecio } from '../utils/formato.js';
import { useViaje } from '../context/ViajeContext.jsx';
import { BadgeDisponibilidad, Cargando, MensajeError } from '../components/Estados.jsx';
import FiltroDisponibles from '../components/FiltroDisponibles.jsx';

// Vuelos disponibles hacia el destino seleccionado (API GraphQL mock)
export default function VuelosDestino() {
  const { id } = useParams();
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const { vuelo: vueloSeleccionado, seleccionarVuelo } = useViaje();
  const { datos: vuelos, cargando, error, recargar } = useAsync(
    () => obtenerVuelos(id, soloDisponibles),
    [id, soloDisponibles]
  );

  if (error) return <MensajeError error={error} onReintentar={recargar} />;

  return (
    <div>
      <FiltroDisponibles activo={soloDisponibles} onCambiar={setSoloDisponibles} total={vuelos?.length ?? 0} etiqueta="vuelos" />
      {cargando ? (
        <Cargando texto="Consultando vuelos vía GraphQL..." />
      ) : (
        <ul className="space-y-3">
          {vuelos.map((v) => {
            const elegido = vueloSeleccionado?.id === v.id;
            return (
              <li
                key={v.id}
                className={`grid gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 sm:grid-cols-[1fr_auto] sm:items-center ${
                  elegido ? 'ring-2 ring-sky-500' : 'ring-slate-200'
                } ${v.disponible ? '' : 'opacity-70'}`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold">{v.aerolinea}</h3>
                    <span className="text-xs text-slate-400">#{v.id}</span>
                    <BadgeDisponibilidad disponible={v.disponible} cantidad={v.asientosDisponibles} unidad="asientos" />
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {v.origen} → {v.destino.ciudad} · {v.duracion} · {v.escalas === 0 ? 'Directo' : `${v.escalas} escala(s)`}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    🛫 Ida: <strong>{formatearFecha(v.fechaSalida)}</strong> &nbsp; 🛬 Regreso: <strong>{formatearFecha(v.fechaRegreso)}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <p className="text-right">
                    <span className="block text-2xl font-bold text-sky-700">{formatearPrecio(v.precio)}</span>
                    <span className="text-xs text-slate-500">ida y vuelta por persona</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => seleccionarVuelo(v)}
                    disabled={!v.disponible || elegido}
                    className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {elegido ? '✓ Seleccionado' : v.disponible ? 'Seleccionar vuelo' : 'Sin asientos'}
                  </button>
                </div>
              </li>
            );
          })}
          {vuelos.length === 0 && <p className="py-8 text-center text-slate-500">No hay vuelos disponibles para este destino.</p>}
        </ul>
      )}
      {vueloSeleccionado && String(vueloSeleccionado.destino.id) === String(id) && (
        <p className="mt-4 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-800 ring-1 ring-sky-100">
          Vuelo seleccionado. Ahora elige un <Link to="../hoteles" className="font-semibold underline">hotel</Link> o revisa{' '}
          <Link to="/mi-viaje" className="font-semibold underline">Mi viaje</Link>.
        </p>
      )}
    </div>
  );
}
