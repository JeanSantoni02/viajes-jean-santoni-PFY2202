const formatoCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
const formatoFecha = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

// 289000 -> "$289.000"
export const formatearPrecio = (valor) => formatoCLP.format(valor);

// "2026-12-10" -> "10 dic 2026"
export const formatearFecha = (iso) => formatoFecha.format(new Date(`${iso}T00:00:00Z`));

// Cantidad de noches entre dos fechas ISO
export function calcularNoches(desde, hasta) {
  const ms = new Date(`${hasta}T00:00:00Z`) - new Date(`${desde}T00:00:00Z`);
  return Math.max(0, Math.round(ms / 86_400_000));
}
