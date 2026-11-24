import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useViaje } from '../context/ViajeContext.jsx';
import { formatearFecha, formatearPrecio } from '../utils/formato.js';

// Resumen del plan de viaje: destino, vuelo y hotel seleccionados con el costo total
export default function MiViaje() {
  const {
    destino, vuelo, hotel, pasajeros, noches, totalVuelo, totalHotel, total,
    quitarVuelo, quitarHotel, cambiarPasajeros, reiniciar
  } = useViaje();
  const [confirmado, setConfirmado] = useState(false);

  if (confirmado) {
    return (
      <div className="py-16 text-center">
        <p className="text-6xl" aria-hidden="true">🎉</p>
        <h1 className="mt-4 text-2xl font-semibold">¡Tu cotización fue registrada!</h1>
        <p className="mt-2 text-slate-500">Un ejecutivo de Viajes Santoni se pondrá en contacto contigo.</p>
        <Link to="/destinos" onClick={() => setConfirmado(false)} className="mt-6 inline-block rounded-lg bg-sky-600 px-5 py-2 font-semibold text-white hover:bg-sky-700">
          Planificar otro viaje
        </Link>
      </div>
    );
  }

  if (!destino) {
    return (
      <div className="py-16 text-center">
        <p className="text-6xl" aria-hidden="true">🧳</p>
        <h1 className="mt-4 text-2xl font-semibold">Aún no has armado tu viaje</h1>
        <p className="mt-2 text-slate-500">Elige un destino y selecciona un vuelo y un hotel.</p>
        <Link to="/destinos" className="mt-6 inline-block rounded-lg bg-sky-600 px-5 py-2 font-semibold text-white hover:bg-sky-700">
          Ver destinos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Mi viaje</h1>
        <p className="mt-1 text-slate-500">
          Destino: <strong>{destino.ciudad}, {destino.pais}</strong> ·{' '}
          <Link to={`/destinos/${destino.id}`} className="text-sky-700 underline">ver opciones</Link>
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-bold">✈️ Vuelo</h2>
          {vuelo ? (
            <div className="mt-3 space-y-1 text-sm">
              <p className="font-semibold">{vuelo.aerolinea} <span className="text-slate-400">#{vuelo.id}</span></p>
              <p>{vuelo.origen} → {vuelo.destino.ciudad}</p>
              <p>{formatearFecha(vuelo.fechaSalida)} al {formatearFecha(vuelo.fechaRegreso)} ({noches} noches)</p>
              <p>{formatearPrecio(vuelo.precio)} × {pasajeros} pasajero(s)</p>
              <button type="button" onClick={quitarVuelo} className="pt-2 text-rose-600 hover:underline">Quitar vuelo</button>
            </div>
          ) : (
            <Link to={`/destinos/${destino.id}/vuelos`} className="mt-3 inline-block text-sm font-semibold text-sky-700 underline">
              Seleccionar un vuelo
            </Link>
          )}
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-bold">🏨 Hotel</h2>
          {hotel ? (
            <div className="mt-3 space-y-1 text-sm">
              <p className="font-semibold">{hotel.nombre} <span className="text-amber-500">{'★'.repeat(hotel.estrellas)}</span></p>
              <p>{formatearPrecio(hotel.precioPorNoche)} por noche × {Math.max(noches, 1)} noche(s)</p>
              {!vuelo && <p className="text-xs text-slate-500">Selecciona un vuelo para calcular las noches según tus fechas.</p>}
              <button type="button" onClick={quitarHotel} className="pt-2 text-rose-600 hover:underline">Quitar hotel</button>
            </div>
          ) : (
            <Link to={`/destinos/${destino.id}/hoteles`} className="mt-3 inline-block text-sm font-semibold text-sky-700 underline">
              Seleccionar un hotel
            </Link>
          )}
        </section>
      </div>

      <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Pasajeros</span>
            <div className="flex items-center rounded-lg ring-1 ring-slate-300">
              <button type="button" onClick={() => cambiarPasajeros(pasajeros - 1)} className="px-3 py-1.5 text-lg" aria-label="Menos pasajeros">−</button>
              <span className="w-8 text-center font-semibold">{pasajeros}</span>
              <button type="button" onClick={() => cambiarPasajeros(pasajeros + 1)} className="px-3 py-1.5 text-lg" aria-label="Más pasajeros">+</button>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <dt className="text-slate-500">Vuelos</dt><dd className="text-right">{formatearPrecio(totalVuelo)}</dd>
            <dt className="text-slate-500">Hotel</dt><dd className="text-right">{formatearPrecio(totalHotel)}</dd>
            <dt className="font-semibold">Total</dt><dd className="text-right text-xl font-bold text-sky-700">{formatearPrecio(total)}</dd>
          </dl>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={reiniciar} className="rounded-lg px-4 py-2 font-medium text-slate-600 ring-1 ring-slate-300 hover:bg-slate-100">
            Vaciar plan
          </button>
          <button
            type="button"
            disabled={!vuelo || !hotel}
            onClick={() => { reiniciar(); setConfirmado(true); }}
            className="rounded-lg bg-sky-600 px-6 py-2 font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Solicitar cotización
          </button>
        </div>
      </section>
    </div>
  );
}
