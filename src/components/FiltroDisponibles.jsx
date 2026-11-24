// Interruptor que se envía como variable $soloDisponibles en la consulta GraphQL
export default function FiltroDisponibles({ activo, onCambiar, total, etiqueta }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-500">{total} {etiqueta} encontrados (consulta GraphQL)</p>
      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={activo}
          onChange={(e) => onCambiar(e.target.checked)}
          className="h-4 w-4 accent-sky-600"
        />
        Mostrar solo disponibles
      </label>
    </div>
  );
}
