/*
 * Cliente de la API REST mock (destinos).
 * En desarrollo, Vite redirige /api -> http://localhost:4000/api (ver vite.config.js).
 */
const URL_BASE = '/api';

async function obtenerJSON(url) {
  let respuesta;
  try {
    respuesta = await fetch(url);
  } catch {
    throw new Error('No se pudo conectar con el backend mock. ¿Está corriendo "npm run dev"?');
  }
  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}));
    throw new Error(cuerpo.error ?? `Error ${respuesta.status} al consultar la API REST`);
  }
  return respuesta.json();
}

// GET /api/destinos?continente=...&q=...
export function obtenerDestinos({ continente, q } = {}) {
  const parametros = new URLSearchParams();
  if (continente) parametros.set('continente', continente);
  if (q) parametros.set('q', q);
  const consulta = parametros.toString();
  return obtenerJSON(`${URL_BASE}/destinos${consulta ? `?${consulta}` : ''}`);
}

// GET /api/destinos/:id
export function obtenerDestino(id) {
  return obtenerJSON(`${URL_BASE}/destinos/${id}`);
}
