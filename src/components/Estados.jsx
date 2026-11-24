// Componentes reutilizables para los estados de carga y error de las APIs

export function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-slate-500" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
      {texto}
    </div>
  );
}

export function MensajeError({ error, onReintentar }) {
  return (
    <div className="rounded-xl bg-rose-50 p-5 text-rose-800 ring-1 ring-rose-200" role="alert">
      <p className="font-semibold">Ocurrió un problema</p>
      <p className="mt-1 text-sm">{error?.message ?? String(error)}</p>
      {onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="mt-3 rounded-lg bg-rose-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

export function BadgeDisponibilidad({ disponible, cantidad, unidad }) {
  return disponible ? (
    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
      Disponible · {cantidad} {unidad}
    </span>
  ) : (
    <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">Agotado</span>
  );
}
