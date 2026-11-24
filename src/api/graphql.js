/*
 * Cliente de la API GraphQL mock (vuelos y hoteles).
 * En desarrollo, Vite redirige /graphql -> http://localhost:4000/graphql (ver vite.config.js).
 */
const URL_GRAPHQL = '/graphql';

// Envía una consulta GraphQL (POST con { query, variables }) y devuelve "data"
export async function consultaGraphQL(query, variables = {}) {
  let respuesta;
  try {
    respuesta = await fetch(URL_GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    });
  } catch {
    throw new Error('No se pudo conectar con el backend mock. ¿Está corriendo "npm run dev"?');
  }
  const { data, errors } = await respuesta.json();
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(', '));
  return data;
}

export const QUERY_VUELOS = /* GraphQL */ `
  query VuelosPorDestino($destinoId: ID!, $soloDisponibles: Boolean) {
    vuelos(destinoId: $destinoId, soloDisponibles: $soloDisponibles) {
      id
      aerolinea
      origen
      fechaSalida
      fechaRegreso
      duracion
      escalas
      precio
      asientosDisponibles
      disponible
      destino { id ciudad pais }
    }
  }
`;

export const QUERY_HOTELES = /* GraphQL */ `
  query HotelesPorDestino($destinoId: ID!, $soloDisponibles: Boolean) {
    hoteles(destinoId: $destinoId, soloDisponibles: $soloDisponibles) {
      id
      nombre
      estrellas
      precioPorNoche
      disponibleDesde
      disponibleHasta
      habitacionesDisponibles
      disponible
      servicios
      destino { id ciudad pais }
    }
  }
`;

export async function obtenerVuelos(destinoId, soloDisponibles = false) {
  const data = await consultaGraphQL(QUERY_VUELOS, { destinoId: String(destinoId), soloDisponibles });
  return data.vuelos;
}

export async function obtenerHoteles(destinoId, soloDisponibles = false) {
  const data = await consultaGraphQL(QUERY_HOTELES, { destinoId: String(destinoId), soloDisponibles });
  return data.hoteles;
}
