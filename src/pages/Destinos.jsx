import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { obtenerDestinos } from '../api/rest.js';
import { useAsync } from '../utils/useAsync.js';
import TarjetaDestino from '../components/TarjetaDestino.jsx';
import { Cargando, MensajeError } from '../components/Estados.jsx';

const CONTINENTES = ['Sudamérica', 'Norteamérica', 'Europa'];

// Lista de destinos disponibles obtenida desde la API REST mock
export default function Destinos() {
  // Los filtros se guardan en la URL (?continente=...&q=...) y se envían como parámetros a la API REST
  const [parametros, setParametros] = useSearchParams();
  const continente = parametros.get('continente') ?? '';
  const q = parametros.get('q') ?? '';
  const [texto, setTexto] = useState(q);

  // Espera a que el usuario deje de escribir para consultar la API
  useEffect(() => {
    const t = setTimeout(() => actualizar({ q: texto.trim() }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto]);

  const actualizar = (cambios) => {
    setParametros(
      (previos) => {
        const nuevos = new URLSearchParams(previos);
        Object.entries(cambios).forEach(([clave, valor]) => (valor ? nuevos.set(clave, valor) : nuevos.delete(clave)));
        return nuevos;
      },
      { replace: true }
    );
  };

  const { datos: destinos, cargando, error, recargar } = useAsync(
    () => obtenerDestinos({ continente, q }),
    [continente, q]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Destinos disponibles</h1>
        <p className="mt-1 text-slate-500">Selecciona un destino para ver sus vuelos y hoteles.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center">
        <input
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar por ciudad o país..."
          aria-label="Buscar destino"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
        />
        <select
          value={continente}
          onChange={(e) => actualizar({ continente: e.target.value })}
          aria-label="Filtrar por continente"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">Todos los continentes</option>
          {CONTINENTES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {cargando && <Cargando texto="Consultando API REST de destinos..." />}
      {error && <MensajeError error={error} onReintentar={recargar} />}
      {destinos && !cargando && (
        destinos.length === 0 ? (
          <p className="py-10 text-center text-slate-500">No se encontraron destinos con esos filtros.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinos.map((d) => (
              <TarjetaDestino key={d.id} destino={d} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
