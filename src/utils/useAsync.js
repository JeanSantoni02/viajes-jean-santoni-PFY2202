import { useCallback, useEffect, useState } from 'react';

/*
 * Hook personalizado para consumir las APIs.
 * Ejecuta la función asíncrona cuando cambian las dependencias y expone
 * { datos, cargando, error, recargar }.
 */
export function useAsync(funcionAsync, dependencias) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });
  const [intento, setIntento] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ejecutar = useCallback(funcionAsync, dependencias);

  useEffect(() => {
    let cancelado = false;
    setEstado((e) => ({ ...e, cargando: true, error: null }));
    ejecutar()
      .then((datos) => !cancelado && setEstado({ datos, cargando: false, error: null }))
      .catch((error) => !cancelado && setEstado({ datos: null, cargando: false, error }));
    return () => {
      cancelado = true; // evita actualizar el estado si el componente cambió de ruta
    };
  }, [ejecutar, intento]);

  return { ...estado, recargar: () => setIntento((n) => n + 1) };
}
