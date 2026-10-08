import { CRAU_CATEGORIAS, crauCategoria, crauTotal } from './CrauInfo';

interface CrauTrackerProps {
  detalle: Record<string, number>;
  guardando?: boolean;
  onChange: (nuevo: Record<string, number>) => void;
}

export default function CrauTracker({ detalle, guardando = false, onChange }: CrauTrackerProps) {
  const total = crauTotal(detalle);

  const cambiar = (key: string, valor: number) => {
    if (guardando) return;
    const nuevo = { ...detalle };
    if (valor <= 0) {
      delete nuevo[key];
    } else {
      nuevo[key] = valor;
    }
    onChange(nuevo);
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#f7f3e8', border: '1px solid #e6dcc0' }}>
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid #e6dcc0' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#5a5344' }}>
            Créditos CRAU
          </span>
          {guardando && <span className="text-[11px] text-[#8a8168]">Guardando…</span>}
        </div>
        <span
          className="px-2.5 py-0.5 rounded-full text-sm font-bold"
          style={{ backgroundColor: '#2e7d6b', color: '#fff' }}
          title="CRAU acumulados"
        >
          {total} CRAU
        </span>
      </div>

      <ul className="divide-y" style={{ borderColor: '#ece4cf' }}>
        {CRAU_CATEGORIAS.map((categoria) => {
          const unidades = detalle[categoria.key] ?? 0;
          const ganados = crauCategoria(categoria, unidades);
          const restante = categoria.bloque > 1 ? categoria.bloque - (unidades % categoria.bloque) : 0;
          return (
            <li key={categoria.key} className="px-3 py-2.5 flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold" style={{ color: '#2e2e2e' }}>
                  {categoria.label}
                </p>
                <p className="text-xs leading-snug" style={{ color: '#8a8168' }}>
                  {categoria.descripcion}
                  {categoria.bloque > 1 && (
                    <> · {categoria.crauPorBloque} CRAU / {categoria.bloque} {categoria.unidad}</>
                  )}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: ganados > 0 ? '#2e7d6b' : '#a89f86' }}>
                  {ganados > 0 ? `+${ganados} CRAU` : '0 CRAU'}
                  {categoria.bloque > 1 && restante < categoria.bloque && (
                    <> · {unidades % categoria.bloque}/{categoria.bloque} {categoria.unidad} para el siguiente</>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={guardando || unidades === 0}
                  onClick={() => cambiar(categoria.key, unidades - 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-lg leading-none disabled:opacity-30 transition-colors"
                  style={{ backgroundColor: '#e6dcc0', color: '#5a5344' }}
                  aria-label={`Quitar una unidad de ${categoria.label}`}
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-bold tabular-nums" style={{ color: '#2e2e2e' }}>
                  {unidades}
                </span>
                <button
                  type="button"
                  disabled={guardando}
                  onClick={() => cambiar(categoria.key, unidades + 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-lg leading-none disabled:opacity-30 transition-colors"
                  style={{ backgroundColor: '#2e7d6b', color: '#fff' }}
                  aria-label={`Añadir una unidad de ${categoria.label}`}
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}