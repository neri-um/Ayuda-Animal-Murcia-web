import { Check } from 'lucide-react';
import { CRAU_CATEGORIAS, crauCategoria } from './CrauInfo';

interface CrauTrackerProps {
  detalle: Record<string, number>;
  guardando?: boolean;
  onChange: (nuevo: Record<string, number>) => void;
}

export default function CrauTracker({ detalle, guardando = false, onChange }: CrauTrackerProps) {
  const fijar = (key: string, valor: number) => {
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
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Créditos CRAU
        </span>
        <span className="text-[11px] text-gray-400">
          Marca cada actividad realizada; el CRAU se calcula solo.
        </span>
        {guardando && <span className="ml-auto text-[11px] text-gray-400">Guardando…</span>}
      </div>

      <ul className="divide-y divide-gray-100">
        {CRAU_CATEGORIAS.map(cat => {
          const unidades = detalle[cat.key] ?? 0;
          const ganados = crauCategoria(cat, unidades);
          const casillas = unidades + 1;
          const enCiclo = cat.bloque > 1 && unidades > 0 ? (unidades % cat.bloque || cat.bloque) : 0;

          return (
            <li key={cat.key} className="px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">{cat.label}</p>
                  <p className="text-xs text-gray-400">
                    {cat.descripcion}
                    {cat.bloque > 1 && <> · {cat.crauPorBloque} CRAU / {cat.bloque} {cat.unidad}</>}
                  </p>
                </div>
                <span className={`text-xs font-bold whitespace-nowrap ${ganados > 0 ? 'text-[#6A994E]' : 'text-gray-300'}`}>
                  {ganados > 0 ? `+${ganados} CRAU` : '0 CRAU'}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {Array.from({ length: casillas }).map((_, i) => {
                  const marcada = i < unidades;
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={guardando}
                      onClick={() => fijar(cat.key, marcada ? i : i + 1)}
                      className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors disabled:opacity-40 ${
                        marcada
                          ? 'bg-[#6A994E] border-[#6A994E] text-white'
                          : 'border-gray-300 text-transparent hover:border-gray-400'
                      }`}
                      title={`${cat.label} ${i + 1}`}
                      aria-label={`${marcada ? 'Quitar' : 'Añadir'} ${cat.label} ${i + 1}`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  );
                })}
                {cat.bloque > 1 && enCiclo > 0 && (
                  <span className="ml-1 text-[11px] text-gray-400">
                    {enCiclo}/{cat.bloque} {cat.unidad}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}