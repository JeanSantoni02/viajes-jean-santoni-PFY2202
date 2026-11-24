import { createContext, useContext, useMemo, useState } from 'react';
import { calcularNoches } from '../utils/formato.js';

/*
 * Estado global del plan de viaje del usuario: destino, vuelo y hotel seleccionados.
 * Si el usuario elige un vuelo u hotel de otro destino, se reinicia la selección anterior.
 */
const ViajeContext = createContext(null);

export function ViajeProvider({ children }) {
  const [plan, setPlan] = useState({ destino: null, vuelo: null, hotel: null, pasajeros: 1 });

  const valor = useMemo(() => {
    const mismoDestino = (destino) => plan.destino && String(plan.destino.id) === String(destino.id);

    const seleccionarVuelo = (vuelo) =>
      setPlan((p) => ({
        ...p,
        destino: vuelo.destino,
        vuelo,
        hotel: mismoDestino(vuelo.destino) ? p.hotel : null
      }));

    const seleccionarHotel = (hotel) =>
      setPlan((p) => ({
        ...p,
        destino: hotel.destino,
        hotel,
        vuelo: mismoDestino(hotel.destino) ? p.vuelo : null
      }));

    const noches = plan.vuelo ? calcularNoches(plan.vuelo.fechaSalida, plan.vuelo.fechaRegreso) : 0;
    const totalVuelo = plan.vuelo ? plan.vuelo.precio * plan.pasajeros : 0;
    const totalHotel = plan.hotel ? plan.hotel.precioPorNoche * Math.max(noches, 1) : 0;

    return {
      ...plan,
      noches,
      totalVuelo,
      totalHotel,
      total: totalVuelo + totalHotel,
      seleccionarVuelo,
      seleccionarHotel,
      quitarVuelo: () => setPlan((p) => ({ ...p, vuelo: null, destino: p.hotel ? p.destino : null })),
      quitarHotel: () => setPlan((p) => ({ ...p, hotel: null, destino: p.vuelo ? p.destino : null })),
      cambiarPasajeros: (n) => setPlan((p) => ({ ...p, pasajeros: Math.min(9, Math.max(1, n)) })),
      reiniciar: () => setPlan({ destino: null, vuelo: null, hotel: null, pasajeros: 1 })
    };
  }, [plan]);

  return <ViajeContext.Provider value={valor}>{children}</ViajeContext.Provider>;
}

export function useViaje() {
  const contexto = useContext(ViajeContext);
  if (!contexto) throw new Error('useViaje debe usarse dentro de <ViajeProvider>');
  return contexto;
}
